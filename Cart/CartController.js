const Cart = require('./CartSchema');
const Product = require('../Seller/Products/ProductSchema');
const Customer = require('../Customer/CustomerSchema');

const addCart = (req, res) => {
  const { userid, productid } = req.params;

 
  Product.findById(productid)
    .then((product) => {
      if (!product) {
        return res.json({
            status:404, 
            message: 'Product not found',
            data:data
         });
      }

      Customer.findById(userid)
        .then((customer) => {
          if (!customer) {
             res.json({
                status:404,
                 message: 'User not found',
                 data:data
             });
          }

          // Check if the product is already in the user's cart
           Cart.findOne({ productid, userid })
           .then((cartItem) => {
            if (cartItem) {
               res.json({
                status:200, 
                message: 'Product already in cart',
             
             });
            }
             else {
              // Create a new cart item if not found
              const newCartItem = new Cart({ productid, userid });
              newCartItem
                .save()
                .then((savedCartItem) => {
                  res.json(savedCartItem);
                })
                .catch((error) => {
                  res.json({
                    status:500,
                     message: error.message,
                     Error:Err
                     });
                });
            }
          });
        })
        .catch((error) => {
          res.json({ 
            status:500,
            message: error.message });
        });
    })
    .catch((error) => {
      res.json({
        status:500,
         message: error.message });
    });
};


const viewCart = (req, res) => {
  const userid = req.params.userid; // Extract user ID from the request params

  // Find all cart items associated with this user
  Cart.find({ userid })
    .populate('productid') // Populate product details from the Product schema
    .then(data => {
      if (!data || data.length === 0) {
        return res.json({ 
          status: 404,
          message: "No products found in the cart" 
        });
      }
      res.json(data); // Return cart data if found
    })
    .catch(err => {
      res.json({ 
        status: 500,
        message: "Error retrieving cart items", 
        error: err.message 
      });
    });
};

  const removeCart = (req, res) => {
    const id = req.params.id; // Extract the id from req.params
  
    Cart.findOneAndDelete({ _id: id })
      .then(cartItem => {
        if (!cartItem) {
          return res.status(404).json({ error: 'Cart item not found' });
        }
        res.status(200).json({ message: 'Cart item removed successfully' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  };
  



module.exports = { addCart,viewCart ,removeCart};
