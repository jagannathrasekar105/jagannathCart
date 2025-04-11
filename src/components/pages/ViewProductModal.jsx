import React from "react";
import {
  Heart,
  X,
  CheckCircle,
  XCircle,
  Tag,
  Layers,
  Truck,
  Percent,
} from "lucide-react";

const ViewProductModal = ({
  product,
  onClose,
  buttonLabel = "",
  buttonAction = () => {},
  showWishlistButton = false,
  wishlistAction,
  wishlistIds = [],
}) => {
  if (!product) return null;

  const isWishlisted = wishlistIds?.includes?.(product.id);
  const inStock = product.stock_quantity > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-300 dark:border-gray-700 transform transition-transform duration-300 animate-zoomIn">
        {/* Product Image */}
        <div className="w-full h-56 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden rounded-t-2xl">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-contain max-h-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Close Button */}
        <div className="flex justify-end px-5 pt-3">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 text-xl"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Details */}
        <div className="px-5 pb-5 space-y-3">
          {/* Title and Wishlist */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{product.name}</h2>
            {showWishlistButton && wishlistAction && (
              <button
                onClick={() => wishlistAction(product.id)}
                className={`transition hover:scale-110 ${
                  isWishlisted
                    ? "text-red-600 animate-pulse"
                    : "text-gray-400 hover:text-pink-500"
                }`}
                title="Toggle Wishlist"
              >
                <Heart
                  className="w-6 h-6"
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            )}
          </div>

          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-600 dark:text-yellow-400">
                ₹{product.final_price}
              </span>
              <span className="line-through text-gray-400 text-sm">
                ₹{product.price}
              </span>
              <span className="text-sm text-red-500 flex items-center gap-1">
                <Percent className="w-4 h-4" /> {product.discount}% off
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Truck className="w-4 h-4" /> Shipping: ₹{product.shipping_cost}
            </div>
          </div>

          {/* Stock and Rating */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1">
              {inStock ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              {inStock
                ? `In Stock (${product.stock_quantity} left)`
                : "Out of Stock"}
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              ★ {product.rating}
            </div>
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300 pt-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Brand:{" "}
              <span className="font-semibold">
                {product.brand || "Generic"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category:{" "}
              <span className="font-semibold">{product.category || "N/A"}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-400 pt-3 leading-relaxed">
            {product.description}
          </p>

          {/* Action Button */}
          {buttonLabel && (
            <button
              disabled={!inStock}
              className={`w-full mt-4 py-2 rounded-lg text-white font-semibold text-md transition ${
                inStock
                  ? "bg-green-600 hover:bg-green-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black animate-bounce-slow"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={() => buttonAction(product.id)}
            >
              {buttonLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
