/** একক পণ্য কার্ডের লোডিং স্কেলিটন। */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="skeleton mt-4 h-3 w-20 rounded" />
      <div className="mt-4 flex items-end justify-between border-t border-dashed border-gray-200 pt-3">
        <div className="space-y-2">
          <div className="skeleton h-2.5 w-16 rounded" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="skeleton h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

/** গ্রিড আকারে অনেকগুলো স্কেলিটন। */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** সেকশন শিরোনামের স্কেলিটন। */
export function SectionHeadingSkeleton() {
  return (
    <div className="mb-5 space-y-2">
      <div className="skeleton h-5 w-48 rounded" />
      <div className="skeleton h-3 w-64 rounded" />
    </div>
  );
}
