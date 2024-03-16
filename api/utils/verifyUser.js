const jwt =require( "jsonwebtoken")
const {errorHandler}=require( "./errorHandler.js")

 const verifyToken =(req,res,next)=>{

    const token=req.cookies.access_token
    if(!token) 
      return next(errorHandler(401,"Unauthorized"))
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err)
            return next(errorHandler(401,"Unauthorized"))
        //this user was set while grenerating jwt token
        req.user=user
        //continue progress in update fumnc in route
        next();
    })
}
module.exports={verifyToken }