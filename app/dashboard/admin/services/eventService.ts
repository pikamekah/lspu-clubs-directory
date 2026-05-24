import { supabase } from "@/app/lib/supabaseClient";

type AdminEditableEvent = {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  program?: string;
  org_id?: string | null;
  date?: string;
  time?: string;
  venue?: string;
  image_url?: string;
};

export async function updateEvent(
  editingEvent: AdminEditableEvent | null,
  setEditingEvent: (value: AdminEditableEvent | null) => void,
  refreshDashboard: () => void
) {
  if (!editingEvent?.id) return;

  const title = editingEvent.title?.trim() || "";
  const orgId = editingEvent.org_id?.trim() || "";
  const date = editingEvent.date?.trim() || "";
  const venue = editingEvent.venue?.trim() || "";

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

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: editingEvent.description?.trim() || "",
      category: editingEvent.category?.trim() || "",
      program: editingEvent.program?.trim() || "",
      org_id: orgId,
      date,
      time: editingEvent.time?.trim() || "",
      venue,
      image_url: editingEvent.image_url || "",
    })
    .eq("id", editingEvent.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Event updated!");

  setEditingEvent(null);
  refreshDashboard();
}