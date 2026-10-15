import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "বাজার দর | আজকের বাজারদর এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "চাল, ডাল, তেল, সবজি, মাছ ও মসলাসহ দৈনন্দিন প্রয়োজনীয় পণ্যের বাজারভিত্তিক আজকের দাম এক জায়গায়।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" data-scroll-behavior="smooth" className={`${bengali.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
