const customers=require('./CustomerSchema');

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');


const registerCustomer=(req,res)=>{
    const newCust = new customers({
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: req.body.password,
        gender: req.body.gender,
        image: req.file
      });
      newCust
        .save()
        .then((data) => {
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
    };


//Login Customer
const loginCustomer = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  customers
    .findOne({ email:email })
    .then((data) => {
      console.log(data);
      if(!data){
      return  res.json({
          status:405,
          msg:"No User Found",
          
      })
      }
       else if(password==data.password){
         return res.json({
            status:200,
            msg:"Login successfully",
            data:data
        })
      }else{
        res.json({
          status:401,
          msg:"password Mismatch",
          
      })
      }
    
    }).catch(err=>{
      console.log(err);
    res.json({
        status:500,
        msg:"Internal server error",
        Error:err
    })
    })
      };
    
const viewCustById=(req,res)=>{
  customers.findById({ _id: req.params.id })
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
  customers.findOneAndUpdate({email: req.body.email },{password: req.body.password})
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

const editCustomerById=(req,res)=>{
  customers.findByIdAndUpdate({_id: req.params.id},{
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    gender: req.body.gender,
    image: req.file
  })
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



const allCustomer = (req,res)=>{
  customers.find()
  .then(data=>{
    res.send(data)
  })
  .catch(err=>{
    console.log(err);
  })

}








    module.exports = {
        registerCustomer,
        upload,
        loginCustomer,
        viewCustById,
        forgotpwd,
        editCustomerById,
        allCustomer
      }