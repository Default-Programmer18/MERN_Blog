const Post = require("../models/post.model");
const { errorHandler } = require("../utils/errorHandler");

 const create=async(req,res,next)=>{
    if(!req.user.isAdmin)
    {
        return next(errorHandler(403,"You are not allowed to create the post."))
    }
    if(!req.body.title|| !req.body.content)
        return next(errorHandler(403,"Please provide all the fields."))
    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

        const newPost=new Post({
            ...req.body,
            slug,
            userId:req.user.id,
            
        })
        try{
            const savedPost=await newPost.save()
            res.status(201).json(savedPost)
        }
        catch(err){
            next(err)
        }
    

 }


 const getPosts=async(req,res,next)=>{
    try{
        const startIndex=parseInt(req.query.startIndex||0)
        const limit=parseInt(req.query.limit||9)
        const sortDirection=req.query.order==="asc"?1:-1;
        const post=await Post.find({
            ...(req.query.userId && {userId:req.query.userId}),
            ...(req.query.postId && {_id:req.query.postId}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.category && {category:req.query.category}),
            ...(req.query.searchTerm &&{
                $or:[
                    //$options:"i"  case-insensitive
                    {title:{$regex : req.query.searchTerm, $options:"i"}},
                    {content:{$regex:req.query.searchTerm, $options:"i"}}
                ]

            })
         } ).sort({updtedAt:sortDirection}).skip(startIndex).limit(limit);
            // It skips a number of documents specified by startIndex and limits the number of documents returned by limit.;
         const totalPosts=await Post.countDocuments();
         
         const now=new Date();
         const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()

         );
         const lastMonthPosts=await Post.countDocuments({createdAt:{$gte:oneMonthAgo}});
         res.status(200).json({
            post,
            totalPosts,
            lastMonthPosts
         });


    }
    catch(err){
        next(err)
    }

 }


 module.exports={
    create,
    getPosts,
 }