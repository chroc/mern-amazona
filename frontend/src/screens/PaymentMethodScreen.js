import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";

const PaymentMethodScreen = () => {
    const { state, dispatch } = useContext(Store);
    const { cart: { shippingAddress, paymentMethod } } = state;
    const navigate = useNavigate();

    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'PayPal');

    useEffect(() => {
        if(!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
        localStorage.setItem('paymentMethod', paymentMethodName);
        navigate('/placeorder');
    };

    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <div className="container small-container">
                <Helmet>
                    <title>Payment Method</title>
                </Helmet>
                <h1 className="my-3">Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="PayPal"
                            label="PayPal"
                            value="PayPal"
                            checked={paymentMethodName === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Stripe"
                            label="Stripe"
                            value="Stripe"
                            checked={paymentMethodName === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Button type="submit">Continue</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default PaymentMethodScreen;