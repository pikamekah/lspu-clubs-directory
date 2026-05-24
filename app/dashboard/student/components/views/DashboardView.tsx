"use client";

import Image from "next/image";

import type {
  DashboardFeature,
  StudentApplication,
  StudentAnnouncement,
  StudentEvent,
  StudentMember,
  Organization,
  StudentView,
} from "../../types";

import EmptyState from "../shared/EmptyState";
import GradientButton from "../shared/GradientButton";
import { getCategoryStyle } from "@/app/lib/publicStyles";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

type Props = {
  dashboardFeature: DashboardFeature;
  setDashboardFeature: (feature: DashboardFeature) => void;
  applications: StudentApplication[];
  members: StudentMember[];
  events: StudentEvent[];
  announcements: StudentAnnouncement[];
  orgMap: Record<string, Organization>;
  setActiveView: (view: StudentView) => void;
  openEvent: (event: StudentEvent) => void;
};

export default function DashboardView({
  dashboardFeature,
  setDashboardFeature,
  applications,
  members,
  events,
  announcements,
  orgMap,
  setActiveView,
  openEvent,
}: Props) {
  return (
    <FadeIn>
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] min-h-[285px] max-w-[760px] group text-white shadow-xl border border-cyan-100">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-lime-500 transition-opacity duration-500 group-hover:opacity-0" />

        <Image
          src={events[0]?.image_url || "/lspu-campus.jpg"}
          alt={events[0]?.title || "Event banner"}
          fill
          priority
          sizes="760px"
          unoptimized
          className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 px-5 sm:px-8 md:px-10 py-7 sm:py-9">
          <p className="inline-flex bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide">
            Next Club Event
          </p>

          {events[0] ? (
            <div className="mt-5">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                {events[0].title || "Event Title"}
              </h1>

              <p className="mt-2 text-white/90 font-bold">
                Hosted by {orgMap[events[0].org_id]?.name || "Organization"}
              </p>

              <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-[640px]">
                <HeroInfo label="Venue" value={events[0].venue || "TBA"} />

                <HeroInfo
                  label="Date"
                  value={
                    events[0].date
                      ? new Date(events[0].date).toLocaleDateString("en-PH", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"
                  }
                />

                <HeroInfo label="Time" value={events[0].time || "TBA"} />
              </div>

              <button
                type="button"
                onClick={() => openEvent(events[0])}
                className="mt-6 bg-white text-cyan-700 px-7 py-3 rounded-full text-sm font-extrabold hover:bg-lime-100 transition"
              >
                Learn More
              </button>
            </div>
          ) : (
            <div className="mt-5">
              <h1 className="text-3xl md:text-4xl font-black">
                No upcoming event yet
              </h1>

              <p className="mt-3 max-w-xl text-white/90 font-medium leading-relaxed">
                Join a club to see upcoming activities and announcements here.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="mt-10 flex items-end justify-between max-w-[760px]">
        <div>
          <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
            Features
          </p>

          <h2 className="mt-3 text-2xl font-black text-[#244543]">
            Quick Access
          </h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-[760px] w-full">
        <StaggerItem delay="delay-0">
          <FeatureCard
            label="Clubs"
            icon="clubs"
            active={dashboardFeature === "clubs"}
            onClick={() => setDashboardFeature("clubs")}
          />
        </StaggerItem>

        <StaggerItem delay="delay-100">
          <FeatureCard
            label="Members"
            icon="members"
            active={dashboardFeature === "members"}
            onClick={() => setDashboardFeature("members")}
          />
        </StaggerItem>

        <StaggerItem delay="delay-200">
          <FeatureCard
            label="Events"
            icon="events"
            active={dashboardFeature === "events"}
            onClick={() => setDashboardFeature("events")}
          />
        </StaggerItem>

        <StaggerItem delay="delay-300">
          <FeatureCard
            label="Notifications"
            icon="notifications"
            active={dashboardFeature === "announcement"}
            onClick={() => setDashboardFeature("announcement")}
          />
        </StaggerItem>
      </div>

      <DashboardFeatureContent
        activeFeature={dashboardFeature}
        applications={applications}
        members={members}
        events={events}
        announcements={announcements}
        orgMap={orgMap}
        setActiveView={setActiveView}
        setDashboardFeature={setDashboardFeature}
        openEvent={openEvent}
      />
    </FadeIn>
  );
}

type DashboardFeatureContentProps = {
  activeFeature: DashboardFeature;
  applications: StudentApplication[];
  members: StudentMember[];
  events: StudentEvent[];
  announcements: StudentAnnouncement[];
  orgMap: Record<string, Organization>;
  setActiveView: (view: StudentView) => void;
  setDashboardFeature: (feature: DashboardFeature) => void;
  openEvent: (event: StudentEvent) => void;
};

function DashboardFeatureContent({
  activeFeature,
  applications,
  members,
  events,
  announcements,
  orgMap,
  setActiveView,
  setDashboardFeature,
  openEvent,
}: DashboardFeatureContentProps) {
  const approvedApplications = applications.filter(
    (app) => app.status === "approved"
  );

  if (activeFeature === "clubs") {
    return (
      <section className="mt-10 max-w-[760px]">
        <SectionHeader
          title="My Clubs"
          buttonLabel="See All"
          onClick={() => setActiveView("clubs")}
        />

        <div className="space-y-3">
          {applications.length === 0 ? (
            <WhitePill text="No club applications yet." />
          ) : (
            applications.slice(0, 2).map((app) => (
              <WhitePill
                key={app.id}
                text={`${app.organizations?.name || "Organization"} — ${
                  app.status || "pending"
                }`}
              />
            ))
          )}
        </div>
      </section>
    );
  }

  if (activeFeature === "members") {
    return (
      <section className="mt-10 max-w-[760px]">
        <h2 className="text-2xl font-black mb-4 text-[#244543]">Members</h2>

        {approvedApplications.length === 0 ? (
          <EmptyState
            title="No members found"
            message="You need an approved club before members can appear."
          />
        ) : (
          <div className="space-y-5">
            {approvedApplications.map((app) => {
              const clubMembers = members.filter(
                (member) => member.org_id === app.org_id
              );

              return (
                <div
                  key={app.id}
                  className="bg-white rounded-[28px] p-6 shadow-sm border border-cyan-100"
                >
                  <h3 className="text-xl font-black mb-4 text-[#244543]">
                    {app.organizations?.name || "Organization"}
                  </h3>

                  {clubMembers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No members listed yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {clubMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-cyan-100 last:border-b-0 pb-3 last:pb-0"
                        >
                          <p className="font-bold text-[#244543]">
                            {member.full_name || member.name || "Member Name"}
                          </p>

                          <span className="bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-4 py-2 rounded-full text-xs font-extrabold">
                            {member.role || "Member"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  if (activeFeature === "events") {
    return (
      <section className="mt-10 max-w-[760px]">
        <SectionHeader
          title="Events"
          buttonLabel="View All"
          onClick={() => {
            setActiveView("events");
            setDashboardFeature("events");
          }}
        />

        {events.length === 0 ? (
          <EmptyState
            title="No events found"
            message="Upcoming events from your joined clubs will appear here."
          />
        ) : (
          <div className="space-y-4">
            {events.slice(0, 2).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                orgName={orgMap[event.org_id]?.name || "Organization Name"}
                openEvent={openEvent}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mt-10 max-w-[760px]">
      <SectionHeader
        title="Notifications"
        buttonLabel="View All"
        onClick={() => setActiveView("announcement")}
      />

      <div className="space-y-3">
        {announcements.slice(0, 2).length === 0 ? (
          <EmptyState
            title="No notifications found"
            message="Announcements and student updates will appear here."
          />
        ) : (
          announcements.slice(0, 2).map((note) => (
            <WhitePill
              key={note.id}
              text={`${note.title || "Announcement"} — ${note.message || ""}`}
            />
          ))
        )}
      </div>
    </section>
  );
}

function HeroInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 border border-white/25 backdrop-blur-sm rounded-2xl p-4">
      <p className="text-[11px] uppercase tracking-wide font-extrabold text-white/70">
        {label}
      </p>

      <p className="mt-1 font-black text-white line-clamp-1">{value}</p>
    </div>
  );
}

function SectionHeader({
  title,
  buttonLabel,
  onClick,
}: {
  title: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <h2 className="text-2xl font-black text-[#244543]">{title}</h2>

      <GradientButton onClick={onClick} className="px-6 py-2 text-sm">
        {buttonLabel}
      </GradientButton>
    </div>
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
      className="group w-full text-left overflow-hidden rounded-[28px] bg-white border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
    >
      <div className="relative h-[190px] overflow-hidden">
        <Image
          src={event.image_url || "/lspu-campus.jpg"}
          alt={event.title || "Event banner"}
          fill
          sizes="760px"
          unoptimized
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <span
          className={`absolute top-4 right-4 rounded-full px-4 py-1.5 text-xs font-extrabold whitespace-nowrap ${getCategoryStyle(
            event.category
          )}`}
        >
          {event.category || "Event"}
        </span>

        <div className="absolute left-5 right-5 bottom-4">
          <p className="text-xs font-bold text-white/80 line-clamp-1">
            {orgName}
          </p>

          <h3 className="mt-1 text-xl font-black text-white leading-tight line-clamp-2 drop-shadow">
            {event.title || "Event name"}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm text-gray-600 line-clamp-2">
          {event.description || "No description available."}
        </p>

        <div className="mt-4 grid gap-1 text-sm text-gray-600">
          <InfoLine label="Date" value={event.date || "TBA"} />
          <InfoLine label="Time" value={event.time || "TBA"} />
          <InfoLine label="Venue" value={event.venue || "TBA"} />
        </div>
      </div>
    </button>
  );
}

type FeatureCardProps = {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
};

function FeatureCard({
  label,
  icon,
  active,
  onClick,
}: FeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-30 sm:h-36 rounded-[22px] sm:rounded-[28px] flex flex-col items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 border shadow-sm transition hover:shadow-md hover:-translate-y-1 ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white border-transparent"
          : "bg-white text-[#244543] border-cyan-100 hover:bg-cyan-50"
      }`}
    >
      <div className="h-14 w-14 rounded-2xl flex items-center justify-center">
        <FeatureIcon name={icon} />
      </div>

      <span className="text-sm sm:text-base font-black text-center leading-tight min-h-[36px] sm:min-h-[40px] flex items-center justify-center">
        {label}
      </span>
    </button>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const common = "h-9 w-9";

  if (name === "clubs") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1A1.7 1.7 0 0 0 21 10h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />
      </svg>
    );
  }

  if (name === "members") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3 20c.6-4 3-7 6-7s5.4 3 6 7H3z" />
        <path d="M13 20c.4-3 2-5 4-5s3.5 2 4 5h-8z" />
      </svg>
    );
  }

  if (name === "events") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
        <path d="M8 14h3M13 14h3M8 17h3" />
      </svg>
    );
  }

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function WhitePill({ text }: { text: string }) {
  return (
    <div className="bg-white border border-cyan-100 rounded-2xl px-5 py-4 text-base font-bold text-[#244543] shadow-sm">
      {text}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="line-clamp-1">
      <span className="font-black text-[#244543]">{label}:</span> {value}
    </p>
  );
}