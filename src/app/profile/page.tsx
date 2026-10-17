"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiEdit2, FiLogOut, FiUser } from "react-icons/fi";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { signOut } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { session, isPending, signedIn } = useRequireAuth("/profile");

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("সাইন আউট সম্পন্ন হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি");
    }
  }

  if (isPending || !signedIn) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-6">
        <div className="skeleton h-6 w-40 rounded" />
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="skeleton h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-3 w-56 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  } 

  const user = session?.user;

  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-6">
      <h1 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
        আমার প্রোফাইল
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        আপনার অ্যাকাউন্টের তথ্য দেখুন ও হালনাগাদ করুন।
      </p>

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "ব্যবহারকারী"}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              {(user?.name ?? "অ").charAt(0)}
            </span>
          )} 
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-gray-900">
              {user?.name ?? "নাম নেই"}
            </p>
            <p className="truncate text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Link
          href="/profile/update"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <FiEdit2 /> তথ্য পরিবর্তন
        </Link>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <FiUser /> অ্যাকাউন্টের সারসংক্ষেপ
        </h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">নাম</dt>
            <dd className="font-medium text-gray-800">{user?.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">ইমেইল</dt>
            <dd className="truncate font-medium text-gray-800">
              {user?.email ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
      >
        <FiLogOut /> সাইন আউট
      </button>
    </div>
  );
}
