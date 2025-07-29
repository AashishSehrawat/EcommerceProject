import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, ShippingInfo } from "../../types/apiTypes";

export interface CartReducerInitialState {
    loading: boolean;
    cartItems: CartItem[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
}

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subtotal: 0,
    tax: 0,
    shippingCharges: 0,
    discount: 0,
    total: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: 0,
    }
}

export const cartReducer = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex(i => i.productId === action.payload.productId);
            if(index != -1) {
                state.cartItems[index] = action.payload;
            } else {
                state.cartItems.push(action.payload);
                state.loading = false;
            }
           
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
            state.loading = false;
        },
        calulatePrice: (state) => {
            const subtotal = state.cartItems.reduce((total, item) => total + (item.price*item.quantity), 0)

            state.subtotal = subtotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.shippingCharges + state.tax - state.discount; 
        },
        discountApply: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart: () => initialState,
    }
});

export const { addToCart, removeCartItem, calulatePrice, discountApply, saveShippingInfo, resetCart } = cartReducer.actions;
export default cartReducer.reducer;
