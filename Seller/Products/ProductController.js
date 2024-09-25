
const products=require('./ProductSchema')
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([
    { name: 'image1' },
    { name: 'image2' },
    { name: 'image3' }
])

const addnewproduct=(req,res)=>{
    const newproduct=new products({
        productname:req.body.productname,
        productbrand:req.body.productbrand,
        quantity:req.body.quantity,
        material:req.body.material,
        specifications:req.body.specifications,
        price:req.body.price,
        gender:req.body.gender,
        size:req.body.size,
        image1:req.files.image1,
        image2:req.files.image2,
        image3:req.files.image3,
        sellerid:req.body.sellerid
    })
    newproduct.save()
    .then((data)=>{
        res.json({
            status:200,
            msg:"inserted succesfully",
            data:data
         })
        })
         .catch((err)=>{
            console.log(err);
            res.json({
               status:500,
               msg:"data not inserted",
               Error:err
            })
            
       
      

    })
}

const viewallproducts=(req,res)=>{
  products.find()
  .then(data => {
    console.log(data);
    res.json({
      status: 200,
      msg: "Data obtained successfully",
      data: data
    })

  }).catch((err)=>{
    console.log(err);
    res.json({
       status:500,
       msg:"no data obtained",
       Error:err
    })
    
 })

}

const viewUserprodById=(req,res)=>{
  products.findById({ _id: req.params.id })
  .then(data => {
    console.log(data);
    res.json({
      status: 200,
      msg: "Data obtained successfully",
      data: data
    })

  }).catch(err => {
    console.log(err);
    res.json({
      status: 500,
      msg: "No Data obtained",
      Error: err
    })
  })
}
const ownProducts = (req, res) => {
  const { sellerid } = req.params;
  console.log(sellerid);
  
  // Modify the query to filter products by sellerid
  products.find({ sellerid: sellerid }) // Adjust this field based on your product schema
   .exec() .then(data => {
      console.log(data);
      
      res.send(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
}



const ownProductsedit = (req, res) => {
  const { productid } = req.params;

  products.findById(productid)
    .then(existingProduct => {
      if (!existingProduct) {
        return res.status(404).json({ status: 404, msg: 'Product not found' });
      }

      // Prepare the updated data
      const updatedData = {
        productname: req.body.productname,
        productbrand: req.body.productbrand,
        quantity: req.body.quantity,
        material: req.body.material,
        specifications: req.body.specifications,
        price: req.body.price,
        gender: req.body.gender,
        size: req.body.size,
        // Keep the existing images if no new ones are uploaded
        image1: req.files['image1'] ? req.files['image1'] : existingProduct.image1,
        image2: req.files['image2'] ? req.files['image2'] : existingProduct.image2,
        image3: req.files['image3'] ? req.files['image3'] : existingProduct.image3,
      };

      return products.findByIdAndUpdate(productid, updatedData, { new: true });
    })
    .then(updatedProduct => {
      res.json({
        status: 200,
        msg: 'Product updated successfully',
        data: updatedProduct,
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
};


const deleteProduct =(req,res)=>{
  const productid = req.params.productid;
  products.findByIdAndDelete(productid)
  .then(data=>{
    res.json({
      status:200,
      msg:'product deleted successfully',
      data:data
    })
  })
  .catch(err=>{
    res.send(err);
  })
}







module.exports={
    addnewproduct,
    upload,
    viewallproducts,
    viewUserprodById,
    ownProducts,
    deleteProduct,
    ownProductsedit
   
}