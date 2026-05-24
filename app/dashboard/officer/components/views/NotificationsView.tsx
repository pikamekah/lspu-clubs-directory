"use client";

import DashboardCard from "../shared/DashboardCard";
import EmptyState from "../shared/EmptyState";
import SectionTitle from "../shared/SectionTitle";
import type { OfficerNotification } from "../../types";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

type Props = {
  notifications: OfficerNotification[];
  openNotification: (note: OfficerNotification) => void;
  markAllNotificationsAsRead: () => void;
};

function getNotificationMeta(type?: string) {
  const key = String(type || "").toLowerCase();

  if (key === "announcement") {
    return {
      label: "Announcement",
      icon: "📢",
    };
  }

  if (key === "application") {
    return {
      label: "Application",
      icon: "👤",
    };
  }

  return {
    label: "Notification",
    icon: "🔔",
  };
}

export default function NotificationsView({
  notifications,
  openNotification,
  markAllNotificationsAsRead,
}: Props) {
  const unreadCount = notifications.filter((note) => !note.is_read).length;

  return (
    <FadeIn>
      <div className="w-full max-w-[950px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-start gap-4 sm:gap-5 mb-6">
          <div>
            <SectionTitle
              title="Notifications"
              subtitle="Review officer alerts, application updates, and announcements."
            />

            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                You have{" "}
                <span className="font-extrabold text-cyan-700">
                  {unreadCount}
                </span>{" "}
                unread notification{unreadCount > 1 ? "s" : ""}.
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="bg-white border border-cyan-100 text-cyan-700 px-5 py-2.5 rounded-full text-sm font-extrabold hover:bg-cyan-50 transition shadow-sm"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <DashboardCard>
              <EmptyState message="Officer alerts, application updates, and announcements will appear here." />
            </DashboardCard>
          ) : (
            notifications.map((note, index) => {
              const unread = !note.is_read;
              const meta = getNotificationMeta(note.type);

              return (
                <StaggerItem
                  key={note.notification_id || note.id}
                  delay={
                    index % 4 === 0
                      ? "delay-0"
                      : index % 4 === 1
                      ? "delay-100"
                      : index % 4 === 2
                      ? "delay-200"
                      : "delay-300"
                  }
                >
                  <button
                    key={note.notification_id || note.id}
                    type="button"
                    onClick={() => openNotification(note)}
                    className={`group w-full text-left rounded-[24px] sm:rounded-[28px] px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 border shadow-sm transition hover:shadow-lg hover:-translate-y-0.5 ${
                      unread
                        ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white border-transparent"
                        : "bg-white text-[#202020] border-cyan-100 hover:bg-cyan-50/40"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0 self-start sm:self-center ${
                        unread
                          ? "bg-white/20 text-white"
                          : "bg-[#f6fffb] text-cyan-700 border border-cyan-100"
                      }`}
                    >
                      {meta.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${
                            unread
                              ? "bg-white/20 text-white"
                              : "bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {meta.label}
                        </span>

                        {unread && (
                          <span className="h-2.5 w-2.5 rounded-full bg-white shrink-0" />
                        )}
                      </div>

                      <p
                        className={`mt-2 font-black text-base truncate ${
                          unread ? "text-white" : "text-[#244543]"
                        }`}
                      >
                        {note.title || "New notification"}
                      </p>

                      <p
                        className={`text-sm mt-1 line-clamp-2 leading-relaxed ${
                          unread ? "text-white/90" : "text-gray-500"
                        }`}
                      >
                        {note.message || "No message available."}
                      </p>

                      {note.created_at && (
                        <p
                          className={`text-xs mt-2 font-semibold ${
                            unread ? "text-white/75" : "text-gray-400"
                          }`}
                        >
                          {new Date(note.created_at).toLocaleString("en-PH")}
                        </p>
                      )}
                    </div>

                    <span
                      className={`text-xs px-4 py-1.5 rounded-full font-extrabold shrink-0 self-start sm:self-center ${
                        unread
                          ? "bg-white text-cyan-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {unread ? "Unread" : "Read"}
                    </span>
                  </button>
                </StaggerItem>
              );
            })
          )}
        </div>
      </div>
    </FadeIn>
  );
}