"use client";

import Image from "next/image";
import { useState } from "react";
import { getCategoryStyle } from "@/app/lib/publicStyles";

type OrganizationEvent = {
  id: string;
  org_id?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  time?: string;
  venue?: string;
  image_url?: string;
};

type Props = {
  events: OrganizationEvent[];
  orgName?: string;
  orgBannerUrl?: string;
};

function formatDate(date?: string) {
  if (!date) return "TBA";

  return new Date(date).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrganizationEventsList({
  events,
  orgName,
  orgBannerUrl,
}: Props) {
  const [selectedEvent, setSelectedEvent] =
    useState<OrganizationEvent | null>(null);

  return (
    <section className="bg-white px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
            Club Activities
          </p>

          <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-black text-[#244543]">
            Upcoming Events
          </h2>

          <p className="mt-3 text-gray-600">
            View upcoming activities organized by {orgName || "this club"}.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-[#f8fffb] rounded-[24px] sm:rounded-[28px] p-7 sm:p-10 border border-cyan-100 text-gray-600 text-center">
            No upcoming events.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className="group bg-white rounded-[30px] overflow-hidden border border-cyan-100 shadow-sm text-left hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <Image
                    src={event.image_url || orgBannerUrl || "/lspu-campus.jpg"}
                    alt={event.title || "Event banner"}
                    title={event.title || "Event banner"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <span
                    className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-extrabold shadow-sm whitespace-nowrap ${getCategoryStyle(
                      event.category
                    )}`}
                  >
                    {event.category || "Event"}
                  </span>

                  <div className="absolute left-5 bottom-4 right-5">
                    <p className="text-xs font-bold text-white/80 line-clamp-1">
                      {orgName || "Organization"}
                    </p>

                    <h3 className="mt-1 font-black text-xl leading-tight line-clamp-2 text-white drop-shadow">
                      {event.title || "Event Name"}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 min-h-[60px]">
                    {event.description || "No event description available."}
                  </p>

                  <div className="mt-5 grid gap-2 text-sm text-gray-600">
                    <InfoLine label="Date" value={formatDate(event.date)} />
                    <InfoLine label="Time" value={event.time || "TBA"} />
                    <InfoLine label="Venue" value={event.venue || "TBA"} />
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-cyan-700 group-hover:text-lime-600 transition">
                    View Event
                    <span className="group-hover:translate-x-1 transition">
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] px-3 sm:px-4 py-6">
          <div className="bg-white rounded-[28px] sm:rounded-[36px] max-w-[760px] w-full overflow-hidden shadow-2xl border border-cyan-100 max-h-[90vh] overflow-y-auto">
            <div className="relative h-[220px] sm:h-[280px] overflow-hidden">
              <Image
                src={
                  selectedEvent.image_url ||
                  orgBannerUrl ||
                  "/lspu-campus.jpg"
                }
                alt={selectedEvent.title || "Event banner"}
                fill
                sizes="(max-width: 768px) 100vw, 760px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute right-5 top-5 h-10 w-10 rounded-full bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-600 font-black shadow-md transition"
                aria-label="Close event details"
                title="Close event details"
              >
                ×
              </button>

              <span
                className={`absolute left-6 top-6 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap shadow-sm ${getCategoryStyle(
                  selectedEvent.category
                )}`}
              >
                {selectedEvent.category || "Event"}
              </span>

              <div className="absolute left-6 right-6 bottom-6 text-white">
                <p className="text-sm font-bold text-white/80">
                  {orgName || "Organization"}
                </p>

                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black leading-tight drop-shadow">
                  {selectedEvent.title || "Event title"}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-7 md:p-8">
              <div className="grid sm:grid-cols-3 gap-4">
                <DetailBox label="Date" value={formatDate(selectedEvent.date)} />
                <DetailBox label="Time" value={selectedEvent.time || "TBA"} />
                <DetailBox label="Venue" value={selectedEvent.venue || "TBA"} />
              </div>

              <div className="mt-8">
                <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                  Event Details
                </p>

                <p className="mt-5 text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="line-clamp-1">
      <span className="font-black text-[#244543]">{label}:</span> {value}
    </p>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl p-4">
      <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 font-black text-[#244543]">{value}</p>
    </div>
  );
}