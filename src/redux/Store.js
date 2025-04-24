import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import wishlistReducer from "./slices/wishlistSlice";
import themeReducer from "./slices/themeSlice";
import checkoutCartReducer from "./slices/checkoutCartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    theme: themeReducer,
    checkoutCart: checkoutCartReducer,
  },
});
