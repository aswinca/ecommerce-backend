const Buy = require('../Buy/buySchema');
const Product = require('../Seller/Products/ProductSchema');
const cart=require('../Cart/CartSchema')

const buyProduct = (req, res) => {
  const { userid, productid, aid, sellerid } = req.params;
  console.log('uid -', userid, 'pid -', productid, 'aid -', aid, 'sid-', sellerid);

  // Find the product by pid
  Product.findById(productid)
    .then(product => {
      if (!product) {
        return res.json({ status:404,
          msg: 'Product not found' });
      }

      // Check if the product has enough quantity
      if (product.quantity < 1) {
        return res.json({status:400,
           msg: 'Product is out of stock' });
      }

      // Decrease the quantity by 1
      product.quantity -= 1;
      return product.save();
    })
    .then(savedProduct => {
      // Save the purchase details
      const buy = new Buy({
        cardName: req.body.cardName,
        cardNumber: req.body.cardNumber,
        expiryDate: req.body.expiryDate,
        cardCvv: req.body.cardCvv,
        productid: productid,
        userid: userid,
        aid: aid,
        sellerid: sellerid,
      });
      
      return buy.save();
    })
    .then(buy => {
      return res.status(201).json({
        status: 201,
        msg: 'Product bought successfully',
        data: buy
      });
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};


const cartBuy = async (req, res) => {
  const { userid, aid } = req.params;
  try {
    const cartItems = await cart.find({ userid: userid }).exec();

    for (const cartItem of cartItems) {
      await cartItem.populate('productid')
      const product = cartItem.productid;
      if (!product || product.quantity < 1) {
        return res.status(400).json({ msg: 'Product is out of stock' });
      }
      product.quantity -= 1;
      await product.save();
      const buy = new Buy({
        cardName: req.body.cardName,
        cardNumber: req.body.cardNumber,
        expiryDate: req.body.expiryDate,
        cardCvv: req.body.cardCvv,
        productid: cartItem.productid,
        userid: userid,
        aid: aid,
        sellerid:product.sellerid,
      });
      await buy.save();
      await cart.deleteMany({ userid: userid });
    }
    res.status(201).json({
      status: 201,
      msg: 'Products bought successfully',
      data: cartItems  
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const viewHistory = (req, res) => {
  const { userid } = req.params;

  Buy.find({ userid})
  .populate({
    path: 'productid',
    populate: {
      path: 'sellerid'
    }
  })
  
    .populate('aid')
    .populate('userid')
    .sort({ _id: -1 }) // Sort by _id in descending order
    .then(data => {
      if (data.length === 0) {
        return res.status(404).json({
          status: 404,
          msg: 'No history found for this user',
        });
      }
      res.status(200).json({
        status: 200,
        msg: 'History fetched successfully',
        data: data
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

const sellerHistory = async (req, res) => {
  const { sellerid } = req.params;

  try {
    // Find purchases associated with the seller's products
    const purchases = await Buy.find({ sellerid }).populate('productid userid aid').sort({ _id: -1 });
    console.log('Purchases:', purchases); // Debug log

    if (!purchases.length) {
      return res.status(404).json({
        status: 404,
        msg: 'No purchases found for this seller',
      });
    }

    // Extract valid product IDs from purchases
    const productIds = purchases
      .filter(purchase => purchase.productid && purchase.productid._id) // Filter out null or undefined pid
      .map(purchase => purchase.productid._id);

    // Find products that match the purchased product IDs
    const products = await Product.find({ _id: { $in: productIds } });
    console.log('Products:', products); // Debug log

    // Identify purchases without corresponding products (deleted products)
    const deletedPurchases = purchases.filter(purchase => {
      if (!purchase.productid || !purchase.productid._id) {
        return true; // Handle null or undefined pid
      }
      return !products.find(product => product._id.equals(purchase.productid._id));
    });

    res.status(200).json({
      status: 200,
      msg: 'History fetched successfully',
      data: {
        purchases,
        deletedPurchases,
      },
    });
  } catch (err) {
    console.error('Error:', err); // Debug log
    res.status(500).json({
      status: 500,
      msg: 'Internal Server Error',
      error: err.message,
    });
  }
};





module.exports = { buyProduct , cartBuy,viewHistory,sellerHistory};
