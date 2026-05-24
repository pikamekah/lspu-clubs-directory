"use client";

import type { AdminAnnouncement } from "../types";

type Props = {
  note: AdminAnnouncement;
  onEdit: () => void;
  onDelete: () => void;
};

function getTargetLabel(note: AdminAnnouncement) {
  const targetType = String(note.target_type || "").toLowerCase();

  if (targetType === "all") return "Everyone";
  if (targetType === "officers") return "Officers";
  if (targetType === "organization") return "Organization";

  return "Announcement";
}

function getTargetStyle(note: AdminAnnouncement) {
  const targetType = String(note.target_type || "").toLowerCase();

  if (targetType === "all") {
    return "bg-cyan-50 text-cyan-700 border border-cyan-100";
  }

  if (targetType === "officers") {
    return "bg-[#ECDDD0] text-[#4B372C] border border-[#E5CBB9]";
  }

  if (targetType === "organization") {
    return "bg-[#CED2C2] text-[#35455D] border border-[#BCC2B1]";
  }

  return "bg-gray-100 text-gray-600 border border-gray-200";
}

export default function AnnouncementCard({
  note,
  onEdit,
  onDelete,
}: Props) {
  const dateLabel = note.created_at
    ? new Date(note.created_at).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No date";

  return (
    <article className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col min-h-[240px]">
      <div className="flex items-start justify-between gap-3">
        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#f6fffb] border border-cyan-100 flex items-center justify-center text-lg sm:text-xl shrink-0">
          📢
        </div>

        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wide whitespace-nowrap ${getTargetStyle(
            note
          )}`}
        >
          {getTargetLabel(note)}
        </span>
      </div>

      <div className="mt-5 flex-1 min-w-0">
        <h3
          className="text-lg sm:text-xl font-black leading-tight text-[#244543] line-clamp-2"
          title={note.title || "Announcement"}
        >
          {note.title || "Announcement"}
        </h3>

        <p className="text-xs text-gray-400 font-bold mt-2">{dateLabel}</p>

        <p className="text-sm text-gray-600 mt-4 line-clamp-4 leading-relaxed break-words">
          {note.message || "No message available."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="button"
          onClick={onEdit}
          className="w-full sm:flex-1 bg-gradient-to-r from-cyan-600 to-lime-500 hover:brightness-110 text-white py-2.5 rounded-full text-sm font-black transition shadow-sm"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="w-full sm:flex-1 bg-red-500/90 text-white border border-red-500 hover:bg-red-600 py-2.5 rounded-full text-sm font-black transition shadow-sm"
        >
          Delete
        </button>
      </div>
    </article>
  );
}