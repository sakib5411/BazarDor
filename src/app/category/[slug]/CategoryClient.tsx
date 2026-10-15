"use client";

import { useEffect, useMemo, useState } from "react";
import NotFoundView from "@/components/NotFoundView";
import ProductGrid from "@/components/ProductGrid";
import { ProductGridSkeleton } from "@/components/Skeletons";
import SortSelect from "@/components/SortSelect";
import {
  getCategory,
  getProductsByCategory,
  sortProducts,
  type Category,
  type Product,
  type SortOrder,
} from "@/lib/api";
import { toBn } from "@/lib/bn";

export default function CategoryClient({ slug }: { slug: string }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOrder>("default");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([getCategory(slug), getProductsByCategory(slug)])
      .then(([categoryData, productList]) => {
        if (!active) return;
        setCategory(categoryData);
        setProducts(productList);
      })
      .catch(() => {
        if (active) setError("ক্যাটাগরির তথ্য আনতে সমস্যা হয়েছে।");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, attempt]);

  const sorted = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  // লোড শেষ, কিন্তু ক্যাটাগরি বা পণ্য নেই -> 404-ধাঁচের খালি অবস্থা
  if (!loading && !error && (products.length === 0 || !category)) {
    return (
      <NotFoundView
        title="এই ক্যাটাগরিতে কোনো পণ্য নেই"
        message={`“${slug}” নামে কোনো ক্যাটাগরি আমরা খুঁজে পাইনি। অন্য যেকোনো ক্যাটাগরি অথবা হোম পেজ থেকে দেখে নিন।`}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ক্যাটাগরির হেডার */}
      {loading ? (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="skeleton h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-3 w-64 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-50 text-2xl ring-1 ring-gray-100"
          >
            {category?.icon ?? "🧺"}
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
              {category?.nameBn ?? slug}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {category?.nameBn} জাতীয় খাদ্যপণ্যের দাম ও বিশ্লেষণ
            </p>
          </div>
        </div>
      )}

      {/* সাজানোর কন্ট্রোল */}
      <div className="flex items-center justify-end rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">
              {category?.nameBn} জাতীয় পণ্যের তালিকা
            </h2>
            <p className="text-sm text-gray-500">
              {toBn(sorted.length)} টি পণ্য
            </p>
          </div>
          <ProductGrid products={sorted} />
        </>
      )}
    </div>
  );
}
