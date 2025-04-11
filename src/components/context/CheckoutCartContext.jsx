import React, { createContext, useContext, useState, useMemo } from "react";

const CheckoutCartContext = createContext();

export const CheckoutCartProvider = ({ children }) => {
  const [buyProduct, setBuyProduct] = useState([]);
  const removeFromBuyProduct = (id) => {
    setBuyProduct((prev) => prev.filter((item) => item.id !== id));
  };
  const updateBuyProductQuantity = (productId, quantity) => {
    setBuyProduct((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };
  const totalAmount = useMemo(() => {
    return buyProduct.reduce(
      (total, { final_price, quantity, shipping_cost }) => {
        const price = parseFloat(final_price);
        const qty = parseInt(quantity);
        const shipping = parseFloat(shipping_cost);
        return total + price * qty + shipping;
      },
      0
    );
  }, [buyProduct]);
  return (
    <CheckoutCartContext.Provider
      value={{
        buyProduct,
        setBuyProduct,
        removeFromBuyProduct,
        updateBuyProductQuantity,
        totalAmount,
      }}
    >
      {children}
    </CheckoutCartContext.Provider>
  );
};

export const useCheckoutCart = () => useContext(CheckoutCartContext);
