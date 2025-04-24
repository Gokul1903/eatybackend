const Product=require('../model/Product')
const Order=require('../model/Order')
const fs = require("fs");
const path = require("path");
const User=require('../model/User')
const FinishedOrder=require('../model/FinishedOrder')

const fetchOrder = async (req, res) => {
    try {
        const ownerId = req.user.userId;
        if (!ownerId) {
            return res.status(401).json({ success: false, message: "Unauthorized: Owner ID not found" });
        }

        const orders = await Order.find({ ownerId })
            .populate("items.productId", "name price") // name and price of product
            .populate("userId", "name"); // populate user's name

        if (!orders.length) {
            return res.status(404).json({ success: false, message: "No orders found for this shop" });
        }

        return res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
const viewsingleorder=async(req,res)=>{
    try {
        const orderid=req.params.id;
        const order=await Order.findById(orderid)
            .populate("items.productId", "name price") 
            .populate("userId", "name");;

        if(!order){
            return res.status(400).json({success:false,message:"Order not found"})

        }
        return res.status(200).json({success:true,order})

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const updateOrderStatus= async(req,res)=>{
    try {
        const orderId=req.params.id;
        const order = await Order.findById(orderId).populate("items.productId");

        if(!order){
            return res.status(400).json({success:false,message:"order not found"})
        }
        if (order.status === "pending") {
            order.status = "accepted";

          }
          else if(order.status === "accepted"){
             order.status ="foodready";
          } 
          else if (order.status === "foodready") {
            order.status = "delivered";
            const orderData = order.toObject();
            delete orderData._id;
            const products = orderData.items.map(item => ({
                name: item.productId.name,
                quantity: item.quantity
              }));
              const finish = new FinishedOrder({
                userId: orderData.userId,
                ownerId: orderData.ownerId,
                address: orderData.Address,
                products,
                totalAmount: orderData.totalAmount,
                paymentMethod: orderData.paymentMethod,
                status: orderData.status
              });
            await finish.save()
          } else {
            return res.status(400).json({ success: false, message: "Order already delivered or cancelled" });
          }
      
          await order.save();
        return res.status(200).json({success:true,message:"status updated",status: order.status})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
    


}
const cancelled_order=async (req,res)=>{
    try {
        const orderId=req.params.id;
        const {message}=req.body
        const order=await Order.findById(orderId)
        if(!order){
            return res.status(400).json({success:false,message:"order not found"})
        }
        await Order.findByIdAndDelete(orderId)
        return res.status(200).json({success:true,message:message||"Order cancelled"})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
}
const viewproduct=async(req,res)=>{
    try {
        const ownerId = req.user.userId;
        const products = await Product.find({ShopId: ownerId});
        console.log(products)
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

module.exports={fetchOrder,updateOrderStatus,cancelled_order,viewsingleorder,viewproduct,viewsingleproduct}