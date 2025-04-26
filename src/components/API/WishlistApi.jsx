const BASE_URL = `${import.meta.env.VITE_API_URL}/api/wishlist`;

export const fetchWishlistAPI = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`);
  const data = await res.json();
  return data;
};

export const addToWishlistAPI = async (userId, productId) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });

  const data = await res.json();
  return data;
};

export const removeFromWishlistAPI = async (userId, productId) => {
  const res = await fetch(`${BASE_URL}/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });

  const data = await res.json();
  return data;
};
