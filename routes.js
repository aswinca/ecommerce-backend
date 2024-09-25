const express = require('express')
const router = express.Router()
console.log("api worked");
const customers=require('./Customer/CustomerController')
const sellers=require('./Seller/SellerController')
const products=require('./Seller/Products/ProductController');
const carts=require('./Cart/CartController')
const address=require('./Address/addressController');
const buys = require('./Buy/buyController');




router.post('/registercustomer',customers.upload,customers.registerCustomer)
router.post('/loginCustomer', customers.loginCustomer)
router.post('/viewCustById/:id',customers.viewCustById)
router.post('/forgotpwdcustomer',customers.forgotpwd)
router.post('/editCustById/:id',customers.upload,customers.editCustomerById)
router.post('/allCustomer',customers.allCustomer)



router.post('/registerseller',sellers.upload,sellers.registerSeller)
router.post('/loginSeller',sellers.loginSeller)
router.post('/viewSellerById/:id',sellers.viewSellerById)
router.post('/forgotpwdseller',sellers.forgotpwd)
router.post('/editSellerbyid/:id',sellers.editSellerById)
router.post('/allSeller',sellers.allSeller)
router.post('/banSeller/:sellerid',sellers.banSeller)
router.post('/pendingSeller',sellers.pendingSeller)
router.post('/approveSeller/:sellerid',sellers.approveSeller)
router.post('/declineSeller/:sellerid',sellers.declineSeller)
router.post('/viewbanSeller',sellers.viewbanSeller)
router.post('/unbanSeller/:sellerid',sellers.unbanSeller)





router.post('/addnewproduct',products.upload,products.addnewproduct)
router.post('/viewallproducts',products.viewallproducts)
router.post('/viewUserindprod/:id',products.viewUserprodById)
router.post('/ownProductsedit/:productid',products.upload,products.ownProductsedit)
router.post('/deleteProduct/:productid',products.deleteProduct)
router.post('/ownProducts/:sellerid',products.ownProducts)



router.post('/addCart/:userid/:productid',carts.addCart)
router.post('/viewCart/:userid',carts.viewCart)
router.post('/removecart/:id',carts.removeCart)



router.post('/newAddress/:userid',address.newAddress)
router.post('/showAddress/:userid',address.showAddress)
router.post('/deleteAddress/:aid',address.deleteAddress)
router.post('/editAddress/:aid',address.editAddress)


router.post('/buyProduct/:userid/:aid/:sellerid/:productid',buys.buyProduct)
router.post('/cartBuy/:userid/:aid',buys.cartBuy)
router.post('/viewHistory/:userid',buys.viewHistory)
router.post('/sellerHistory/:sellerid',buys.sellerHistory)

module.exports = router