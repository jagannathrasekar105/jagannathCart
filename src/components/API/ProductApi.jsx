const BASE_URL = `${import.meta.env.VITE_API_URL}/api/products`;
export const fetchTopSellingProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/top-selling`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return [];
  }
};
export const fetchProductWithCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products-with-categories`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
    return [];
  }
};
