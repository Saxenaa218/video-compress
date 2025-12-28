"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-sm w-full space-y-4">
        {/* Login Box */}
        <div className="bg-white border border-gray-200 p-10 text-center">
          <h1 className="text-4xl font-semibold mb-8" style={{ fontFamily: "cursive" }}>
            Instagram
          </h1>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm focus:outline-none focus:border-gray-400"
            />

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-semibold">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <a href="#" className="text-sm text-blue-900">
            Forgot password?
          </a>
        </div>

        {/* Sign Up Box */}
        <div className="bg-white border border-gray-200 p-5 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        {/* App Download */}
        <div className="text-center">
          <p className="text-sm mb-4">Get the app.</p>
          <div className="flex justify-center gap-2">
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
              alt="Get it on Google Play"
              className="h-10"
            />
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
              alt="Get it on Microsoft"
              className="h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
