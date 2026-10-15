"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import AuthShell from "@/components/AuthShell";
import { signIn, signUp } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function validate() {
    if (name.trim().length < 2) return "আপনার পূর্ণ নাম লিখুন।";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "সঠিক ইমেইল ঠিকানা লিখুন।";
    if (password.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
    if (password !== confirm) return "দুটি পাসওয়ার্ড মিলছে না।";
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

    const { error } = await signUp.email({
      name: name.trim(),
      email,
      password,
    });

    if (error) {
      const message =
        error.message?.toLowerCase().includes("exist")
          ? "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।"
          : (error.message ?? "রেজিস্ট্রেশন সম্পন্ন হয়নি।");
      setFormError(message);
      toast.error(message);
      setSubmitting(false);
      return;
    }

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।");
    // রেজিস্ট্রেশনের পর লগইন পেজে পাঠানো হয় (অ্যাসাইনমেন্টের নির্দেশ)
    router.push(`/signin?email=${encodeURIComponent(email)}`);
  }

  async function handleSocial(provider: "google" | "github") {
    setFormError(null);
    try {
      await signIn.social({ provider, callbackURL: "/" });
    } catch {
      toast.error("সোশ্যাল লগইন শুরু করা যায়নি।");
    }
  }

  return (
    <AuthShell
      title="অ্যাকাউন্ট তৈরি করুন"
      subtitle="বিনা খরচে সাইন ইন করে সব দামের বিস্তারিত বিশ্লেষণ দেখুন।"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="signup-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            নাম
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="যেমন: রেজওয়ান আহমেদ"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            ইমেইল
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            পাসওয়ার্ড
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label
            htmlFor="signup-confirm"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="আবার লিখুন"
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
          {submitting ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "রেজিস্ট্রেশন করুন"}
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
        আগেই অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/signin"
          className="font-semibold text-green-700 hover:underline"
        >
          সাইন ইন করুন
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
