const express = require('express')
const router=express.Router();
const {Authmiddleware}=require('../authmiddleware/authmiddle')
const { placeOrder ,viewproduct,viewsingleproduct,getProfile} = require("../eatycontroller/usercontroller");

router.post("/placeOrder",Authmiddleware,placeOrder)
router.get("/viewproduct",viewproduct)
router.get("/viewsingleproduct/:id",viewsingleproduct)
router.get("/getProfile",Authmiddleware,getProfile)
module.exports=router