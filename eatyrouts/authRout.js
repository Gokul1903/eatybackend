const express = require('express')
const {signup,signin,logout,verify_otp,forget_password,reset_password,verift_otp_reset,Owner_Signup,Owner_signin}= require('../eatycontroller/authcontroller')
const router=express.Router();


router.post('/signup',signup);  
router.post('/signin',signin);
router.post('/logout',logout);
router.post('/verify',verify_otp);
router.post('/forgot',forget_password);
router.post('/resetverify',verift_otp_reset);
router.post('/reset',reset_password);
router.post('/Owner_signup',Owner_Signup);
router.post('/Owner_signin',Owner_signin);

module.exports=router;
