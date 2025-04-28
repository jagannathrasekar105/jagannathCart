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
import CheckoutPage from "./components/pages/CheckoutPage";
import ConfirmAndPayPage from "./components/pages/ConfirmAndPayPage";
import { Toaster } from "react-hot-toast";
import { useMemo, useEffect } from "react";
import { ThemeProvider } from "./components/context/ThemeContext";
import { CartProvider } from "./components/context/CartContext";
import { CheckoutCartProvider } from "./components/context/CheckoutCartContext";
import YourOrderPage from "./components/pages/YourOrderPage";
import HistoryPage from "./components/pages/HistoryPage";
import OrderSuccessPage from "./components/pages/OrderSuccessPage";
import ProfilePage from "./components/pages/ProfilePage";
import {
  WishlistProvider,
  useWishlist,
} from "./components/context/WishlistContext";
import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "./components/redux/action/authActions";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CartProvider>
          <CheckoutCartProvider>
            <WishlistProvider>
              <WishlistInit />
              <Navbar />
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 1100,
                }}
              />
              <MainRoutes />
            </WishlistProvider>
          </CheckoutCartProvider>
        </CartProvider>
      </BrowserRouter>
    </ThemeProvider>
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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAuthenticated = useMemo(() => !!user, [user]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(authLogin(user, token));
    }
  }, [dispatch]);

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
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/confirmAndPay" element={<ConfirmAndPayPage />} />
      <Route path="/order" element={<YourOrderPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
