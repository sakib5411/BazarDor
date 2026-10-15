"use client";

import { FiChevronDown } from "react-icons/fi";
import type { SortOrder } from "@/lib/api";

const OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "default", label: "ডিফল্ট" },
  { value: "asc", label: "দাম: কম থেকে বেশি" },
  { value: "desc", label: "দাম: বেশি থেকে কম" },
];

type Props = {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
};

/** C1 — “সাজান” ড্রপডাউন (chevron আইকন সহ)। */
export default function SortSelect({ value, onChange }: Props) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-500">
      <span className="hidden sm:inline">সাজান:</span>
      <span className="relative inline-flex items-center">
        <select
          aria-label="সাজান"
          value={value}
          onChange={(event) => onChange(event.target.value as SortOrder)}
          className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-3 text-sm font-semibold text-gray-800 shadow-sm transition focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none"
        >
          {OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FiChevronDown
          aria-hidden
          className="pointer-events-none absolute right-2.5 text-gray-400"
        />
      </span>
    </label>
  );
}
