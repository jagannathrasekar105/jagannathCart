import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const wishlistIds = wishlist?.map((item) => item.id) || [];

  useEffect(() => {
    if (user?.id) fetchWishlist(user.id);
  }, [user]);

  const fetchWishlist = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
      const data = await res.json();
      setWishlist(data || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const addToWishlist = async (userId, productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();
      if (data.success) {
        setWishlist((prev) => {
          const exists = prev.some(
            (item) => item.id === productId || item.product_id === productId
          );
          return exists ? prev : [...prev, { id: productId }];
        });

        showSuccessToast("Added to wishlist");

        return { success: true };
      } else {
        showErrorToast(data.message || "Already in wishlist");
        return { success: false };
      }
    } catch (error) {
      showErrorToast("Something went wrong");
      return { success: false };
    }
  };

  const removeFromWishlist = async (userId, productId, showToast = true) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (data.success) {
        setWishlist((prev) =>
          prev.filter(
            (item) => item.id !== productId && item.product_id !== productId
          )
        );

        if (showToast) {
          showErrorToast("Removed from wishlist");
        }

        return { success: true };
      } else {
        if (showToast) {
          showErrorToast(data.message || "Failed to remove");
        }
        return { success: false, message: data.message };
      }
    } catch (error) {
      if (showToast) {
        showErrorToast("Something went wrong");
      }
      return { success: false };
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!user?.id) {
      showErrorToast("Login to use wishlist");

      return;
    }

    if (wishlistIds.includes(productId)) {
      await removeFromWishlist(user.id, productId);
    } else {
      await addToWishlist(user.id, productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        handleWishlistToggle,
        wishlistIds,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
