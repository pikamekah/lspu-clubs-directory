"use client";

import ContentPanel from "../ContentPanel";
import EventCard from "../EventCard";
import type {
  AdminEvent,
  AdminOrganization,
} from "../../types";

type Props = {
  filteredEvents: AdminEvent[];
  organizations: AdminOrganization[];
  setShowEventModal: (show: boolean) => void;
  setEditingEvent: (event: AdminEvent) => void;
  deleteEvent: (id: string) => void;
};

export default function EventsView({
  filteredEvents,
  organizations,
  setShowEventModal,
  setEditingEvent,
  deleteEvent,
}: Props) {
  return (
    <ContentPanel
      title="School Events"
      subtitle="Create and manage school activities and organization events."
      onCreate={() => setShowEventModal(true)}
    >
      {filteredEvents.length === 0 ? (
        <div className="bg-[#f6fffb] border border-cyan-100 rounded-[24px] p-8 text-center">
          <p className="font-black text-[#244543]">
            No events found
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Created events will appear here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              orgName={
                organizations.find((org) => org.id === event.org_id)?.name ||
                "Organization"
              }
              onEdit={() => setEditingEvent(event)}
              onDelete={() => deleteEvent(event.id)}
            />
          ))}
        </div>
      )}
    </ContentPanel>
  );
}