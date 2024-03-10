const express = require('express');
const app= express();
const userRoutes =require('./routes/user.route.js');
const authRoutes =require('./routes/auth.route.js');

/////////////////////////////////////database///////////////////////////////////////////
const  {connectToMongoDb}=require('./connectionDb/connectionMongoDb.js');
//npm i mongodb,mongoose,dotenv
const dotenv=require("dotenv")
dotenv.config();

connectToMongoDb(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDb is connected ")
})
.catch(err=>{console.log(err)});;

/////////////////////////////////////database///////////////////////////////////////////

//its not allowed to accept json by defaulrt as req,this is the possible way to accept
app.use(express.json())

app.listen(process.env.PORT,()=>{
    console.log("hi")   
})

app.use("/api/user/",userRoutes);
app.use("/api/auth/",authRoutes);

