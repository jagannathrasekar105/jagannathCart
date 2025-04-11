import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Moon, Sun, Heart } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  // console.log(wishlist);
  const handleCartClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };
  const handleWishlistClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/wishlist");
    }
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/product", label: "Product" },
    { path: "/shop", label: "Shop" },
    { path: "/contact", label: "Contact" },
    { path: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* 🔶 Logo */}
        <div className="text-2xl font-extrabold tracking-wide">
          Jagannath<span className="text-yellow-300">Mart</span>
        </div>

        {/* 🔗 Nav Links */}
        <ul className="flex gap-6 font-medium text-lg">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? "text-yellow-300 font-bold border-b-2 border-yellow-300"
                    : "hover:text-yellow-300 transition"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 🌙 Theme Toggle */}
        <button
          onClick={toggleTheme}
          className=" p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full shadow transition"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* 🛒 Cart & User Info */}
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <ShoppingCart className="w-6 h-6 hover:text-yellow-300 transition" />
            {user && cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-300 text-pink-800 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <div
            className="relative cursor-pointer"
            onClick={handleWishlistClick}
          >
            <Heart className="w-6 h-6 hover:text-yellow-300 transition" />
            {user && Object.keys(wishlist).length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-300 text-pink-800 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {Object.keys(wishlist).length}
              </span>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold">👋 {user.username}</span>
              <button
                onClick={logout}
                className="bg-yellow-300 text-pink-800 px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:text-yellow-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-300 transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
