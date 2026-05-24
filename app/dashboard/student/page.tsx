"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { ScaleIn } from "@/components/dashboard/Animated";

import StudentSidebar from "./components/StudentSidebar";
import DashboardView from "./components/views/DashboardView";
import StudentHeader from "./components/StudentHeader";
import ClubsView from "./components/views/ClubsView";
import EventsView from "./components/views/EventsView";
import NotificationsView from "./components/views/NotificationsView";
import AccountView from "./components/views/AccountView";
import RightPanel from "./components/RightPanel";
import LoadingScreen from "@/components/LoadingScreen";

import type {
  AccountForm,
  DashboardFeature,
  Organization,
  StudentApplication,
  StudentAnnouncement,
  StudentEvent,
  StudentMember,
  StudentNotification,
  StudentUser,
  StudentView,
} from "./types";

type DisplayAnnouncement = (StudentNotification | StudentAnnouncement) & {
  notification_id?: string;
  is_read?: boolean;
  type?: string;
};

function getCategoryStyle(category?: string) {
  const key = (category || "").toLowerCase();

  if (key === "seminar") {
    return "bg-[#F1C5AE] text-[#4F2B21]";
  }

  if (key === "workshop") {
    return "bg-[#ECDDD0] text-[#4B372C]";
  }

  if (key === "competition") {
    return "bg-[#CED2C2] text-[#35455D]";
  }

  if (key === "recruitment") {
    return "bg-[#92B1B6] text-[#102B33]";
  }

  if (key === "meeting") {
    return "bg-[#35455D] text-white";
  }

  if (key === "social") {
    return "bg-[#BFD1DF] text-[#26384A]";
  }

  return "bg-[#35455D] text-white";
}

export default function StudentDashboard() {
  const router = useRouter();

  const [activeView, setActiveView] = useState<StudentView>("dashboard");
  function changeView(view: StudentView) {
    setActiveView(view);
    setSearch("");
  }
  const [dashboardFeature, setDashboardFeature] =
    useState<DashboardFeature>("clubs");

  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<DisplayAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClubApplication, setSelectedClubApplication] =
    useState<StudentApplication | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [userRow, setUserRow] = useState<StudentUser | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [members, setMembers] = useState<StudentMember[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [officialAnnouncements, setOfficialAnnouncements] =
    useState<StudentAnnouncement[]>([]);
  const [orgMap, setOrgMap] = useState<Record<string, Organization>>({});
  const [selectedEvent, setSelectedEvent] = useState<StudentEvent | null>(null);

  const [accountForm, setAccountForm] = useState<AccountForm>({
    first_name: "",
    last_name: "",
    email: "",
    student_id: "",
    department: "",
    program: "",
    course_section: "",
    year_level: "",
    gender: "",
    contact_number: "",
    profile_url: "",
  });

  const loadDashboard = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (!profile) {
      router.push("/login");
      return;
    }

    const role = String(profile.role || "").trim();

    if (role === "main_admin") {
      router.replace("/dashboard/admin");
      return;
    }

    const { data: announcementRows } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    setOfficialAnnouncements(announcementRows || []);

    setUserRow(profile);

    setAccountForm({
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      email: profile.email || "",
      student_id: profile.student_id || "",
      department: profile.college || "",
      program: profile.program || "",
      course_section: profile.course_section || "",
      year_level: profile.year_level || "",
      gender: profile.gender || "",
      contact_number: profile.contact_number || "",
      profile_url: profile.profile_url || "",
    });

    const { data: memberRows } = await supabase
      .from("members")
      .select("*, organizations(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const safeApplications = memberRows || [];
    setApplications(safeApplications);

    const mapped: Record<string, Organization> = {};

    safeApplications.forEach((item: StudentApplication) => {
      if (item.organizations) {
        mapped[item.org_id] = item.organizations;
      }
    });

    setOrgMap(mapped);

    const approvedOrgIds = safeApplications
      .filter((item: StudentApplication) => item.status === "approved")
      .map((item: StudentApplication) => item.org_id);

    if (approvedOrgIds.length > 0) {
      const today = new Date().toISOString().split("T")[0];

      const { data: eventRows } = await supabase
        .from("events")
        .select("*")
        .in("org_id", approvedOrgIds)
        .gte("date", today)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      setEvents(eventRows || []);

      const { data: memberListRows } = await supabase
        .from("members")
        .select("*, organizations(*)")
        .in("org_id", approvedOrgIds)
        .eq("status", "approved")
        .order("full_name", { ascending: true });

      setMembers(memberListRows || []);
    } else {
      setEvents([]);
      setMembers([]);
    }

    const { data: notifRows } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const studentSideNotifications = (notifRows || []).filter(
      (note: StudentNotification) => {
        if (note.type !== "announcement") return true;

        const targetRole = String(note.target_role || "").toLowerCase();

        return targetRole === "student" || targetRole === "";
      }
    );

    setNotifications(studentSideNotifications);
    setLoading(false);
  }, [router, setLoading]);

  useEffect(() => {
    async function runLoadDashboard() {
      await loadDashboard();
    }

    runLoadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel("student-notifications")
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function saveAccount() {
    if (!userRow?.auth_id) {
      alert("User profile not loaded.");
      return;
    }

    const fullName = `${accountForm.first_name} ${accountForm.last_name}`.trim();

    const { error } = await supabase
      .from("users")
      .update({
        first_name: accountForm.first_name,
        last_name: accountForm.last_name,
        full_name: fullName,
        email: accountForm.email,
        contact_number: accountForm.contact_number,
        college: accountForm.department,
        program: accountForm.program,
        year_level: accountForm.year_level,
        course_section: accountForm.course_section,
        gender: accountForm.gender,
        profile_url: accountForm.profile_url,
      })
      .eq("auth_id", userRow.auth_id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account updated!");
    await loadDashboard();
  }

  function openNotifications() {
    setShowNotifications((prev) => !prev);
  }

  const filteredApplications = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return applications;

    return applications.filter((app) =>
      [app.organizations?.name, app.organizations?.department, app.status]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [applications, search]);

  const filteredEvents = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return events;

    return events.filter((event) =>
      [
        event.title,
        event.description,
        event.venue,
        event.category,
        orgMap[event.org_id]?.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [events, search, orgMap]);

  const filteredMembers = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return members;

    return members.filter((member) =>
      [
        member.full_name,
        member.name,
        member.role,
        member.course_section,
        member.organizations?.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [members, search]);

  const joinedOrgIds = applications
    .filter((app) => app.status === "approved")
    .map((app) => app.org_id);

  const announcementNotifications = notifications.filter(
    (note) => note.type === "announcement"
  );

  const announcements = officialAnnouncements
    .filter((note) => {
      const targetType = String(note.target_type || "").toLowerCase();

      if (targetType === "everyone" || targetType === "all") {
        return true;
      }

      if (targetType === "organization") {
        return note.target_value
          ? joinedOrgIds.includes(note.target_value)
          : false;
      }

      return false;
    })
    .map((note) => {
      const matchingNotification = announcementNotifications.find((notif) => {
        const targetRole = String(notif.target_role || "").toLowerCase();

        return (
          targetRole === "student" &&
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

  const firstName =
    userRow?.first_name ||
    userRow?.full_name?.split(" ")[0] ||
    userRow?.email?.split("@")[0] ||
    "Student";

  const visibleAnnouncementNotificationIds = new Set(
    announcements
      .map((announcement) => announcement.notification_id)
      .filter(Boolean)
  );

  const visibleAnnouncementIds = new Set(
    announcements.map((announcement) => announcement.id)
  );

  const studentNotifications = notifications.filter((note) => {
    const type = String(note.type || "").toLowerCase();

    if (
      type === "approved" ||
      type === "rejected" ||
      type === "membership" ||
      type === "student" ||
      type === "general"
    ) {
      return true;
    }

    if (type === "announcement") {
      const targetRole = String(note.target_role || "").toLowerCase();
      const announcementGroup = note.announcement_group || "";

      if (targetRole && targetRole !== "student") {
        return false;
      }

      return (
        visibleAnnouncementNotificationIds.has(note.id) ||
        visibleAnnouncementIds.has(announcementGroup)
      );
    }

    return false;
  });

  const uniqueStudentNotifications = Array.from(
    new Map(
      studentNotifications.map((note) => [
        note.type === "announcement"
          ? note.announcement_group || note.id
          : note.id,
        note,
      ])
    ).values()
  );

  const unreadNotifications = uniqueStudentNotifications.filter(
    (note) => !note.is_read
  );

  const notificationTabItems = [
    ...announcements,
    ...uniqueStudentNotifications.filter(
      (note) => String(note.type || "").toLowerCase() !== "announcement"
    ),
  ].sort((a, b) => {
    const dateA = new Date(a.created_at || "").getTime();
    const dateB = new Date(b.created_at || "").getTime();

    return dateB - dateA;
  });

  const hasUnreadNotifications = unreadNotifications.length > 0;

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink"
        message="Loading your student dashboard..."
      />
    );
  }

  async function openAnnouncement(note: DisplayAnnouncement) {
    setSelectedAnnouncement(note);

    const notificationId = note.notification_id || note.id;

    if (!note.is_read && notificationId) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId
            ? { ...item, is_read: true }
            : item
        )
      );
    }
  }

  async function markAllNotificationsAsRead() {
    const unreadIds = uniqueStudentNotifications
      .filter((note) => !note.is_read)
      .map((note) => note.notification_id || note.id);

    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setNotifications((prev) =>
      prev.map((note) =>
        unreadIds.includes(note.id)
          ? { ...note, is_read: true }
          : note
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fffb] flex flex-col lg:flex-row text-[#202020] overflow-x-hidden">
      <StudentSidebar
        activeView={activeView}
        setActiveView={changeView}
        handleLogout={handleLogout}
        isOfficer={userRow?.role === "officer_admin"}
      />

      <section className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto">
        <StudentHeader
          firstName={firstName}
          userRow={userRow}
          search={search}
          setSearch={setSearch}
          setActiveView={setActiveView}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          openNotifications={openNotifications}
          hasUnreadNotifications={hasUnreadNotifications}
          notifications={uniqueStudentNotifications}
          unreadCount={unreadNotifications.length}
          openNotification={openAnnouncement}
          markAllNotificationsAsRead={markAllNotificationsAsRead}
          applications={applications}
          events={events}
          announcements={announcements}
          openEvent={(event: StudentEvent) => setSelectedEvent(event)}
          openClub={(application: StudentApplication) =>
            setSelectedClubApplication(application)
          }
        />

          <div
            className={`w-full max-w-[1180px] mx-auto min-w-0 px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-8 overflow-x-hidden ${
              activeView === "dashboard"
                ? "grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6 lg:gap-8"
                : "block"
            }`}
          >
            <div className="min-w-0">

              <div className="mt-6">
                {activeView === "dashboard" && (
                  <DashboardView
                    dashboardFeature={dashboardFeature}
                    setDashboardFeature={setDashboardFeature}
                    applications={filteredApplications}
                    members={filteredMembers}
                    events={filteredEvents}
                    announcements={announcements}
                    orgMap={orgMap}
                    setActiveView={setActiveView}
                    openEvent={(event: StudentEvent) => setSelectedEvent(event)}
                  />
                )}

                {activeView === "clubs" && (
                  <ClubsView
                    filteredApplications={filteredApplications}
                  />
                )}

                {activeView === "events" && (
                  <EventsView
                    filteredEvents={filteredEvents}
                    orgMap={orgMap}
                    openEvent={(event: StudentEvent) => setSelectedEvent(event)}
                  />
                )}

                {activeView === "announcement" && (
                  <NotificationsView
                    announcements={notificationTabItems}
                    openAnnouncement={openAnnouncement}
                  />
                )}

                {activeView === "account" && (
                  <AccountView
                    accountForm={accountForm}
                    setAccountForm={setAccountForm}
                    userRow={userRow}
                    saveAccount={saveAccount}
                  />
                )}
            </div>
          </div>

          {activeView === "dashboard" && (
            <div className="hidden xl:block">
              <RightPanel
                applications={applications}
                events={events}
                announcements={announcements}
                orgMap={orgMap}
              />
            </div>
          )}
        </div>
      </section>
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-3 sm:px-4 py-6">
          <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl border border-cyan-100">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-start gap-4 min-w-0">
                <div className="h-14 w-14 rounded-2xl bg-[#f6fffb] border border-cyan-100 flex items-center justify-center text-2xl shrink-0">
                  {String(selectedAnnouncement.type || "").toLowerCase() ===
                  "membership"
                    ? "👤"
                    : "📢"}
                </div>

                <div className="min-w-0">
                  <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
                    {String(selectedAnnouncement.type || "").toLowerCase() ===
                    "membership"
                      ? "Membership"
                      : "Announcement"}
                  </p>

                  <h2 className="mt-4 text-2xl md:text-3xl font-black text-[#244543] leading-tight">
                    {selectedAnnouncement.title || "Notification"}
                  </h2>

                  {selectedAnnouncement.created_at && (
                    <p className="text-xs text-gray-400 font-semibold mt-2">
                      {new Date(selectedAnnouncement.created_at).toLocaleString(
                        "en-PH"
                      )}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition font-black shrink-0"
                aria-label="Close notification"
                title="Close notification"
              >
                ×
              </button>
            </div>

            <div className="mt-7 bg-[#f6fffb] border border-cyan-100 rounded-[24px] p-6">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words">
                {selectedAnnouncement.message || "No message available."}
              </p>
            </div>
          </ScaleIn>
        </div>
      )}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-4">
          <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] max-w-[760px] w-full overflow-hidden shadow-2xl border border-cyan-100 max-h-[90vh] overflow-y-auto">
            <div className="relative h-[220px] sm:h-[280px] overflow-hidden">
              <Image
                src={selectedEvent.image_url || "/lspu-campus.jpg"}
                alt={selectedEvent.title || "Event banner"}
                fill
                sizes="(max-width: 768px) 100vw, 760px"
                unoptimized
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
                  {orgMap[selectedEvent.org_id]?.name || "Organization"}
                </p>

                <h2 className="mt-2 text-2xl md:text-4xl font-black leading-tight drop-shadow line-clamp-2">
                  {selectedEvent.title || "Event title"}
                </h2>
              </div>
            </div>

            <div className="p-5 sm:p-7 md:p-8">
              <div className="grid md:grid-cols-3 gap-4">
                <InfoBox
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
                <InfoBox label="Time" value={selectedEvent.time || "TBA"} />
                <InfoBox label="Venue" value={selectedEvent.venue || "TBA"} />
              </div>

              <div className="mt-8">
                <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                  Event Details
                </p>

                <p className="mt-5 text-gray-600 leading-relaxed whitespace-pre-line break-words">
                  {selectedEvent.description || "No description available."}
                </p>
              </div>
            </div>
          </ScaleIn>
        </div>
      )}
      {selectedClubApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-4">
          <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-cyan-100">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                  Organization
                </p>

                <h2 className="mt-5 text-2xl md:text-3xl font-black text-[#244543]">
                  {selectedClubApplication.organizations?.name || "Organization"}
                </h2>

                <p className="mt-2 text-sm font-bold text-cyan-700">
                  {selectedClubApplication.organizations?.department ||
                    selectedClubApplication.organizations?.category ||
                    "Club"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedClubApplication(null)}
                className="h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition font-black shrink-0"
                aria-label="Close club details"
                title="Close club details"
              >
                ×
              </button>
            </div>

            <p className="mt-5 text-gray-600 whitespace-pre-line leading-relaxed break-words">
              {selectedClubApplication.organizations?.short_desc ||
                selectedClubApplication.organizations?.name ||
                "No description available."}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <InfoBox
                label="Status"
                value={selectedClubApplication.status || "Pending"}
              />

              <InfoBox
                label="Section"
                value={selectedClubApplication.course_section || "N/A"}
              />
            </div>
          </ScaleIn>
        </div>
      )}
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl p-4">
      <p className="text-xs text-gray-400 font-extrabold uppercase tracking-wide">
        {label}
      </p>

      <p className="mt-1 font-black text-[#244543] break-words">{value}</p>
    </div>
  );
}