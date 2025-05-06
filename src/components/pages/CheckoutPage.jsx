import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import RemoveProductModal from "./RemoveProductModal";
import { useCheckoutCart } from "../context/CheckoutCartContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    buyProduct,
    setBuyProduct,
    removeFromBuyProduct,
    updateBuyProductQuantity,
    totalAmount,
  } = useCheckoutCart();

  const [modalState, setModalState] = useState({ show: false, product: null });

  const handleRemoveClick = useCallback((product) => {
    setModalState({ show: true, product });
  }, []);

  const confirmRemove = useCallback(() => {
    const productId = modalState.product?.id;
    if (productId) {
      removeFromBuyProduct(productId);
    }
    setModalState({ show: false, product: null });
  }, [modalState, removeFromBuyProduct]);

  const handleQuantityChange = useCallback(
    (productId, currentQty, type) => {
      const newQty =
        type === "inc" ? currentQty + 1 : Math.max(currentQty - 1, 1);
      updateBuyProductQuantity(productId, newQty);
    },
    [updateBuyProductQuantity]
  );

  return (
    <div className=" bg-gradient-to-br from-pink-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 p-10 space-y-10  ">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8   ">
        <h1 className="text-4xl font-extrabold text-center text-pink-600 dark:text-yellow-400 tracking-wide ">
          🛒 Checkout Summary
        </h1>

        {buyProduct.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-yellow-500 ">
            No products to checkout.
          </p>
        ) : (
          <div className="space-y-6 max-h-80 overflow-y-auto p-2 overflow-x-hidden scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100 dark:scrollbar-thumb-yellow-400 dark:scrollbar-track-gray-700">
            {buyProduct.map((item) => {
              const total = (
                parseFloat(item.final_price) * item.quantity +
                parseFloat(item.shipping_cost)
              ).toFixed(2);
              return (
                <div
                  key={item.cartItemId || item.id}
                  className="relative border border-pink-200 dark:border-yellow-500 rounded-xl p-6 bg-pink-50/60 dark:bg-gray-800 shadow-md transform transition-transform hover:scale-[1.01]"
                >
                  <button
                    onClick={() => handleRemoveClick(item)}
                    className="absolute top-3 right-3 text-pink-500 dark:text-yellow-400 hover:text-pink-700 dark:hover:text-yellow-300"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-32 h-32 object-contain rounded-lg bg-white border shadow dark:bg-gray-700"
                    />
                    <div className="flex-1 space-y-3">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Brand:</span>{" "}
                        {item.brand}
                      </p>
                      {item.category && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Category:</span>{" "}
                          {item.category}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Rating:</span> ⭐{" "}
                        {item.rating}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                        <div>
                          <span className="text-gray-500">Original:</span> ₹
                          {item.price}
                        </div>
                        <div>
                          <span className="text-gray-500">Discount:</span>{" "}
                          {item.discount}%
                        </div>
                        <div>
                          <span className="text-gray-500">Final Price:</span> ₹
                          {item.final_price}
                        </div>
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <div className="inline-flex items-center gap-2 border rounded px-2 py-1 bg-white dark:bg-gray-700 ml-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity,
                                  "dec"
                                )
                              }
                              className="p-1 text-pink-500 dark:text-yellow-400 hover:text-pink-600 dark:hover:text-yellow-300"
                            >
                              <Minus size={18} />
                            </button>
                            <span className="min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity,
                                  "inc"
                                )
                              }
                              className="p-1 text-pink-500 dark:text-yellow-400 hover:text-pink-600 dark:hover:text-yellow-300"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Shipping:</span> ₹
                          {item.shipping_cost}
                        </div>
                        <div className="font-semibold text-pink-600 dark:text-yellow-400">
                          Total: ₹{total}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {buyProduct.length > 0 && (
          <div className="border-t border-pink-300 dark:border-yellow-600 text-right pt-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Grand Total:{" "}
              <span className="text-pink-600 dark:text-yellow-400">
                ₹{totalAmount.toFixed(2)}
              </span>
            </h3>
            <button
              className="mt-2 px-8 py-3 bg-pink-500 dark:bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-pink-600 dark:hover:bg-yellow-600 transition-all duration-300"
              onClick={() => navigate("/confirmAndPay")}
            >
              Confirm & Pay
            </button>
          </div>
        )}
      </div>

      {modalState.show && (
        <RemoveProductModal
          show={modalState.show}
          product={modalState.product}
          onCancel={() => setModalState({ show: false, product: null })}
          onConfirm={confirmRemove}
        />
      )}
    </div>
  );
}
