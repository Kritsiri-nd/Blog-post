// src/components/CoffeeLoading.jsx
import React from "react";
import Lottie from "lottie-react";
import coffeeAnimation from "../assets/coffee-loading.json";

export default function CoffeeLoading({
  size = "w-50 h-50",
  text = "กำลังชงกาแฟของคุณ...",
  showText = true,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Lottie
        animationData={coffeeAnimation}
        loop={true}
        className={size}
      />
      {showText && (
        <p className="mt-2 text-brown-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
}
