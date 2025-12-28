"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.email && formData.username && formData.password && formData.password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-sm w-full space-y-4">
        {/* Register Box */}
        <div className="bg-white border border-gray-200 p-10 text-center">
          <h1 className="text-4xl font-semibold mb-4" style={{ fontFamily: "cursive" }}>
            Instagram
          </h1>

          <p className="text-gray-500 font-semibold mb-6">
            Sign up to see photos and videos from your friends.
          </p>

          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm focus:outline-none focus:border-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm focus:outline-none focus:border-gray-400"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <p className="text-xs text-gray-500 my-4">
              People who use our service may have uploaded your contact information to Instagram.{" "}
              <a href="#" className="text-blue-900">
                Learn More
              </a>
            </p>

            <p className="text-xs text-gray-500 mb-4">
              By signing up, you agree to our{" "}
              <a href="#" className="text-blue-900">
                Terms
              </a>
              ,{" "}
              <a href="#" className="text-blue-900">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-900">
                Cookies Policy
              </a>
              .
            </p>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
          </form>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-gray-200 p-5 text-center">
          <p className="text-sm">
            Have an account?{" "}
            <Link href="/login" className="text-blue-500 font-semibold">
              Log in
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
