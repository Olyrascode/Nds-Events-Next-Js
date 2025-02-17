// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// // 📌 Action asynchrone pour récupérer les produits depuis l'API
// export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
//   const response = await fetch('http://localhost:5000/api/products');
//   if (!response.ok) {
//     throw new Error('Erreur lors de la récupération des produits');
//   }
//   const data = await response.json();
//   console.log("📌 Produits récupérés :", data.products); // 🔥 Debug
//   return data.products;
// });

// // 📌 Création du slice Redux
// const productSlice = createSlice({
//   name: 'products',
//   initialState: {
//     products: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload;
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default productSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 📌 Récupérer les produits depuis MongoDB
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('http://82.29.170.25/api/products');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des produits');
  }
  return response.json(); // Retourne les produits
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Mets à jour Redux avec les produits
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default productSlice.reducer;
