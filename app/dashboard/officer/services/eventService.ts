import { supabase } from "@/app/lib/supabaseClient";

import type {
  EventForm,
  OfficerUser,
  Organization,
} from "../types";

export async function saveEvent(
  eventForm: EventForm,
  eventBanner: string,
  editingEventId: string | null,
  organization: Organization | null,
  userRow: OfficerUser | null,
  refreshDashboard: () => Promise<void>,
  closeModal: () => void
) {
  if (!organization) {
    alert("No assigned organization found.");
    return;
  }

  const title = eventForm.title?.trim();
  const date = eventForm.date?.trim();

  if (!title || !date) {
    alert("Event title and date are required.");
    return;
  }

  const payload = {
    title,
    category: eventForm.category || "",
    date,
    time: eventForm.time || "",
    venue: eventForm.venue || "",
    description: eventForm.description || "",
    image_url: eventBanner || eventForm.image_url || "",
    org_id: organization.id,
  };

  if (editingEventId) {
    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", editingEventId)
      .eq("org_id", organization.id);

    if (error) {
      console.error("Officer event update error:", error);
      alert(error.message);
      return;
    }
  } else {
    const { error } = await supabase.from("events").insert([
      {
        ...payload,
        created_by: userRow?.auth_id || null,
      },
    ]);

    if (error) {
      console.error("Officer event insert error:", error);
      alert(error.message);
      return;
    }
  }

  closeModal();
  await refreshDashboard();
}

export async function deleteEvent(
  id: string,
  organization: Organization | null,
  refreshDashboard: () => Promise<void>
) {
  if (!organization) {
    alert("No assigned organization found.");
    return;
  }

  if (!confirm("Delete this event?")) return;

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("org_id", organization.id);

  if (error) {
    console.error("Officer event delete error:", error);
    alert(error.message);
    return;
  }

  await refreshDashboard();
}