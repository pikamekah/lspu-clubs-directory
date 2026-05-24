import { supabase } from "@/app/lib/supabaseClient";

type OrganizationForm = {
  name: string;
  short_desc: string;
  department: string;
  description: string;
  offers: string;
  members: string;
  location: string;
  president: string;
  contact: string;
  banner_url: string;
  logo_url: string;
};

type EventForm = {
  title: string;
  description: string;
  category: string;
  program: string;
  org_id: string;
  date: string;
  time: string;
  venue: string;
  image_url: string;
};

type AdminRow = {
  auth_id?: string;
};

const emptyOrgForm: OrganizationForm = {
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
};

const emptyEventForm: EventForm = {
  title: "",
  description: "",
  category: "",
  program: "",
  org_id: "",
  date: "",
  time: "",
  venue: "",
  image_url: "",
};

export async function createOrganization(
  orgForm: OrganizationForm,
  refreshDashboard: () => void,
  setShowOrgModal: (value: boolean) => void,
  setOrgForm: (value: OrganizationForm) => void
) {
  const name = orgForm.name.trim();
  const department = orgForm.department.trim();

  if (!name) {
    alert("Organization name is required.");
    return;
  }

  if (!department) {
    alert("Please select a department.");
    return;
  }

  const { error } = await supabase.from("organizations").insert([
    {
      name,
      short_desc: orgForm.short_desc.trim(),
      department,
      category: department,
      description: orgForm.description.trim(),
      offers: orgForm.offers.trim(),
      members: Number(orgForm.members) || 0,
      location: orgForm.location.trim(),
      contact: orgForm.contact.trim(),
      contact_email: orgForm.contact.trim(),
      banner_url: orgForm.banner_url,
      logo_url: orgForm.logo_url,
      officers: {
        President: orgForm.president.trim(),
      },
      status: "active",
    },
  ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Organization created!");

  setShowOrgModal(false);
  setOrgForm(emptyOrgForm);
  refreshDashboard();
}

export async function deleteOrganization(
  id: string,
  refreshDashboard: () => void
) {
  if (!confirm("Delete this organization?")) return;

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Organization deleted.");
  refreshDashboard();
}

export async function deleteEvent(
  id: string,
  refreshDashboard: () => void
) {
  if (!confirm("Delete this event?")) return;

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Event deleted.");
  refreshDashboard();
}

export async function createEvent(
  eventForm: EventForm,
  adminRow: AdminRow | null,
  refreshDashboard: () => void,
  setShowEventModal: (value: boolean) => void,
  setEventForm: (value: EventForm) => void
) {
  const title = eventForm.title.trim();
  const orgId = eventForm.org_id.trim();
  const date = eventForm.date.trim();
  const venue = eventForm.venue.trim();

  if (!title) {
    alert("Event title is required.");
    return;
  }

  if (!orgId) {
    alert("Please select an organization.");
    return;
  }

  if (!date) {
    alert("Event date is required.");
    return;
  }

  if (!venue) {
    alert("Event venue is required.");
    return;
  }

  const { error } = await supabase.from("events").insert([
    {
      title,
      description: eventForm.description.trim(),
      category: eventForm.category.trim(),
      program: eventForm.program.trim(),
      org_id: orgId,
      date,
      time: eventForm.time.trim(),
      venue,
      image_url: eventForm.image_url,
      created_by: adminRow?.auth_id,
    },
  ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Event created!");

  setShowEventModal(false);
  setEventForm(emptyEventForm);
  refreshDashboard();
}