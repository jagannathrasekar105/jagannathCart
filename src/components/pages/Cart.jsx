import React from "react";
import toast from "react-hot-toast";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cart() {
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const handleQuantityChange = async (index, change) => {
    const updatedItem = cartItems[index];
    const newQty = updatedItem.quantity + change;

    if (newQty < 1) return;

    await updateCartQuantity(userId, updatedItem.id, newQty);
    toast.success("Cart updated");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 px-6 py-6"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-4xl font-bold text-center text-pink-700 dark:text-yellow-300 mb-8"
      >
        🛒 Your Cart
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
      >
        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-pink-600 dark:text-yellow-300 mb-4">
              🛍️ Your cart is feeling a little empty!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Add some amazing products to your cart and make it happy 😊
            </p>
            <Link
              to="/"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white dark:bg-yellow-400 dark:hover:bg-yellow-300 dark:text-black font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
            >
              🛒 Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Scrollable Product List */}
            <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.cartItemId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 py-2"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded bg-gray-100 dark:bg-gray-700"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-pink-600 dark:text-yellow-400 font-bold">
                        ₹{item.final_price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      title="Decrease"
                      className={`text-2xl font-bold ${
                        item.quantity === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-pink-600 dark:text-yellow-400 hover:scale-110 transition"
                      }`}
                      onClick={() => handleQuantityChange(index, -1)}
                      disabled={item.quantity === 1}
                    >
                      <Minus size={20} />
                    </button>

                    <span className="text-lg font-bold text-gray-800 dark:text-white transition-all duration-300 ease-in-out">
                      {item.quantity}
                    </span>

                    <button
                      title="Increase"
                      className="text-2xl font-bold text-pink-600 dark:text-yellow-400 hover:scale-110 transition"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {/* Total & Remove */}
                  <div className="text-right">
                    <p className="text-md font-semibold text-green-600 dark:text-yellow-300">
                      Total: ₹{(item.final_price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-red-500 dark:text-red-400 hover:underline"
                      onClick={async () => {
                        await removeFromCart(userId, item.id);
                        toast.success("Item removed from cart");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final Total & Checkout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-right mt-6"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Grand Total: ₹
                {cartItems
                  .reduce(
                    (sum, item) => sum + item.final_price * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </h2>
              <button className="mt-4 bg-pink-600 dark:bg-yellow-500 dark:text-black text-white px-6 py-2 rounded hover:bg-pink-700 dark:hover:bg-yellow-400 transition">
                Proceed to Checkout
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
