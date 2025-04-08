import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) setUserId(user.id);
  }, []);

  useEffect(() => {
    if (userId) fetchWishlist(userId);
  }, [userId]);

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
      console.log("Wishlist Add Response:", data);

      if (data.success) {
        // Ensure productId is in the wishlist
        setWishlist((prev) => {
          if (
            prev.find(
              (item) => item.id === productId || item.product_id === productId
            )
          ) {
            return prev;
          }
          return [...prev, { id: productId }];
        });

        toast.success("Added to wishlist");
        return { success: true };
      } else {
        toast.error(data.message || "Already in wishlist");
        return { success: false };
      }
    } catch (error) {
      toast.error("Something went wrong");
      return { success: false };
    }
  };

  const removeFromWishlist = async (userId, productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (data.success) {
        setWishlist((prev) => prev.filter((item) => item.id !== productId));
        toast.success("Removed from wishlist");
        return { success: true };
      } else {
        toast.error(data.message || "Failed to remove");
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error("Something went wrong");
      return { success: false, message: "Something went wrong" };
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
