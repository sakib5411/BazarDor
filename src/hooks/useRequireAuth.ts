"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

/**
 * সুরক্ষিত রুটের গার্ড।
 * লগইন না থাকলে টোস্ট দেখিয়ে সাইন ইন পেজে পাঠায় এবং
 * `next` প্যারামিটারে ফিরে আসার পথ মনে রাখে।
 */
export function useRequireAuth(redirectPath: string) {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const signedIn = Boolean(session?.user);

  useEffect(() => {
    if (isPending || signedIn) return;
    toast.error("এই পেজটি দেখতে অনুগ্রহ করে সাইন ইন করুন");
    const timer = setTimeout(() => {
      router.replace(
        `/signin?next=${encodeURIComponent(redirectPath)}`,
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [isPending, signedIn, router, redirectPath]);

  return { session, userId: session?.user?.id, isPending, signedIn, refetch };
}
