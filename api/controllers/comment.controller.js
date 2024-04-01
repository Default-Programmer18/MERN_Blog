const Comment=require('../models/comment.model.js');
const { errorHandler } = require('../utils/errorHandler.js');


const createComment= async(req,res,next)=>{
   
    try{
        const {postId,userId,content}=req.body

        if(userId!==req.user.id)
        {
            return next(errorHandler(403,"You are not allowed to comment on this post."))
        }
        
        const newComment=new Comment({
            postId,
            userId,
            content,
        })
        
       const response= await newComment.save()

        res.status(200).json(newComment)
    

    }
    catch(error){
        console.log(error)
        next(error)
    }

 }

 const getPostComments= async(req,res,next)=>{
    try{
        
        const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
        return res.status(200).json(comments)
    }
    catch(error){
        next(error)
    }

 }

 const likeComment= async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId)
       
        if(!comment)
        return next(errorHandler(404,"No such comment exists"))
        
        const userIndex=comment.likes.indexOf(req.user.id)
        if(userIndex===-1)
        {
            comment. numberOfLikes+=1;
            comment.likes.push(req.user.id)
        }
        else
        {
            comment. numberOfLikes-=1;
        comment.likes.splice(userIndex,1)
        }
        await comment.save();
        return res.status(200).json(comment)
    }
    catch(error) {
        next(error)
    }

 }

 const editComment= async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId)
       
        if(!comment)
        return next(errorHandler(404,"No such comment exists"))
        
        if(req.user.id!==comment.userId && !req.isAdmin)
        return next(errorHandler(404,"No such comment exists"))
     
       const editedComment=await Comment.findByIdAndUpdate(req.params.commentId,{
        content:req.body.content
       },{new:true})
        
        return res.status(200).json(editedComment)
    }
    catch(error) {
        next(error)
    }

 }
 const deleteComment= async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId)
       
        if(!comment)
        return next(errorHandler(404,"No such comment exists"))
        
        if(req.user.id!==comment.userId && !req.isAdmin)
        return next(errorHandler(404,"No such comment exists"))
     
       const deletedComment=await Comment.findByIdAndDelete(req.params.commentId)
       console.log(deletedComment)
        return res.status(200).json("Commnet has been deleted");
    }
    catch(error) {
        next(error)
    }

 }

 const getComments=async(req,res,next)=>{

    if(!req.user.isAdmin )
    return next(errorHandler(403,"You are not allowed to get all the comments."))
    
    try{
        const startIndex=parseInt(req.query.startIndex)||0
        const limit=parseInt(req.query.limit)||9
        const sortDirection=req.query.sort==="asc"?1:-1;
        const comments=await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);

        const totalComments=await Comment.countDocuments()
        const now=new Date()
        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        )
        const lastMonthComments=await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}})

        return res.status(200).json({comments,totalComments,lastMonthComments})

    }
    catch(error){
        next(error)
    }

 }
 module.exports ={
     createComment,
     getPostComments,
     likeComment,
     editComment,deleteComment,
     getComments
    }