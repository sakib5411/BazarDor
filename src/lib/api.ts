/**
 * BazarDor API ক্লায়েন্ট।
 * তিনটি বেস URL একের পর এক চেষ্টা করা হয়, যাতে একটা ডাউন থাকলেও অ্যাপ চলে।
 */

import type { ChangeDir } from "./bn";

export type MarketPrice = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: ChangeDir; pct: number };
  markets: MarketPrice[];
};

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export const BASE_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

/** 404 হলে null, অন্যথায় parsed JSON। সব base URL fail করলে throw করে। */
async function apiGet<T>(path: string): Promise<T | null> {
  let lastError: unknown = null;

  for (const base of BASE_URLS) {
    try {
      const res = await fetch(`${base}${path}`, { cache: "no-store" });
      if (res.status === 404) return null;
      if (!res.ok) {
        lastError = new Error(`HTTP ${res.status} from ${base}`);
        continue;
      }
      return (await res.json()) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("বাজার দর API-তে সংযোগ করা যায়নি");
}

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

/* ------------------------------------------------------------------ */
/* ছোট ইন-মেমরি ক্যাশ — ক্লায়েন্টে বারবার একই রিকোয়েস্ট এড়াতে সাহায্য করে */
/* ------------------------------------------------------------------ */

let productsCache: Product[] | null = null;
let productsPromise: Promise<Product[]> | null = null;
let categoriesCache: Category[] | null = null;
let categoriesPromise: Promise<Category[]> | null = null;

export function clearApiCache() {
  productsCache = null;
  productsPromise = null;
  categoriesCache = null;
  categoriesPromise = null;
}

/** সব পণ্য (ক্যাশেড)। */
export async function getProducts(): Promise<Product[]> {
  if (productsCache) return productsCache;
  if (!productsPromise) {
    productsPromise = apiGet<Product[]>("/products")
      .then((data) => {
        productsCache = data ?? [];
        return productsCache;
      })
      .catch((error) => {
        productsPromise = null;
        throw error;
      });
  }
  return productsPromise;
}

/** সব ক্যাটাগরি (ক্যাশেড), API fail করলে স্ট্যাটিক ফলব্যাক। */
export async function getCategories(): Promise<Category[]> {
  if (categoriesCache) return categoriesCache;
  if (!categoriesPromise) {
    categoriesPromise = apiGet<Category[]>("/categories")
      .then((data) => {
        categoriesCache = data && data.length > 0 ? data : FALLBACK_CATEGORIES;
        return categoriesCache;
      })
      .catch(() => {
        categoriesPromise = null;
        categoriesCache = FALLBACK_CATEGORIES;
        return categoriesCache;
      });
  }
  return categoriesPromise;
}

/**
 * একটি ক্যাটাগরির তথ্য; না থাকলে null।
 * আগে ক্যাশ করা তালিকা থেকে খোঁজা হয়, না পেলে একক endpoint ব্যবহার করা হয় —
 * এতে অপ্রয়োজনীয় 404 রিকোয়েস্ট (ও কনসোল এরর) এড়ানো যায়।
 */
export async function getCategory(slug: string): Promise<Category | null> {
  const all = await getCategories();
  const known = all.find((c) => c.slug === slug);
  if (known) return known;

  return await apiGet<Category>(`/categories/${encodeURIComponent(slug)}`);
}

/**
 * একটি ক্যাটাগরির পণ্য।
 * API `/products?category=xyz` ব্যবহার করা হয়; খালি হলে খালি অ্যারে।
 */
export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const data = await apiGet<Product[]>(
    `/products?category=${encodeURIComponent(slug)}`,
  );
  return data ?? [];
}

/** slug দিয়ে একটি পণ্য। `/products/<id>` endpoint id নেয়, তাই নাম দিয়ে খোঁজা হয়। */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

/** দামের সারসংক্ষেপ (সর্বনিম্ন, সর্বোচ্চ, গড়)। */
export function priceSummary(product: Product) {
  const markets = product.markets ?? [];
  if (markets.length === 0) {
    return { min: product.today, max: product.today, avg: product.today };
  }
  const mins = markets.map((m) => m.min);
  const maxs = markets.map((m) => m.max);
  const avgs = markets.map((m) => (m.min + m.max) / 2);
  const min = Math.min(...mins);
  const max = Math.max(...maxs);
  const avg = Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length);
  return { min, max, avg };
}

/** দামি থেকে সস্তা / সস্তা থেকে দামি সাজানোর অপশন। */
export type SortOrder = "default" | "asc" | "desc";

/**
 * C1 — বাংলা সংখ্যা সঠিকভাবে ধরার জন্য সংখ্যার মান দিয়ে সাজানো হয়,
 * স্ট্রিং তুলনা করা হয় না।
 */
export function sortProducts(list: Product[], order: SortOrder): Product[] {
  if (order === "default") return list;
  const sorted = [...list].sort((a, b) => a.today - b.today);
  return order === "asc" ? sorted : sorted.reverse();
}
