"use client";

import Link from "next/link";
import type { AdminView } from "../types";

type Props = {
  activeView: AdminView;
  setActiveView: (view: AdminView) => void;
  logout: () => void;
};

export default function AdminSidebar({
  activeView,
  setActiveView,
  logout,
}: Props) {
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
                Main Administrator
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

      <nav className="w-full px-4 pb-4 lg:pb-0 lg:space-y-2 overflow-x-auto lg:overflow-visible overscroll-x-contain">
        <div className="flex lg:block gap-2 w-max lg:w-full">
          <SideButton
            active={activeView === "dashboard"}
            label="Dashboard"
            icon="dashboard"
            onClick={() => setActiveView("dashboard")}
          />

          <SideButton
            active={activeView === "users"}
            label="Students"
            icon="students"
            onClick={() => setActiveView("users")}
          />

          <SideButton
            active={activeView === "organizations"}
            label="Organizations"
            icon="organizations"
            onClick={() => setActiveView("organizations")}
          />

          <SideButton
            active={activeView === "events"}
            label="Events"
            icon="events"
            onClick={() => setActiveView("events")}
          />

          <SideButton
            active={activeView === "announcement"}
            label="Announcement"
            icon="announcement"
            onClick={() => setActiveView("announcement")}
          />

          <SideButton
            active={activeView === "contacts"}
            label="Contact Messages"
            icon="contacts"
            onClick={() => setActiveView("contacts")}
          />
        </div>
      </nav>

      <div className="hidden lg:block mt-auto px-4 pb-6">
        <button
          type="button"
          onClick={logout}
          className="w-full h-[48px] flex items-center gap-4 px-5 text-left text-sm font-extrabold rounded-2xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
        >
          <Icon name="logout" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

type SideButtonProps = {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
};

function SideButton({
  active,
  label,
  icon,
  onClick,
}: SideButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[46px] lg:h-[50px] flex items-center gap-3 lg:gap-4 px-4 lg:px-5 text-left text-xs lg:text-sm font-extrabold rounded-2xl transition whitespace-nowrap shrink-0 lg:shrink lg:w-full ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-md"
          : "text-gray-500 hover:bg-cyan-50 hover:text-cyan-700"
      }`}
    >
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  );
}

function Icon({ name }: { name: string }) {
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

  if (name === "students") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1-5 4-8 8-8s7 3 8 8H4z" />
      </svg>
    );
  }

  if (name === "organizations") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3 20c.6-4 3-7 6-7s5.4 3 6 7H3z" />
        <path d="M13 20c.4-3 2-5 4-5s3.5 2 4 5h-8z" />
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
      >
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    );
  }

  if (name === "announcement") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 5h16v12H7l-3 3z" />
      </svg>
    );
  }

  if (name === "contacts") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 5h16v14H4z" />
        <path d="M4 7l8 6 8-6" />
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
      >
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 3v18h-8" />
      </svg>
    );
  }

  return null;
}