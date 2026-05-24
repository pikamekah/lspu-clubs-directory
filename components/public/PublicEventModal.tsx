"use client";

import Image from "next/image";
import type {
  PublicEvent,
  PublicOrganization,
} from "@/app/lib/publicTypes";
import { getCategoryStyle } from "@/app/lib/publicStyles";
import { ScaleIn } from "@/components/dashboard/Animated";

type Props = {
  event: PublicEvent | null;
  orgMap: Record<string, PublicOrganization>;
  onClose: () => void;
};

export default function PublicEventModal({
  event,
  orgMap,
  onClose,
}: Props) {
  if (!event) return null;

  const eventOrg = event.org_id ? orgMap[event.org_id] : undefined;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-3 sm:px-4 py-6">
      <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] max-w-[760px] w-full overflow-hidden shadow-2xl border border-cyan-100 max-h-[90vh] overflow-y-auto">
        <div className="relative h-[220px] sm:h-[280px] overflow-hidden">
          <Image
            src={event.image_url || eventOrg?.banner_url || "/lspu-campus.jpg"}
            alt={event.title || "Event banner"}
            title={event.title || "Event banner"}
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 sm:right-5 top-4 sm:top-5 h-10 w-10 rounded-full bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-600 font-black shadow-md transition"
            aria-label="Close event details"
            title="Close event details"
          >
            ×
          </button>

          <span
            className={`absolute left-4 sm:left-6 top-4 sm:top-6 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-extrabold whitespace-nowrap max-w-[170px] truncate shadow-sm ${getCategoryStyle(
              event.category
            )}`}
          >
            {event.category || "Event"}
          </span>

          <div className="absolute left-5 sm:left-6 right-5 sm:right-6 bottom-5 sm:bottom-6 text-white">
            <p className="text-xs sm:text-sm font-bold text-white/80 line-clamp-1">
              {eventOrg?.name || "Organization"}
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black leading-tight drop-shadow line-clamp-3">
              {event.title || "Event title"}
            </h2>
          </div>
        </div>

        <div className="p-5 sm:p-7 md:p-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <InfoBox label="Date" value={event.date || "TBA"} icon="📅" />
            <InfoBox label="Time" value={event.time || "TBA"} icon="⏰" />
            <InfoBox label="Venue" value={event.venue || "TBA"} icon="📍" />
          </div>

          <div className="mt-8">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Event Details
            </p>

            <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
              {event.description || "No description available."}
            </p>
          </div>
        </div>
      </ScaleIn>
    </div>
  );
}

function InfoBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl p-4 min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white shadow-sm shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wide">
            {label}
          </p>

          <p className="mt-1 font-black text-[#244543] truncate" title={value}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}