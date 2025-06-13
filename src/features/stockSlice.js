import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-nds-events.fr";

// ✅ Fetch pour les produits individuels
export const fetchAvailableStock = createAsyncThunk(
  "stock/fetchAvailableStock",
  async ({ productId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/stock/${productId}?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || "Erreur lors de la récupération du stock"
        );
      }

      const data = await response.json();
      return {
        productId,
        startDate,
        endDate,
        availableStock: data.availableStock,
      };
    } catch {
      return rejectWithValue("Erreur serveur");
    }
  }
);

// ✅ Fetch pour les packs
export const fetchAvailablePackStock = createAsyncThunk(
  "stock/fetchAvailablePackStock",
  async ({ packId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/packs/${packId}/availability?startDate=${startDate}&endDate=${endDate}`
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || "Erreur lors de la récupération du stock du pack"
        );
      }

      const data = await response.json();
      return {
        packId,
        startDate,
        endDate,
        availableStock: data.availableStock,
      };
    } catch {
      return rejectWithValue("Erreur serveur");
    }
  }
);

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    stockByProduct: {}, // Stock des produits individuels avec clé incluant les dates
    stockByPack: {}, // Stock des packs avec clé incluant les dates
    loading: false,
    error: null,
  },
  reducers: {
    // Action pour vider le cache du stock
    clearStockCache: (state) => {
      state.stockByProduct = {};
      state.stockByPack = {};
    },
    // Action pour vider le cache d'un produit spécifique
    clearProductStockCache: (state, action) => {
      const { productId } = action.payload;
      // Supprimer toutes les entrées qui commencent par ce productId
      Object.keys(state.stockByProduct).forEach((key) => {
        if (key.startsWith(`${productId}_`)) {
          delete state.stockByProduct[key];
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Gestion du stock des produits
      .addCase(fetchAvailableStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableStock.fulfilled, (state, action) => {
        state.loading = false;
        // Créer une clé unique incluant productId et les dates
        const cacheKey = `${action.payload.productId}_${action.payload.startDate}_${action.payload.endDate}`;
        state.stockByProduct[cacheKey] = action.payload.availableStock;
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
        // Créer une clé unique incluant packId et les dates
        const cacheKey = `${action.payload.packId}_${action.payload.startDate}_${action.payload.endDate}`;
        state.stockByPack[cacheKey] = action.payload.availableStock;
      })
      .addCase(fetchAvailablePackStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStockCache, clearProductStockCache } = stockSlice.actions;
export default stockSlice.reducer;
