// context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils"; // adjust path
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);
      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user?.id) {
      showErrorToast("Please login to add items to cart");
      return { success: false, data: { error: "Not logged in" } };
    }

    const isAlreadyInCart = cartItems.some((item) => item.id === productId);
    if (isAlreadyInCart) {
      showErrorToast("🛒 Product already in cart");
      return { success: false, data: { error: "Already in cart" } };
    }

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchCartItems();
        showSuccessToast("Item added to cart");
      }

      return { success: res.ok, data };
    } catch (error) {
      showErrorToast("Something went wrong!");
      return { success: false, data: { error } };
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (!user?.id) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId, quantity }),
      });

      if (res.ok) {
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
    if (!user?.id) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/cart/${user.id}/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await fetchCartItems();
        showSuccessToast("Item removed from cart");
      } else {
        showErrorToast("Failed to remove item from cart");
      }
    } catch (error) {
      showErrorToast("An error occurred. Please try again.");
      console.error("Error removing item from cart:", error);
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
