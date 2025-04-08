import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductModal from "./ProductModal";

function Products() {
  const [products, setProducts] = useState([]);
  const { cartItems, addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const wishlistIds = wishlist?.map((item) => item.product_id || item.id) || [];

  useEffect(() => {
    fetch("http://localhost:5000/api/products/top-selling")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleWishlistToggle = async (productId) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!userId) {
      toast.error("Login to use wishlist");
      return;
    }

    if (wishlistIds.includes(productId)) {
      await removeFromWishlist(userId, productId);
    } else {
      await addToWishlist(userId, productId);
    }
  };

  const handleAddToCart = async (productId, quantity) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    const isAlreadyInCart = cartItems.some((item) => item.id === productId);
    if (isAlreadyInCart) {
      toast("🛒 Product already in cart", {
        position: "top-right",
        style: { background: "#ff4d4d", color: "#fff", marginTop: "60px" },
      });
      return;
    }

    const result = await addToCart(userId, productId, quantity);
    if (result.success) {
      toast.success("Item added to cart", {
        position: "top-right",
        style: { background: "#4CAF50", color: "#fff", marginTop: "60px" },
      });
    } else {
      toast.error(result.data?.error || "Failed to add to cart", {
        position: "top-right",
        style: { background: "#ff4d4d", color: "#fff", marginTop: "60px" },
      });
    }
  };

  return (
    <div className="space-y-10 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 min-h-screen">
      <section className="relative bg-gradient-to-r from-blue-500 to-green-500 dark:from-gray-800 dark:to-gray-900 text-white p-10 text-center rounded-md shadow-lg transition-colors duration-300">
        <div className="absolute top-4 left-4">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 text-gray-800 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white w-64"
          />
        </div>
        <h1 className="text-4xl font-extrabold mb-2 text-white dark:text-yellow-300">
          🛍️ Browse Our Products
        </h1>
        <p className="text-xl text-white/90 dark:text-gray-300">
          Find the best items at unbeatable prices
        </p>
      </section>

      <section className="px-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-yellow-300 mb-6">
          🛒 Top Selling Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300"
            >
              <img
                src={product.image_url}
                alt={product.name}
                onClick={() => setSelectedProduct(product)} // ✅ Opens modal only on image
                className="h-40 w-full object-contain mx-auto rounded mb-4 hover:opacity-90 transition cursor-pointer"
              />

              <h3
                className="text-xl font-bold text-gray-800 dark:text-white hover:underline cursor-pointer"
                onClick={() => setSelectedProduct(product)} // ✅ Opens modal only on title
              >
                {product.name}
              </h3>

              <div className="flex items-center justify-between flex-wrap gap-2 mt-4">
                <p className="text-green-600 dark:text-yellow-400 font-semibold">
                  ₹{product.price}
                </p>

                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < product.rating
                          ? ""
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    ({product.rating})
                  </span>
                </div>

                <button
                  title="Toggle Wishlist"
                  onClick={() => handleWishlistToggle(product.id)}
                  className={`transition ${
                    wishlistIds.includes(product.id)
                      ? "text-red-500 dark:text-yellow-500"
                      : "text-red-500 dark:text-yellow-500"
                  } hover:scale-110`}
                >
                  <Heart
                    fill={
                      wishlistIds.includes(product.id) ? "currentColor" : "none"
                    }
                    className="w-6 h-6"
                  />
                </button>

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black transition whitespace-nowrap"
                  onClick={() => handleAddToCart(product.id, 1)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            handleAddToCart={handleAddToCart}
            handleWishlistToggle={handleWishlistToggle}
            wishlistIds={wishlistIds}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </section>
    </div>
  );
}

export default Products;
