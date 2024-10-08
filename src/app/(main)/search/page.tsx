import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import SearchResult from "./SearchResult";

interface PageProps {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: `Search result for "${q}`,
  };
}

export default function Page({ searchParams: { q } }: PageProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Search result for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResult query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
