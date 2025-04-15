const mongoose=require('mongoose')

const Schema=mongoose.Schema

const ProductSchema = new Schema ({
    name:{ type:String,required:true},
    price:{ type:Number,required:true},
    image:{type:String,required:true},
    ShopId:{type:mongoose.Schema.Types.ObjectId,ref:"Owner",required:true},
    availability:{type:Number,required:true,min:0}
},{timestamps :true});

module.exports=mongoose.model("Product",ProductSchema);