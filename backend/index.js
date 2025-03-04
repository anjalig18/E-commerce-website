const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://sammy:sammy7890@cluster0.43cb0.mongodb.net/e-commerce");

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
  });
});

// Route for Images folder
app.use('/images', express.static('upload/images'));

// Middleware to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

// User Schema
const Users = mongoose.model("Users", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: [{ productId: Number, size: String, quantity: Number }],
  date: { type: Date, default: Date.now() }
});

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number },
  old_price: { type: Number },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

// Root API Route For Testing
app.get("/", (req, res) => {
  res.send("Root");
});

// User Login API
app.post('/login', async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      success = true;
      const token = jwt.sign(data, 'secret_ecom');
      return res.json({ success, token });
    }
  }
  return res.status(400).json({ success, errors: "Invalid email or password" });
});

// User Signup API
app.post('/signup', async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success, errors: "User already exists" });
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: []
  });
  await user.save();
  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  success = true;
  return res.json({ success, token });
});

// Get all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// Get latest products
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(-8);
  res.send(arr);
});

// Get popular women's products
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" }).slice(0, 4);
  res.send(products);
});

// Get related products
app.post("/relatedproducts", async (req, res) => {
  const { category } = req.body;
  const products = await Product.find({ category }).slice(0, 4);
  res.send(products);
});

// Add item to cart
app.post('/addtocart', fetchuser, async (req, res) => {
  console.log("Add Cart");
  const { itemId, size } = req.body;
  let userData = await Users.findOne({ _id: req.user.id });

  let existingItem = userData.cartData.find(item => item.productId === itemId && item.size === size);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    userData.cartData.push({ productId: itemId, size, quantity: 1 });
  }

  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

// Remove item from cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  console.log("Remove Cart");
  const { itemId, size } = req.body;
  let userData = await Users.findOne({ _id: req.user.id });

  userData.cartData = userData.cartData.filter(item => !(item.productId === itemId && item.size === size));

  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

// Get cart data
app.post('/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// Add new product (Admin)
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  
  const product = new Product({
    id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price
  });

  await product.save();
  res.json({ success: true, name: req.body.name });
});

// Remove product (Admin)
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true });
});

// Start server
app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
