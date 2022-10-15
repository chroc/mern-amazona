import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();

// GET All Products
productRouter.get('/', async (req, res) => {
    const products = await Product.find({});
    res.send(products);
});

// GET All Categories
productRouter.get('/categories', expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
}));

// GET Product by :slug
productRouter.get('/slug/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product not found' });
    }
});

// GET Product by :id
productRouter.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ message: 'Product not found' });
    }
});

export default productRouter;