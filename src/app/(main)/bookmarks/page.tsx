import { Metadata } from "next";
import TrendsSidebar from "@/components/TrendsSidebar";
import Bookmarks from "./Bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks",
};

// bookmarks page
export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="space-y-5- w-full min-w-0">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <Bookmarks/>
      </div>
      <TrendsSidebar/>
    </main>
  );
}
