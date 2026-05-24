"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import LoadingScreen from "@/components/LoadingScreen";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import DashboardView from "./components/views/DashboardView";
import OrganizationsView from "./components/views/OrganizationsView";
import EventsView from "./components/views/EventsView";
import AnnouncementsView from "./components/views/AnnouncementsView";
import UsersView from "./components/views/UsersView";
import ContactMessagesView from "./components/views/ContactMessagesView";

import CreateOrganizationModal from "./components/modals/CreateOrganizationModal";
import CreateEventModal from "./components/modals/CreateEventModal";
import CreateAnnouncementModal from "./components/modals/CreateAnnouncementModal";
import EditAnnouncementModal from "./components/modals/EditAnnouncementModal";
import EditEventModal from "./components/modals/EditEventModal";
import OrganizationDetailsModal from "./components/modals/OrganizationDetailsModal";

import useAdminDashboard from "./hooks/useAdminDashboard";

import {
  createOrganization as createOrganizationService,
  deleteOrganization as deleteOrganizationService,
  deleteEvent as deleteEventService,
  createEvent as createEventService,
} from "./services/adminService";

import { updateEvent as updateEventService } from "./services/eventService";

import {
  uploadOrganizationImage,
  updateOrganization,
} from "./services/organizationService";

import {
  sendAnnouncement as sendAnnouncementService,
  updateAnnouncement as updateAnnouncementService,
  deleteAnnouncement as deleteAnnouncementService,
  type EditableAnnouncement,
} from "./services/announcementService";

import { updateUserRole as updateUserRoleService } from "./services/userService";

import type {
  AdminView,
  OrgForm,
  EventForm,
  AnnouncementForm,
  AdminOrganization,
  AdminEvent,
  AdminContactMessage,
} from "./types";

type EditableOrganization = AdminOrganization & {
  president?: string;
};

type EditableEvent = AdminEvent;

const departmentOptions = [
  "CAS",
  "CBAA",
  "CCJE",
  "CCS",
  "CIHTM",
  "CIT",
  "COE",
  "CONAH",
  "CTE",
  "NON-ACAD",
];

const eventTagOptions = [
  "Seminar",
  "Workshop",
  "Competition",
  "Recruitment",
  "Social",
  "Meeting",
];

export default function MainAdminDashboard() {
  const router = useRouter();

  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [search, setSearch] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [contactMessages, setContactMessages] = useState<AdminContactMessage[]>([]);
  const [contactLoading, setContactLoading] = useState(false);

  const {
    loading,
    adminRow,
    organizations,
    events,
    users,
    members,
    announcements,
    refreshDashboard,
  } = useAdminDashboard(router);

  const [selectedOrganization, setSelectedOrganization] =
    useState<EditableOrganization | null>(null);

  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const [orgForm, setOrgForm] = useState<OrgForm>({
    name: "",
    short_desc: "",
    department: "",
    description: "",
    offers: "",
    members: "",
    location: "",
    president: "",
    contact: "",
    banner_url: "",
    logo_url: "",
  });

  const [eventForm, setEventForm] = useState<EventForm>({
    title: "",
    description: "",
    category: "",
    program: "",
    org_id: "",
    date: "",
    time: "",
    venue: "",
    image_url: "",
  });

  const [announcementForm, setAnnouncementForm] =
    useState<AnnouncementForm>({
      title: "",
      message: "",
      target_type: "all",
      target_value: "",
    });

  const [editingAnnouncement, setEditingAnnouncement] =
    useState<EditableAnnouncement | null>(null);

  const [editingEvent, setEditingEvent] =
    useState<EditableEvent | null>(null);

  const [announcementFilter, setAnnouncementFilter] = useState("all_view");
  const [organizationFilter, setOrganizationFilter] = useState("All");

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const loadContactMessages = useCallback(async () => {
    setContactLoading(true);

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Contact messages fetch error:", error);
      setContactMessages([]);
    } else {
      setContactMessages(data || []);
    }

    setContactLoading(false);
  }, []);

  function changeAdminView(view: AdminView) {
    setActiveView(view);

    if (view === "contacts") {
      void loadContactMessages();
    }
  }

  async function markContactMessageAsRead(id: string) {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status: "read" })
      .eq("id", id);

    if (error) {
      console.error("Mark contact message as read error:", error);
      alert("Failed to mark message as read.");
      return;
    }

    await loadContactMessages();
  }

  async function deleteContactMessage(id: string) {
    const confirmed = confirm("Are you sure you want to delete this message?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete contact message error:", error);
      alert("Failed to delete message.");
      return;
    }

    await loadContactMessages();
  }

  const filteredOrganizations = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return organizations.filter((org) => {
      const matchesSearch =
        !keyword ||
        [org.name, org.department, org.category, org.short_desc]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const orgDepartment = (
        org.department ||
        org.category ||
        "NON-ACAD"
      ).toUpperCase();

      const matchesFilter =
        organizationFilter === "All" ||
        orgDepartment === organizationFilter;

      return matchesSearch && matchesFilter;
    });
  }, [organizations, search, organizationFilter]);

  const filteredEvents = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return events;

    return events.filter((event) =>
      [event.title, event.description, event.venue, event.category]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [events, search]);

  const filteredAnnouncements = useMemo(() => {
    const uniqueAnnouncements = Array.from(
      new Map(
        announcements.map((note) => [
          note.announcement_group || note.id,
          note,
        ])
      ).values()
    );

    const keyword = search.toLowerCase().trim();

    return uniqueAnnouncements.filter((note) => {
      const matchesSearch = [note.title, note.message]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

      const matchesFilter =
        announcementFilter === "all_view" ||
        note.target_type === announcementFilter;

      return matchesSearch && matchesFilter;
    });
  }, [announcements, search, announcementFilter]);

  const filteredContactMessages = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return contactMessages;

    return contactMessages.filter((message) =>
      [
        message.name,
        message.email,
        message.concern,
        message.message,
        message.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)
    );
  }, [contactMessages, search]);

  const searchSuggestions = useMemo(() => {
    if (!search.trim()) return [];

    const keyword = search.toLowerCase();

    const suggestions: { label: string; type: AdminView }[] = [
      ...organizations.map((org) => ({
        label: org.name || "Unnamed Organization",
        type: "organizations" as AdminView,
      })),
      ...events.map((event) => ({
        label: event.title || "Untitled Event",
        type: "events" as AdminView,
      })),
      ...users.map((user) => ({
        label: user.full_name || user.email || "Unnamed User",
        type: "users" as AdminView,
      })),
      ...announcements.map((note) => ({
        label: note.title || "Untitled Announcement",
        type: "announcement" as AdminView,
      })),
      ...contactMessages.map((message) => ({
        label: `${message.name} - ${message.concern}`,
        type: "contacts" as AdminView,
      })),
    ];

    return suggestions
      .filter((item) => item.label.toLowerCase().includes(keyword))
      .slice(0, 5);
  }, [search, organizations, events, users, announcements, contactMessages]);

  function goToSearchResult(result: { label: string; type: AdminView }) {
    setSearch(result.label);
    setSelectedSuggestionIndex(-1);
    changeAdminView(result.type);
  }

  const students = users.filter(
    (user) => user.role === "student" || user.role === "officer_admin"
  );

  const firstYear = students.filter(
    (student) => student.year_level === "1"
  ).length;

  const secondYear = students.filter(
    (student) => student.year_level === "2"
  ).length;

  const thirdYear = students.filter(
    (student) => student.year_level === "3"
  ).length;

  const fourthYear = students.filter(
    (student) => student.year_level === "4"
  ).length;

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink Admin"
        message="Loading main admin dashboard..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#202020] overflow-x-hidden flex flex-col lg:block">
      <AdminSidebar
        activeView={activeView}
        setActiveView={changeAdminView}
        logout={logout}
      />

      <section className="lg:ml-[260px] min-h-screen px-4 sm:px-6 lg:px-10 py-6 lg:py-10 min-w-0 overflow-x-hidden">
        <div className="w-full max-w-[1180px] mx-auto min-w-0">
          <AdminHeader
            search={search}
            setSearch={setSearch}
            searchSuggestions={searchSuggestions}
            selectedSuggestionIndex={selectedSuggestionIndex}
            setSelectedSuggestionIndex={setSelectedSuggestionIndex}
            goToSearchResult={goToSearchResult}
          />

          {activeView === "dashboard" && (
            <DashboardView
              filteredOrganizations={filteredOrganizations}
              organizations={organizations}
              events={events}
              students={students}
              firstYear={firstYear}
              secondYear={secondYear}
              thirdYear={thirdYear}
              fourthYear={fourthYear}
              setSelectedOrganization={setSelectedOrganization}
            />
          )}

          {activeView === "organizations" && (
            <OrganizationsView
              filteredOrganizations={filteredOrganizations}
              organizationFilter={organizationFilter}
              setOrganizationFilter={setOrganizationFilter}
              setShowOrgModal={setShowOrgModal}
              setSelectedOrganization={setSelectedOrganization}
            />
          )}

          {activeView === "events" && (
            <EventsView
              filteredEvents={filteredEvents}
              organizations={organizations}
              setShowEventModal={setShowEventModal}
              setEditingEvent={setEditingEvent}
              deleteEvent={(id: string) =>
                deleteEventService(id, refreshDashboard)
              }
            />
          )}

          {activeView === "announcement" && (
            <AnnouncementsView
              filteredAnnouncements={filteredAnnouncements}
              announcementFilter={announcementFilter}
              setAnnouncementFilter={setAnnouncementFilter}
              setShowAnnouncementModal={setShowAnnouncementModal}
              setEditingAnnouncement={setEditingAnnouncement}
              deleteAnnouncement={(note: EditableAnnouncement) =>
                deleteAnnouncementService(note, refreshDashboard)
              }
            />
          )}

          {activeView === "users" && (
            <UsersView
              students={students}
              organizations={organizations}
              updateUserRole={(
                userId: string,
                authId: string,
                role: string,
                orgId: string
              ) =>
                updateUserRoleService(
                  userId,
                  authId,
                  role,
                  orgId,
                  refreshDashboard
                )
              }
            />
          )}

          {activeView === "contacts" && (
            <ContactMessagesView
              contactMessages={filteredContactMessages}
              contactLoading={contactLoading}
              markContactMessageAsRead={markContactMessageAsRead}
              deleteContactMessage={deleteContactMessage}
            />
          )}
        </div>
      </section>

      <CreateOrganizationModal
        show={showOrgModal}
        orgForm={orgForm}
        setOrgForm={setOrgForm}
        departmentOptions={departmentOptions}
        setShowOrgModal={setShowOrgModal}
        createOrganization={() =>
          createOrganizationService(
            orgForm,
            refreshDashboard,
            setShowOrgModal,
            setOrgForm
          )
        }
      />

      <CreateEventModal
        show={showEventModal}
        onClose={() => setShowEventModal(false)}
        eventForm={eventForm}
        setEventForm={setEventForm}
        eventTagOptions={eventTagOptions}
        organizations={organizations}
        createEvent={() =>
          createEventService(
            eventForm,
            adminRow,
            refreshDashboard,
            setShowEventModal,
            setEventForm
          )
        }
      />

      <CreateAnnouncementModal
        show={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        announcementForm={announcementForm}
        setAnnouncementForm={setAnnouncementForm}
        organizations={organizations}
        sendAnnouncement={() =>
          sendAnnouncementService(
            announcementForm,
            users,
            members,
            adminRow,
            setShowAnnouncementModal,
            setAnnouncementForm,
            refreshDashboard
          )
        }
      />

      <OrganizationDetailsModal
        selectedOrganization={selectedOrganization}
        setSelectedOrganization={setSelectedOrganization}
        departmentOptions={departmentOptions}
        uploadOrganizationImage={uploadOrganizationImage}
        updateOrganization={() =>
          updateOrganization(
            selectedOrganization,
            setSelectedOrganization,
            refreshDashboard
          )
        }
        deleteOrganization={(id: string) =>
          deleteOrganizationService(id, refreshDashboard)
        }
      />

      <EditAnnouncementModal
        editingAnnouncement={editingAnnouncement}
        setEditingAnnouncement={setEditingAnnouncement}
        organizations={organizations}
        updateAnnouncement={() =>
          updateAnnouncementService(
            editingAnnouncement,
            setEditingAnnouncement,
            refreshDashboard
          )
        }
      />

      <EditEventModal
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
        organizations={organizations}
        eventTagOptions={eventTagOptions}
        updateEvent={() =>
          updateEventService(
            editingEvent,
            setEditingEvent,
            refreshDashboard
          )
        }
      />
    </main>
  );
}