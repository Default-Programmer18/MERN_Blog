const Comment=require('../models/comment.model.js');


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


 module.exports ={
     createComment,
     getPostComments
    }