"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { getCategoryStyle } from "@/app/lib/publicStyles";
import { uploadImage } from "./utils/uploadImage";
import { ScaleIn } from "@/components/dashboard/Animated";
import type {
  OfficerView,
  EventForm,
  ClubForm,
  MemberApplication,
  Organization,
  OfficerEvent,
  OfficerNotification,
  OfficerUser,
} from "./types";

import {
  approveMember as approveMemberService,
  rejectMember as rejectMemberService,
  updateMemberRole as updateMemberRoleService,
} from "./services/memberService";

import {
  saveEvent as saveEventService,
  deleteEvent as deleteEventService,
} from "./services/eventService";

import { saveClub as saveClubService } from "./services/clubService";

import {
  openNotification as openNotificationService,
  markAllNotificationsAsRead as markAllNotificationsAsReadService,
} from "./services/notificationService";

import OfficerSidebar from "./components/OfficerSidebar";
import OfficerHeader from "./components/OfficerHeader";
import DashboardView from "./components/views/DashboardView";
import ApplicationsView from "./components/views/ApplicationsView";
import EventsView from "./components/views/EventsView";
import MembersView from "./components/views/MembersView";
import NotificationsView from "./components/views/NotificationsView";
import NotificationModal from "./modals/NotificationModal";
import ClubView from "./components/views/ClubView";
import EventModal from "./modals/EventModal";
import LoadingScreen from "@/components/LoadingScreen";

export default function OfficerDashboard() {
  const router = useRouter();

  const [activeView, setActiveView] = useState<OfficerView>("dashboard");

  function changeView(view: OfficerView) {
    setActiveView(view);
    setSearch("");
  }

  const [loading, setLoading] = useState(true);

  const [userRow, setUserRow] = useState<OfficerUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [members, setMembers] = useState<MemberApplication[]>([]);
  const [events, setEvents] = useState<OfficerEvent[]>([]);
  const [notifications, setNotifications] = useState<OfficerNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const [applicationSort, setApplicationSort] = useState("recent");

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<OfficerNotification | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<OfficerEvent | null>(null);

  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    description: "",
    venue: "",
    category: "",
    date: "",
    time: "",
    image_url: "",
  });

  const [eventBanner, setEventBanner] = useState("");

  const [clubForm, setClubForm] = useState<ClubForm>({
    name: "",
    short_desc: "",
    department: "",
    location: "",
    contact: "",
    contact_email: "",
    description: "",
    offers: "",
    banner_url: "",
    logo_url: "",
  });

  const [officialAnnouncements, setOfficialAnnouncements] =
    useState<OfficerNotification[]>([]);

  const loadDashboard = useCallback(async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        console.error("Profile error:", profileError);
        router.push("/login");
        return;
      }

      setUserRow(profile);

      if (profile.role !== "officer_admin") {
        router.push("/dashboard/student");
        return;
      }

      let orgData = null;

      if (profile.org_id) {
        const { data, error } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", profile.org_id)
          .maybeSingle();

        if (error) console.error("Organization fetch error:", error);

        orgData = data;
      }

      if (!orgData) {
        console.error("No organization assigned to officer:", profile);
        alert("No organization is assigned to this officer account.");
        return;
      }

      const { data: announcementRows } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      setOfficialAnnouncements(announcementRows || []);

      setOrganization(orgData);

      setClubForm({
        name: orgData.name || "",
        short_desc: orgData.short_desc || "",
        department: orgData.department || "",
        location: orgData.location || "",
        contact: orgData.contact || "",
        contact_email: orgData.contact_email || "",
        description: orgData.description || "",
        offers: Array.isArray(orgData.offers)
          ? orgData.offers.join(", ")
          : orgData.offers || "",
        banner_url: orgData.banner_url || "",
        logo_url: orgData.logo_url || "",
      });

      const { data: applicationRows, error: applicationError } = await supabase
        .from("members")
        .select("*")
        .eq("org_id", orgData.id)
        .order("created_at", { ascending: false });

      if (applicationError) console.error("Applications error:", applicationError);

      const safeApplications = applicationRows || [];
      setApplications(safeApplications);
      setMembers(
        safeApplications.filter(
          (member: MemberApplication) => member.status === "approved"
        )
      );

      const { data: eventRows, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("org_id", orgData.id)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (eventError) console.error("Events error:", eventError);

      setEvents(eventRows || []);

      const { data: notifRows, error: notifError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (notifError) console.error("Notifications error:", notifError);

      setNotifications(notifRows || []);
    } catch (err) {
      console.error("Officer dashboard load failed:", err);
      alert("Officer dashboard failed to load. Please check the browser console.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    async function runLoadDashboard() {
      await loadDashboard();
    }

    runLoadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel("officer-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          void loadDashboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDashboard]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function openCreateEvent() {
    setEditingEventId(null);
    setEventBanner("");
    setEventForm({
      title: "",
      description: "",
      venue: "",
      category: "",
      date: "",
      time: "",
      image_url: "",
    });
    setShowEventModal(true);
  }

  function openEditEvent(event: OfficerEvent) {
    setEditingEventId(event.id);
    setEventBanner(event.image_url || "");
    setEventForm({
      title: event.title || "",
      description: event.description || "",
      venue: event.venue || "",
      category: event.category || "",
      date: event.date || "",
      time: event.time || "",
      image_url: event.image_url || "",
    });
    setShowEventModal(true);
  }

  function toggleNotifications() {
    setShowNotifications((prev) => !prev);
  }

  const filteredApplications = useMemo(() => {
    let data = [...applications];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter((app: MemberApplication) =>
        [
          app.full_name,
          app.name,
          app.first_name,
          app.last_name,
          app.course_section,
          app.section,
          app.year_section,
          app.student_id,
          app.email,
          app.phone,
          app.contact_number,
          app.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (applicationSort === "oldest") {
      data.sort((a: MemberApplication, b: MemberApplication) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

        return dateA - dateB;
      });
    }

    if (applicationSort === "recent") {
      data.sort((a: MemberApplication, b: MemberApplication) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

        return dateB - dateA;
      });
    }

    if (applicationSort === "name") {
      data.sort((a: MemberApplication, b: MemberApplication) =>
        (
          a.full_name ||
          a.name ||
          `${a.first_name || ""} ${a.last_name || ""}`.trim() ||
          ""
        ).localeCompare(
          b.full_name ||
            b.name ||
            `${b.first_name || ""} ${b.last_name || ""}`.trim() ||
            ""
        )
      );
    }

    return data;
  }, [applications, search, applicationSort]);

  const filteredEvents = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return events;

    return events.filter((event: OfficerEvent) =>
      [event.title, event.description, event.venue, event.category]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [events, search]);

  const combinedMembers = members.map((member) => ({
    id: member.id,
    name:
      member.full_name ||
      member.name ||
      `${member.first_name || ""} ${member.last_name || ""}`.trim() ||
      "Unknown Member",
    student_id: member.student_id || "N/A",
    role: member.role || "Member",
    course_section:
      member.course_section || member.section || member.year_section || "N/A",
    email: member.email || "N/A",
    contact: member.phone || member.contact_number || "N/A",
  }));

  const announcementNotifications = notifications.filter(
    (note) => note.type === "announcement"
  );

  const announcements = officialAnnouncements
    .filter((note) => {
      const targetType = String(note.target_type || "").toLowerCase();
      const targetValue = String(note.target_value || "");

      if (targetType === "all" || targetType === "everyone") {
        return true;
      }

      if (targetType === "officers") {
        return (
          targetValue === organization?.id ||
          targetValue === organization?.department
        );
      }

      if (targetType === "organization") {
        return targetValue === organization?.id;
      }

      return false;
    })
    .map((note) => {
      const matchingNotification = announcementNotifications.find((notif) => {
        const targetRole = String(notif.target_role || "").toLowerCase();

        return (
          targetRole === "officer_admin" &&
          (notif.announcement_group === note.id ||
            (notif.title === note.title && notif.message === note.message))
        );
      });

      return {
        ...note,
        type: "announcement",
        is_read: matchingNotification?.is_read ?? true,
        notification_id: matchingNotification?.id,
      };
    });

  const actionNotifications = notifications.filter((note) => {
    const type = String(note.type || "").toLowerCase();
    const targetRole = String(note.target_role || "").toLowerCase();

    if (type === "announcement") {
      return false;
    }

    return (
      type === "application" ||
      type === "officer" ||
      targetRole === "officer_admin"
    );
  });

  const combinedNotifications = [...actionNotifications, ...announcements].sort(
    (a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      return dateB - dateA;
    }
  );

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter((event) => {
    if (!event.date) return false;

    return event.date >= today;
  });

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink"
        message="Loading officer dashboard..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020] overflow-x-hidden flex flex-col lg:block">
      <OfficerSidebar
        activeView={activeView}
        setActiveView={changeView}
        logout={logout}
      />

      <section className="lg:ml-[260px] min-w-0 overflow-x-hidden">
        <OfficerHeader
          userRow={userRow}
          search={search}
          setSearch={setSearch}
          setActiveView={setActiveView}
          applications={applications}
          members={members}
          events={events}
          notifications={combinedNotifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          toggleNotifications={toggleNotifications}
          openNotification={(note: OfficerNotification) =>
            openNotificationService(
              note,
              setSelectedNotification,
              setNotifications
            )
          }
          markAllNotificationsAsRead={() =>
            markAllNotificationsAsReadService(
              combinedNotifications,
              setNotifications
            )
          }
        />

        <div className="p-4 sm:p-6 lg:p-10 max-w-[1120px] mx-auto w-full">
          {activeView === "dashboard" && (
            <DashboardView
              events={upcomingEvents}
              organization={organization}
              applicationSort={applicationSort}
              setApplicationSort={setApplicationSort}
              filteredApplications={filteredApplications}
              approveMember={(id: string) =>
                approveMemberService(id, organization, loadDashboard)
              }
              rejectMember={(id: string) =>
                rejectMemberService(id, organization, loadDashboard)
              }
              setActiveView={setActiveView}
              openEvent={(event: OfficerEvent) => setSelectedEvent(event)}
            />
          )}

          {activeView === "application" && (
            <ApplicationsView
              filteredApplications={filteredApplications}
              applicationSort={applicationSort}
              setApplicationSort={setApplicationSort}
              approveMember={(id: string) =>
                approveMemberService(id, organization, loadDashboard)
              }
              rejectMember={(id: string) =>
                rejectMemberService(id, organization, loadDashboard)
              }
            />
          )}

          {activeView === "events" && (
            <EventsView
              filteredEvents={filteredEvents}
              openCreateEvent={openCreateEvent}
              openEditEvent={openEditEvent}
              deleteEvent={(id: string) =>
                deleteEventService(id, loadDashboard)
              }
            />
          )}

          {activeView === "members" && (
            <MembersView
              combinedMembers={combinedMembers}
              updateMemberRole={(id: string, role: string) =>
                updateMemberRoleService(id, role, setMembers)
              }
            />
          )}

          {activeView === "notifications" && (
            <NotificationsView
              notifications={combinedNotifications}
              openNotification={(note: OfficerNotification) =>
                openNotificationService(
                  note,
                  setSelectedNotification,
                  setNotifications
                )
              }
              markAllNotificationsAsRead={() =>
                markAllNotificationsAsReadService(
                  combinedNotifications,
                  setNotifications
                )
              }
            />
          )}

          {activeView === "club" && (
            <ClubView
              clubForm={clubForm}
              setClubForm={setClubForm}
              members={members}
              saveClub={() =>
                saveClubService(clubForm, organization, loadDashboard)
              }
              uploadImage={uploadImage}
            />
          )}
        </div>
      </section>

      <EventModal
        showEventModal={showEventModal}
        editingEventId={editingEventId}
        eventForm={eventForm}
        setEventForm={setEventForm}
        eventBanner={eventBanner}
        setEventBanner={setEventBanner}
        uploadImage={uploadImage}
        saveEvent={() =>
          saveEventService(
            eventForm,
            eventBanner,
            editingEventId,
            organization,
            userRow,
            loadDashboard,
            () => setShowEventModal(false)
          )
        }
        onClose={() => setShowEventModal(false)}
      />

      <NotificationModal
        selectedNotification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-3 sm:px-4 py-6">
          <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] max-w-[760px] w-full overflow-hidden shadow-2xl border border-cyan-100 max-h-[90vh] overflow-y-auto">
            <div className="relative h-[220px] sm:h-[280px] overflow-hidden">
              <Image
                src={selectedEvent.image_url || "/lspu-campus.jpg"}
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
                className={`absolute left-6 top-6 px-4 py-2 rounded-full text-xs font-black whitespace-nowrap shadow-sm ${getCategoryStyle(
                  selectedEvent.category
                )}`}
              >
                {selectedEvent.category || "Event"}
              </span>

              <div className="absolute left-6 right-6 bottom-6 text-white">
                <p className="text-sm font-bold text-white/80">
                  {organization?.name || "Organization"}
                </p>

                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black leading-tight drop-shadow">
                  {selectedEvent.title || "Event title"}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-7 md:p-8">
              <div className="grid sm:grid-cols-3 gap-4">
                <EventInfoBox
                  label="Date"
                  value={
                    selectedEvent.date
                      ? new Date(selectedEvent.date).toLocaleDateString("en-PH", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"
                  }
                />
                <EventInfoBox label="Time" value={selectedEvent.time || "TBA"} />
                <EventInfoBox label="Venue" value={selectedEvent.venue || "TBA"} />
              </div>

              <div className="mt-8">
                <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
                  Event Details
                </p>

                <p className="mt-5 text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedEvent.description || "No description available."}
                </p>
              </div>
            </div>
          </ScaleIn>
        </div>
      )}
    </main>
  );
}

function EventInfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl p-4">
      <p className="text-xs text-gray-400 font-black uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 font-black text-[#244543]">{value}</p>
    </div>
  );
}