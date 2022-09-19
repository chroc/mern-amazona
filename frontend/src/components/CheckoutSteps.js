import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from "../utils";

const CheckoutSteps = (props) => {
    //.

    return (
        <Row className="checkout-steps">
            <Col className={props.step1 ? 'active' : ''}>Sign-In</Col>
            <Col className={props.step2 ? 'active' : ''}>Shipping</Col>
            <Col className={props.step3 ? 'active' : ''}>Payment</Col>
            <Col className={props.step4 ? 'active' : ''}>Place Order</Col>
        </Row>
    );
};

export default CheckoutSteps;