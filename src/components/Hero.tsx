"use client";

import { useEffect, useState } from "react";
import { bnDate } from "@/lib/bn";

/** হিরো সেকশনের ডানদিকের ঝুড়ি ইলাস্ট্রেশন (ইমোজি + CSS দিয়ে তৈরি)। */
function Basket() {
  return (
    <div
      aria-hidden
      className="relative mt-6 hidden h-44 w-56 shrink-0 md:block"
    >
      <span className="absolute top-0 left-6 text-3xl">🍎</span>
      <span className="absolute top-2 left-20 text-3xl">🍇</span>
      <span className="absolute top-0 right-6 text-3xl">🍊</span>
      <span className="absolute top-10 left-1 text-3xl">🥕</span>
      <span className="absolute top-11 right-1 text-3xl">🥦</span>
      <span className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl">
        🍅
      </span>

      <div className="absolute bottom-10 left-1/2 h-3 w-44 -translate-x-1/2 rounded-full bg-amber-700" />
      <div className="absolute bottom-0 left-1/2 h-16 w-40 -translate-x-1/2 rounded-b-[2.5rem] bg-gradient-to-b from-amber-600 to-amber-800 shadow-inner" />
    </div>
  );
}

export default function Hero() {
  const [date, setDate] = useState("");
  useEffect(() => setDate(bnDate()), []);

  return (
    <section className="rounded-3xl border border-green-100 bg-green-50/60 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span suppressHydrationWarning>আজ, {date || "আপডেট হচ্ছে…"}</span>
          </p>

          <h1 className="text-2xl leading-snug font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলাসহ দৈনন্দিন প্রয়োজনীয়
            সব পণ্যের বাজারভিত্তিক সর্বনিম্ন, সর্বোচ্চ এবং পরিবর্তনের হার — সবই
            এক জায়গায় দেখুন, সহজেই তুলনা করুন।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 sm:text-base"
          >
            সব দাম দেখুন
            <span aria-hidden>↓</span>
          </a>
        </div>

        <Basket />
      </div>
    </section>
  );
}
