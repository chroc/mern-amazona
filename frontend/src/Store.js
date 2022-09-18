import { createContext, useReducer } from "react";

const Store = createContext();

const initialState = {
    cart: {
        cartItems: []
    }
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            // add item to cart
            return {...state, cart: {...state.cart, cartItems: [...state.cart.cartItems, action.payload]}};
            break;
    
        default:
            return state;
    }
};

const StoreProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};

    return <Store.Provider value={value}>{props.children}</Store.Provider>
};

export { Store, StoreProvider };