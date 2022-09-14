import { useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
// import data from '../data';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const HomeScreen = () => {
    // const [products, setProducts] = useState([]);
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: ''
    });
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get('/api/products');
                dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: error.message });
            }

            // setProducts(result.data);
            // console.log(result.data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Featured Products</h1>
            <div className="products">
                {loading ? <div>Loading...</div> : error ? <div>{error}</div> :
                    (
                        <Row>
                            {products.map((product) => (
                                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    )}
            </div>
        </div>
    );
};

export default HomeScreen;