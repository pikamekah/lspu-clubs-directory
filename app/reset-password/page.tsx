"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully. Please log in again.");

    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eeeeee] flex items-center justify-center px-4 py-8 lg:px-6 lg:py-0">
      <Image
        src="/lspu-school-bg.jpg"
        alt="LSPU campus background"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-15"
      />

      <div className="absolute inset-0 bg-white/35" />

      <div className="relative w-full max-w-[445px] lg:max-w-none lg:w-[1120px] lg:h-[590px]">
        <section className="hidden lg:block absolute left-0 top-0 h-full w-[1060px] overflow-hidden rounded-[42px] shadow-2xl">
          <Image
            src="/lspu-school-bg.jpg"
            alt="LSPU campus"
            fill
            sizes="1060px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/18" />

          <div className="relative z-10 px-12 pt-9 flex items-center text-white">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              LSPU.
            </Link>

            <nav className="ml-24 flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wide drop-shadow">
              <Link href="/" className="hover:underline underline-offset-4">
                Home
              </Link>

              <Link href="/about" className="hover:underline underline-offset-4">
                About Us
              </Link>

              <Link href="/resources" className="hover:underline underline-offset-4">
                Resources
              </Link>

              <Link href="/contact" className="hover:underline underline-offset-4">
                Contact
              </Link>

              <Link
                href="/login"
                className="font-extrabold underline underline-offset-8 decoration-2"
              >
                Log In
              </Link>
            </nav>
          </div>

          <div className="absolute left-12 bottom-11 text-white">
            <h2 className="text-5xl font-extrabold drop-shadow-lg">
              Reset Password
            </h2>

            <p className="mt-3 max-w-md text-white/90">
              Create a new password and return to your UniLink account.
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-t-[34px] bg-gradient-to-r from-cyan-700 to-lime-500 px-6 pt-6 pb-24 shadow-2xl lg:hidden">
          <Image
            src="/lspu-school-bg.jpg"
            alt="LSPU campus"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 via-cyan-700/60 to-lime-500/70" />

          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black shadow-md">
                U
              </div>

              <div>
                <h1 className="text-xl font-black leading-none">UniLink</h1>

                <p className="text-[10px] text-white/80 mt-1">
                  LSPU Clubs Directory
                </p>
              </div>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-white text-cyan-700 text-xs font-black shadow-sm"
            >
              Log in
            </Link>
          </div>

          <div className="relative z-10 mt-10 text-center text-white">
            <div className="mx-auto h-16 w-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black shadow-lg">
              U
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight">
              Reset Password
            </h2>

            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              Enter your new password to recover access to your UniLink account.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-white/15 border border-white/30 px-5 py-2 text-[11px] font-black">
              Laguna State Polytechnic University
            </div>
          </div>
        </section>

        <section className="relative z-30 w-full bg-white rounded-[32px] shadow-[0_18px_45px_rgba(0,0,0,0.22)] flex items-center justify-center px-7 py-8 -mt-16 lg:mt-0 lg:absolute lg:left-[595px] lg:top-[46px] lg:h-[510px] lg:w-[445px] lg:rounded-[42px] lg:px-9 lg:py-0">
          <div className="w-full max-w-[340px] lg:max-w-[330px]">
            <h1 className="text-[32px] lg:text-3xl font-extrabold text-[#171717] mb-2">
              Create New Password
            </h1>

            <p className="text-[11px] text-gray-500 mb-6">
              Enter and confirm your new password below.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-3.5">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  title="New password"
                  aria-label="New password"
                  className="w-full h-11 lg:h-9 rounded-full bg-[#f6fffb] lg:bg-[#e5e5e5] border border-cyan-100 lg:border-0 px-5 pr-12 text-xs text-gray-700 placeholder:text-gray-400 lg:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200 lg:italic"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon />
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  title="Confirm new password"
                  aria-label="Confirm new password"
                  className="w-full h-11 lg:h-9 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-5 pr-12 text-xs text-gray-700 placeholder:text-gray-400 lg:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200 lg:italic"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  title={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  <EyeIcon />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 lg:h-10 bg-gradient-to-r from-cyan-600 to-lime-500 lg:bg-none lg:bg-[#101415] text-white rounded-full text-xs font-black lg:font-medium hover:brightness-110 lg:hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

              <Link
                href="/login"
                className="w-full h-10 lg:h-9 bg-[#e4e4e4] text-[#171717] rounded-full text-xs font-medium hover:bg-gray-300 transition flex items-center justify-center"
              >
                Back to Login
              </Link>

              <div className="pt-3 border-t border-cyan-100 text-center text-[10px] text-gray-400 lg:hidden">
                © 2026 UniLink | LSPU Clubs Directory
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}