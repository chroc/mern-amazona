import express  from "express";
import data from "./data.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Connect DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log(err.message);
});

const app = express();
const port = process.env.PORT || 5000;

// GET All Products
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

// GET Product by :slug
app.get('/api/products/slug/:slug', (req, res) => {
  const product = data.products.find((p) => p.slug === req.params.slug);
  if(product){
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

// GET Product by :id
app.get('/api/products/:id', (req, res) => {
  const product = data.products.find((p) => p._id === req.params.id);
  if(product){
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

// Server Up...
app.listen(port, () => {
    console.log(`Amazona Server Up at ${port}`);
});