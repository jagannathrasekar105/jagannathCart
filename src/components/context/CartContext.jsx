import { createContext, useContext, useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import {
  fetchCartItemsApi,
  addToCartApi,
  updateCartApi,
  removeFromCartApi,
} from "../API/CartApi";
import { useSelector } from "react-redux";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.ID) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user?.ID) return;

    try {
      const data = await fetchCartItemsApi(user.ID);
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?.ID) {
      showErrorToast("Please login to add items to cart");
      return { success: false, data: { error: "Not logged in" } };
    }

    const isAlreadyInCart = cartItems.some((item) => item.ID === productId);
    if (isAlreadyInCart) {
      showErrorToast("🛒 Product already in cart");
      return { success: false, data: { error: "Already in cart" } };
    }

    try {
      const { success, data } = await addToCartApi(
        user.ID,
        productId,
        quantity
      );
      if (success) {
        await fetchCartItems();
        showSuccessToast("Item added to cart");
      }
      return { success, data };
    } catch (error) {
      showErrorToast("Something went wrong!");
      return { success: false, data: { error } };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user?.ID) return;

    try {
      const success = await updateCartApi(user.ID, productId, quantity);
      if (success) {
        await fetchCartItems();
        showSuccessToast("Cart quantity updated successfully");
      } else {
        showErrorToast("Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      showErrorToast("Something went wrong");
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.ID) return;

    try {
      const success = await removeFromCartApi(user.ID, productId);
      if (success) {
        await fetchCartItems();
        showSuccessToast("Item removed from cart");
      } else {
        showErrorToast("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      showErrorToast("An error occurred. Please try again.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
