"use client";

import Image from "next/image";
import DashboardSearchBar from "@/components/dashboard/DashboardSearchBar";

import type {
  StudentApplication,
  StudentAnnouncement,
  StudentEvent,
  StudentNotification,
  StudentUser,
  StudentView,
} from "../types";

import { useEffect, useRef, useState } from "react";

type Props = {
  firstName: string;
  userRow: StudentUser | null;
  search: string;
  setSearch: (value: string) => void;
  setActiveView: (view: StudentView) => void;

  applications: StudentApplication[];
  events: StudentEvent[];
  announcements: StudentAnnouncement[];

  openEvent: (event: StudentEvent) => void;
  openClub: (application: StudentApplication) => void;

  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  openNotifications: () => void;

  unreadCount: number;
  hasUnreadNotifications: boolean;
  notifications: StudentNotification[];

  openNotification?: (note: StudentNotification | StudentAnnouncement) => void;

  markAllNotificationsAsRead?: () => void;
};

export default function StudentHeader({
  firstName,
  userRow,
  search,
  setSearch,
  setActiveView,
  applications,
  events,
  announcements,
  openEvent,
  openClub,
  showNotifications,
  setShowNotifications,
  openNotifications,
  hasUnreadNotifications,
  notifications,
  unreadCount,
  openNotification,
  markAllNotificationsAsRead,
}: Props) {
  const searchRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const suggestions: {
    id: string;
    kind: "menu" | "club" | "event" | "announcement";
    label: string;
    subtitle?: string;
    tag?: string;
    view: StudentView;
    event?: StudentEvent;
    application?: StudentApplication;
    announcement?: StudentAnnouncement;
  }[] = [
    {
      id: "nav-dashboard",
      kind: "menu" as const,
      label: "Dashboard",
      subtitle: "Go to dashboard",
      tag: "Menu",
      view: "dashboard" as const,
    },
    {
      id: "nav-clubs",
      kind: "menu" as const,
      label: "My Clubs",
      subtitle: "View joined and applied clubs",
      tag: "Menu",
      view: "clubs" as const,
    },
    {
      id: "nav-events",
      kind: "menu" as const,
      label: "Events",
      subtitle: "View club events",
      tag: "Menu",
      view: "events" as const,
    },
    {
      id: "nav-announcements",
      kind: "menu" as const,
      label: "Announcements",
      subtitle: "View announcements",
      tag: "Menu",
      view: "announcement" as const,
    },
    {
      id: "nav-account",
      kind: "menu" as const,
      label: "My Account",
      subtitle: "Edit your profile",
      tag: "Menu",
      view: "account" as const,
    },

    ...applications.map((app) => ({
      id: `club-${app.id}`,
      kind: "club" as const,
      label: app.organizations?.name || "Organization",
      subtitle: app.status
        ? `Club application • ${app.status}`
        : "Club application",
      tag: "Club",
      view: "clubs" as const,
      application: app,
    })),

    ...events.map((event) => ({
      id: `event-${event.id}`,
      kind: "event" as const,
      label: event.title || "Event",
      subtitle: event.venue || "Club event",
      tag: "Event",
      view: "events" as const,
      event,
    })),

    ...announcements.map((note) => ({
      id: `announcement-${note.id}`,
      kind: "announcement" as const,
      label: note.title || "Announcement",
      subtitle: note.message || "Announcement",
      tag: "Announcement",
      view: "announcement" as const,
      announcement: note,
    })),
  ].filter((item) =>
    [item.label, item.subtitle, item.tag]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  function goToSuggestion(item: {
    label: string;
    view: StudentView;
    kind?: "menu" | "club" | "event" | "announcement";
    event?: StudentEvent;
    application?: StudentApplication;
    announcement?: StudentAnnouncement;
  }) {
    setShowNotifications(false);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    if (item.kind === "menu") {
      setActiveView(item.view);
      setSearch("");
      return;
    }

    if (item.kind === "event" && item.event) {
      setSearch(item.label);
      setActiveView("events");
      openEvent(item.event);
      return;
    }

    if (item.kind === "club" && item.application) {
      setSearch(item.label);
      setActiveView("clubs");
      openClub(item.application);
      return;
    }

    if (item.kind === "announcement" && item.announcement) {
      setSearch(item.label);
      setActiveView("announcement");
      openNotification?.(item.announcement);
      return;
    }

    setSearch(item.label);
    setActiveView(item.view);
  }

  return (
    <header className="relative z-30 bg-[#f6fffb] border-b border-cyan-100 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 overflow-visible">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(300px,1fr)_minmax(360px,460px)_minmax(220px,280px)] items-start xl:items-center gap-5 xl:gap-6">
        <div>
          <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
            Student Dashboard
          </p>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black leading-tight text-[#244543]">
            Welcome back, {firstName}
          </h1>

          <p className="text-sm mt-2 text-gray-500">
            Let&apos;s explore your clubs, events, and announcements.
          </p>
        </div>

        <div
          ref={searchRef}
          className="relative z-50 flex items-center gap-3 sm:gap-4 min-w-0 w-full"
        >
          <div className="flex-1 min-w-0 xl:w-[460px] xl:max-w-[40vw] xl:min-w-[340px]">
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

          <button
            type="button"
            onClick={openNotifications}
            className={`relative h-12 w-12 shrink-0 rounded-full flex items-center justify-center border shadow-sm transition ${
              hasUnreadNotifications
                ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white border-transparent"
                : "bg-white text-cyan-700 border-cyan-100 hover:bg-cyan-50"
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Icon name="bell" />

            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-16 right-0 bg-white text-[#202020] rounded-[24px] sm:rounded-[28px] shadow-2xl p-4 w-[min(20rem,calc(100vw-2rem))] z-30 border border-cyan-100">
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-[#244543]">Notifications</p>

                {notifications.some((note) => !note.is_read) && (
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-xs font-extrabold text-cyan-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications yet.</p>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {notifications.slice(0, 5).map((note) => (
                    <button
                      type="button"
                      key={note.id}
                      onClick={() => openNotification?.(note)}
                      className={`w-full text-left rounded-2xl p-4 border transition hover:shadow-sm ${
                        note.is_read
                          ? "bg-[#f6fffb] border-cyan-100 opacity-80"
                          : "bg-cyan-50 border-cyan-200"
                      }`}
                    >
                      <p className="font-black text-sm text-[#244543]">
                        {note.title}
                      </p>

                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {note.message}
                      </p>

                      <p className="text-[11px] text-gray-400 mt-2">
                        {note.created_at
                          ? new Date(note.created_at).toLocaleString()
                          : "No date"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center justify-between xl:justify-end gap-4 min-w-0">
          <div className="text-right min-w-0">
            <p className="font-black text-lg leading-tight text-[#244543] truncate">
              {firstName}
            </p>
            <p className="text-sm text-gray-500">Student</p>
          </div>

          <div className="relative h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[3px] shadow-md shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-white bg-white">
              <Image
                src={userRow?.profile_url || "/lspu-campus.jpg"}
                alt="Profile"
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Icon({ name }: { name: string }) {
  if (name === "search") {
    return (
      <svg
        className="w-5 h-5 text-teal-900"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    );
  }

  if (name === "filter") {
    return (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 7h16M4 17h16" />
        <circle cx="9" cy="7" r="2" />
        <circle cx="15" cy="17" r="2" />
      </svg>
    );
  }

  if (name === "bell") {
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

  return null;
}