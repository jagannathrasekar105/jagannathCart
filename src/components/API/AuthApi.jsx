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
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

export const uploadProfilePicture = async (file, token, id) => {
  // const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("profilePic", file);

  const res = await fetch(`${BASE_URL}/${id}/upload-profile-pic`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

export const removeProfilePicture = async (token, id) => {
  const res = await fetch(`${BASE_URL}/${id}/remove-profile-pic`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return { ok: res.ok, data };
};
