const express=require("express");
const router = express.Router();
const {Owner_Signup}= require('../eatycontroller/authcontroller')
const {Admin_signin}= require('../eatycontroller/admincontroller')



const {AuthmiddlewareAdmin}=require('../authmiddleware/authmiddle')
router.post('/Owner_signup',AuthmiddlewareAdmin,Owner_Signup);
router.post('/admin_login',Admin_signin);
module.exports = router;