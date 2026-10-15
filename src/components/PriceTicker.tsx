"use client";

import { useEffect, useState } from "react";
import { getProducts, type Product } from "@/lib/api";
import { bnNumber, changeColorClass, changeText, unitShort } from "@/lib/bn";

function TickerItem({ product }: { product: Product }) {
  return (
    <span className="flex shrink-0 items-center gap-2 px-5 text-sm whitespace-nowrap">
      <span aria-hidden className="text-base">
        {product.image || product.categoryIcon}
      </span>
      <span className="font-semibold text-gray-800">{product.nameBn}</span>
      <span className="text-gray-600">
        {bnNumber(product.today)} টাকা/{unitShort(product.unit)}
      </span>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${changeColorClass(
          product.change.dir,
        )}`}
      >
        {changeText(product.change.pct, product.change.dir)}
      </span>
      <span aria-hidden className="text-gray-300">
        •
      </span>
    </span>
  );
}

/**
 * নেভবারের নিচের প্রাইস টিকার।
 * তালিকাটি দুইবার রেন্ডার করা হয় যাতে -৫০% translate দিয়ে
 * বিরতিহীন (infinite) মার্কি তৈরি হয়।
 */
export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        /* টিকার ব্যর্থ হলেও বাকি অ্যাপ চলবে */
      });
    return () => {
      active = false;
    };
  }, []);

  if (products.length === 0) {
    return (
      <div className="border-y border-gray-200 bg-white">
        <div className="flex gap-6 overflow-hidden px-4 py-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-4 w-40 shrink-0 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const loop = [...products, ...products];

  return (
    <div className="marquee-viewport border-y border-gray-200 bg-white">
      <div className="flex overflow-hidden py-2">
        <div className="marquee-track">
          {loop.map((product, index) => (
            <TickerItem key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
