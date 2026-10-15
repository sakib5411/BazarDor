import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getMigrations } from "better-auth/db/migration";
import Database from "better-sqlite3";
import { Pool } from "pg";

/**
 * ডেটাবেজ নির্বাচন:
 *  - `DATABASE_URL` সেট থাকলে (production / Vercel) → Postgres (pg) ব্যবহার হবে।
 *  - না থাকলে লোকাল SQLite ফাইল ব্যবহার হবে, যাতে ডেভেলপারকে কিছু সেটআপ করতে না হয়।
 */
function resolveDatabase() {
  const url = process.env.DATABASE_URL;
  if (url && /^postgres(ql)?:\/\//i.test(url)) {
    return new Pool({
      connectionString: url,
      ssl: /localhost|127\.0\.0\.1/.test(url)
        ? undefined
        : { rejectUnauthorized: false },
    });
  }
  return new Database(process.env.SQLITE_PATH ?? "bazardor.sqlite");
}

const googleEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);
const githubEnabled = Boolean(
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
);

export const auth = betterAuth({
  // baseURL সেট না থাকলে better-auth নিজেই রিকোয়েস্ট থেকে বের করে নেয়।
  ...(process.env.BETTER_AUTH_URL
    ? { baseURL: process.env.BETTER_AUTH_URL }
    : {}),
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "bazardor-dev-secret-change-me-in-production",
  database: resolveDatabase(),
  emailAndPassword: {
    enabled: true,
    // অ্যাসাইনমেন্টের নির্দেশ অনুযায়ী ইমেইল ভেরিফিকেশন বন্ধ রাখা হয়েছে।
    requireEmailVerification: false,
    // রেজিস্ট্রেশনের পর ইউজারকে লগইন পেজে পাঠানো হবে, তাই অটো-সাইনইন বন্ধ।
    autoSignIn: false,
  },
  socialProviders: {
    ...(googleEnabled
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        }
      : {}),
    ...(githubEnabled
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // ৭ দিন
    updateAge: 60 * 60 * 24, // দিনে একবার রিফ্রেশ
  },
  plugins: [nextCookies()],
});

/** কোন সোশ্যাল লগইন এখন সক্রিয় — UI-তে দেখানোর জন্য। */
export const socialAvailability = {
  google: googleEnabled,
  github: githubEnabled,
};

let migrationPromise: Promise<void> | null = null;

/**
 * BetterAuth-এর টেবিলগুলো (user, session, account, verification)
 * তৈরি করে নেয়। এতে নতুন ক্লোন করেও অ্যাপ সাথে সাথে চলে,
 * আলাদা করে `npx auth migrate` চালানোর দরকার হয় না।
 */
export function ensureDatabaseReady(): Promise<void> {
  if (!migrationPromise) {
    migrationPromise = getMigrations(auth.options)
      .then(({ runMigrations }) => runMigrations())
      .catch((error) => {
        migrationPromise = null;
        throw error;
      });
  }
  return migrationPromise;
}

// প্রথম অনুরোধের জন্য অপেক্ষা না করে অ্যাপ লোড হওয়ার সাথেই
// ডেটাবেজ প্রস্তুত করা শুরু হয়।
ensureDatabaseReady().catch((error) => {
  console.error("[bazardor] ডেটাবেজ প্রস্তুত করা যায়নি:", error);
});
