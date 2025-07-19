import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import authReducer from './reducer/authReducer'; // Assuming you have an auth reducer
import { productApi } from './api/productApi';
import { cartReducer } from './reducer/cartReducer';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer, // Assuming you have an auth reducer
    [productApi.reducerPath]: productApi.reducer, // Adding the productApi reducer
    cart: cartReducer.reducer, // Adding the cartReducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(authApi.middleware) // Adding the authApi middleware,
      .concat(productApi.middleware) // Adding the productApi middleware
  )
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;