const sellers=require('./SellerSchema')
const multer = require("multer");
const products=require('../Seller/Products/ProductSchema')

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');

const registerSeller=(req,res)=>{
    const newSeller=new sellers({
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        gender: req.body.gender,
        image: req.file
    });
    newSeller.save()
    .then((data)=>{
        res.json({
            status: 200,
            msg: "Inserted successfully",
            data: data,
          });
        
    })
    .catch((err) => {
        if (err.code == 1100) {
          return res.json({
            status: 409,
            msg: "Mail Id already in Use",
            Error: err
          })
        }
        res.json({
          status: 500,
          msg: "Data not Inserted",
          Error: err,
        });
      });

}

const loginSeller=(req,res)=>{
    const email = req.body.email;
  const password = req.body.password;

sellers
.findOne({ email: email })
.then((data) => {
  if (!data) {
    return res.json({
      status: 400,
      msg: "Seller not found"
    });
  }
  if (password === data.password) {

    if(data.isActive == true && data.isBan == false){
      return res.status(200).json({
        status: 200,
        msg: "Login successfully",
        data: data
      });
    }
    else if(data.isBan == true){
      return res.json({
        status: 401,
        msg: "Seller is banned",
        data : 'ban'
      });
    }
    else{
        return res.json({
          status: 401,
          msg: "Seller is not active",
          data : 'pending'
        });
      } 
    

  } else {
    return res.json({
      status: 401,
      msg: "Password mismatch"
    });
  }
})
.catch((err) => {
  res.status(500).json({
    status: 500,
    msg: "Internal Server Error"
  });
});
}


const viewSellerById=(req,res)=>{
    sellers.findById({ _id: req.params.id })
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

const forgotpwd=(req,res)=>{
  sellers.findOneAndUpdate({email: req.body.email },{password: req.body.password})
  .then(data => {
    if (data != null)
      res.json({
        status: 200,
        msg: "Updated successfully",
        data:data
      })
    else
      res.json({
        status: 500,
        msg: "customer Not Found"

      })
  }).catch(err => {
    console.log(err);
    res.json({
      status: 500,
      msg: "Data not Updated",
      Error: err
    })
  })


}


const editSellerById=(req,res)=>{
  sellers.findByIdAndUpdate({_id: req.params.id},{ username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    gender: req.body.gender,
    image: req.file})

    .then(data => {
      res.json({
        status: 200,
        msg: "Updated successfully",
        data:data
      })
    }).catch(err => {
      res.json({
        status: 500,
        msg: "Data not Updated",
        Error: err
      })
    })


}



const allSeller=(req,res)=>{
  sellers.find()
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


const banSeller = async (req, res) => {
  const { sellerid } = req.params;
  
  try {
   
    const updatedSeller = await sellers.findByIdAndUpdate(sellerid, { isBan: true }, { new: true });

    if (!updatedSeller) {
      return res.status(404).json({ msg: 'Seller not found' });
    }

  
    await products.deleteMany({ sellerid: sellerid });

    res.status(200).json({
      status: 200,
      msg: 'Seller banned and products deleted successfully',
      data: updatedSeller
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

const pendingSeller = (req,res)=>{
  sellers.find({isActive:false})
  .then(data=>{
    res.send(data)
  })
  .catch(err=>{
    console.log(err);
  })

}



const approveSeller =(req,res)=>{
  const {sellerid} = req.params
  sellers.findByIdAndUpdate(sellerid, { isActive: true }, { new: true })
  .then(data=>{
    res.send(data)
  })
  .catch(err=>{
    res.send(err)
  })
}


const declineSeller = (req,res)=>{
  const {sellerid}= req.params;
  sellers.findByIdAndDelete(sellerid)
  .then(data=>{
    res.send(data)
  })
  .catch(err=>{
    res.send(err)
  })
}
const viewbanSeller = (req, res) => {
  sellers.find({ isActive: true, isBan: true })
    .then(data => {
      if (data.length === 0) {
        return res.status(404).json({ message: 'No banned sellers found.' });
      }
      res.status(200).json(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error', error: err });
    });
};


const unbanSeller =(req,res)=>{
  const {sellerid} = req.params
  sellers.findByIdAndUpdate(sellerid, { isBan: false }, { new: false })
  .then(data=>{
    res.send(data)
  })
  .catch(err=>{
    res.send(err)
  })
}








module.exports = {
    registerSeller,
    upload,
    loginSeller,
    viewSellerById,
    forgotpwd,
   editSellerById,
   allSeller,
   banSeller,
   pendingSeller,
   approveSeller,
   declineSeller,
   viewbanSeller,
   unbanSeller
}
