const BASE_URL = "http://localhost:5000/api/cart";

export const fetchCartItemsApi = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch cart items");
  return await res.json();
};

export const addToCartApi = async (userId, productId, quantity) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity }),
  });

  const data = await res.json();
  return { success: res.ok, data };
};

export const updateCartApi = async (userId, productId, quantity) => {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, quantity }),
  });

  return res.ok;
};

export const removeFromCartApi = async (userId, productId) => {
  const res = await fetch(`${BASE_URL}/${userId}/${productId}`, {
    method: "DELETE",
  });

  return res.ok;
};
