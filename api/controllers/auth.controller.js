const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/errorHandler.js");
const jwt = require("jsonwebtoken");

//next is the middleware
const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (
        !username ||
        !email ||
        !password ||
        username === "" ||
        password === "" ||
        email === ""
    )
        next(errorHandler(400, "All fields are required..."));

    //10 is the no of rounds
    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({ message: "User Created" });
    } catch (error) {
        next(error);
    }
};

///////////////////////////signin/////////////////////////////////////
const signin = async (req, res, next) => {
    const { username, password, email } = req.body;
    if (!password || password === "" || !email || email === "")
        next(errorHandler(400, "All fields are required..."));

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler("400", "Invalid password"));
        const token = jwt.sign(
            { id: validUser._id ,
                isAdmin:validUser.isAdmin},
            process.env.JWT_SECRET
            // {
            //     expiresIn:3600
            // }//if not given expires as user closes the browswer
        );
        //removes password and add aother data to rest
        //assigning password to pass
        const { password: pass, ...rest } = validUser._doc;
        //validUser._doc: Assuming validUser is an object,
        //the _doc property is often used in some MongoDB libraries like Mongoose to get the raw document data.

        res
            .status(200)
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .json(rest);
    } catch (error) {
        next(error);
    }
};
///////////////////////////signin normally/////////////////////////////////////

///////////////////////////signin with google/////////////////////////////////////
const google= async(req,res,next)=>{
    const {username,email,googlePhotoUrl}=req.body
    try{
        const validUser=await User.findOne({email})
        if(validUser)
        {
            const token=jwt.sign({
                id:validUser._id,
                isAdmin:validUser.isAdmin},
                process.env.JWT_SECRET
            )
            const { password: pass, ...rest } = validUser._doc;
            res.status(200).cookie("access_token",token,{
                httpOnly:true,
            }).json(rest);
        }
        else{
          //make new user if no data in db during google auth
          const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
          const hashedPassword=bcryptjs.hashSync(generatedPassword,10)
          const newUser=new User({
            // However, there's a small issue in your code. The Math.random().toString(9) generates a 
            // string representation of a floating-point number between 0 and 1, but when you call
            // .slice(-4) on it, it won't necessarily give you the last four digits of the number.
          // The code name.toLowerCase().split(' ').join('') takes the name, converts it to lowercase, splits it by spaces,
            //  and then joins it back together without spaces. 
            // This effectively removes any spaces from the name and converts it to lowercase.
            username:  username.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            password:hashedPassword,
            email,
            profilePicture:googlePhotoUrl
          })
        
        await newUser.save();
        const token=jwt.sign({
            id:validUser._id,
            isAdmin:validUser.isAdmin},
            process.env.JWT_SECRET
        )
        const { password: pass, ...rest } = newUser._doc;
        res.status(200).cookie("access_token",token,{
            httpOnly:true,
        }).json(rest);
        }

    }
    catch(error){
        return next(error)
    }

}
///////////////////////////signin with google/////////////////////////////////////

module.exports = {
    signup,
    signin,
    google,
};
