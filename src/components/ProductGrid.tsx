import type { Product } from "@/lib/api";
import ProductCard from "./ProductCard";

/** রেসপন্সিভ গ্রিড — বড় স্ক্রিনে ৪ কলাম, মোবাইলে ১ কলাম। */
export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
