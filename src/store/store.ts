
import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/productSlice';
import stockReducer from '../features/stockSlice';
import authReducer from '../features/authSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    stock: stockReducer,
    auth: authReducer,
  },
});

// Définir et exporter le type du dispatch
export type AppDispatch = typeof store.dispatch;
