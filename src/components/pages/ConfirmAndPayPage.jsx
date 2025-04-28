import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Plus, Minus } from "lucide-react";
import RemoveProductModal from "./RemoveProductModal";
import { useCheckoutCart } from "../context/CheckoutCartContext";
import OrderSuccessPage from "./OrderSuccessPage";
import { showErrorToast } from "../../utils/toastUtils";
import { placeOrder } from "../API/OrderApi";
import { useSelector } from "react-redux";

const shippingFields = ["name", "mobile", "address", "city", "pincode"];
const paymentOptions = [
  "UPI",
  "Credit Card",
  "Net Banking",
  "Cash on Delivery",
];

export default function ConfirmAndPayPage() {
  const navigate = useNavigate();
  const {
    buyProduct,
    setBuyProduct,
    removeFromBuyProduct,
    updateBuyProductQuantity,
  } = useCheckoutCart();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    mobile: "",
    payment: "UPI",
    agree: false,
  });

  const [modalState, setModalState] = useState({ show: false, product: null });

  const totalAmount = useMemo(() => {
    return buyProduct.reduce((sum, item) => {
      const price = parseFloat(item.final_price || 0);
      const qty = parseInt(item.quantity || 1);
      const shipping = parseFloat(item.shipping_cost || 0);
      return sum + price * qty + shipping;
    }, 0);
  }, [buyProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateQuantity = (productId, action) => {
    const item = buyProduct.find((p) => p.id === productId);
    if (!item) return;

    const newQty =
      action === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    updateBuyProductQuantity(productId, newQty);
  };

  const handlePlaceOrder = async () => {
    const { name, address, city, pincode, mobile, payment, agree } = form;

    if (!name || !address || !city || !pincode || !mobile) {
      return showErrorToast("⚠️ Please fill in all shipping fields.");
    }

    if (!agree) {
      return showErrorToast("⚠️ Please agree to the terms and conditions.");
    }

    const orderData = {
      user_id: user.id,
      total_amount: totalAmount.toFixed(2),
      name,
      mobile,
      address,
      city,
      pincode,
      payment_method: payment,
      items: buyProduct.map(({ id, quantity, final_price }) => ({
        product_id: id,
        quantity,
        price: final_price,
      })),
    };

    try {
      const result = await placeOrder(orderData);
      navigate("/order-success", { state: { orderData } });
    } catch (err) {
      alert("❌ Something went wrong while placing your order.");
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping & Payment Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-pink-600 dark:text-yellow-400 mb-4">
              📍 Shipping Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shippingFields.map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field[0].toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-pink-600 dark:text-yellow-400 mb-3">
              💳 Select Payment Method
            </h2>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white text-black dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {paymentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label>I agree to the terms and conditions 📜</label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            🧾 Order Summary
          </h2>

          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100 dark:scrollbar-thumb-yellow-400 dark:scrollbar-track-gray-700">
            {buyProduct.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No products in your cart.
              </p>
            ) : (
              buyProduct.map((item) => (
                <div
                  key={item.id}
                  className="relative border border-pink-200 dark:border-yellow-500 flex items-stretch gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4 p-3 rounded-lg min-h-[120px]"
                >
                  <button
                    onClick={() => setModalState({ show: true, product: item })}
                    className="absolute top-2 right-2 text-pink-500 dark:text-yellow-400 hover:text-pink-700 dark:hover:text-yellow-300 transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded self-center"
                  />
                  <div className="flex flex-col justify-center flex-1 pr-6">
                    <p className="font-semibold break-words">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, "dec")}
                        className="text-2xl font-bold text-pink-600 dark:text-yellow-400 hover:scale-110 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, "inc")}
                        className="text-2xl font-bold text-pink-600 dark:text-yellow-400 hover:scale-110 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="mt-1">Price: ₹{item.final_price}</p>
                    <p>Shipping: ₹{item.shipping_cost}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-lg font-semibold text-pink-600 dark:text-yellow-400">
              Grand Total: ₹{totalAmount.toFixed(2)}
            </p>
            <button
              onClick={handlePlaceOrder}
              className="mt-5 w-full bg-pink-500 dark:bg-yellow-500 hover:bg-pink-600 dark:hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition"
              disabled={buyProduct.length === 0}
            >
              🛒 Place Your Order
            </button>
          </div>
        </div>
      </div>

      {/* Remove Modal */}
      {modalState.show && (
        <RemoveProductModal
          show={modalState.show}
          product={modalState.product}
          onCancel={() => setModalState({ show: false, product: null })}
          onConfirm={() => {
            removeFromBuyProduct(modalState.product.id);
            setModalState({ show: false, product: null });
          }}
        />
      )}
    </section>
  );
}
