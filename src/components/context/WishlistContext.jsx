import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchWishlistAPI,
  addToWishlistAPI,
  removeFromWishlistAPI,
} from "../API/WishlistApi";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import { useSelector } from "react-redux";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const [wishlist, setWishlist] = useState([]);

  const wishlistIds = wishlist?.map((item) => item.id) || [];

  useEffect(() => {
    if (user?.id) fetchWishlist(user.id);
  }, [user]);

  const fetchWishlist = async (userId) => {
    try {
      const data = await fetchWishlistAPI(userId);
      setWishlist(data || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const addToWishlist = async (userId, productId) => {
    try {
      const data = await addToWishlistAPI(userId, productId);

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
      const data = await removeFromWishlistAPI(userId, productId);

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
