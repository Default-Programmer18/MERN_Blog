const User = require("../models/user.model");
const { errorHandler } = require("../utils/errorHandler");


const updateUser=async(req,res,next)=>{

    if(req.user.id!==req.params.userId)
    {
        return next(errorHandler(403,"Not allowed toupdate the user"))
    }
     if(req.body.password){
        {
            if(req.body.password.length<8)
                return next(errorHandler(400,"Password must be at least 8 characters"))
        }
        req.body.password = bcryptjs.hashsync(req.body.password,10)
     }
     if(req.body.username)
     {
        if(req.body.username.length<6 || req.body.username.length>20)
            return next(errorHandler(400,"Username must be betwween 6 and 20 characters"))
        if(req.body.username.includes(" "))
             return next(errorHandler(400,"Username must not contain space"))
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/))
             return next(errorHandler(400,"Username must contain only letters and numbers"))
     }
        try{
            const updatedUser= await User.findByIdAndUpdate(req.params.userId,{
                //set only update fields which are present
                $set:{
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    profilePicture:req.body.profilePicture
                },
            },{new:true}//this makes the func return uppdated info otherwise returns old info
            )
            
            const {password, ...rest}=updatedUser._doc
            res.status(200).json(rest)
        }
        catch(error)
        {
            return next(error)
        }
     
    
};

const deleteUser = async (req,res,next)=>{
    if(!req.user.isAdmin && req.user.id!==req.params.userId)
    {
        return next(errorHandler(403,"You are not allowed to delete the user."))
    }
    try{
            await User.findByIdAndDelete(req.params.userId);
            res.status(200).json("User has been deleted")
    }
    catch(error)
    {
        next(error)
    }
}
const signout= (req, res,next)=>
{
        try {
            res.clearCookie("access_token").status(200).json("User signed out successfully.")
        }
        catch(error){
            next(error)
        }
}

const getUsers=async(req, res, next)=>{
    if(!req.user.isAdmin )
    return next(errorHandler(403,"You must be an admin to see all users."))

    try{
        const startIndex=parseInt(req.query.startIndex||0)
        const limit=parseInt(req.query.limit||9)
        const sortDirection=req.query.sort==="asc"?1:-1;

        const users=await User.find()
        .sort({createdAt:sortDirection})
        .skip(startIndex)
        .limit(limit)

        //array returned
        const usersWithoutPassword=users.map((user)=>{
            const {password,...rest}=user._doc
            return rest
        })
        const totalUsers=await User.countDocuments()
        const now=new Date()
        const oneMonthAgo=new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDate()
        );
        const lastMonthUsers=await User.countDocuments({createdAt:{$gte:oneMonthAgo}})
        res.status(200).json({
            users:usersWithoutPassword,
            totalUsers,
            lastMonthUsers})
        

    }
    catch(error)
    {
     next(error)
    }

}
//get user by id
    const getUser= async (req,res,next)=>{
        try{
            const user=await User.findById({_id:req.params.userId})
            if(!user) 
            return next(errorHandler(404,"User Not Found..."))
          
           const {password,...rest}=user._doc
          
            res.status(200).json(rest)

        }
        catch(error)
        {
            next(error)
        }
        
    }

module.exports={
    updateUser,
    deleteUser,
    signout,
    getUsers,
    getUser
}


