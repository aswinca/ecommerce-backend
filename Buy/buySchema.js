const mongoose = require('mongoose');
const products = require('../Seller/Products/ProductSchema');
const user = require('../Customer/CustomerSchema');
const seller = require('../Seller/SellerSchema');
const address = require('../Address/addressSchema');

var buySchema = mongoose.Schema({
    cardName:{
      type:String
    },
    cardNumber:{
      type:Number
    },
    expiryDate:{
      type:Date
    },
    cardCvv:{
      type:Number
    }
    ,productid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'products' 
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'customers'
    },
    aid:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Address'
    },
    sellerid:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'sellers'
    },
    date:{
      type: Date,
      default: Date.now()
    }
  });
  
const Buy = mongoose.model('orders', buySchema);
module.exports = Buy;
