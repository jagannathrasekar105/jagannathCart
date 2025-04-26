import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Truck, CreditCard, Home } from "lucide-react";

export default function YourOrderPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${user.id}`
        );
        const data = await response.json();

        // Sort by order_date descending
        const sortedOrders = data.sort(
          (a, b) => new Date(b.order_date) - new Date(a.order_date)
        );

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const calculateTotal = (items) =>
    items.reduce((sum, item) => {
      const price = parseFloat(item.price || 0);
      const qty = parseInt(item.quantity || 1);
      return sum + price * qty;
    }, 0);

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-100 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 text-center max-w-md w-full border border-pink-300 dark:border-yellow-500">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-pink-600 dark:text-yellow-400 mb-2">
            Login Required
          </h2>
          <p className="text-gray-700 dark:text-gray-200 mb-6">
            Please login to view your orders and order history.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-pink-500 hover:bg-pink-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold rounded-xl shadow"
          >
            🔑 Go to Login
          </button>
        </div>
      </section>
    );
  }

  const latestOrderId = orders.length > 0 ? orders[0].order_id : null;

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10 relative">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-pink-500 dark:bg-yellow-500 hover:bg-pink-600 dark:hover:bg-yellow-600 text-white font-semibold rounded-xl shadow"
          >
            🏠 Back to Home
          </button>
          <h1 className="text-4xl font-extrabold text-pink-600 dark:text-yellow-400 tracking-tight">
            🧾 Order History
          </h1>
          <div className="w-36" />
        </div>

        {orders.length === 0 ? (
          <p className="text-center text-lg text-gray-600 dark:text-gray-300">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-pink-200 dark:border-yellow-500 space-y-10"
            >
              {order.order_id === latestOrderId && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-pink-600 dark:text-yellow-400">
                    📦 Delivery Progress
                  </h2>
                  <div className="flex items-center justify-between gap-4">
                    {[
                      {
                        label: "Confirmed",
                        icon: <CheckCircle className="text-green-500" />,
                        date: order.confirmed_at,
                      },
                      {
                        label: "Shipped",
                        icon: <Truck className="text-yellow-500" />,
                        date: order.shipped_at,
                      },
                      {
                        label: "Delivered",
                        icon: <Home className="text-blue-500" />,
                        date: order.delivered_at,
                      },
                    ].map((step, idx) => (
                      <React.Fragment key={step.label}>
                        <div className="flex flex-col items-center text-center">
                          {step.icon}
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {step.label}
                          </span>
                          {step.date && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(step.date).toLocaleString()}
                            </span>
                          )}
                        </div>
                        {idx < 2 && (
                          <div className="h-1 w-full bg-gradient-to-r from-pink-300 via-yellow-300 to-pink-300 rounded-full" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-pink-50 dark:bg-gray-700 p-6 rounded-2xl border border-pink-200 dark:border-yellow-500 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    📑 Order Summary
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Order ID:</strong> #{order.order_id}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Placed On:</strong>{" "}
                    {new Date(order.order_date).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">{order.status}</span>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <CreditCard className="inline mr-1" size={16} />
                    <strong>Payment Method:</strong> {order.payment_method}
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-gray-700 p-6 rounded-2xl border border-yellow-300 dark:border-yellow-600 space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    🚚 Shipping Address
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Name:</strong> {order.name}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Mobile:</strong> {order.mobile}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Address:</strong> {order.address}, {order.city} -{" "}
                    {order.pincode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-100 dark:scrollbar-thumb-yellow-400 dark:scrollbar-track-gray-700 pr-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-5 border border-pink-200 dark:border-yellow-500 p-4 rounded-xl bg-white dark:bg-gray-700 shadow-sm"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-300"
                    />
                    <div className="flex-1 space-y-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Price: ₹{parseFloat(item.price).toFixed(2)}
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Subtotal: ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right border-t pt-4">
                <p className="text-2xl font-extrabold text-pink-600 dark:text-yellow-400">
                  Grand Total: ₹{calculateTotal(order.items).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
