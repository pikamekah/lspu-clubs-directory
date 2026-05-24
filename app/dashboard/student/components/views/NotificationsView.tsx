"use client";

import type {
  StudentAnnouncement,
  StudentNotification,
} from "../../types";

import EmptyState from "../shared/EmptyState";
import SectionTitle from "../shared/SectionTitle";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

type DisplayItem = (StudentAnnouncement | StudentNotification) & {
  notification_id?: string;
  is_read?: boolean;
  type?: string;
  created_at?: string;
};

type Props = {
  announcements: DisplayItem[];
  openAnnouncement: (announcement: DisplayItem) => void;
};

function getItemLabel(item: DisplayItem) {
  const type = String(item.type || "").toLowerCase();

  if (type === "membership") return "Membership";
  if (type === "announcement") return "Announcement";

  return "Announcement";
}

function getItemIcon(item: DisplayItem) {
  const type = String(item.type || "").toLowerCase();

  if (type === "membership") return "👤";
  if (type === "announcement") return "📢";

  return "📢";
}

export default function NotificationsView({
  announcements,
  openAnnouncement,
}: Props) {
  return (
    <FadeIn>
      <div className="w-full max-w-[950px] mx-auto">
        <SectionTitle
          title="Notifications"
          subtitle="Unread announcements and student updates are highlighted. Click an item to read it."
        />

        <div className="mt-6 space-y-4">
          {announcements.length === 0 ? (
            <EmptyState
              title="No notifications found."
              message="Announcements, approval updates, and student notifications will appear here."
            />
          ) : (
            announcements.map((note, index) => {
              const unread = note.is_read === false;

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
                    type="button"
                    onClick={() => openAnnouncement(note)}
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
                      {getItemIcon(note)}
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
                          {getItemLabel(note)}
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
                        {note.title || "Notification"}
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