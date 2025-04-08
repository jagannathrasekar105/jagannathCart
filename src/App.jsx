import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Contact from "./components/pages/Contact";
import About from "./components/pages/About";
import Shop from "./components/pages/Shop";
import Cart from "./components/pages/Cart";
import Wishlist from "./components/pages/Wishlist";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import WelcomePage from "./components/pages/Welcome";
import Product from "./components/pages/Product";
import ProtectedRoute from "./components/context/ProtectedRoute";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import { Toaster } from "react-hot-toast";
import { useMemo, useEffect } from "react";
import { ThemeProvider } from "./components/context/ThemeContext";
import { CartProvider } from "./components/context/CartContext";
import {
  WishlistProvider,
  useWishlist,
} from "./components/context/WishlistContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <CartProvider>
            <WishlistProvider>
              <WishlistInit />
              <Navbar />
              <Toaster position="top-right" reverseOrder={false} />
              <MainRoutes />
            </WishlistProvider>
          </CartProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

function WishlistInit() {
  const { fetchWishlist } = useWishlist();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      fetchWishlist(user.id);
    }
  }, []);

  return null;
}

function MainRoutes() {
  const { user, loading } = useAuth();
  const isAuthenticated = useMemo(() => !!user, [user]);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home /> : <WelcomePage />} />
      <Route path="/shop" element={<Shop />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
