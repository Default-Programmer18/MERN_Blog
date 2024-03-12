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
            { id: validUser._id },
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
///////////////////////////signin/////////////////////////////////////

module.exports = {
    signup,
    signin,
};
