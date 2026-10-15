"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChangeBadge from "@/components/ChangeBadge";
import NotFoundView from "@/components/NotFoundView";
import { useSession } from "@/lib/auth-client";
import { getProductBySlug, priceSummary, type Product } from "@/lib/api";
import { bnNumber, bnTaka, toBn, unitLabel } from "@/lib/bn";

const MARKET_COLUMNS = ["বাজার", "বিভাগ", "সর্বনিম্ন", "সর্বোচ্চ", "গড়"];

export default function ProductDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const signedIn = Boolean(session?.user);

  /* সুরক্ষিত রুট — লগইন না থাকলে টোস্ট দেখিয়ে সাইন ইন পেজে পাঠানো হয় */
  useEffect(() => {
    if (isPending || signedIn) return;
    toast.error("এই পেজটি দেখতে অনুগ্রহ করে সাইন ইন করুন");
    const timer = setTimeout(() => {
      router.replace(`/signin?next=${encodeURIComponent(`/product/${slug}`)}`);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPending, signedIn, router, slug]);

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    setLoading(true);
    getProductBySlug(slug)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        setError(null);
      })
      .catch(() => {
        if (active) setError("পণ্যের তথ্য আনতে সমস্যা হয়েছে।");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, signedIn]);

  if (isPending || !signedIn) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-4 w-56 rounded" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="skeleton h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-sm font-semibold text-amber-800">
            🔒 এই পণ্যের বিস্তারিত দেখতে সাইন ইন করা প্রয়োজন।
          </p>
          <Link
            href={`/signin?next=${encodeURIComponent(`/product/${slug}`)}`}
            className="mt-4 inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            সাইন ইন করুন
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-4 w-56 rounded" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="skeleton h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
            <div className="skeleton h-16 w-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <NotFoundView
        title="এই পণ্যটি খুঁজে পাওয়া যায়নি"
        message={`“${slug}” নামে কোনো পণ্য আমাদের তালিকায় নেই। ঠিকানাটি আবার দেখে নিন।`}
      />
    );
  }

  const { min, max, avg } = priceSummary(product);
  const description = `${product.categoryNameBn} জাতীয় পণ্য — ${unitLabel(
    product.unit,
  )} হিসেবে বাজারে বিক্রি হয়।`;

  const stats = [
    {
      label: "সর্বনিম্ন দাম",
      value: min,
      hint: "সবচেয়ে সস্তা বাজারের দাম",
      tone: "text-green-600",
    },
    {
      label: "সর্বোচ্চ দাম",
      value: max,
      hint: "সবচেয়ে দামি বাজারের দাম",
      tone: "text-red-600",
    },
    {
      label: "গড় দাম",
      value: avg,
      hint: "সব বাজারের গড় হিসাব",
      tone: "text-gray-900",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ব্রেডক্রাম্ব */}
      <nav aria-label="ব্রেডক্রাম্ব" className="text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-green-700">
              হোম
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/category/${product.category}`}
              className="hover:text-green-700"
            >
              {product.categoryNameBn}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-semibold text-gray-800">{product.nameBn}</li>
        </ol>
      </nav>

      {/* সারসংক্ষেপ */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-50 text-2xl ring-1 ring-gray-100"
            >
              {product.image || product.categoryIcon}
            </span>
            <div className="min-w-0">
              <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                {product.nameBn}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>
                <span>{unitLabel(product.unit)}</span>
              </p>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">আজকের দাম</p>
            <p className="text-xl font-extrabold text-gray-900">
              {bnNumber(product.today)}{" "}
              <span className="text-sm font-semibold">টাকা</span>
            </p>
            <ChangeBadge
              dir={product.change.dir}
              pct={product.change.pct}
              className="mt-1"
            />
          </div>
        </div>
      </section>

      {/* দামের সারসংক্ষেপ */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold text-gray-900">
          দামের সারসংক্ষেপ
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-5"
            >
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-2xl font-extrabold ${stat.tone}`}>
                {bnTaka(stat.value)}
              </p>
              <p className="mt-1 text-xs text-gray-400">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* বাজারভিত্তিক তালিকা */}
      <section>
        <h2 className="mb-3 text-lg font-extrabold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                <tr>
                  {MARKET_COLUMNS.map((column) => (
                    <th key={column} scope="col" className="px-4 py-3 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {product.markets.map((market) => {
                  const average = Math.round((market.min + market.max) / 2);
                  return (
                    <tr key={`${market.market}-${market.division}`}>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {market.market}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {market.division}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {bnTaka(market.min)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {bnTaka(market.max)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {bnTaka(average)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
            মোট {toBn(product.markets.length)} টি বাজারের তথ্য দেখানো হয়েছে।
          </p>
        </div>
      </section>
    </div>
  );
}
