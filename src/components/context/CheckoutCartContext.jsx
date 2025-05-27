import React, { createContext, useContext, useState, useMemo } from "react";

const CheckoutCartContext = createContext();

export const CheckoutCartProvider = ({ children }) => {
  const [buyProduct, setBuyProduct] = useState([]);
  const removeFromBuyProduct = (id) => {
    setBuyProduct((prev) => prev.filter((item) => item.ID !== id));
  };
  const updateBuyProductQuantity = (productId, QUANTITY) => {
    setBuyProduct((prev) =>
      prev.map((item) => (item.ID === productId ? { ...item, QUANTITY } : item))
    );
  };

  console.log("buyProduct", buyProduct);

  const totalAmount = useMemo(() => {
    return buyProduct.reduce(
      (TOTAL, { FINAL_PRICE, QUANTITY, SHIPPING_COST }) => {
        const price = parseFloat(FINAL_PRICE);
        const qty = parseInt(QUANTITY);
        const shipping = parseFloat(SHIPPING_COST);
        return TOTAL + price * qty + shipping;
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
