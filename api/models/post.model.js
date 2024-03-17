const mongoose=require("mongoose")

 const postSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
       default:"https://firebasestorage.googleapis.com/v0/b/mernblog-d8eb5.appspot.com/o/blogDefault.jpg?alt=media&token=a5a2df49-6cfd-46fd-ba9f-b3fb5d39c074",
    },
    category:{
        type:String,
        default:"uncategorized"
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }


 },{timestamps:true}
 );
 const Post=mongoose.model("Post",postSchema)
 module.exports=Post
