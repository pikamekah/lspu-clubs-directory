"use client";

import Image from "next/image";

import type { StudentEvent, Organization } from "../../types";

import EmptyState from "../shared/EmptyState";
import DashboardCard from "../shared/DashboardCard";
import SectionTitle from "../shared/SectionTitle";
import { getCategoryStyle } from "@/app/lib/publicStyles";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

type Props = {
  filteredEvents: StudentEvent[];
  orgMap: Record<string, Organization>;
  openEvent: (event: StudentEvent) => void;
};

export default function EventsView({
  filteredEvents,
  orgMap,
  openEvent,
}: Props) {
  return (
    <FadeIn>
      <div className="w-full">
        <SectionTitle
          title="Upcoming Events"
          subtitle="Stay updated with club activities and schedules."
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1050px]">
          {filteredEvents.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState
                title="No events found"
                message="Upcoming events from your joined clubs will appear here."
              />
            </div>
          ) : (
            filteredEvents.map((event, index) => (
              <StaggerItem
                key={event.id}
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
                <EventCard
                  event={event}
                  orgName={orgMap[event.org_id]?.name || "Organization Name"}
                  openEvent={openEvent}
                />
              </StaggerItem>
            ))
          )}
        </div>
      </div>
    </FadeIn>
  );
}

type EventCardProps = {
  event: StudentEvent;
  orgName: string;
  openEvent: (event: StudentEvent) => void;
};

function EventCard({ event, orgName, openEvent }: EventCardProps) {
  return (
    <button
      type="button"
      onClick={() => openEvent(event)}
      className="group w-full text-left h-full"
    >
      <DashboardCard className="overflow-hidden p-0 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-cyan-100 rounded-[30px]">
        <div className="relative h-[190px] sm:h-[220px] overflow-hidden">
          <Image
            src={event.image_url || "/lspu-campus.jpg"}
            alt={event.title || "Event banner"}
            fill
            sizes="(max-width: 1024px) 100vw, 525px"
            unoptimized
            className="object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          <span
            className={`absolute top-4 right-4 rounded-full px-4 py-1.5 text-xs font-extrabold whitespace-nowrap shadow-sm ${getCategoryStyle(
              event.category
            )}`}
          >
            {event.category || "Event"}
          </span>

          <div className="absolute left-5 right-5 bottom-4">
            <p className="text-xs font-bold text-white/80 line-clamp-1">
              {orgName}
            </p>

            <h3 className="mt-1 text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2 drop-shadow">
              {event.title || "Event name"}
            </h3>
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <p className="text-gray-600 line-clamp-3 flex-1">
            {event.description || "No description available."}
          </p>

          <div className="mt-5 grid gap-2 text-sm text-gray-600">
            <InfoLine
              label="Date"
              value={
                event.date
                  ? new Date(event.date).toLocaleDateString("en-PH", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "TBA"
              }
            />

            <InfoLine label="Time" value={event.time || "TBA"} />
            <InfoLine label="Venue" value={event.venue || "TBA"} />
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-cyan-700 group-hover:text-lime-600 transition">
            View Event
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </div>
      </DashboardCard>
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