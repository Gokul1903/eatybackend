const express = require('express')
const router=express.Router();
const {Authmiddleware}=require('../authmiddleware/authmiddle')
const { placeOrder ,viewproduct,viewsingleproduct,getProfile,Orderhistory,cancelled_order} = require("../eatycontroller/usercontroller");

router.post("/placeOrder",Authmiddleware,placeOrder)
router.get("/viewproduct",viewproduct)
router.get("/viewsingleproduct/:id",viewsingleproduct)
router.get("/getProfile",Authmiddleware,getProfile)
router.get("/getHistory",Authmiddleware,Orderhistory)
router.delete("/cancelorder",Authmiddleware,cancelled_order)
module.exports=router