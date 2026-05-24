"use client";

import Image from "next/image";
import StatusBadge from "@/app/dashboard/student/components/shared/StatusBadge";
import type {
  OfficerView,
  OfficerEvent,
  Organization,
  MemberApplication,
} from "../../types";
import { FadeIn } from "@/components/dashboard/Animated";

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

type Props = {
  events: OfficerEvent[];
  organization: Organization | null;
  applicationSort: string;
  setApplicationSort: (value: string) => void;
  filteredApplications: MemberApplication[];
  approveMember: (id: string) => void;
  rejectMember: (id: string) => void;
  setActiveView: (view: OfficerView) => void;
  openEvent: (event: OfficerEvent) => void;
};

export default function DashboardView({
  events,
  organization,
  applicationSort,
  setApplicationSort,
  filteredApplications,
  approveMember,
  rejectMember,
  setActiveView,
  openEvent,
}: Props) {
  return (
    <FadeIn>
      <div className="grid xl:grid-cols-[390px_minmax(0,1fr)] gap-6 xl:gap-8 w-full max-w-[1120px] mx-auto items-start">
        <section className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 border border-cyan-100 shadow-sm h-fit">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#244543]">
                Upcoming Events
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your next organization activity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveView("events")}
              className="text-cyan-600 font-black text-sm hover:underline shrink-0"
            >
              View all
            </button>
          </div>

          <div className="mt-6">
            {events.length === 0 ? (
              <div className="border border-cyan-100 rounded-[24px] p-6 text-gray-500 bg-[#f6fffb]">
                No upcoming events.
              </div>
            ) : (
              events.slice(0, 1).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => openEvent(event)}
                  className="group w-full text-left bg-white border border-cyan-100 rounded-[26px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="relative h-[220px] overflow-hidden">
                    <Image
                      src={event.image_url || "/lspu-campus.jpg"}
                      alt={event.title || "Event banner"}
                      fill
                      sizes="390px"
                      priority
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    <span
                      className={`absolute right-4 top-4 inline-flex items-center justify-center min-w-[72px] h-8 px-4 rounded-full text-xs font-black whitespace-nowrap shadow-sm ${getCategoryStyle(
                        event.category
                      )}`}
                    >
                      {event.category || "Event"}
                    </span>

                    <div className="absolute left-5 right-5 bottom-5 text-white">
                      <p className="text-xs font-bold text-white/80 line-clamp-1">
                        {organization?.name || "Organization"}
                      </p>

                      <h3 className="mt-1 text-2xl font-black leading-tight line-clamp-2 drop-shadow">
                        {event.title || "Event Name"}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description || "No description available."}
                    </p>

                    <div className="mt-5 space-y-2 text-sm">
                      <InfoLine label="Venue" value={event.venue || "TBA"} />
                      <InfoLine label="Date" value={event.date || "TBA"} />
                      <InfoLine label="Time" value={event.time || "TBA"} />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 border border-cyan-100 shadow-sm min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#244543]">
                Applications
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Review recent membership requests.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 bg-white border border-cyan-100 rounded-[24px] sm:rounded-full p-1 shadow-sm">
              {[
                { label: "Recently", value: "recent" },
                { label: "Oldest", value: "oldest" },
                { label: "By Name", value: "name" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setApplicationSort(item.value)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-black transition ${
                    applicationSort === item.value
                      ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                      : "text-gray-500 hover:bg-cyan-50 hover:text-cyan-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] overflow-x-auto border border-cyan-100 bg-white shadow-sm w-full">
            <div className="grid min-w-[620px] grid-cols-[minmax(210px,2fr)_minmax(110px,1fr)_minmax(150px,1fr)] bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black text-sm px-6 py-4 gap-5">
              <div>Name</div>
              <div>Applied</div>
              <div>Status</div>
            </div>

            {filteredApplications.slice(0, 3).length === 0 ? (
              <div className="px-7 py-8 text-gray-500">
                No applications found.
              </div>
            ) : (
              filteredApplications.slice(0, 3).map((app) => {
                const studentName =
                  app.full_name ||
                  app.student_name ||
                  app.name ||
                  `${app.first_name || ""} ${app.last_name || ""}`.trim() ||
                  "Unknown Student";

                const section =
                  app.course_section ||
                  app.section ||
                  app.year_section ||
                  "No Section";

                const appliedDate = app.created_at
                  ? new Date(app.created_at).toLocaleDateString("en-PH")
                  : "Today";

                return (
                  <div
                    key={app.id}
                    className="grid min-w-[620px] grid-cols-[minmax(210px,2fr)_minmax(110px,1fr)_minmax(150px,1fr)] border-b border-cyan-50 last:border-b-0 items-center gap-5 px-6 py-5 bg-white hover:bg-cyan-50/40 transition"
                  >
                    <div className="min-w-0">
                      <p
                        className="font-black text-sm text-[#244543] line-clamp-2 leading-tight"
                        title={studentName}
                      >
                        {studentName}
                      </p>

                      <p className="text-gray-400 text-xs truncate">
                        {section}
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-sm text-[#244543]">
                        {appliedDate}
                      </p>

                      <p className="text-gray-400 text-xs">Applied</p>
                    </div>

                    <div>
                      {app.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => approveMember(app.id)}
                            className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black text-base shadow-sm hover:brightness-110 transition"
                            aria-label="Approve application"
                            title="Approve"
                          >
                            ✓
                          </button>

                          <button
                            type="button"
                            onClick={() => rejectMember(app.id)}
                            className="h-9 w-9 rounded-full bg-red-50 text-red-600 font-black text-base hover:bg-red-100 transition"
                            aria-label="Reject application"
                            title="Reject"
                          >
                            ×
                          </button>
                        </div>
                      )}

                      {app.status === "approved" && (
                        <StatusBadge label="approved" variant="success" />
                      )}

                      {app.status === "rejected" && (
                        <StatusBadge label="rejected" variant="danger" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveView("application")}
            className="block mx-auto mt-5 text-cyan-600 font-black text-sm hover:underline"
          >
            Show All Applications
          </button>
        </section>
      </div>
    </FadeIn>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-gray-600">
      <span className="font-black text-[#244543]">{label}:</span> {value}
    </p>
  );
}