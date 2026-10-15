import type { Metadata } from "next";
import CategoryClient from "./CategoryClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `ক্যাটাগরি: ${slug}`,
    description: `${slug} ক্যাটাগরির আজকের বাজারদর ও দামের পরিবর্তন।`,
  };
}

/**
 * ডাইনামিক রুটকে সার্ভার কম্পোনেন্টে রাখা হয়েছে,
 * যাতে Vercel-এ রিফ্রেশ করলেও কোনো সমস্যা না হয়।
 */
export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
