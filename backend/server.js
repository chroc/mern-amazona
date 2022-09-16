import express  from "express";
import data from "./data.js";

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

// Server Up...
app.listen(port, () => {
    console.log(`Amazona Server Up at ${port}`);
});