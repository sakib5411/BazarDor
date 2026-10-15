# 🛒 বাজার দর (BazarDor)

> **প্রয়োজনীয় পণ্যের দাম এক নজরে।**

চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম-দুধ ও মসলাসহ দৈনন্দিন প্রয়োজনীয় পণ্যের
**বাজারভিত্তিক আজকের দাম** এক জায়গায় দেখার জন্য একটি বাংলা ওয়েব অ্যাপ্লিকেশন।
দামের ওঠানামা, সর্বনিম্ন–সর্বোচ্চ–গড় দাম এবং কোন বাজারে কত — সবই সহজে তুলনা করা যায়।

---

## 🔗 লাইভ ও রিপোজিটরি

| বিষয় | লিংক |
| --- | --- |
| 🌐 Live Link | _(ডিপ্লয় করার পর এখানে বসান)_ |
| 💻 GitHub Repository | _(রিপোজিটরির লিংক এখানে বসান)_ |

---

## 🛠️ ব্যবহৃত প্রযুক্তি (Technologies)

| প্রযুক্তি | কেন ব্যবহার করা হয়েছে |
| --- | --- |
| **Next.js 16 (App Router)** | পেজ রাউটিং, সার্ভার কম্পোনেন্ট ও ডাইনামিক রুট |
| **TypeScript** | টাইপ-সেফ কোড, ভালো অটোকমপ্লিশন |
| **Tailwind CSS v4** | রেসপন্সিভ, ইউটিলিটি-ফার্স্ট স্টাইলিং |
| **BetterAuth** | ইমেইল/পাসওয়ার্ড + Google + GitHub লগইন |
| **react-hot-toast** | সাকসেস/এরর নোটিফিকেশন |
| **react-icons** | Chevron, Google, GitHub, User ইত্যাদি আইকন |
| **better-sqlite3 / PostgreSQL** | BetterAuth-এর ডেটা সংরক্ষণ |
| **Noto Sans Bengali** | বাংলা লেখা সুন্দর দেখানোর জন্য |

---

## ✨ মূল ফিচার (Key Features)

1. **প্রাইস টিকার (মার্কি) সহ নেভবার** — লোগোর নিচে বাংলা তারিখ, তারপর ক্যাটাগরি লিংকের সারি
   (সক্রিয় ক্যাটাগরি সবুজ রঙে হাইলাইট) এবং নিচে বিরতিহীন স্ক্রল হওয়া দামের টিকার।
2. **হোম পেজে তিনটি সেকশন** — “আজ দাম বেড়েছে ▲” (টপ ৬), “আজ দাম কমেছে ▼” (টপ ৬)
   এবং “সব পণ্য” গ্রিড (লার্জ স্ক্রিনে ৪ কলাম, মোবাইলে ১ কলাম)।
3. **সুরক্ষিত পণ্যের বিস্তারিত পেজ** (`/product/[slug]`) — লগইন ছাড়া ঢোকা যায় না;
   দামের সারসংক্ষেপ (সর্বনিম্ন/সর্বোচ্চ/গড়) এবং **বাজারভিত্তিক আজকের দাম** টেবিল।
4. **ক্যাটাগরি পেজ** (`/category/[slug]`) — sort dropdown (`ডিফল্ট / কম থেকে বেশি / বেশি থেকে কম`),
   লোডিং স্কেলিটন এবং ক্যাটাগরি খালি/ভুল হলে ৪০৪-ধাঁচের empty state।
5. **সম্পূর্ণ authentication** — BetterAuth দিয়ে ইমেইল/পাসওয়ার্ড সাইন আপ-সাইন ইন,
   Google ও GitHub সোশ্যাল লগইন, প্রোফাইল দেখা এবং **নাম হালনাগাদ** (`/profile/update`)।
6. **সব জায়গায় টোস্ট নোটিফিকেশন** — লগইন, সাইন আপ, সাইন আউট, ভ্যালিডেশন এরর এবং
   সুরক্ষিত রুটে ঢুকতে গেলে সাইন ইন করার বার্তা।
7. **৩৬০° রেসপন্সিভ + বন্ধুত্বপূর্ণ ৪০৪ পেজ** — মোবাইল, ট্যাবলেট ও ডেস্কটপে সমানভাবে কাজ করে।

---

## 📁 ফাইল স্ট্রাকচার (Project Structure)

```text
bazardor/
├── .env.example                 # প্রয়োজনীয় env ভেরিয়েবলের নমুনা
├── .npmrc                       # Python/C++ টুলচেইন ছাড়াই npm install-এর কনফিগ
├── next.config.ts               # Next.js কনফিগ
├── package.json
├── README.md
└── src/
    ├── app/
    │   ├── layout.tsx           # রুট লেআউট: নেভবার + ফুটার + টোস্টার
    │   ├── globals.css          # থিম, মার্কি ও স্কেলিটন অ্যানিমেশন
    │   ├── page.tsx             # 🏠 হোম পেজ
    │   ├── not-found.tsx        # ৪০৪ পেজ
    │   ├── signin/page.tsx      # সাইন ইন
    │   ├── signup/page.tsx      # সাইন আপ
    │   ├── profile/
    │   │   ├── page.tsx         # আমার প্রোফাইল
    │   │   └── update/page.tsx  # C3 — তথ্য হালনাগাদ
    │   ├── category/[slug]/
    │   │   ├── page.tsx         # সার্ভার র‍্যাপার (Vercel-এ রিফ্রেশ নিরাপদ)
    │   │   └── CategoryClient.tsx
    │   ├── product/[slug]/
    │   │   ├── page.tsx         # সুরক্ষিত সার্ভার র‍্যাপার
    │   │   └── ProductDetailClient.tsx
    │   └── api/auth/[...all]/
    │       └── route.ts         # BetterAuth হ্যান্ডলার
    ├── components/
    │   ├── Navbar.tsx           # লোগো + তারিখ + ক্যাটাগরি + অথ বাটন
    │   ├── PriceTicker.tsx      # দামের মার্কি
    │   ├── Hero.tsx             # ব্যানার + CTA (#সব-পণ্য)
    │   ├── ProductCard.tsx      # পণ্যের কার্ড
    │   ├── ProductGrid.tsx      # রেসপন্সিভ গ্রিড
    │   ├── ChangeBadge.tsx      # ▲ / ▼ / — ব্যাজ
    │   ├── SortSelect.tsx       # C1 — সাজানোর ড্রপডাউন
    │   ├── Skeletons.tsx        # লোডিং স্কেলিটন
    │   ├── NotFoundView.tsx     # বন্ধুত্বপূর্ণ ৪০৪ ভিউ
    │   ├── AuthShell.tsx        # auth পেজের খোলস
    │   └── Footer.tsx
    ├── hooks/
    │   ├── useProducts.ts       # পণ্য লোড করার হুক
    │   └── useRequireAuth.ts    # সুরক্ষিত রুটের গার্ড
    └── lib/
        ├── api.ts               # API ক্লায়েন্ট + টাইপ + ক্যাশ
        ├── bn.ts                # বাংলা সংখ্যা, তারিখ ও একক
        ├── auth.ts              # BetterAuth (সার্ভার)
        └── auth-client.ts       # BetterAuth (ক্লায়েন্ট)
```

---

## 🚀 লোকাল সেটআপ (Local Setup)

```bash
# ১) ডিপেন্ডেন্সি ইনস্টল
npm install

# ২) env ফাইল তৈরি করুন
cp .env.example .env.local

# ৩) .env.local-এ BETTER_AUTH_SECRET বসান
#    (তৈরি করতে: openssl rand -base64 32)

# ৪) ডেভ সার্ভার চালু করুন
npm run dev
```

তারপর ব্রাউজারে **http://localhost:3000** খুলুন।

> 💡 **প্রথমবার VS Code-এ ঢুকলে `layout.tsx`-এ `Cannot find name 'LayoutProps'`
> লেখা একটি লাল দাগ দেখতে পারেন — এটি স্বাভাবিক।** Next.js চলার সময় নিজে থেকেই
> টাইপ ফাইল তৈরি করে; তাই একবার `npm run dev` (বা `npm run build`) চালালেই দাগটি
> চলে যায়। `tsc --noEmit`-ও বিল্ডের পরে সম্পূর্ণ ক্লিন।

> 🐍 **Python লাগবে না।** প্রজেক্টের `.npmrc`-তে `ignore-scripts=true` দেওয়া আছে,
> কারণ `better-sqlite3` কম্পাইল না করেই prebuilt বাইনারি ব্যবহার করে। তাই
> Windows-এ C++ build tools বা Python ছাড়াও `npm install` সোজা কাজ করে।

> 💡 **কোনো ডেটাবেজ সেটআপ লাগবে না।** `DATABASE_URL` না দিলে অ্যাপ নিজেই একটি
> লোকাল SQLite ফাইল (`bazardor.sqlite`) বানিয়ে নেয় এবং BetterAuth-এর
> `user`, `session`, `account`, `verification` টেবিলগুলো স্বয়ংক্রিয়ভাবে তৈরি করে নেয়।

### সোশ্যাল লগইন চালু করা (ঐচ্ছিক)

`.env.local`-এ Google/GitHub-এর key বসালেই বাটন দুটি সত্যিকারভাবে কাজ করবে:

- **Google** — [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
  Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- **GitHub** — [GitHub Developer Settings](https://github.com/settings/developers) →
  Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

key না দিলে প্রোফাইল (Email/Password) লগইন ঠিকঠাক কাজ করবে শুধু।

---

## ☁️ ডিপ্লয়মেন্ট (Vercel / Netlify)

1. GitHub-এ কোড পুশ করে Vercel-এ ইমপোর্ট করুন।
2. **Environment Variables**-এ বসান:
   - `BETTER_AUTH_SECRET` — একটি লম্বা র‍্যান্ডম স্ট্রিং
   - `BETTER_AUTH_URL` — আপনার লাইভ ঠিকানা (যেমন `https://bazardor.vercel.app`)
   - `DATABASE_URL` — একটি **PostgreSQL** সংযোগ স্ট্রিং
     (বিনামূল্যে পাওয়া যায় [Neon](https://neon.tech) বা [Supabase](https://supabase.com) থেকে)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` এবং `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
     (সোশ্যাল লগইন চাইলে — callback URL হবে `https://your-app.vercel.app/api/auth/callback/google` ইত্যাদি)
3. Deploy চাপুন।

> ⚠️ **গুরুত্বপূর্ণ:** সার্ভারলেস প্ল্যাটফর্মে ফাইল-ভিত্তিক SQLite টিকে না,
> তাই ডিপ্লয় করার সময় অবশ্যই `DATABASE_URL` (Postgres) দিতে হবে।

ডাইনামিক রুট `/category/[slug]` ও `/product/[slug]` App Router-এর
রিয়াল ডাইনামিক রুট হিসেবে তৈরি, তাই **যেকোনো পেজ রিফ্রেশ করলেও 404 হয় না**।

---

## 🔌 ব্যবহৃত API

বেস URL (যেকোনো একটি, অ্যাপ তিনটিই চেষ্টা করে):

```text
https://openapi.programming-hero.com/api/bazardor
https://api.api-store.workers.dev/api/bazardor
https://api.abcz.workers.dev/api/bazardor
```

| Endpoint | কাজ |
| --- | --- |
| `GET /products` | সব পণ্য |
| `GET /products?category=chal` | নির্দিষ্ট ক্যাটাগরির পণ্য |
| `GET /products/1` | একটি পণ্য (id দিয়ে) |
| `GET /categories` | সব ক্যাটাগরি |
| `GET /categories/chal` | একটি ক্যাটাগরি |

---

## 📜 স্ক্রিপ্ট

```bash
npm run dev     # ডেভ সার্ভার
npm run build   # প্রোডাকশন বিল্ড
npm run start   # প্রোডাকশন সার্ভার
npm run lint    # ESLint
```

---

## 📝 নোট

- দাম ও বাজারের সব তথ্য প্রদর্শনযোগ্য উদাহরণ; প্রকৃত বাজারদর সময়ের সাথে বদলায়।
- এই অ্যাসাইনমেন্টের নির্দেশ অনুযায়ী ইমেইল ভেরিফিকেশন ও পাসওয়ার্ড রিসেট
  ফিচার ইচ্ছা করে যোগ করা হয়নি।
