import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import DynamicImage from "./DynamicImage";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-3xl font-bold">
            Login to Social Media
          </h1>
          <div className="space-y-5">
            <div>

            </div>
            {/* login form */}
            <LoginForm />

            {/* Google sign in button */}
            <GoogleSignInButton/>
            
            {/* sign up button */}
            <Link href="/signup" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
        <DynamicImage/>
      </div>
    </main>
  );
}
