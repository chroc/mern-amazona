import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(Store);
    const { cart, userInfo } = state;

    // Round number: 122.2443 => 122.24
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    // Use reduce to calculate the total of items price
    cart.itemsPrice = round2(cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0));
    // Calculate shipping price
    cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
    // Calculate tax price
    cart.taxPrice = round2(0.15 * cart.itemsPrice);
    // Calculate total price
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

    // Place Order
    const placeOrderHandler = async () => {};

    useEffect(() => {
        if(!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4>
                <Helmet>
                    <title>Preview Order</title>
                </Helmet>
            </CheckoutSteps>
            <h1 className="my-3">Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name: </strong>{cart.shippingAddress.fullName} <br/>
                                <strong>Address: </strong>{cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                                {cart.shippingAddress.country}
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method: </strong>{cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroupItem key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"></img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}><span>{item.quantity}</span></Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cart.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col><strong>Order Total</strong></Col>
                                        <Col><strong>${cart.totalPrice.toFixed(2)}</strong></Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >Place Order</Button>
                                    </div>
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;