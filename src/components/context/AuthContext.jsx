import { createContext, useContext, useState, useEffect } from "react";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils"; // adjust path

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (firstName, lastName, email, username, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorToast(data.error || data.message || "Registration failed");
        return { error: data.error || data.message || "Registration failed" };
      }

      showSuccessToast("Registration successful! Please login.");
      return { success: true };
    } catch (err) {
      showErrorToast(err.message || "Something went wrong");
      return { error: err.message || "Something went wrong" };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showErrorToast(data.error || "Login failed");
        return { error: data.error || "Login failed" };
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setUser(data.user);

      showSuccessToast(
        `Login successful! Welcome back, ${data.user.username}!`
      );
      return { success: true };
    } catch (error) {
      showErrorToast("Something went wrong during login");
      return { error: "Something went wrong during login" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    showSuccessToast("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
