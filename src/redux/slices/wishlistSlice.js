// wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchWishlistAPI,
  addToWishlistAPI,
  removeFromWishlistAPI,
} from "../../components/API/WishlistApi";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await fetchWishlistAPI(userId);
      return data || [];
    } catch (err) {
      return rejectWithValue("Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const data = await addToWishlistAPI(userId, productId);
      if (!data.success) return rejectWithValue(data.message);
      return { id: productId };
    } catch (err) {
      return rejectWithValue("Add to wishlist failed");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const data = await removeFromWishlistAPI(userId, productId);
      if (!data.success) return rejectWithValue(data.message);
      return productId;
    } catch (err) {
      return rejectWithValue("Remove from wishlist failed");
    }
  }
);

// ✅ NEW: handleWishlistToggle
export const handleWishlistToggle = createAsyncThunk(
  "wishlist/handleWishlistToggle",
  async ({ userId, productId }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const existing = state.wishlist.items;
    const isInWishlist = existing.some(
      (item) => item.id === productId || item.product_id === productId
    );

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist({ userId, productId })).unwrap();
        showErrorToast("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ userId, productId })).unwrap();
        showSuccessToast("Added to wishlist");
      }
    } catch (err) {
      showErrorToast(err || "Action failed");
      return rejectWithValue(err);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const exists = state.items.some(
          (item) => item.id === action.payload.id
        );
        if (!exists) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) =>
            item.id !== action.payload && item.product_id !== action.payload
        );
      });
  },
});

export default wishlistSlice.reducer;
