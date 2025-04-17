const User=require('../model/User');
const Tempuser=require('../model/Tempuser')
const bcrypt = require('bcryptjs');   
const jwt = require('jsonwebtoken');
const sendOtp=require('../mailser/nodemailer');
const Owner = require('../model/Owners')

const signup= async (req,res)=>{
    try {
        const {name,email,password}= req.body;

    const existingUser= await User.findOne({email});
    if(existingUser){
        return res.status(400).json({success: false,message:"User already exist"});
    }
    //hash passward create pandrom 
    const hashedpass= await bcrypt.hash(password,10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires=new Date(Date.now() + 10 * 60 * 1000);
    const tempuser=new Tempuser({
        name,
        email,
        password : hashedpass,
        otp:otp,
        otpExpires:otpExpires,
    })

    //save pandrom database la
    
    await tempuser.save();
    const htmltext=`<p>Hello,</p><p>Your OTP for Signup is: <strong style="color: green; font-size: 18px;">${otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>Thanks, <br>Eaty Team</p>`
    await sendOtp(email,htmltext)

    return res.status(200).json({success: true,message:"Otp sent Successfully"});

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false,message:"Server error"})
    }
    //ipodhaiku signup mattum mudichi iruken...
}
const verify_otp=async (req,res)=>{
    try {
        const {email,otp}=req.body
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({success: false,message:"User already exist"})
        }
    const tempuser= await Tempuser.findOne({email});
    if(!tempuser){
        return res.status(400).json({success: false,message:"User not found"})
    }
    if(tempuser.otp != otp || tempuser.otpExpires < Date.now()){
        return res.status(400).json({success: false,message:"Invalid otp or Otp expired"})
    }
    await User.create({
        name: tempuser.name,
        email: tempuser.email,
        password: tempuser.password, // Already hashed
    });
    
    await Tempuser.deleteOne({email})

    return res.status(200).json({success: true,message:"Signup successfull "})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success: false,message:"Server error "})
    }
    
}

const signin = async (req,res)=>{
    try {
        const {email,password}=req.body;
    const existingUser= await User.findOne({email})
    if(!existingUser){
        return res.status(400).json({success: false,message:'invalid Email'})
    }
    const ispasscrt= await bcrypt.compare(password,existingUser.password)
    if(!ispasscrt){
        return res.status(400).json({success: false,message:'invalid password'})
    }
    const token=jwt.sign({userId:existingUser._id}, process.env.JWT_SECRET,{expiresIn:'7d'})
    res.cookie('token',token,{
        httpOnly:true,
        secure:true ,//process.env.NODE_ENV,
        sameSite:'None',
        maxAge:7 * 24 * 60 * 60 * 1000

    })
    return res.status(200).json({success: true,message:"Signin Successfully",token});
    } catch (error) {
        return res.status(500).json({success: false,message:"Server error"})
    }
    
    

}
const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
           
        })
        return res.json({success:true,message:'logged out'})
    }
    catch(err){
        return res.json({success:'false',message:err.message})
    }
}
const forget_password= async (req,res)=>{
    
    try {
        const {email} =req.body

    const isexist=await User.findOne({email})
    if(!isexist){
        return res.status(400).json({success: false,message:"Invalid user "})
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires=new Date(Date.now() + 10 * 60 * 1000);
    await Tempuser.findOneAndUpdate({email},
        {otp,otpExpires,name:isexist.name,password:isexist.password},
        {upsert:true,new:true}
    )
    const htmltext=`<p>Hello,</p><p>Your OTP for Password reset is: <strong style="color: green; font-size: 18px;">${otp}</strong></p><p>If you didn't request this, please ignore this email.</p><p>Thanks, <br>Eaty Team</p>`

    await sendOtp(email,htmltext)
    return res.status(200).json({success: true,message:"OTP sent successfully"})
    } catch (error) {
        return res.status(400).json({success: false,message:error.message})
    }


}
const reset_password = async (req,res)=>{
    
     try {
        const {email,newpassword}=req.body
    const user = User.findOne({email})
     if(!user){
        return res.status(400).json("Invalid user")
     }
     const hashedpassword =await bcrypt.hash(newpassword,10);

     await User.updateOne({email},{password:hashedpassword})
     await Tempuser.deleteOne({email})
     return res.status(200).json({success: true,message:"Password changed successfully"})
     } catch (error) {
        return res.status(400).json({success: false,message:error.message})
     }
}

const verift_otp_reset = async (req,res)=>{
    try {
        const{email,otp}=req.body
        const user = User.findOne({email})
        if(!user){
            return res.status(400).json({success: false,message:"Invalid user"})
        }
        const tempuser= await Tempuser.findOne({email})
        if(!tempuser){
            return res.status(400).json({success: false,message:"Invalid user"})
        }
        if(tempuser.otp != otp || tempuser.otpExpires < Date.now()){
            return res.status(400).json({success: false,message:"Invalid otp or Otp expired"})
        }
        await Tempuser.deleteOne({email})
        return res.status(200).json({success: true,message:"OTP verified"})
    } catch (error) {
        return res.status(400).json({success: false,message:error.message})
    }
}

const Owner_Signup=async (req,res)=>{
    try {
        const {name,email,password}=req.body
        const existing= await Owner.findOne({email})
        if(existing){
            return res.status(400).json({success: false,message:"User already exist"})
        }
        const hashedpassword= await bcrypt.hash(password,10);
        const newOwner= new Owner({
            name,
            email,
            password:hashedpassword
        })
        await newOwner.save()
        return res.status(200).json({success: true,message:"Signup Successfully for owner"});
    } catch (error) {
        return res.status(400).json({success: false,message:error.message})
    }
}
const Owner_signin = async (req,res)=>{
    try {
        const {email,password}=req.body;
        const existingUser= await Owner.findOne({email})
    if(!existingUser){
        return res.status(400).json({success: false,message:'invalid Email'})
    }
    const ispasscrt= await bcrypt.compare(password,existingUser.password)
    if(!ispasscrt){
        return res.status(400).json({success: false,message:'invalid password'})
    }
    const token=jwt.sign({userId:existingUser._id}, process.env.OWNER_SECRET,{expiresIn:'7d'})
    res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV,
        sameSite:'None',
        maxAge:7 * 24 * 60 * 60 * 1000

    })
    return res.status(200).json({success: true,message:"Signin Successfully foe Owner"});
    } catch (error) {
        return res.status(500).json({success: false,message:"Server error"})
    }
    
    

}
module.exports={signup,signin,logout,verify_otp,forget_password,reset_password,verift_otp_reset,Owner_Signup,Owner_signin};