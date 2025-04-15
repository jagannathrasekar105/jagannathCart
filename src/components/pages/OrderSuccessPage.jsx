import React, { useEffect, useState, useMemo } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Printer,
  Home,
  Eye,
  MapPin,
  Calendar,
  CreditCard,
  PackageOpen,
} from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccessPage = () => {
  const { state } = useLocation();
  const orderData = state?.orderData;
  const [showConfetti, setShowConfetti] = useState(true);
  const [width, height] = useWindowSize();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({}); // Store details by product_id

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orderData?.items) return;

    const fetchProductDetails = async () => {
      try {
        const productIds = orderData.items.map((item) => item.product_id);
        const uniqueProductIds = [...new Set(productIds)];

        const responses = await Promise.all(
          uniqueProductIds.map((id) =>
            fetch(`http://localhost:5000/api/products/${id}`).then((res) =>
              res.json()
            )
          )
        );

        const productMap = responses.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {});

        setProductDetails(productMap);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [orderData]);

  if (!orderData) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-pink-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200">
        <p className="text-xl font-semibold">
          No order data found. Please try again.
        </p>
      </section>
    );
  }

  const formattedDate = new Date().toLocaleDateString();
  const deliveryDate = new Date(
    Date.now() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  const handlePrint = () => window.print();

  // Memoized calculation of subtotal to optimize rendering
  const calculateSubtotal = useMemo(() => {
    return orderData.items.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
  }, [orderData.items]);

  return (
    <section className="min-h-screen bg-pink-100 dark:bg-gray-900 py-2 px-4">
      {showConfetti && <Confetti width={width} height={height} />}

      <motion.div
        className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <CheckCircle className="text-yellow-500 w-8 h-8" />
          <h1 className="text-3xl font-bold text-pink-600 dark:text-yellow-400">
            Order Placed Successfully!
          </h1>
        </div>

        {/* Greeting */}
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Hi{" "}
          <span className="text-pink-600 dark:text-yellow-400 font-semibold">
            {orderData.name.trim()}
          </span>
          , your order has been confirmed. Thank you for shopping with us!
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full shadow-md transition"
          >
            <Printer className="w-5 h-5" />
            Print Invoice
          </button>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("/order")}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
            >
              <Eye className="w-5 h-5" />
              Order History
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full shadow-md transition"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT - Summary + Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="rounded-xl bg-pink-50 dark:bg-gray-700 border border-pink-200 dark:border-gray-600 p-5 shadow">
              <h2 className="text-xl font-semibold text-pink-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Order Summary
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <p>
                  <strong>Subtotal:</strong> ₹{calculateSubtotal.toFixed(2)}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{orderData.total_amount}
                </p>
                <p>
                  <strong>Payment Method:</strong> {orderData.payment_method}
                </p>
                <p>
                  <strong>Order Date:</strong> {formattedDate}
                </p>
                <p>
                  <strong>Delivery By:</strong> {deliveryDate}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="rounded-xl bg-pink-50 dark:bg-gray-700 border border-pink-200 dark:border-gray-600 p-5 shadow">
              <h2 className="text-xl font-semibold text-pink-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <p>
                  <strong>Name:</strong> {orderData.name}
                </p>
                <p>
                  <strong>Address:</strong> {orderData.address}
                </p>
                <p>
                  <strong>City:</strong> {orderData.city}
                </p>
                <p>
                  <strong>Pincode:</strong> {orderData.pincode}
                </p>
                <p>
                  <strong>Mobile:</strong> {orderData.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT - Items List */}
          <section>
            <h2 className="text-xl font-semibold text-pink-600 dark:text-yellow-400 mb-4 flex items-center gap-2">
              <PackageOpen className="w-5 h-5" />
              Items
            </h2>

            <ul className="space-y-4  max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100 dark:scrollbar-thumb-yellow-400 dark:scrollbar-track-gray-700">
              {orderData.items.map((item, index) => {
                const price = parseFloat(item.price);
                const totalPrice = (price * item.quantity).toFixed(2);
                const product = productDetails[item.product_id];

                return (
                  <li
                    key={index}
                    className="flex justify-between items-start bg-yellow-100 dark:bg-gray-800 rounded-2xl p-5 shadow-md"
                  >
                    {/* Left Side: Image and Product Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={product?.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-pink-700 dark:text-yellow-300">
                          {product?.name || `Product ID: ${item.product_id}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × ₹{price.toFixed(2)}
                        </p>
                        {product?.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Total Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-pink-600 dark:text-yellow-400">
                        ₹{totalPrice}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </motion.div>
    </section>
  );
};

export default OrderSuccessPage;
