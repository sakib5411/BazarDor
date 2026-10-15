import NotFoundView from "@/components/NotFoundView";

export const metadata = {
  title: "পাতা খুঁজে পাওয়া যায়নি",
};

/** অজানা/ভুল যেকোনো রুটের জন্য বন্ধুত্বপূর্ণ ৪০৪ পেজ। */
export default function NotFound() {
  return <NotFoundView />;
}
