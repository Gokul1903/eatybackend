const mongoose =require('mongoose');

const Schema=mongoose.Schema

const OwnerSchema = new Schema({
    name:{
        type:String,
        required:true
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
    phone:{
        type:Number,
        required:true,
        unique:true
    },
},{timestamps:true});
module.exports=mongoose.model('Owner',OwnerSchema)
