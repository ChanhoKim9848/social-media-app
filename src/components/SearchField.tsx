"use client";

import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

// search field function
export default function SearchField() {
  const router = useRouter();

  // submit form and search the value
  //   if JavaScript is available, we handle submit with javascript logic
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    // if field is empty, return nothing
    if (!q) return;

    // push new query variable into the URL
    // encode because certain characters are not allowed in URL
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }
  return (
    // if JavaScript is disabled, we still have form action that even works without JavaScript
    // Progressive Enhancement
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
