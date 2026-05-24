"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

function getSavedLogin() {
  if (typeof window === "undefined") return "";

  return localStorage.getItem("unilink_saved_login") || "";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState(() => getSavedLogin());
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => Boolean(getSavedLogin()));

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const loginInput = email.trim().toLowerCase();

    let loginEmail = loginInput;

    const studentIdPattern = /^\d{4}-\d{4}$/;

    if (studentIdPattern.test(loginInput)) {
      const { data: studentData, error: studentError } = await supabase
        .from("users")
        .select("email")
        .eq("student_id", loginInput)
        .maybeSingle();

      if (studentError) {
        setLoading(false);
        console.error("Student ID login error:", studentError);
        alert("Could not verify Student ID. Please try again.");
        return;
      }

      if (!studentData?.email) {
        setLoading(false);
        alert("No account found with this Student ID.");
        return;
      }

      loginEmail = studentData.email.toLowerCase();
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("Login failed. Please try again.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("unilink_saved_login", loginInput);
    } else {
      localStorage.removeItem("unilink_saved_login");
    }

    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();

    setLoading(false);

    if (roleError) {
      console.error("Role fetch error:", roleError);
      alert("Role fetch failed. Please check the users table policy.");
      return;
    }

    if (!userData) {
      alert(
        "Your login account exists, but your profile row is missing in the users table. Please contact the main admin."
      );
      return;
    }

    if (userData.role === "main_admin") {
      router.push("/dashboard/admin");
      return;
    }

    router.push("/home");
  }

  async function handleGoogleLogin() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    }
  }

  async function handleForgotPassword() {
    const userEmail = email.trim().toLowerCase();

    if (!userEmail) {
      alert("Please enter your email address first.");
      return;
    }

    const studentIdPattern = /^\d{4}-\d{4}$/;

    if (studentIdPattern.test(userEmail)) {
      alert("Please enter your email address, not your Student ID, to reset your password.");
      return;
    }

    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setResetLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset link sent. Please check your email.");
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
                Welcome Back!
              </h2>
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
                href="/signup"
                className="px-5 py-2.5 rounded-full bg-white text-cyan-700 text-xs font-black shadow-sm"
              >
                Sign up
              </Link>
            </div>

            <div className="relative z-10 mt-10 text-center text-white">
              <div className="mx-auto h-16 w-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black shadow-lg">
                U
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight">
                Welcome Back
              </h2>

              <p className="mt-3 text-sm text-white/90 leading-relaxed">
                Sign in to your UniLink account and continue exploring campus
                organizations.
              </p>

              <div className="mt-5 inline-flex rounded-full bg-white/15 border border-white/30 px-5 py-2 text-[11px] font-black">
                Laguna State Polytechnic University
              </div>
            </div>
          </section>

          <section className="relative z-30 w-full bg-white rounded-[32px] shadow-[0_18px_45px_rgba(0,0,0,0.22)] flex items-center justify-center px-7 py-8 -mt-16 lg:mt-0 lg:absolute lg:left-[595px] lg:top-[46px] lg:h-[510px] lg:w-[445px] lg:rounded-[42px] lg:px-9 lg:py-0">
            <div className="w-full max-w-[340px] lg:max-w-[330px]">
              <h1 className="text-[32px] lg:text-3xl font-extrabold text-[#171717] mb-2 lg:mb-14">
                Log in
              </h1>

              <p className="text-[11px] text-gray-500 mb-6 lg:hidden">
                Sign in to your UniLink student account.
              </p>

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 lg:text-gray-500">
                    <UserIcon />
                  </span>

                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address or Student ID"
                    title="Email address or Student ID"
                    aria-label="Email address or Student ID"
                    className="w-full h-11 lg:h-9 rounded-full bg-[#f6fffb] lg:bg-[#e5e5e5] border border-cyan-100 lg:border-0 pl-11 pr-4 text-xs text-gray-700 placeholder:text-gray-400 lg:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200 lg:italic"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 lg:text-gray-500">
                    <LockIcon />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    title="Password"
                    aria-label="Password"
                    className="w-full h-11 lg:h-9 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 pl-11 pr-11 text-xs text-gray-700 placeholder:text-gray-400 lg:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200 lg:italic"
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

                <div className="flex items-center justify-between text-[11px] text-gray-500 px-3">
                  <label className="flex items-center gap-2 italic">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-green-700"
                    />
                    Remember Me
                  </label>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="italic hover:text-green-700 disabled:opacity-60"
                  >
                    {resetLoading ? "Sending..." : "Forgot Password?"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 lg:h-10 bg-gradient-to-r from-cyan-600 to-lime-500 lg:bg-none lg:bg-[#101415] text-white rounded-full text-xs font-black lg:font-medium hover:brightness-110 lg:hover:bg-black transition disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>

                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <div className="h-px bg-gray-400 flex-1" />
                  <span>Or</span>
                  <div className="h-px bg-gray-400 flex-1" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full h-10 lg:h-9 bg-white border border-gray-300 text-[#171717] rounded-full text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="w-full h-10 lg:h-9 bg-[#e4e4e4] text-[#171717] rounded-full text-xs font-medium hover:bg-gray-300 transition"
                >
                  Sign up
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    );
  }

function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-5 4-8 8-8s7 3 8 8H4z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 9V7a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1ZM9 7a3 3 0 0 1 6 0v2H9V7Z" />
    </svg>
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}