
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://82.29.170.25';


// // ✅ Fetch pour les produits individuels
// export const fetchAvailableStock = createAsyncThunk(
//   'stock/fetchAvailableStock',
//   async ({ productId, startDate, endDate }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${API_URL}/api/stock/${productId}?startDate=${startDate}&endDate=${endDate}`
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         return rejectWithValue(error.message || 'Erreur lors de la récupération du stock');
//       }

//       const data = await response.json();
//       return { productId, availableStock: data.availableStock };
//     } catch (error) {
//       return rejectWithValue('Erreur serveur');
//     }
//   }
// );

// // ✅ Fetch pour les packs
// export const fetchAvailablePackStock = createAsyncThunk(
//   'stock/fetchAvailablePackStock',
//   async ({ packId, startDate, endDate }, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         `${API_URL}/api/packs/${packId}/availability?startDate=${startDate}&endDate=${endDate}`
//       );

//       if (!response.ok) {
//         const error = await response.json();
//         return rejectWithValue(error.message || 'Erreur lors de la récupération du stock du pack');
//       }

//       const data = await response.json();
//       return { packId, availableStock: data.availableStock };
//     } catch (error) {
//       return rejectWithValue('Erreur serveur');
//     }
//   }
// );

// const stockSlice = createSlice({
//   name: 'stock',
//   initialState: {
//     stockByProduct: {}, // Stock des produits individuels
//     stockByPack: {},    // ✅ Stock des packs
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // ✅ Gestion du stock des produits
//       .addCase(fetchAvailableStock.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAvailableStock.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stockByProduct[action.payload.productId] = action.payload.availableStock;
//       })
//       .addCase(fetchAvailableStock.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // ✅ Gestion du stock des packs
//       .addCase(fetchAvailablePackStock.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchAvailablePackStock.fulfilled, (state, action) => {
//         state.loading = false;
//         state.stockByPack[action.payload.packId] = action.payload.availableStock;
//       })
//       .addCase(fetchAvailablePackStock.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // ✅ Vérifie bien l'export ici :
// export default stockSlice.reducer;
// // export { fetchAvailableStock, fetchAvailablePackStock };
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-nds-events.fr';

// ✅ Fetch pour les produits individuels
export const fetchAvailableStock = createAsyncThunk(
  'stock/fetchAvailableStock',
  async ({ productId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/stock/${productId}?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la récupération du stock');
      }

      const data = await response.json();
      return { productId, availableStock: data.availableStock };
    } catch {
      return rejectWithValue('Erreur serveur');
    }
  }
);

// ✅ Fetch pour les packs
export const fetchAvailablePackStock = createAsyncThunk(
  'stock/fetchAvailablePackStock',
  async ({ packId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/packs/${packId}/availability?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Erreur lors de la récupération du stock du pack');
      }

      const data = await response.json();
      return { packId, availableStock: data.availableStock };
    } catch {
      return rejectWithValue('Erreur serveur');
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stockByProduct: {}, // Stock des produits individuels
    stockByPack: {},    // Stock des packs
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion du stock des produits
      .addCase(fetchAvailableStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockByProduct[action.payload.productId] = action.payload.availableStock;
      })
      .addCase(fetchAvailableStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Gestion du stock des packs
      .addCase(fetchAvailablePackStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePackStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockByPack[action.payload.packId] = action.payload.availableStock;
      })
      .addCase(fetchAvailablePackStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default stockSlice.reducer;
