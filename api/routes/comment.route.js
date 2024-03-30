const express=require('express')
const { createComment, getPostComments, likeComment } = require('../controllers/comment.controller.js')
const { verifyToken } = require("../utils/verifyUser.js")
const router=express.Router()

router.post("/create",verifyToken,createComment)
router.get("/getPostComments/:postId",getPostComments)
router.put("/likeComment/:commentId",verifyToken,likeComment)
module.exports= router