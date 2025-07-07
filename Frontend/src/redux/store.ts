import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import authReducer from './reducer/authReducer'; // Assuming you have an auth reducer

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer, // Assuming you have an auth reducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(authApi.middleware) // Adding the authApi middleware,
  )
})

export default store;
