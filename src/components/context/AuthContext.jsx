import { createContext, useContext, useState, useEffect } from "react";
import {
  registerUser,
  loginUser,
  uploadProfilePicture,
  removeProfilePicture,
} from "../API/AuthApi";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (firstName, lastName, email, username, password) => {
    try {
      const { ok, data } = await registerUser({
        firstName,
        lastName,
        email,
        username,
        password,
      });

      if (!ok) {
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
      const { ok, data } = await loginUser(email, password);

      if (!ok) {
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

  const updateUserProfile = async (file) => {
    try {
      const token = localStorage.getItem("token");
      const { ok, data } = await uploadProfilePicture(file, token);

      if (!ok) throw new Error("Profile picture upload failed");

      const updatedUser = { ...user, profilePic: data.base64Image };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showSuccessToast(data.message);
      setFileInputKey(Date.now());
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to update profile picture");
    }
  };

  const removeUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { ok, data } = await removeProfilePicture(token);

      if (!ok) throw new Error("Failed to remove profile picture");

      const updatedUser = { ...user, profilePic: null };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showSuccessToast(data.message);
      setFileInputKey(Date.now());
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to remove profile picture");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        loading,
        setUser,
        updateUserProfile,
        removeUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
