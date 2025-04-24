const Product=require('../model/Product')
const Order=require('../model/Order')
const fs = require("fs");
const path = require("path");
const User=require('../model/User')
const {sendmail}=require('../mailser/nodemailer');
const Owner=require('../model/Owners')

const placeOrder = async (req, res) => {
    try {
        const userId=req.user.userId;
        const { ownerId, items,Address,availability } = req.body;
        if ( !ownerId || !items || items.length === 0 || !Address || !availability) {
            console.log(ownerId,items,Address)
            return res.status(400).json({ message: "User ID and items are required" });
        }

        let totalAmount = 0;
        const updatedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            if (product.ShopId != ownerId ){
                return res.status(404).json({ message: "Shop not found"  });
            }
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            updatedItems.push({
                productId: item.productId,
                quantity: item.quantity
            });
        }
        const newOrder = new Order({
            userId,
            ownerId,
            items: updatedItems,
            totalAmount,
            availability,
            Address
        });

        await newOrder.save();


        for (const item of updatedItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
        
            // Ensure availability doesn't go below 0
            if (product.availability < item.quantity) {
                throw new Error(`Insufficient availability for product: ${item.productId}`);
            }
        
            // Decrease availability safely
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { availability: -item.quantity }
            });
        }

        const owner = await Owner.findById(ownerId);
        const email= owner.email
        const htmltext=`<p>Hurryy...!</p><strong style="color: green; font-size: 25px;">Order...!</strong>`
        await sendmail(email,htmltext)
        

        return res.status(201).json({success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const viewproduct=async(req,res)=>{
    try {
        const products = await Product.find();
        return res.status(200).json({ success: true, products });
    } catch (error) {
        return res.status(500).json({success: false,message:"Server error"})
    }
}
const viewsingleproduct=async(req,res)=>{
    try {
        const productid=req.params.id;
        const product=await Product.findById(productid);

        if(!product){
            return res.status(400).json({success:false,message:"product not found"})

        }
        return res.status(200).json({success:true,product})

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
const Orderhistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
        }

        const orders = await Order.find({ userId })
            .populate("items.productId", "name price") // name and price of product
            .populate("userId", "name")
            .populate("ownerId", "phone");// populate user's name

            if (!orders.length) {
                return res.status(200).json({ success: true, orders: [] });
            }
            

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getProfile= async (req,res)=>{
    try {
        const userId=req.user.userId;
        const user =await User.findById(userId).select("name email")
        if(!user){
            return res.status(400).json({success:true,message:"Invalid user"})
        }
        return res.status(200).json({success:true,user})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}
const cancelled_order=async (req,res)=>{
    try {
        
        const {message,id}=req.body
        const order=await Order.findById(id)
        if(!order){
            return res.status(400).json({success:false,message:"order not found"})
        }
        await Order.findByIdAndDelete(id)
        return res.status(200).json({success:true,message:message||"Order cancelled"})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

module.exports={placeOrder,viewproduct,viewsingleproduct,getProfile,Orderhistory,cancelled_order}