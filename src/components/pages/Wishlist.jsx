import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ViewProductModal from "./ViewProductModal";
import { useSelector } from "react-redux";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, fetchWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist(user.id);
    }
  }, [user]);
  const getFinalPrice = (price, discount) =>
    (parseFloat(price) - parseFloat(discount)).toFixed(2);

  const handleMoveToCart = async (itemId) => {
    const { success } = await addToCart(itemId, 1);
    if (success) {
      await removeFromWishlist(user.id, itemId, false);
    }
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 dark:from-gray-900 dark:to-gray-800 px-4 py-8 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-4xl font-extrabold text-pink-700 dark:text-yellow-300 mb-6"
        >
          💖 Your Wishlist
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="py-16"
        >
          <h2 className="text-3xl font-bold text-pink-600 dark:text-yellow-300 mb-4">
            💔 Your wishlist is empty!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Browse your favorites and save them for later!
          </p>
          <Link
            to="/"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-black font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            🛍️ Start Exploring
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 dark:from-gray-900 dark:to-gray-800 px-4 py-8"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-4xl font-extrabold text-center text-pink-700 dark:text-yellow-300 mb-10"
      >
        💖 Your Wishlist
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {wishlist.map((item, index) => {
          const finalPrice = getFinalPrice(item.price, item.discount);

          return (
            <motion.div
              key={item.wishlistItemId || item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-[320px]"
            >
              <div
                className="cursor-pointer"
                onClick={() => setSelectedProduct(item)}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-40 object-contain bg-gray-100 dark:bg-gray-700 p-4"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 dark:text-yellow-400 text-lg font-bold">
                    ₹{finalPrice}
                  </span>
                  {parseFloat(item.discount) > 0 && (
                    <span className="line-through text-sm text-gray-400">
                      ₹{item.price}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    className="text-sm text-pink-600 dark:text-yellow-500 hover:underline"
                    onClick={() => handleMoveToCart(item.id)}
                  >
                    🛒 Move to Cart
                  </button>
                  <button
                    className="text-sm text-pink-500 dark:text-yellow-500 hover:underline"
                    onClick={async () => {
                      await removeFromWishlist(user.id, item.id);
                    }}
                  >
                    💔 Remove
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {selectedProduct && (
          <ViewProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            buttonLabel="Move to Cart"
            buttonAction={handleMoveToCart}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
