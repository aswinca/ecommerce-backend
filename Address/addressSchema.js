const mongoose = require('mongoose');
const User = require('../Customer/CustomerSchema'); // Assuming 'Customer' is the model name

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  pin: {
    type: Number,
    default: null
  },
  contact: {
    type: Number,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  landmark: {
    type: String,
    default: null
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'  // Ensure 'Customer' matches your Customer model
  }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
