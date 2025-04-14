const express=require("express");
const router = express.Router();
const {Owner_Signup}= require('../eatycontroller/authcontroller')


const {AuthmiddlewareAdmin}=require('../authmiddleware/authmiddle')
router.post('/Owner_signup',AuthmiddlewareAdmin,Owner_Signup);

module.exports = router;