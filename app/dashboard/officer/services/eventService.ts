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
  if (!organization) return;

  if (!eventForm.title || !eventForm.date) {
    alert("Event title and date are required.");
    return;
  }

  const payload = {
    ...eventForm,
    image_url: eventBanner || eventForm.image_url,
  };

  if (editingEventId) {
    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", editingEventId);

    if (error) {
      alert(error.message);
      return;
    }
  } else {
    const { error } = await supabase.from("events").insert([
      {
        ...payload,
        org_id: organization.id,
        created_by: userRow?.auth_id,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }
  }

  closeModal();
  await refreshDashboard();
}

export async function deleteEvent(
  id: string,
  refreshDashboard: () => Promise<void>
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

  await refreshDashboard();
}