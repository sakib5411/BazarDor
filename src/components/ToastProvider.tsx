"use client";

import { Toaster } from "react-hot-toast";

/** পুরো অ্যাপে টোস্ট নোটিফিকেশন দেখানোর জন্য (data-rht-toaster)। */
export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          fontFamily: "inherit",
          borderRadius: "12px",
          background: "#111827",
          color: "#ffffff",
          fontSize: "14px",
        },
        success: { iconTheme: { primary: "#16a34a", secondary: "#ffffff" } },
        error: { iconTheme: { primary: "#dc2626", secondary: "#ffffff" } },
      }}
    />
  );
}
