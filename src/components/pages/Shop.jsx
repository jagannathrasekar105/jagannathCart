import React from "react";

export default function Shop() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-800 dark:to-gray-900 px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-purple-700 dark:text-yellow-300 mb-10">
        🛍️ Shop All Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition"
          >
            <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Product {item}
            </h2>
            <p className="text-pink-600 dark:text-yellow-400 font-bold mt-2">
              ₹{item * 499}
            </p>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
