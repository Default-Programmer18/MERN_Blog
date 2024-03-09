//npm i mongodb,mongoose,dotenv
const mongoose=require('mongoose');



async function connectToMongoDb(url)
{
    return mongoose.connect(url)
                

    
};
module.exports={
    connectToMongoDb,
}