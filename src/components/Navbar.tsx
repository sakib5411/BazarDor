"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { FALLBACK_CATEGORIES, getCategories, type Category } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { bnDate } from "@/lib/bn";
import PriceTicker from "./PriceTicker";

function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "ব্যবহারকারী"}
        className="h-7 w-7 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
      {(name ?? "অ").trim().charAt(0)}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [date, setDate] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // তারিখ ক্লায়েন্টে হিসাব করা হয় (হাইড্রেশন মিসম্যাচ এড়াতে)
  useEffect(() => setDate(bnDate()), []);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {
        /* ফলব্যাক ক্যাটাগরি ব্যবহার হবে */
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  async function handleSignOut() {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছেন");
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন");
    }
  }

  const links = [
    { href: "/", label: "হোম", icon: "" },
    ...categories.map((c) => ({
      href: `/category/${c.slug}`,
      label: c.nameBn,
      icon: c.icon,
    })),
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* সারি ১: লোগো + অথ */}
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-lg shadow-sm"
            >
              🛒
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-lg font-extrabold tracking-tight text-gray-900">
                বাজার দর
              </span>
              <span
                suppressHydrationWarning
                className="text-[11px] text-gray-500"
              >
                {date || "আজকের বাজার"}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {isPending ? (
              <div className="skeleton h-9 w-24 rounded-lg" />
            ) : session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-2.5 py-1.5 transition hover:bg-gray-50"
                >
                  <Avatar
                    name={session.user.name}
                    image={session.user.image}
                  />
                  <span className="hidden max-w-24 truncate text-sm font-semibold text-gray-800 sm:block">
                    {session.user.name}
                  </span>
                  <FiChevronDown className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FiUser /> আমার প্রোফাইল
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut /> সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* সারি ২: ক্যাটাগরি লিংক */}
        <nav aria-label="ক্যাটাগরি" className="no-scrollbar -mx-1 overflow-x-auto">
          <ul className="flex items-center gap-1 px-1 pb-2">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="shrink-0">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      active
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {link.icon ? <span aria-hidden>{link.icon}</span> : null}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* সারি ৩: প্রাইস টিকার */}
      <PriceTicker />
    </header>
  );
}
