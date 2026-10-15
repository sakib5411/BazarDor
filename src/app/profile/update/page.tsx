"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { authClient } from "@/lib/auth-client";

/**
 * C3 — “তথ্য পরিবর্তন” পেজ।
 * BetterAuth-এর updateUser ব্যবহার করে নাম পরিবর্তন করা হয়।
 * রেফারেন্স: https://better-auth.com/docs/concepts/users-accounts#update-user
 */
export default function UpdateProfilePage() {
  const router = useRouter();
  const { session, isPending, signedIn, refetch } = useRequireAuth(
    "/profile/update",
  );

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // বর্তমান নাম দিয়ে ইনপুট আগে থেকেই ভরে দেওয়া হয়
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setFormError("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    setSaving(true);
    setFormError(null);

    const { error } = await authClient.updateUser({ name: name.trim() });

    if (error) {
      const message = error.message ?? "তথ্য হালনাগাদ করা যায়নি।";
      setFormError(message);
      toast.error(message);
      setSaving(false);
      return;
    }

    await refetch();
    toast.success("আপনার তথ্য সফলভাবে হালনাগাদ হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  if (isPending || !signedIn) {
    return (
      <div className="mx-auto max-w-lg py-6">
        <div className="skeleton h-6 w-48 rounded" />
        <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="skeleton h-3 w-16 rounded" />
          <div className="skeleton h-10 w-full rounded-lg" />
          <div className="skeleton h-11 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-4 sm:py-6">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-green-700"
      >
        <FiArrowLeft /> প্রোফাইলে ফিরে যান
      </Link>

      <h1 className="mt-4 text-xl font-extrabold text-gray-900 sm:text-2xl">
        তথ্য হালনাগাদ করুন
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        আপনার অ্যাকাউন্টের নাম পরিবর্তন করে “হালনাগাদ করুন” বাটনে চাপ দিন।
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
        noValidate
      >
        <div>
          <label
            htmlFor="update-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            নাম
          </label>
          <input
            id="update-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="আপনার পূর্ণ নাম"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            ইমেইল
          </label>
          <input
            type="email"
            value={session?.user?.email ?? ""}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            ইমেইল পরিবর্তন এই অ্যাসাইনমেন্টে সমর্থিত নয়।
          </p>
        </div>

        {formError ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "হালনাগাদ হচ্ছে…" : "হালনাগাদ করুন"}
        </button>
      </form>
    </div>
  );
}
