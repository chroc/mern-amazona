import { useContext, useEffect, useReducer, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Badge, Button, Card, Col, FloatingLabel, Form, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import Rating from '../components/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils.js'
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const reducer = (state, action) => {
    switch (action.type) {
        case 'REFRESH_PRODUCT':
            return { ...state, product: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreateReview: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreateReview: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreateReview: false };
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ProductScreen = () => {
    let reviewsRef = useRef();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { slug } = useParams();
    const navigate = useNavigate();

    const [{ loading, error, product, loadingCreateReview }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ''
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                // console.log(result.data);
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        };
        fetchData();
    }, [slug]);

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const addToCartHandler = async () => {
        // check if current product exist in the cart or not
        const existItem = cart.cartItems.find((p) => p._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
        }
        // Dispatch add to cart action on the Context
        ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        navigate('/cart');
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!comment || !rating) {
            toast.error('Please enter comment and rating');
            return;
        }
        try {
            const { data } = await axios.post(
                `/api/products/${product._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );

            dispatch({
                type: 'CREATE_SUCCESS',
            });
            toast.success('Review submitted successfully');
            product.reviews.unshift(data.review);
            product.numReviews = data.numReviews;
            product.rating = data.rating;
            dispatch({ type: 'REFRESH_PRODUCT', payload: product });
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop,
            });
        } catch (error) {
            toast.error(getError(error));
            dispatch({ type: 'CREATE_FAIL' });
        }
    };

    return (
        loading ? <LoadingBox /> : error ? <MessageBox variant="danger">{error}</MessageBox>
            :
            <div>
                <Row>
                    <Col md={6}><img className="img-large" src={product.image} alt={product.name}></img></Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroupItem>
                                <Helmet>
                                    <title>{product.name}</title>
                                </Helmet>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Rating rating={product.rating} numReviews={product.numReviews} />
                            </ListGroupItem>
                            <ListGroupItem>Price : ${product.price}</ListGroupItem>
                            <ListGroupItem>Description: <p>{product.description}</p></ListGroupItem>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>${product.price}</Col>
                                        </Row>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{product.countInStock > 0 ? (
                                                <Badge bg="success">In Stock</Badge>
                                            ) : (
                                                <Badge bg="danger">Unavailable</Badge>
                                            )}</Col>
                                        </Row>
                                    </ListGroupItem>
                                    {product.countInStock > 0 && (
                                        <ListGroupItem>
                                            <div className="d-grid">
                                                <Button onClick={addToCartHandler} variant="primary">Add to cart</Button>
                                            </div>
                                        </ListGroupItem>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div className="my-3">
                    <h2 ref={reviewsRef}>Reviews</h2>
                    <div className="mb-3">
                        {product.reviews.length === 0 && (
                            <MessageBox>There is no review</MessageBox>
                        )}
                    </div>
                    <ListGroup>
                        {product.reviews.map((review) => (
                            <ListGroup.Item key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating rating={review.rating} caption=" "></Rating>
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <div className="my-3">
                        {userInfo ? (
                            <form onSubmit={submitHandler}>
                                <h2>Write a customer review</h2>
                                <Form.Group className="mb-3" controlId="rating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Select
                                        aria-label="Rating"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="">Select...</option>
                                        <option value="1">1- Poor</option>
                                        <option value="2">2- Fair</option>
                                        <option value="3">3- Good</option>
                                        <option value="4">4- Very good</option>
                                        <option value="5">5- Excelent</option>
                                    </Form.Select>
                                </Form.Group>
                                <FloatingLabel
                                    controlId="floatingTextarea"
                                    label="Comments"
                                    className="mb-3"
                                >
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </FloatingLabel>

                                <div className="mb-3">
                                    <Button disabled={loadingCreateReview} type="submit">
                                        Submit
                                    </Button>
                                    {loadingCreateReview && <LoadingBox></LoadingBox>}
                                </div>
                            </form>
                        ) : (
                            <MessageBox>
                                Please{' '}
                                <Link to={`/signin?redirect=/product/${product.slug}`}>
                                    Sign In
                                </Link>{' '}
                                to write a review
                            </MessageBox>
                        )}
                    </div>
                </div>
            </div>
    );
};

export default ProductScreen;