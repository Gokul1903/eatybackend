const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Owner', 
        required: true
    },
    Address:{
        type:String,
        required:true
    },
    availability:{
        type:Number,
        required:true,
        min:0
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        }
    }],
    totalAmount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'UPI', 'Card', 'NetBanking'],
        default:'COD'
    },
    status: { 
        type: String, 
        enum: ['pending','accepted','foodready', 'delivered', 'cancelled'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
