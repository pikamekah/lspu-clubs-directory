import { supabase } from "@/app/lib/supabaseClient";

import type {
  ClubForm,
  Organization,
} from "../types";

export async function saveClub(
  clubForm: ClubForm,
  organization: Organization | null,
  refreshDashboard: () => Promise<void>
) {
  if (!organization) return;

  const { error } = await supabase
    .from("organizations")
    .update({
      name: clubForm.name,
      short_desc: clubForm.short_desc,
      department: clubForm.department,
      location: clubForm.location,
      contact: clubForm.contact,
      contact_email: clubForm.contact_email,
      description: clubForm.description,
      offers: clubForm.offers,
      banner_url: clubForm.banner_url,
      logo_url: clubForm.logo_url,
    })
    .eq("id", organization.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Club updated!");
  await refreshDashboard();
}