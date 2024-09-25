const mongoose= require("mongoose");
const products=require('../Seller/Products/ProductSchema')
const user=require('../Customer/CustomerSchema')

var cartSchema = mongoose.Schema({
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'products'
     
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'customers'
     
    },
    date: {
      type: Date,
      default: Date.now
    },
    quantity:{
      type:Number,
      default:1
    }
  });
  
  const cart = mongoose.model('cart', cartSchema);
  module.exports = cart;
  