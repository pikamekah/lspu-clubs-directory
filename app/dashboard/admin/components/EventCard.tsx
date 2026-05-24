"use client";

import Image from "next/image";
import type { AdminEvent } from "../types";

type Props = {
  event: AdminEvent;
  orgName: string;
  onEdit: () => void;
  onDelete: () => void;
};

function getCategoryStyle(category?: string) {
  const key = (category || "").toLowerCase();

  if (key === "seminar") return "bg-[#F1C5AE] text-[#4F2B21]";
  if (key === "workshop") return "bg-[#ECDDD0] text-[#4B372C]";
  if (key === "competition") return "bg-[#CED2C2] text-[#35455D]";
  if (key === "recruitment") return "bg-[#92B1B6] text-[#102B33]";
  if (key === "meeting") return "bg-[#35455D] text-white";
  if (key === "social") return "bg-[#BFD1DF] text-[#26384A]";

  return "bg-[#35455D] text-white";
}

function isPastEvent(date?: string) {
  if (!date) return false;

  const today = new Date().toISOString().split("T")[0];
  return date < today;
}

export default function EventCard({
  event,
  orgName,
  onEdit,
  onDelete,
}: Props) {
  const past = isPastEvent(event.date);

  return (
    <article className="group bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
      <div className="relative h-[175px] sm:h-[190px] overflow-hidden">
        <Image
          src={event.image_url || "/lspu-campus.jpg"}
          alt={event.title || "Event banner"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          <span
            className={`inline-flex items-center justify-center min-w-[72px] h-8 px-4 rounded-full text-xs font-black whitespace-nowrap shadow-sm ${getCategoryStyle(
              event.category
            )}`}
          >
            {event.category || "Event"}
          </span>

          <span
            className={`inline-flex items-center justify-center h-7 px-3 rounded-full text-[11px] font-black shadow-sm ${
              past
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-cyan-50 text-cyan-700 border border-cyan-100"
            }`}
          >
            {past ? "Past" : "Upcoming"}
          </span>
        </div>

        <div className="absolute left-5 right-5 bottom-5 text-white">
          <p className="text-xs font-bold text-white/80 line-clamp-1">
            {orgName || "Organization"}
          </p>

          <h3 className="mt-1 text-xl sm:text-2xl font-black leading-tight line-clamp-2 drop-shadow">
            {event.title || "Event Name"}
          </h3>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px]">
          {event.description || "No description added yet."}
        </p>

        <div className="grid grid-cols-1 gap-3 mt-5">
          <InfoBox label="Date" value={event.date || "TBA"} />
          <InfoBox label="Time" value={event.time || "TBA"} />
          <InfoBox label="Venue" value={event.venue || "TBA"} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-lime-500 hover:brightness-110 text-white py-2.5 rounded-full text-sm font-black transition shadow-sm"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex-1 bg-red-500/90 text-white border border-red-500 hover:bg-red-600 py-2.5 rounded-full text-sm font-black transition shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-3">
      <p className="text-[11px] text-gray-400 font-black uppercase tracking-wide">
        {label}
      </p>

      <p
        className="mt-1 text-sm font-black text-[#244543] line-clamp-1"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}