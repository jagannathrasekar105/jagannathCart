// src/components/redux/checkoutCartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyProduct: [],
};

const checkoutCartSlice = createSlice({
  name: "checkoutCart",
  initialState,
  reducers: {
    setBuyProduct: (state, action) => {
      state.buyProduct = action.payload;
    },
    addToBuyProduct: (state, action) => {
      const product = action.payload;
      const exists = state.buyProduct.find((item) => item.id === product.id);
      if (!exists) {
        state.buyProduct.push(product);
      }
    },
    removeFromBuyProduct: (state, action) => {
      const productId = action.payload;
      state.buyProduct = state.buyProduct.filter(
        (item) => item.id !== productId
      );
    },
    updateBuyProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.buyProduct = state.buyProduct.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    },
    resetCheckoutCart: () => initialState,
  },
});
// src/components/redux/checkoutCartSlice.js

// In checkoutCartSlice.js
export const selectTotalAmount = (state) =>
  state.checkoutCart.buyProduct.reduce(
    (total, { final_price, quantity, shipping_cost }) => {
      const price = parseFloat(final_price);
      const qty = parseInt(quantity);
      const shipping = parseFloat(shipping_cost);
      return total + price * qty + shipping;
    },
    0
  );

export const {
  setBuyProduct,
  addToBuyProduct,
  removeFromBuyProduct,
  updateBuyProductQuantity,
  resetCheckoutCart,
} = checkoutCartSlice.actions;

export default checkoutCartSlice.reducer;
