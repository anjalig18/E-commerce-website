const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { type } = require("os");

// Middleware setup
app.use(express.json());
app.use(cors());

// MongoDB connection
const dbURI = "mongodb+srv://anjalig1810:Anjali123%40%40%40@cluster0.fqhty1b.mongodb.net/";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("MongoDB connection error:", err));

// Define a simple route
app.get("/", (req, res) => {
    res.send("Express App is running");
});

//image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
      return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//creating uplaod endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        Image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

//schema for creating product

const Product = mongoose.model("product",{
   id:{
      type:Number,
      required:true,
      },
    name:{
      type:String,
      required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
     id:id,
     name:req.body.name,
     image:req.body.image,
     category:req.body.category,
     old_price:req.body.old_price,
     new_price:req.body.new_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})
//creating api for deleting product

app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Remove");
    res.json({
        success:true,
        name:req.body.name
    })
})

//creating API for getting all product

app.get('/allproducts',async(req,res)=>{
     let products = await Product.find({});
     console.log("All product fetched");
     res.send(products);
})

//schema creating for users

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },

})

//Creating EndPoint  for registering the user
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found with same email address" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save();

    const data = {
        user: {
            id: user.id,
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token });
});

//Creating end point for user login

app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({ success: true, token });
        }
        else{
            res.json({ success: false, errors:"Wrong password" });
        }
    }
    else{
        res.json({ success: false, errors:"Wrong Email Id" });
    }
})
// Creating endpoint for new collection

app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})
//creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
   let products = await Product.find({category:"women"});
   let popular_in_women = products.slice(0,4);
   console.log("Popular in women fetch");
   res.send(popular_in_women);
})

//creating endpoint for adding product in cartdata
// app.post('/addtocart',async(req,res)=>{
   
// })

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error:", error);
    }
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
