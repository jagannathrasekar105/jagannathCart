const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
export const placeOrder = async (orderData) => {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to place order.");
    }

    return result;
  } catch (error) {
    console.error("❌ Order API error:", error);
    throw error;
  }
};
