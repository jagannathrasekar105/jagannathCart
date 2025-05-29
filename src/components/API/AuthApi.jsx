import { useSelector } from "react-redux";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();

  return { ok: res.ok, data };
};

export const uploadProfilePicture = async (file, id) => {
  const formData = new FormData();
  formData.append("profilePic", file);

  const res = await fetch(`${BASE_URL}/${id}/upload-profile-pic`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

export const removeProfilePicture = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/remove-profile-pic`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();
  return { ok: res.ok, data };
};
