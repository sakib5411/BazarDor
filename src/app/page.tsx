"use client";

import Link from "next/link";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import {
  ProductGridSkeleton,
  SectionHeadingSkeleton,
} from "@/components/Skeletons";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/lib/api";

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-xl">
        <span aria-hidden>{icon}</span>
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

/** একই পণ্য দুইবার এলেও key আলাদা রাখার জন্য। */
function topRisers(products: Product[], count = 6) {
  return [...products]
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, count);
}

function topFallers(products: Product[], count = 6) {
  return [...products]
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, count);
}

export default function HomePage() {
  const { products, loading, error, reload } = useProducts();

  const risers = topRisers(products);
  const fallers = topFallers(products);

  return (
    <div className="space-y-10">
      <Hero />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : null}

      {/* সেকশন A — আজ দাম বেড়েছে */}
      <section>
        <SectionHeading
          icon="▲"
          title="আজ দাম বেড়েছে"
          subtitle="গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে।"
        />
        {loading ? (
          <>
            <SectionHeadingSkeleton />
            <ProductGridSkeleton count={6} />
          </>
        ) : (
          <ProductGrid products={risers} />
        )}
      </section>

      {/* সেকশন B — আজ দাম কমেছে */}
      <section>
        <SectionHeading
          icon="▼"
          title="আজ দাম কমেছে"
          subtitle="গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে।"
        />
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <ProductGrid products={fallers} />
        )}
      </section>

      {/* সেকশন C — সব পণ্য */}
      <section id="সব-পণ্য" className="scroll-mt-28">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            icon="🛍️"
            title="সব পণ্য"
            subtitle="চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলার সম্পূর্ণ তালিকা।"
          />
          {!loading && products.length > 0 ? (
            <p className="mb-5 text-sm text-gray-500">
              মোট {products.length} টি পণ্য
            </p>
          ) : null}
        </div>

        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            এখন কোনো পণ্যের তথ্য পাওয়া যাচ্ছে না।{" "}
            <Link href="/" className="font-semibold text-green-700 underline">
              আবার চেষ্টা করুন
            </Link>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}
