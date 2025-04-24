const mongoose=require('mongoose')

const Schema= mongoose.Schema

const FinishedOrder = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    address: { type: String, required: true },
    products: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'Card', 'NetBanking'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'foodready', 'delivered', 'cancelled'],
      default: 'pending'
    }
  }, { timestamps: true });
  

module.exports=mongoose.model('FinishedOrder',FinishedOrder)