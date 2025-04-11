import React from "react";

// Sample dummy data (replace this with data from context or API)
const orderHistory = [
  {
    orderId: "ORD123",
    date: "2025-04-09",
    totalAmount: 1480,
    items: [
      {
        name: "Wireless Mouse",
        quantity: 1,
        final_price: 1200,
        shipping_cost: 80,
        image_url: "https://via.placeholder.com/80",
      },
      {
        name: "USB-C Adapter",
        quantity: 1,
        final_price: 200,
        shipping_cost: 0,
        image_url: "https://via.placeholder.com/80",
      },
    ],
  },
  {
    orderId: "ORD124",
    date: "2025-03-20",
    totalAmount: 890,
    items: [
      {
        name: "Bluetooth Earphones",
        quantity: 1,
        final_price: 790,
        shipping_cost: 100,
        image_url: "https://via.placeholder.com/80",
      },
    ],
  },
];

export default function HistoryPage() {
  return (
    <section className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-pink-600 dark:text-yellow-400 mb-6">
          📦 Order History
        </h1>

        {orderHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No past orders found.
          </p>
        ) : (
          orderHistory.map((order) => (
            <div
              key={order.orderId}
              className="mb-8 border border-pink-300 dark:border-yellow-500 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Order #{order.orderId}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {order.date}
                </p>
              </div>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Price: ₹{item.final_price}, Shipping: ₹
                        {item.shipping_cost}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right font-semibold text-pink-600 dark:text-yellow-400">
                Total Paid: ₹{order.totalAmount}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
