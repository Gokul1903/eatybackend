const Product=require('../model/Product')
const Order=require('../model/Order')
const fs = require("fs");
const path = require("path");

const addProduct=async (req,res)=>{
    try {
        const ShopId = req.user.userId;
        const {name,price} =req.body;
        const image=req.file ? `/uploads/${req.file.filename}`:null;
        
    
        if(!name || !price || !ShopId || !image){
            return res.status(400).json({success: false,message:"All properties required"})
        }
        const newproduct= new Product({
            name,
            price,
            ShopId,
            image,
            availability:true
        })
        await newproduct.save()
        return res.status(201).json({success: true, message: "Product added successfully", product: newproduct });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}


const update_product = async (req, res) => {
    try {
        const ShopId = req.user.userId;
        const { productId, name, price } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        
        if (!productId || !name || !price || !ShopId) {
            return res.status(400).json({success: false, message: "All properties required" });
        }

        
        const existingProduct = await Product.findOne({ _id: productId, ShopId });
        
        if (!existingProduct) {
            return res.status(404).json({success: false, message: "Product not found" });
        }

        // Delete old image 
        if (image && existingProduct.image) {
            const oldImagePath = path.join(__dirname, "../uploads", path.basename(existingProduct.image));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Update pandrom
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, ShopId },
            { name, price, ...(image && { image }) }, 
            { new: true } 
        );

        return res.status(200).json({success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({success: false, message: "Server error" });
    }
};



const delete_product = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({success: false, message: "Product ID is required" });
        }

        // Find pandrom
        const exproduct = await Product.findById(productId);
        
        if (!exproduct) {
            return res.status(404).json({success: false, message: "Product does not exist" });
        }

        // Delete pandrom image ha folderla irundhu
        if (exproduct.image) {
            const imagePath = path.join(__dirname, "../uploads", path.basename(exproduct.image));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete the file
            }
        }
        

        // Delete pandrom batabase la
        await Product.findByIdAndDelete(productId);
        await Order.updateMany(
                    { "items.productId": productId },
                    { $pull: { items: { productId } } }
                );
        return res.status(200).json({success: true, message: "Product Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({success: false, message: error.message });
    }
};



module.exports={addProduct,update_product,delete_product}