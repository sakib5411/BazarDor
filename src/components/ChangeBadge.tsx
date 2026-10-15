import { changeColorClass, changeText, type ChangeDir } from "@/lib/bn";

type Props = {
  dir: ChangeDir;
  pct: number;
  className?: string;
};

/** ▲ সবুজ / ▼ লাল / — ধূসর — দাম পরিবর্তনের ব্যাজ। */
export default function ChangeBadge({ dir, pct, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${changeColorClass(
        dir,
      )} ${className}`}
    >
      {changeText(pct, dir)}
    </span>
  );
}
