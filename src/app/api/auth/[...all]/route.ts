import { auth, ensureDatabaseReady } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

/**
 * প্রথম রিকোয়েস্টেই ডেটাবেজ টেবিল তৈরি হয়ে যায়,
 * তারপর আসল BetterAuth হ্যান্ডলারে পাঠানো হয়।
 */
async function withDatabase(
  handler: (request: Request) => Promise<Response>,
  request: Request,
) {
  await ensureDatabaseReady();
  return handler(request);
}

export function GET(request: Request) {
  return withDatabase(handlers.GET, request);
}

export function POST(request: Request) {
  return withDatabase(handlers.POST, request);
}
