const express=require('express');
const {  updateUser } = require('../controllers/user.controller');
const { verifyToken } = require('../utils/verifyUser');
const router = express.Router();


router.put("/update/:userId",verifyToken,updateUser)

module.exports=router