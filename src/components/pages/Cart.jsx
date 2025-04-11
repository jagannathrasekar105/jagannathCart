import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCheckoutCart } from "../context/CheckoutCartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ViewProductModal from "./ViewProductModal";
import { showErrorToast } from "../../utils/toastUtils";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartQuantity } = useCart();
  const { setBuyProduct } = useCheckoutCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleQuantityChange = async (index, change) => {
    const item = cartItems[index];
    const newQty = item.quantity + change;
    if (newQty >= 1) await updateCartQuantity(item.id, newQty);
  };
  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === cartItems.length
        ? []
        : cartItems.map((item) => item.id)
    );
  };

  const handleMultiProductCheckout = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    if (!selectedProducts.length)
      return showErrorToast("🛍️ Select at least one item to continue.");
    setBuyProduct(selectedProducts);
    navigate("/checkout");
  };

  const getTotalPrice = () =>
    cartItems
      .reduce(
        (sum, item) => sum + Number(item.final_price || 0) * item.quantity,
        0
      )
      .toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800"
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-4xl font-bold text-center text-pink-700 dark:text-yellow-300 p-4"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center py-16"
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
            <div className="flex items-center justify-end mb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={handleSelectAll}
                  className="accent-pink-500 dark:accent-yellow-400"
                />
                Select All
              </label>
            </div>

            <div className="max-h-80 overflow-y-auto pr-4 space-y-2 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100 dark:scrollbar-thumb-yellow-400 dark:scrollbar-track-gray-700">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.cartItemId || item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 py-4"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="accent-pink-500 dark:accent-yellow-400 mr-4"
                  />

                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => setSelectedProduct(item)}
                  >
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

                  <div className="flex items-center justify-center gap-4 flex-1">
                    <button
                      title="Decrease quantity"
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
                    <span className="text-lg font-bold text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      title="Increase quantity"
                      className="text-2xl font-bold text-pink-600 dark:text-yellow-400 hover:scale-110 transition"
                      onClick={() => handleQuantityChange(index, 1)}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-1 text-right">
                    <p className="text-sm font-semibold text-green-600 dark:text-yellow-300">
                      ₹{(item.final_price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      className="text-sm text-red-500 dark:text-red-400 hover:underline"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedProduct && (
              <ViewProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                buttonLabel="Buy"
                buttonAction={() => {
                  setBuyProduct([selectedProduct]);
                  navigate("/checkout");
                }}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-right mt-2"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Grand Total: ₹{getTotalPrice()}
              </h2>
              <button
                onClick={handleMultiProductCheckout}
                className="mt-2 bg-pink-600 dark:bg-yellow-500 dark:text-black text-white px-6 py-2 rounded hover:bg-pink-700 dark:hover:bg-yellow-400 transition"
              >
                Proceed to Checkout
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
