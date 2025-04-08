import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ import auth context

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth(); // ✅ get current logged-in user

  const fetchCartItems = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
    const data = await res.json();
    setCartItems(data);
  };

  const addToCart = async (userId, productId, quantity) => {
    const res = await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    const data = await res.json();

    if (res.ok) {
      await fetchCartItems(userId);
    }

    return { success: res.ok, data };
  };

  const updateCartQuantity = async (userId, productId, quantity) => {
    const res = await fetch("http://localhost:5000/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });

    const data = await res.json();

    if (res.ok) {
      await fetchCartItems(userId);
    }

    return { success: res.ok, data };
  };

  const removeFromCart = async (userId, productId) => {
    const res = await fetch(
      `http://localhost:5000/api/cart/${userId}/${productId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      await fetchCartItems(userId);
    }
  };

  // ✅ React to changes in the logged-in user
  useEffect(() => {
    if (user?.id) {
      fetchCartItems(user.id);
    } else {
      setCartItems([]); // clear cart if no user
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
