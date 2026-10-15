import Link from "next/link";
import { toBn } from "@/lib/bn";

type Props = {
  title?: string;
  message?: string;
  code?: number;
};

/** 404 / খালি অবস্থার জন্য বন্ধুত্বপূর্ণ ভিউ। */
export default function NotFoundView({
  title = "দুঃখিত, পাতাটি খুঁজে পাওয়া যায়নি",
  message = "আপনি যে পণ্য বা ক্যাটাগরি খুঁজছেন সেটি আমাদের তালিকায় নেই অথবা ঠিকানাটি ভুল।",
  code = 404,
}: Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p aria-hidden className="text-6xl">
        🧺
      </p>
      <p className="mt-4 text-5xl font-extrabold text-green-600">{toBn(code)}</p>
      <h1 className="mt-3 text-xl font-bold text-gray-900 sm:text-2xl">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">{message}</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
      >
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
