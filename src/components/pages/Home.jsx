import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterDropdown from "./FilterDropdown";
import ViewProductModal from "./ViewProductModal";
import { useCart } from "../context/CartContext";
import { useCheckoutCart } from "../context/CheckoutCartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart } from "lucide-react";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const { setBuyProduct } = useCheckoutCart();
  const { wishlistIds, handleWishlistToggle } = useWishlist();
  const navigate = useNavigate();

  const categoryStyles = [
    { bg: "bg-gradient-to-r from-red-400 to-pink-500" },
    { bg: "bg-gradient-to-r from-green-400 to-blue-500" },
    { bg: "bg-gradient-to-r from-yellow-400 to-red-500" },
    { bg: "bg-gradient-to-r from-purple-400 to-indigo-500" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products/products-with-categories"
        );
        const data = await res.json();
        const fourCategories = data.categories;
        setCategories(fourCategories);
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) => {
        return (
          selectedFilters.includes(product.category_id.toString()) ||
          selectedFilters.includes(product.id.toString())
        );
      });
      setFilteredProducts(filtered);
    }
  }, [selectedFilters, products]);

  const toggleFilter = (value) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="space-y-10 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-500 to-green-500 dark:from-gray-800 dark:to-gray-900 text-white p-10 text-center rounded-md shadow-lg transition-colors duration-300 ">
        <FilterDropdown
          categories={categories}
          products={products}
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
        />
        <h1 className="text-4xl font-extrabold mb-2 text-white dark:text-yellow-300">
          🌟 Welcome to Jagannath Mart
        </h1>
        <p className="text-xl text-white/90 dark:text-gray-300">
          Shop the best deals on your favorite products
        </p>
      </section>

      {/* Categories Section */}
      <section className="px-6 mt-10">
        <h2 className="text-3xl font-bold text-center text-purple-800 dark:text-yellow-300 mb-6">
          🛒 Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id.toString());
                setSelectedFilters([cat.id.toString()]);
              }}
              className={`${categoryStyles[index]?.bg || "bg-gray-400"} 
                text-white font-semibold text-center p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ${
                  selectedCategoryId === cat.id.toString()
                    ? "ring-4 ring-white dark:ring-yellow-300"
                    : ""
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="px-6">
        <h2 className="text-3xl font-bold text-center text-pink-700 dark:text-yellow-300 mb-6">
          💥 Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
          // <ViewProductModal
          //   product={selectedProduct}
          //   handleAddToCart={addToCart}
          //   handleWishlistToggle={handleWishlistToggle}
          //   wishlistIds={wishlistIds}
          //   onClose={() => setSelectedProduct(null)}
          //   isFromWishlist={false}
          // />

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

export default Home;
