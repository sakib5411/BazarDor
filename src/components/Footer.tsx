import { bnShortDate } from "@/lib/bn";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="text-sm font-semibold text-gray-800">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p className="text-xs text-gray-500 sm:text-sm">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
      <div className="border-t border-gray-100 py-3 text-center text-[11px] text-gray-400">
        © {bnShortDate().replace(/,\s*\d{4}$/, "")} যাবতীয় তথ্য শুধুমাত্র শিক্ষামূলক
        উদাহরণ হিসেবে প্রদর্শিত।
      </div>
    </footer>
  );
}
