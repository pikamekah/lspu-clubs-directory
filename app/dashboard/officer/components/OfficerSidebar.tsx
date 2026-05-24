"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { OfficerView } from "../types";

type Props = {
  activeView: OfficerView;
  setActiveView: (view: OfficerView) => void;
  logout: () => void;
};

export default function OfficerSidebar({
  activeView,
  setActiveView,
  logout,
}: Props) {
  const router = useRouter();

  return (
    <aside className="w-full lg:fixed lg:left-0 lg:top-0 lg:z-40 lg:w-[260px] lg:h-screen bg-white flex flex-col shrink-0 shadow-sm border-b lg:border-b-0 lg:border-r border-cyan-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-5 lg:pt-9 pb-4 lg:pb-8">
        <div className="flex items-center justify-between gap-4 lg:block">
          <Link href="/home" className="flex items-center gap-3">
            <div className="h-11 w-11 lg:h-12 lg:w-12 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[3px] shadow-md shrink-0">
              <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                <span className="text-lg font-black bg-gradient-to-r from-cyan-600 to-lime-500 bg-clip-text text-transparent">
                  U
                </span>
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="font-black text-xl lg:text-2xl leading-none bg-gradient-to-r from-cyan-600 to-lime-500 text-transparent bg-clip-text">
                UniLink
              </h1>

              <p className="text-gray-500 text-xs mt-1">
                Officer Dashboard
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="lg:hidden h-10 px-4 rounded-full bg-red-50 text-red-600 text-xs font-extrabold hover:bg-red-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <nav className="px-4 pb-4 lg:pb-0 lg:space-y-2 overflow-x-auto lg:overflow-visible">
        <div className="flex lg:block gap-2 min-w-max lg:min-w-0">
          <SideButton
            active={activeView === "dashboard"}
            label="Dashboard"
            icon="dashboard"
            onClick={() => setActiveView("dashboard")}
          />

          <SideButton
            active={activeView === "application"}
            label="Applications"
            icon="application"
            onClick={() => setActiveView("application")}
          />

          <SideButton
            active={activeView === "events"}
            label="Events"
            icon="events"
            onClick={() => setActiveView("events")}
          />

          <SideButton
            active={activeView === "members"}
            label="Members"
            icon="members"
            onClick={() => setActiveView("members")}
          />

          <SideButton
            active={activeView === "notifications"}
            label="Notifications"
            icon="notifications"
            onClick={() => setActiveView("notifications")}
          />

          <div className="hidden lg:block px-4 py-4">
            <div className="border-b border-cyan-100" />
          </div>

          <SideButton
            active={activeView === "club"}
            label="My Club"
            icon="club"
            onClick={() => setActiveView("club")}
          />

          <SideButton
            active={false}
            label="Student Dashboard"
            icon="dashboard"
            onClick={() => router.push("/dashboard/student")}
          />
        </div>
      </nav>

      <div className="hidden lg:block mt-auto px-4 pb-6">
        <button
          type="button"
          onClick={logout}
          className="w-full h-[48px] flex items-center gap-4 px-5 text-left text-sm font-extrabold rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <SideIcon name="logout" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function SideButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[46px] lg:h-[50px] flex items-center gap-3 lg:gap-4 px-4 lg:px-5 text-left text-xs lg:text-sm font-extrabold rounded-2xl transition whitespace-nowrap lg:w-full ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-md"
          : "text-gray-500 hover:bg-cyan-50 hover:text-cyan-700"
      }`}
    >
      <SideIcon name={icon} />
      <span>{label}</span>
    </button>
  );
}

function SideIcon({ name }: { name: string }) {
  const common = "w-5 h-5 shrink-0";

  if (name === "dashboard") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (name === "application") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 3h10v18H7z" />
        <path d="M9 7h6M9 11h6M9 15h4" />
      </svg>
    );
  }

  if (name === "events") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    );
  }

  if (name === "members") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3 20c.6-4 3-7 6-7s5.4 3 6 7H3z" />
        <path d="M13 20c.4-3 2-5 4-5s3.5 2 4 5h-8z" />
      </svg>
    );
  }

  if (name === "notifications") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (name === "club") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M7 9h10v2H7zM7 13h6v2H7z" fill="white" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18h-8" />
      </svg>
    );
  }

  return null;
}