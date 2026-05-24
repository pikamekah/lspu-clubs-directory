"use client";

import ContentPanel from "../ContentPanel";
import AnnouncementCard from "../AnnouncementCard";
import type { AdminAnnouncement } from "../../types";

type Props = {
  filteredAnnouncements: AdminAnnouncement[];
  announcementFilter: string;
  setAnnouncementFilter: (value: string) => void;
  setShowAnnouncementModal: (show: boolean) => void;
  setEditingAnnouncement: (note: AdminAnnouncement) => void;
  deleteAnnouncement: (note: AdminAnnouncement) => void;
};

const announcementFilters = [
  { label: "All", value: "all_view" },
  { label: "Everyone", value: "all" },
  { label: "Officers", value: "officers" },
  { label: "Organization", value: "organization" },
];

export default function AnnouncementsView({
  filteredAnnouncements,
  announcementFilter,
  setAnnouncementFilter,
  setShowAnnouncementModal,
  setEditingAnnouncement,
  deleteAnnouncement,
}: Props) {
  return (
    <ContentPanel
      title="Announcements"
      subtitle="Create and manage announcements for students, officers, and organizations."
      onCreate={() => setShowAnnouncementModal(true)}
    >
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-wide text-gray-400 mb-3">
          Filter by Target
        </p>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
          {announcementFilters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setAnnouncementFilter(item.value)}
              className={`shrink-0 px-4 py-2 rounded-full font-black text-xs transition shadow-sm ${
                announcementFilter === item.value
                  ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white"
                  : "bg-[#f6fffb] border border-cyan-100 text-cyan-700 hover:bg-cyan-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="bg-[#f6fffb] border border-cyan-100 rounded-[24px] p-8 text-center">
          <p className="font-black text-[#244543]">
            No announcements found
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Try changing the filter or create a new announcement.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {filteredAnnouncements.map((note) => (
            <AnnouncementCard
              key={note.announcement_group || note.id}
              note={note}
              onEdit={() => setEditingAnnouncement(note)}
              onDelete={() => deleteAnnouncement(note)}
            />
          ))}
        </div>
      )}
    </ContentPanel>
  );
}