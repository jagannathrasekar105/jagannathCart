import React from "react";

export default function RemoveProductModal({ show, product, onCancel, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl space-y-4 max-w-md w-full text-center border-2 border-pink-200 dark:border-yellow-500">
        <h2 className="text-2xl font-bold text-pink-600 dark:text-yellow-400">
          Remove Product?
        </h2>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={product?.image_url}
            alt={product?.name}
            className="w-24 h-24 object-contain rounded bg-white border shadow"
          />
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold">Name:</span> {product?.name}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ₹{product?.final_price}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {product?.quantity}
            </p>
            <p className="font-bold text-pink-600 dark:text-yellow-400">
              Total: ₹
              {(
                parseFloat(product?.final_price || 0) * (product?.quantity || 1) +
                parseFloat(product?.shipping_cost || 0)
              ).toFixed(2)}
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Are you sure you want to remove this product from checkout?
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-500 dark:bg-yellow-500 text-white font-semibold rounded hover:bg-pink-600 dark:hover:bg-yellow-600"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
