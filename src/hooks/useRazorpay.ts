"use client";

import { useState, useEffect } from "react";

export const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);
  }, []);

  const openPaymentModal = (options: any) => {
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return { isLoaded, openPaymentModal };
};
