import { supabase } from "@/app/lib/supabaseClient";

type AdminEditableOrganization = {
  id: string;
  banner_url?: string;
  logo_url?: string;
  name?: string;
  department?: string;
  description?: string;
  offers?: string | string[];
  location?: string;
  contact?: string;
  president?: string;
};

export async function uploadOrganizationImage(
  file: File,
  type: "banner" | "logo"
) {
  const fileExt = file.name.split(".").pop();
  const safeExt = fileExt || "jpg";

  const fileName = `${Date.now()}-${crypto.randomUUID()}-${type}.${safeExt}`;
  const filePath = `organizations/${fileName}`;

  const { error } = await supabase.storage
    .from("club-images")
    .upload(filePath, file);

  if (error) {
    alert(error.message);
    return "";
  }

  const { data } = supabase.storage
    .from("club-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function updateOrganization(
  selectedOrganization: AdminEditableOrganization | null,
  setSelectedOrganization: (
    value: AdminEditableOrganization | null
  ) => void,
  refreshDashboard: () => void
) {
  if (!selectedOrganization?.id) return;

  const name = selectedOrganization.name?.trim() || "";
  const department = selectedOrganization.department?.trim() || "";

  if (!name) {
    alert("Organization name is required.");
    return;
  }

  if (!department) {
    alert("Please select a department.");
    return;
  }

  const offers = Array.isArray(selectedOrganization.offers)
    ? selectedOrganization.offers.join(", ")
    : selectedOrganization.offers?.trim() || "";

  const { error } = await supabase
    .from("organizations")
    .update({
      banner_url: selectedOrganization.banner_url || "",
      logo_url: selectedOrganization.logo_url || "",
      name,
      department,
      category: department,
      description: selectedOrganization.description?.trim() || "",
      offers,
      location: selectedOrganization.location?.trim() || "",
      contact: selectedOrganization.contact?.trim() || "",
      contact_email: selectedOrganization.contact?.trim() || "",
      officers: {
        President: selectedOrganization.president?.trim() || "",
      },
    })
    .eq("id", selectedOrganization.id);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Organization updated!");

  setSelectedOrganization(null);
  refreshDashboard();
}