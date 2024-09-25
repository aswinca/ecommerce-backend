const Address = require('./addressSchema');

const newAddress = (req, res) => {
    const { userid } = req.params;

    const address = new Address({
      name: req.body.name,
      pin: req.body.pin,
      number: req.body.number,
      city: req.body.city,
      state: req.body.state,
      landmark: req.body.landmark,
      userid: userid 
    });

    address.save()
      .then(data => {
        res.status(201).json({
          status: 201,
          msg: 'Address created successfully',
          data: data
        });
      })
      .catch(err => {
        res.status(500).send(err);
      });
};

  const showAddress = (req, res) => {
    const { userid } = req.params;
  
    Address.find({ userid: userid })
      .then(data => {
        if (data.length === 0) {
          return res.status(404).json({
            status: 404,
            msg: 'No addresses found for this user',
          });
        }
        res.status(200).json({
          status: 200,
          msg: 'Address fetched successfully',
          data: data
        });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };
  


  const deleteAddress =(req,res)=>{
    const {aid} = req.params;
    Address.findByIdAndDelete(aid)
    .then(data => {
      res.status(201).json({
        status: 201,
        msg: 'Address deleted successfully',
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
  }

  
  const editAddress = (req,res)=>{
    const {aid} = req.params;
    Address.findByIdAndUpdate(aid,{
      name: req.body.name,
      pin: req.body.pin,
      number: req.body.number,
      city: req.body.city,
      state: req.body.state,
      landmark: req.body.landmark,
    })
    .then(data => {
      res.status(201).json({
        status: 201,
        msg: 'Address edited successfully',
        data:data
      });
    })
    .catch(err => {
      res.status(500).send(err);
    });
  }

  module.exports = {newAddress,showAddress,deleteAddress,editAddress}