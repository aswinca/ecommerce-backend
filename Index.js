const express = require('express')
const app= express();
const route=require('./routes')
const bodyParser=require('body-parser')
const db=require('./dbconnection')
const cors=require('cors')
console.log("backend called");

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static( `${__dirname}/upload`));
app.use(cors())
app.use('/',route)



app.listen(4030,()=>{
    console.log("Server created successfully");
})