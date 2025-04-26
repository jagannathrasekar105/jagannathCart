import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Moon,
  Sun,
  Heart,
  ListOrdered,
  Edit,
  Trash,
  User,
  LogOut,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import { useCart } from "./context/CartContext";
import { useWishlist } from "./context/WishlistContext";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/product", label: "Product" },
  { path: "/shop", label: "Shop" },
  { path: "/contact", label: "Contact" },
  { path: "/about", label: "About" },
];

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, updateUserProfile, removeUserProfile } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) updateUserProfile(file);
    setDropdownOpen(false);
  };

  const profileIcon = user?.profilePic ? (
    <img
      src={`data:image/jpeg;base64,${user.profilePic}`}
      alt="profile"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xl font-bold">
      {user?.username?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="text-2xl font-extrabold tracking-wide">
          Jagannath<span className="text-yellow-300">Mart</span>
        </div>

        {/* Navigation */}
        <ul className="flex gap-6 font-medium text-lg">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`${
                  location.pathname === path
                    ? "text-yellow-300 font-bold border-b-2 border-yellow-300"
                    : "hover:text-yellow-300 transition"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full shadow transition"
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <IconWithBadge
            icon={ShoppingCart}
            count={user ? cartItems.length : 0}
            onClick={() => navigate(user ? "/cart" : "/login")}
          />

          {/* Wishlist */}
          <IconWithBadge
            icon={Heart}
            count={user ? Object.keys(wishlist).length : 0}
            onClick={() => navigate(user ? "/wishlist" : "/login")}
          />

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-semibold">👋 {user.username}</span>

              {/* Dropdown */}
              <DropdownMenu.Root
                open={dropdownOpen}
                onOpenChange={setDropdownOpen}
              >
                <DropdownMenu.Trigger asChild>
                  <button className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-300 hover:scale-105 transition-transform">
                    {profileIcon}
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="mr-4 bg-purple-600 dark:bg-yellow-500 shadow-xl rounded-md px-3 py-3 min-w-[180px] mt-2 z-50"
                    sideOffset={8}
                  >
                    <DropdownMenu.Label className="text-sm text-white mb-2">
                      Hello,{" "}
                      <span className="font-semibold capitalize">
                        {user.username}
                      </span>
                    </DropdownMenu.Label>

                    <DropdownMenu.Separator className="h-px bg-white my-2" />

                    <DropdownItem
                      label="Profile"
                      icon={<User className="w-4 h-4" />}
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                    />

                    <DropdownItem
                      label="Order History"
                      icon={<ListOrdered size={16} />}
                      onClick={() => {
                        navigate("/order");
                        setDropdownOpen(false);
                      }}
                    />
                    <DropdownItem
                      label={
                        user.profilePic
                          ? "Edit Profile Picture"
                          : "Upload Profile Picture"
                      }
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => fileInputRef.current?.click()}
                    />
                    <input
                      ref={fileInputRef}
                      key={fileInputKey}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    {user.profilePic && (
                      <DropdownItem
                        label="Remove Profile Picture"
                        icon={<Trash className="w-4 h-4" />}
                        onClick={() => {
                          removeUserProfile();
                          setDropdownOpen(false);
                        }}
                      />
                    )}
                    <DropdownItem
                      label="Logout"
                      icon={<LogOut className="w-4 h-4" />}
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    />
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
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

// Reusable components

const IconWithBadge = ({ icon: Icon, count, onClick }) => (
  <div className="relative cursor-pointer" onClick={onClick}>
    <Icon className="w-6 h-6 hover:text-yellow-300 transition" />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-yellow-300 text-pink-800 text-xs font-bold px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

const DropdownItem = ({ label, icon, onClick }) => (
  <DropdownMenu.Item
    onSelect={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="cursor-pointer flex items-center gap-2 hover:bg-yellow-300 dark:hover:bg-pink-400 px-2 py-1 rounded text-sm text-white"
  >
    {icon}
    {label}
  </DropdownMenu.Item>
);
