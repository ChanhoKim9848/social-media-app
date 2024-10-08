import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";
import DynamicImage from "./DynamicImage";


export const metadata: Metadata = {
  title: "Sign up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-muted-foreground">
              A place where <span className="italic">you</span> can find good people!
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm/>
            <Link href="/login" className="block text-center hover:underline">
                Already have an account? Login            
            </Link>
          </div>
        </div>
        {/* image on the right */}
        <DynamicImage/>
      </div>
    </main>
  );
}
