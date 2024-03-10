const User=require("../models/user.model.js")
const bcryptjs =require("bcryptjs")
const { errorHandler } = require("../utils/errorHandler.js")

//next is the middleware
const signup=async(req,res,next)=>{
 
    const {username,email,password}=req.body
    if(!username || !email || !password || username==="" || password==="" || email==="" )
        next(errorHandler(400,"All fields are required..."))
     
    //10 is the no of rounds
    const hashedPassword = bcryptjs.hashSync(password,10);
    
    try{
        const newUser=new User({
            username,
            email,
            password:hashedPassword
        });

        await newUser.save();
        return res.status(201).json({message:"User Created"});
    }
    catch(error){
        next(error);
    }

    
}


module.exports={
    signup,
}