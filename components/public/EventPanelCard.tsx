"use client";

import Image from "next/image";
import { getCategoryStyle } from "@/app/lib/publicStyles";
import type { PublicEvent } from "@/app/lib/publicTypes";

type Props = {
  event: PublicEvent;
  orgName: string;
  image: string;
  onClick: () => void;
};

export default function EventPanelCard({
  event,
  orgName,
  image,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left overflow-hidden rounded-[30px] bg-white border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
    >
      <div className="relative h-[180px] overflow-hidden">
        <Image
          src={image || "/lspu-campus.jpg"}
          alt={event.title || "Event banner"}
          title={event.title || "Event banner"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <span
          className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full h-fit font-extrabold shadow-sm whitespace-nowrap ${getCategoryStyle(
            event.category
          )}`}
        >
          {event.category || "Event"}
        </span>

        <div className="absolute left-5 bottom-4 right-5">
          <p className="text-xs font-bold text-white/80 line-clamp-1">
            {orgName || "Organization Name"}
          </p>

          <h3 className="mt-1 font-black text-xl text-white leading-tight drop-shadow line-clamp-2">
            {event.title || "Event Name"}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[44px]">
          {event.description || "No description available."}
        </p>

        <div className="mt-5 grid gap-2 text-sm text-gray-600">
          <InfoLine label="Date" value={event.date || "TBA"} />
          <InfoLine label="Time" value={event.time || "TBA"} />
          <InfoLine label="Venue" value={event.venue || "TBA"} />
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-cyan-700 group-hover:text-lime-600 transition">
          View Event
          <span className="group-hover:translate-x-1 transition">→</span>
        </div>
      </div>
    </button>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="line-clamp-1">
      <span className="font-black text-[#244543]">{label}:</span> {value}
    </p>
  );
}