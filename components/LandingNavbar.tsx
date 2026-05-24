"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabaseClient";

type Props = {
  activePage?:
    | "home"
    | "about"
    | "resources"
    | "organizations"
    | "events"
    | "contact"
    | "privacy";
};

export default function LandingNavbar({ activePage }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(Boolean(data.session));
      setCheckingUser(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      setCheckingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const homeHref = isLoggedIn ? "/home" : "/";

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 flex items-center justify-between gap-4 text-white">
        <Link href={homeHref} className="flex items-center gap-3 shrink-0">
          <div className="h-11 w-11 rounded-full bg-white/15 border border-white/40 flex items-center justify-center font-extrabold shadow-md">
            U
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold leading-none">
              UniLink
            </h1>

            <p className="hidden sm:block text-xs text-white/75 mt-1">
              LSPU Clubs Directory
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold">
          {checkingUser ? (
            <div className="h-8 w-[360px] rounded-full bg-white/20 animate-pulse" />
          ) : (
            <>
              <LandingLink
                href={homeHref}
                label="Home"
                active={activePage === "home"}
              />

              {isLoggedIn ? (
                <>
                  <LandingLink
                    href="/organizations"
                    label="Organizations"
                    active={activePage === "organizations"}
                  />

                  <LandingLink
                    href="/events"
                    label="Events"
                    active={activePage === "events"}
                  />
                </>
              ) : (
                <>
                  <LandingLink
                    href="/about"
                    label="About Us"
                    active={activePage === "about"}
                  />

                  <LandingLink
                    href="/resources"
                    label="Resources"
                    active={activePage === "resources"}
                  />

                  <LandingLink
                    href="/contact"
                    label="Contact"
                    active={activePage === "contact"}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {checkingUser ? (
            <div className="hidden sm:block h-10 w-[120px] rounded-full bg-white/20 animate-pulse" />
          ) : isLoggedIn ? (
            <Link
              href="/dashboard/student"
              className="hidden sm:inline-flex px-5 py-2.5 rounded-full bg-white text-cyan-700 font-extrabold hover:bg-lime-100 transition shadow-sm"
            >
              My Profile
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-full border border-white/50 text-white font-bold hover:bg-white hover:text-cyan-700 transition"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-full bg-white text-cyan-700 font-extrabold hover:bg-lime-100 transition shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden h-11 w-11 rounded-full bg-white/15 border border-white/40 text-white flex items-center justify-center shadow-sm hover:bg-white/25 transition"
            aria-label="Toggle menu"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mx-4 sm:mx-6 rounded-[28px] bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl overflow-hidden">
          <div className="p-3 space-y-1">
            {checkingUser ? (
              <>
                <div className="h-12 rounded-2xl bg-cyan-100 animate-pulse" />
                <div className="h-12 rounded-2xl bg-cyan-100 animate-pulse" />
                <div className="h-12 rounded-2xl bg-cyan-100 animate-pulse" />
              </>
            ) : (
              <>
                <MobileLandingLink
                  href={homeHref}
                  label="Home"
                  active={activePage === "home"}
                  onClick={() => setMobileMenuOpen(false)}
                />

                {isLoggedIn ? (
                  <>
                    <MobileLandingLink
                      href="/organizations"
                      label="Organizations"
                      active={activePage === "organizations"}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileLandingLink
                      href="/events"
                      label="Events"
                      active={activePage === "events"}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileLandingLink
                      href="/dashboard/student"
                      label="My Profile"
                      active={false}
                      onClick={() => setMobileMenuOpen(false)}
                    />
                  </>
                ) : (
                  <>
                    <MobileLandingLink
                      href="/about"
                      label="About Us"
                      active={activePage === "about"}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileLandingLink
                      href="/resources"
                      label="Resources"
                      active={activePage === "resources"}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileLandingLink
                      href="/contact"
                      label="Contact"
                      active={activePage === "contact"}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center px-5 py-3 rounded-full border border-cyan-100 bg-white text-cyan-700 font-extrabold hover:bg-cyan-50 transition"
                      >
                        Log in
                      </Link>

                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center px-5 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-extrabold hover:brightness-110 transition"
                      >
                        Sign up
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function LandingLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "text-lime-300 transition"
          : "hover:text-lime-300 transition"
      }
    >
      {label}
    </Link>
  );
}

function MobileLandingLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-5 py-3 rounded-2xl font-extrabold transition ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
      }`}
    >
      {label}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}