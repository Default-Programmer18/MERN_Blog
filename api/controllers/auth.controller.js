const User=require("../models/user.model.js")
const bcryptjs =require("bcryptjs")
const signup=async(req,res)=>{
 
    const {username,email,password}=req.body
    if(!username || !email || !password || username==="" || password==="" || email==="" )
        return res.status(400).json({message:"All fields are required"});
     
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
        return res.status(500).json({message:error.message});
    }

    
}


module.exports={
    signup,
}