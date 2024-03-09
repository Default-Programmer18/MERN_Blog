const express = require('express');
const app= express();

const  {connectToMongoDb}=require('./connectionDb/connectionMongoDb.js');
//npm i mongodb,mongoose,dotenv
const dotenv=require("dotenv")
dotenv.config();

connectToMongoDb(process.env.MONGO_URL)
.then(()=>{console.log("MongoDb is connected hi")})
.catch(err=>{console.log(err)});;



app.listen(process.env.PORT,()=>{
    console.log("hi")   
})

