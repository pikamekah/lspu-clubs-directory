"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [checkingUser, setCheckingUser] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkLoggedInUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserRole(null);
      setProfileUrl("");
      setCheckingUser(false);
      return;
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("role, profile_url")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Public navbar profile error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      setUserRole(null);
      setProfileUrl("");
      setCheckingUser(false);
      return;
    }

    setUserRole(userData?.role?.trim() || null);
    setProfileUrl(userData?.profile_url || "");
    setCheckingUser(false);
  }, []);

  useEffect(() => {
    async function runCheckLoggedInUser() {
      await checkLoggedInUser();
    }

    runCheckLoggedInUser();
  }, [checkLoggedInUser]);

  function getDashboardLink() {
    const role = userRole?.trim();

    if (role === "main_admin") return "/dashboard/admin";
    if (role === "officer_admin") return "/dashboard/student";
    if (role === "student") return "/dashboard/student";

    return "/login";
  }

  function getHomeLink() {
    return userRole ? "/home" : "/";
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const homeHref = getHomeLink();

  return (
    <nav className="sticky top-0 z-50 bg-[#f6fffb]/95 backdrop-blur-xl border-b border-cyan-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        <Link href={homeHref} className="flex items-center gap-3 shrink-0">
          <div className="h-11 w-11 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white font-black shadow-md">
            U
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black leading-none text-[#244543]">
              Uni<span className="text-lime-500">Link</span>
            </h1>

            <p className="hidden sm:block text-xs text-gray-500 mt-1">
              LSPU Clubs Directory
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-3 text-sm font-extrabold">
          {checkingUser ? (
            <div className="h-10 w-[360px] rounded-full bg-cyan-100 animate-pulse" />
          ) : (
            <>
              <NavLink
                href={homeHref}
                label="Home"
                active={isActive(homeHref)}
              />

              {userRole ? (
                <>
                  <NavLink
                    href="/organizations"
                    label="Organizations"
                    active={isActive("/organizations")}
                  />

                  <NavLink
                    href="/events"
                    label="Events"
                    active={isActive("/events")}
                  />
                </>
              ) : (
                <>
                  <NavLink
                    href="/about"
                    label="About Us"
                    active={isActive("/about")}
                  />

                  <NavLink
                    href="/resources"
                    label="Resources"
                    active={isActive("/resources")}
                  />

                  <NavLink
                    href="/contact"
                    label="Contact"
                    active={isActive("/contact")}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {checkingUser ? (
            <div className="h-11 w-11 rounded-full bg-cyan-100 animate-pulse" />
          ) : userRole ? (
            <button
              type="button"
              onClick={() => router.push(getDashboardLink())}
              title="Open dashboard"
              aria-label="Open dashboard"
              className="group flex items-center gap-3 rounded-full bg-white border border-cyan-100 pl-2 sm:pl-3 pr-2 sm:pr-4 py-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <span className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt="Profile"
                    title="Profile"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <ProfileIcon />
                )}
              </span>

              <span className="hidden sm:block text-sm font-black text-[#244543] group-hover:text-cyan-700">
                My Profile
              </span>
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:inline-flex px-5 py-2.5 rounded-full border border-cyan-100 bg-white text-cyan-700 font-extrabold hover:bg-cyan-50 transition"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-extrabold hover:brightness-110 transition"
              >
                Sign up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden h-11 w-11 rounded-full bg-white border border-cyan-100 text-[#244543] shadow-sm flex items-center justify-center hover:bg-cyan-50 transition"
            aria-label="Toggle menu"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyan-100 bg-[#f6fffb]/98 backdrop-blur-xl px-4 sm:px-6 pb-5">
          <div className="pt-4 space-y-2">
            {checkingUser ? (
              <div className="space-y-3">
                <div className="h-12 rounded-2xl bg-cyan-100 animate-pulse" />
                <div className="h-12 rounded-2xl bg-cyan-100 animate-pulse" />
                <div className="h-12 rounded-2xl bg-cyan-100 animate-pulse" />
              </div>
            ) : (
              <>
                <MobileNavLink
                  href={homeHref}
                  label="Home"
                  active={isActive(homeHref)}
                  onClick={() => setMobileMenuOpen(false)}
                />

                {userRole ? (
                  <>
                    <MobileNavLink
                      href="/organizations"
                      label="Organizations"
                      active={isActive("/organizations")}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileNavLink
                      href="/events"
                      label="Events"
                      active={isActive("/events")}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push(getDashboardLink());
                      }}
                      className="w-full text-left px-5 py-3 rounded-2xl font-extrabold text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 transition"
                    >
                      My Profile
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink
                      href="/about"
                      label="About Us"
                      active={isActive("/about")}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileNavLink
                      href="/resources"
                      label="Resources"
                      active={isActive("/resources")}
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <MobileNavLink
                      href="/contact"
                      label="Contact"
                      active={isActive("/contact")}
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

function NavLink({
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
      className={`px-5 py-2.5 rounded-full transition ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
      }`}
    >
      {label}
    </Link>
  );
}

function ProfileIcon() {
  return (
    <svg
      className="h-6 w-6 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-5 4-8 8-8s7 3 8 8H4z" />
    </svg>
  );
}

function MobileNavLink({
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