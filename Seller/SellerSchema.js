const mongoose = require("mongoose");

const SellerSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    contact: {
        type: Number,  
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Object // Consider defining the structure here
    },
    gender: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isBan: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('sellers', SellerSchema);
