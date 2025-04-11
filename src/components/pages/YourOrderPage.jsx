import React from "react";
import { useNavigate } from "react-router-dom";
import { useCheckoutCart } from "../context/CheckoutCartContext";

export default function YourOrderPage() {
  const navigate = useNavigate();
  const { buyProduct } = useCheckoutCart();

  const calculateTotal = () => {
    return buyProduct.reduce((sum, item) => {
      const price = parseFloat(item.final_price || 0);
      const qty = parseInt(item.quantity || 1);
      const shipping = parseFloat(item.shipping_cost || 0);
      return sum + price * qty + shipping;
    }, 0);
  };

  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-pink-600 dark:text-yellow-400 mb-6">
          🎉 Your Order
        </h1>

        {buyProduct.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No items found in your order.
          </p>
        ) : (
          <>
            <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 dark:scrollbar-thumb-yellow-400">
              {buyProduct.map((item) => (
                <div
                  key={item.cartItemId}
                  className="border border-pink-200 dark:border-yellow-500 p-4 rounded-lg flex gap-4 items-center"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Price: ₹{item.final_price}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Shipping: ₹{item.shipping_cost}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 text-right">
              <p className="text-lg font-semibold text-pink-600 dark:text-yellow-400">
                Total Paid: ₹{calculateTotal().toFixed(2)}
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-pink-500 dark:bg-yellow-500 hover:bg-pink-600 dark:hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
              >
                🏠 Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
