import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `পণ্যের বিস্তারিত: ${slug}`,
    description: "পণ্যের আজকের দাম, সর্বনিম্ন-সর্বোচ্চ-গড় দাম ও বাজারভিত্তিক তালিকা।",
  };
}

/** সুরক্ষিত রুট — লগইন ছাড়া দেখা যাবে না। */
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
