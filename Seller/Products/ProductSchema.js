const mongoose = require("mongoose");
const seller=require('../SellerSchema')

const productSchema = mongoose.Schema({
    sellerid:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'sellers'
      },
    productname: {
        type: String
    },
    productbrand: {
        type: String
    },
    quantity: {
        type: Number,
        default:1
       
    },
    material: {
        type: String
    },
    specifications: {
        type: String
    },
    price: {
        type: Number
       
    },
    size: {
        type: String
    },
    gender: {
        type: String,
         default:'male'
    },
    category: {
        type: String
    },
    image1: {
        type: Object
    },
    image2: {
        type: Object
    },
    image3: {
        type: Object
    }
});

module.exports = mongoose.model('products', productSchema);
