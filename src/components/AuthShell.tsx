import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

/** সাইন ইন ও সাইন আপ পেজের সাধারণ খোলস (শিরোনাম + কার্ড)। */
export default function AuthShell({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-md px-1 py-4 sm:py-8">
      <h1 className="text-center text-2xl font-extrabold text-gray-900">
        {title}
      </h1>
      <p className="mt-1.5 text-center text-sm text-gray-500">{subtitle}</p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        {children}
      </div>
    </div>
  );
}

/** রুট সাসপেন্সের সময় দেখানোর স্কেলিটন। */
export function AuthShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md py-8">
      <div className="skeleton mx-auto h-7 w-40 rounded" />
      <div className="skeleton mx-auto mt-3 h-3 w-64 rounded" />
      <div className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="skeleton h-10 w-full rounded-lg" />
        <div className="skeleton h-10 w-full rounded-lg" />
        <div className="skeleton h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
 