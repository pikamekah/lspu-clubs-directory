"use client";

import type {
  StudentApplication,
  StudentAnnouncement,
  StudentEvent,
  Organization,
} from "../types";

type Props = {
  applications: StudentApplication[];
  events: StudentEvent[];
  announcements: StudentAnnouncement[];
  orgMap: Record<string, Organization>;
};

export default function RightPanel({
  applications,
  events,
  announcements,
  orgMap,
}: Props) {
  return (
    <aside className="w-[280px] bg-white rounded-[32px] p-6 shadow-sm border border-cyan-100 h-fit">
      <PanelTitle title="Application Status" />

      <div className="space-y-3">
        {applications.slice(0, 2).length === 0 ? (
          <EmptyText text="No applications yet." />
        ) : (
          applications.slice(0, 2).map((app) => (
            <div
              key={app.id}
              className="bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-4"
            >
              <p className="text-sm font-black text-[#244543] truncate">
                {app.organizations?.name || "Organization Name"}
              </p>

              <span
                className={`mt-3 inline-flex px-3 py-1 rounded-full text-xs font-extrabold capitalize ${
                  app.status === "approved"
                    ? "bg-emerald-50 text-emerald-600"
                    : app.status === "rejected"
                    ? "bg-red-50 text-red-500"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {app.status || "pending"}
              </span>
            </div>
          ))
        )}
      </div>

      <PanelTitle title="Upcoming Events" />

      <div className="space-y-3">
        {events.slice(0, 3).length === 0 ? (
          <EmptyText text="No upcoming events." />
        ) : (
          events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="bg-[#f6fffb] border border-cyan-100 rounded-2xl p-4 flex gap-3 hover:shadow-md transition"
            >
              <span className="bg-gradient-to-r from-cyan-600 to-lime-500 text-white h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
                <EventsSmallIcon />
              </span>

              <div className="min-w-0">
                <p className="font-black text-sm text-[#244543] line-clamp-2">
                  {event.title || "Event name"}
                </p>

                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {orgMap[event.org_id]?.name || "Organization name"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <PanelTitle title="Latest Update" />

      <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gradient-to-r from-cyan-600 to-lime-500 text-white h-9 w-9 rounded-xl flex items-center justify-center shrink-0">
            🔔
          </span>

          <p className="text-xs font-extrabold text-cyan-700 uppercase">
            Latest
          </p>
        </div>

        <p className="font-black text-sm text-[#244543] line-clamp-2">
          {announcements[0]?.title || "No Update"}
        </p>

        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
          {announcements[0]?.message ||
            "No updates available right now."}
        </p>
      </div>
    </aside>
  );
}

function PanelTitle({ title }: { title: string }) {
  return (
    <div className="mt-7 mb-3 first:mt-0">
      <h3 className="font-black text-[#244543]">{title}</h3>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-4 text-sm text-gray-500">
      {text}
    </div>
  );
}

function EventsSmallIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}