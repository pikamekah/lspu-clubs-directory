"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";

import type {
  OfficerView,
  MemberApplication,
  OfficerEvent,
  OfficerUser,
  OfficerNotification,
} from "../types";

type OfficerSuggestion = {
  id: string;
  kind: "menu" | "application" | "member" | "event";
  label: string;
  subtitle?: string;
  tag?: string;
  view: OfficerView;
};

type Props = {
  userRow: OfficerUser | null;
  search: string;
  setSearch: (value: string) => void;
  setActiveView: (view: OfficerView) => void;
  applications: MemberApplication[];
  members: MemberApplication[];
  events: OfficerEvent[];

  notifications: OfficerNotification[];
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  toggleNotifications: () => void;
  openNotification: (note: OfficerNotification) => void;
  markAllNotificationsAsRead: () => void;
};

export default function OfficerHeader({
  userRow,
  search,
  setSearch,
  setActiveView,
  applications,
  members,
  events,
  notifications,
  showNotifications,
  setShowNotifications,
  toggleNotifications,
  openNotification,
  markAllNotificationsAsRead,
}: Props) {
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const unreadNotifications = notifications.filter((note) => !note.is_read);
  const hasUnreadNotifications = unreadNotifications.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSuggestions(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowNotifications]);

  const rawSuggestions: OfficerSuggestion[] = [
    {
      id: "nav-dashboard",
      kind: "menu",
      label: "Dashboard",
      subtitle: "Go to dashboard",
      tag: "Menu",
      view: "dashboard",
    },
    {
      id: "nav-applications",
      kind: "menu",
      label: "Applications",
      subtitle: "View membership applications",
      tag: "Menu",
      view: "application",
    },
    {
      id: "nav-events",
      kind: "menu",
      label: "Events",
      subtitle: "View organization events",
      tag: "Menu",
      view: "events",
    },
    {
      id: "nav-members",
      kind: "menu",
      label: "Members",
      subtitle: "View approved members",
      tag: "Menu",
      view: "members",
    },
    {
      id: "nav-notifications",
      kind: "menu",
      label: "Notifications",
      subtitle: "View notifications",
      tag: "Menu",
      view: "notifications",
    },
    {
      id: "nav-club",
      kind: "menu",
      label: "My Club",
      subtitle: "Edit organization profile",
      tag: "Menu",
      view: "club",
    },

    ...applications.map((app) => ({
      id: `application-${app.id}`,
      kind: "application" as const,
      label:
        app.full_name ||
        app.name ||
        `${app.first_name || ""} ${app.last_name || ""}`.trim() ||
        "Application",
      subtitle: app.status ? `Application • ${app.status}` : "Application",
      tag: "Application",
      view: "application" as const,
    })),

    ...members.map((member) => ({
      id: `member-${member.id}`,
      kind: "member" as const,
      label:
        member.full_name ||
        member.name ||
        `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
        "Member",
      subtitle: member.role ? `Member • ${member.role}` : "Member",
      tag: "Member",
      view: "members" as const,
    })),

    ...events.map((event) => ({
      id: `event-${event.id}`,
      kind: "event" as const,
      label: event.title || "Event",
      subtitle: event.venue || "Organization event",
      tag: event.category || "Event",
      view: "events" as const,
    })),
  ];

  const suggestions = Array.from(
    new Map(
      rawSuggestions.map((item) => [
        `${item.label.toLowerCase()}-${item.view}`,
        item,
      ])
    ).values()
  ).filter((item) =>
    [item.label, item.subtitle, item.tag]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  function goToSuggestion(item: {
    label: string;
    view: OfficerView;
    kind?: "menu" | "application" | "member" | "event";
  }) {
    setActiveView(item.view);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    if (item.kind === "menu") {
      setSearch("");
      return;
    }

    setSearch(item.label);
  }

  const displayName =
    userRow?.first_name ||
    userRow?.full_name?.split(" ")[0] ||
    userRow?.email?.split("@")[0] ||
    "Officer";

  return (
    <header className="relative z-30 bg-[#f6fffb] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 overflow-visible border-b border-cyan-100">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(300px,1fr)_minmax(420px,520px)_minmax(220px,280px)] items-start xl:items-center gap-5 xl:gap-6">
        <div className="min-w-0">
          <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
            Officer Dashboard
          </p>

          <h1 className="mt-4 text-2xl sm:text-[32px] font-black leading-[1.08] text-[#244543]">
            Welcome back,
            <br />
            {displayName}
          </h1>

          <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-[340px]">
            Manage your organization, applications, events, and members.
          </p>
        </div>

        <div className="relative z-50 w-full min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 w-full min-w-0">
            <div ref={searchRef} className="relative flex-1 min-w-0">
              <DashboardSearchBar
                search={search}
                setSearch={setSearch}
                showSuggestions={showSuggestions}
                setShowSuggestions={setShowSuggestions}
                selectedSuggestionIndex={selectedSuggestionIndex}
                setSelectedSuggestionIndex={setSelectedSuggestionIndex}
                suggestions={suggestions}
                placeholder="Search here..."
                onSearch={() => {
                  const firstRealSuggestion =
                    suggestions.find((item) => item.kind !== "menu") ||
                    suggestions[0];

                  if (firstRealSuggestion) {
                    goToSuggestion(firstRealSuggestion);
                  }
                }}
                onOpenSuggestion={goToSuggestion}
                onClear={() => {
                  setSearch("");
                  setShowSuggestions(false);
                  setSelectedSuggestionIndex(-1);
                }}
              />
            </div>

            <div ref={notificationRef} className="relative shrink-0">
              <button
                type="button"
                onClick={toggleNotifications}
                className={`relative h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center border-2 shadow-sm transition ${
                  hasUnreadNotifications
                    ? "bg-white text-cyan-700 border-cyan-100"
                    : "bg-white text-cyan-700 border-cyan-100 hover:bg-cyan-50"
                }`}
                title="Notifications"
                aria-label="Notifications"
              >
                <BellIcon />

                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 min-w-5 px-1 rounded-full flex items-center justify-center border-2 border-white">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-14 sm:top-16 right-0 bg-white text-[#202020] rounded-[24px] sm:rounded-3xl shadow-2xl p-4 w-[min(20rem,calc(100vw-2rem))] z-50 border border-cyan-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-black text-[#244543]">Notifications</p>

                    {hasUnreadNotifications && (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-black text-cyan-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No notifications yet.
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {notifications.slice(0, 5).map((note) => {
                        const type = String(note.type || "").toLowerCase();

                        const label =
                          type === "announcement"
                            ? "Announcement"
                            : type === "application"
                            ? "Application"
                            : "Notification";

                        return (
                          <button
                            type="button"
                            key={note.id}
                            onClick={() => openNotification(note)}
                            className={`w-full text-left rounded-2xl p-4 border transition hover:shadow-sm ${
                              note.is_read
                                ? "bg-[#f6fffb] border-cyan-100 opacity-80"
                                : "bg-cyan-50 border-cyan-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="inline-flex px-2.5 py-1 rounded-full bg-white text-cyan-700 border border-cyan-100 text-[10px] font-black uppercase">
                                {label}
                              </span>

                              {!note.is_read && (
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                              )}
                            </div>

                            <p className="font-black text-sm text-[#244543] line-clamp-1">
                              {note.title || "Notification"}
                            </p>

                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {note.message || "No message available."}
                            </p>

                            <p className="text-[11px] text-gray-400 mt-2">
                              {note.created_at
                                ? new Date(note.created_at).toLocaleString("en-PH")
                                : "No date"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between xl:justify-end gap-3 sm:gap-4 min-w-0">
          <div className="text-left xl:text-right min-w-0">
            <p className="text-[#244543] font-black text-sm sm:text-base leading-tight max-w-[220px] xl:max-w-[170px] break-words">
              {userRow?.full_name || displayName}
            </p>

            <p className="text-gray-500 text-sm">Officer</p>
          </div>

          <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[3px] shadow-md shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-white">
              <Image
                src={userRow?.profile_url || "/lspu-campus.jpg"}
                alt={`${displayName} profile`}
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}