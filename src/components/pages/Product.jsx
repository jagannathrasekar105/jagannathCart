// components/Products.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCheckoutCart } from "../context/CheckoutCartContext";
import { useWishlist } from "../context/WishlistContext";
import ViewProductModal from "./ViewProductModal";
import { Heart } from "lucide-react";
import { fetchTopSellingProducts } from "../API/ProductApi";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const { setBuyProduct } = useCheckoutCart();
  const { wishlistIds, handleWishlistToggle } = useWishlist();

  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchTopSellingProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

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
        <h1 className="text-4xl font-extrabold mb-2 dark:text-yellow-300">
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
                onClick={() => setSelectedProduct(product)}
                className="h-40 w-full object-contain mx-auto rounded mb-4 hover:opacity-90 transition cursor-pointer"
              />

              <div className="flex  items-center justify-between">
                <h3
                  className="text-xl font-bold text-gray-800 dark:text-white hover:underline cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.name}
                </h3>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black transition whitespace-nowrap"
                  onClick={() => {
                    setBuyProduct([{ ...product, quantity: 1 }]);
                    navigate("/checkout");
                  }}
                >
                  Buy
                </button>
              </div>

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
                  className="transition hover:scale-110 text-red-500 dark:text-yellow-500"
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
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <ViewProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            buttonLabel="Add to Cart"
            buttonAction={addToCart}
            showWishlistButton={true}
            wishlistAction={handleWishlistToggle}
            wishlistIds={wishlistIds}
          />
        )}
      </section>
    </div>
  );
}

export default Products;
