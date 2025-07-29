import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import authReducer from './reducer/authReducer'; // Assuming you have an auth reducer
import { productApi } from './api/productApi';
import { cartReducer } from './reducer/cartReducer';
import { orderApi } from './api/orderApi';
import { dashboardApi } from './api/dashboardApi';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer, // Assuming you have an auth reducer
    [productApi.reducerPath]: productApi.reducer, // Adding the productApi reducer
    cart: cartReducer.reducer, // Adding the cartReducer
    [orderApi.reducerPath]: orderApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(authApi.middleware) // Adding the authApi middleware,
      .concat(productApi.middleware) // Adding the productApi middleware
      .concat(orderApi.middleware)
      .concat(dashboardApi.middleware) // Adding the dashboardApi middleware
  )
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;