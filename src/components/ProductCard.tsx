import Link from "next/link";
import type { Product } from "@/lib/api";
import { bnTaka, unitLabel } from "@/lib/bn";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
    >
      {/* ইমোজি + নাম */}
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-xl ring-1 ring-gray-100"
        >
          {product.image || product.categoryIcon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
            {product.nameBn}
          </h3>
          <p className="truncate text-xs text-gray-500">
            {product.categoryIcon} {product.categoryNameBn}
          </p>
        </div>
      </div>

      {/* একক */}
      <p className="mt-3 text-xs text-gray-500">{unitLabel(product.unit)}</p>

      {/* দাম + পরিবর্তন */}
      <div className="mt-3 flex items-end justify-between gap-2 border-t border-dashed border-gray-200 pt-3">
        <div>
          <p className="text-[11px] leading-4 text-gray-500">আজকের দাম</p>
          <p className="text-base font-bold text-gray-900 sm:text-lg">
            {bnTaka(product.today)}
          </p>
        </div>
        <ChangeBadge dir={product.change.dir} pct={product.change.pct} />
      </div>
    </Link>
  );
}
