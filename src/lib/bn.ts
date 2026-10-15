/**
 * বাংলা সংখ্যা, তারিখ ও একক (unit) সংক্রান্ত হেল্পার ফাংশন।
 * পুরো অ্যাপে দাম/তারিখ দেখানোর জন্য এগুলো ব্যবহার করা হয়।
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;

/** ইংরেজি অঙ্ককে বাংলা অঙ্কে রূপান্তর করে: 148 -> "১৪৮" */
export function toBn(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * সংখ্যাকে হাজার-বিভাজক সহ বাংলায় দেখায়।
 * bnNumber(1850) -> "১,৮৫০"
 * bnNumber(2.1, 1) -> "২.১"
 */
export function bnNumber(value: number, fractionDigits = 0): string {
  const safe = Number.isFinite(value) ? value : 0;
  const formatted = safe.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return toBn(formatted);
}

/** দাম দেখানোর জন্য: "১৪৮ টাকা" */
export function bnTaka(value: number): string {
  return `${bnNumber(value)} টাকা`;
}

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
] as const;

const BN_WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
] as const;

/** বাংলা তারিখ: "সোমবার, ৫ অক্টোবর, ২০২৬" */
export function bnDate(date: Date = new Date()): string {
  const weekday = BN_WEEKDAYS[date.getDay()];
  const day = toBn(date.getDate());
  const month = BN_MONTHS[date.getMonth()];
  const year = toBn(date.getFullYear());
  return `${weekday}, ${day} ${month}, ${year}`;
}

/** ছোট বাংলা তারিখ: "৫ অক্টোবর, ২০২৬" */
export function bnShortDate(date: Date = new Date()): string {
  return `${toBn(date.getDate())} ${BN_MONTHS[date.getMonth()]}, ${toBn(date.getFullYear())}`;
}

const UNIT_LABELS: Record<string, string> = {
  kg: "প্রতি কেজি",
  gram: "প্রতি গ্রাম",
  gramme: "প্রতি গ্রাম",
  litre: "প্রতি লিটার",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pic: "প্রতি পিস",
  hali: "প্রতি হালি",
  bundle: "প্রতি আঁটি",
  kg_bundle: "প্রতি আঁটি",
};

/** "kg" -> "প্রতি কেজি" */
export function unitLabel(unit?: string): string {
  if (!unit) return "";
  return UNIT_LABELS[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

const UNIT_SHORT: Record<string, string> = {
  kg: "কেজি",
  gram: "গ্রাম",
  gramme: "গ্রাম",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pic: "পিস",
  hali: "হালি",
  bundle: "আঁটি",
};

/** টিকারে দেখানোর ছোট একক: "kg" -> "কেজি" */
export function unitShort(unit?: string): string {
  if (!unit) return "";
  return UNIT_SHORT[unit.toLowerCase()] ?? unit;
}

export type ChangeDir = "up" | "down" | "flat";

/**
 * পরিবর্তনের ব্যাজ টেক্সট বানায়।
 * up -> "▲ ২.১%", down -> "▼ ২.৯%", flat -> "— ০.০%"
 */
export function changeText(pct: number, dir: ChangeDir): string {
  if (dir === "flat" || Math.abs(pct) < 0.05) return "— ০.০%";
  const arrow = dir === "up" ? "▲" : "▼";
  return `${arrow} ${bnNumber(Math.abs(pct), 1)}%`;
}

/** ব্যাজের রঙ (Tailwind class) — সবুজ উপরে, লাল নিচে, ধূসর সমান। */
export function changeColorClass(dir: ChangeDir): string {
  if (dir === "up") return "text-emerald-600 bg-emerald-50";
  if (dir === "down") return "text-red-600 bg-red-50";
  return "text-gray-500 bg-gray-100";
}
