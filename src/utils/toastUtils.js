// src/utils/toastUtils.js
import { toast } from "react-hot-toast";

const defaultOptions = {
  style: {
    marginTop: "75px",
    color: "#fff",
  },
  position: "top-right",
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#4CAF50",
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: "#ff4d4d",
    },
  });
};
