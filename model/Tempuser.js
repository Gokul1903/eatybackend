const mongoose=require('mongoose');

const Schema=mongoose.Schema

const TempuserSchema=new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique: true,

    },
    password:{
        type:String,
        required:true
    },
    
    otp:{
        type:Number,
        default:null
    },
    otpExpires:{
        type:Date,default:null
    }
},{timestamps:true})

const Tempuser=mongoose.model("Tempuser",TempuserSchema)

module.exports=Tempuser;