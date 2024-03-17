const express = require('express');
const app= express();
const userRoutes =require('./routes/user.route.js');
const authRoutes =require('./routes/auth.route.js');
const postRoutes=require("./routes/post.route.js")
const cookieParser = require('cookie-parser');
/////////////////////////////////////database///////////////////////////////////////////
const  {connectToMongoDb}=require('./connectionDb/connectionMongoDb.js');
//npm i mongodb,mongoose,dotenv
const dotenv=require("dotenv");

dotenv.config();

connectToMongoDb(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDb is connected ")
})
.catch(err=>{console.log(err)});;

/////////////////////////////////////database///////////////////////////////////////////

//its not allowed to accept json by defaulrt as req,this is the possible way to accept
app.use(express.json())
//npm i cookie-parse
app.use(cookieParser())



app.listen(process.env.PORT,()=>{
    console.log("hi")   
})

app.use("/api/user/",userRoutes);
app.use("/api/auth/",authRoutes);
app.use("/api/post/",postRoutes);

//middleware 
app.use((err,req,res,next)=>{
   const statusCode=err.statusCode||500;
    const success=false
    const message=err.message||"Internal Server Error";
    res.status(statusCode).json({
        
        statusCode,
        success,
        message
    })
});

