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

const deleteUser = async (req,res,error)=>{
    if(req.user.id!==req.params.userId)
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
module.exports={
    updateUser,
    deleteUser,
    signout
}


