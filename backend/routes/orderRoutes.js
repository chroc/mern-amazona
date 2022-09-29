import express from "express";
import Order from "../models/orderModel.js";
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { generateToken, isAuth } from "../utils.js";

const orderRouter = express.Router();

orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
    // create new order
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((p) => ({ ...p, product: p._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id
    });

    // save new order
    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
}));

export default orderRouter;