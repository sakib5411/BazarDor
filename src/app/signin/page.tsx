"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import AuthShell, { AuthShellSkeleton } from "@/components/AuthShell";
import { signIn } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "সঠিক ইমেইল ঠিকানা লিখুন।";
    }
    if (password.length < 8) {
      return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const { error } = await signIn.email({ email, password });

    if (error) {
      const message =
        error.message === "Invalid email or password"
          ? "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।"
          : (error.message ?? "সাইন ইন করা যায়নি।");
      setFormError(message);
      toast.error(message);
      setSubmitting(false);
      return;
    }

    toast.success("সফলভাবে সাইন ইন হয়েছে!");
    router.push(redirectTo);
    router.refresh();
  }

  async function handleSocial(provider: "google" | "github") {
    setFormError(null);
    try {
      await signIn.social({ provider, callbackURL: redirectTo });
    } catch {
      toast.error("সোশ্যাল লগইন শুরু করা যায়নি।");
    }
  }

  return (
    <AuthShell
      title="সাইন ইন"
      subtitle="বাজার দর-এ ঢুকে দামের সম্পূর্ণ তালিকা ও বিশ্লেষণ দেখুন।"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="signin-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            ইমেইল
          </label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label
            htmlFor="signin-password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            পাসওয়ার্ড
          </label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
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
          disabled={submitting}
          className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        অথবা
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleSocial("google")}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <FcGoogle className="text-lg" /> Google দিয়ে সাইন ইন
        </button>
        <button
          type="button"
          onClick={() => handleSocial("github")}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <FiGithub className="text-lg" /> GitHub দিয়ে সাইন ইন
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/signup"
          className="font-semibold text-green-700 hover:underline"
        >
          সাইন আপ করুন
        </Link>
      </p>

      <p className="mt-3 text-center text-xs text-gray-400">
        <Link href="/" className="hover:text-green-700">
          ← হোম পেজে ফিরে যান
        </Link>
      </p>
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthShellSkeleton />}>
      <SignInForm />
    </Suspense>
  );
}
