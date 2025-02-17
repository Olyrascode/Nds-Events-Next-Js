// import { configureStore } from '@reduxjs/toolkit';
// import productReducer from '../features/productSlice';  // ✅ Import du nouveau slice
// import stockReducer from '../features/stockSlice';
// import authReducer from '../features/authSlice';


// export const store = configureStore({
//   reducer: {
//     products: productReducer,  // ✅ Ajout du reducer des produits
//     stock: stockReducer,
//     auth: authReducer, 

//   },
// });
// src/store.ts
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
