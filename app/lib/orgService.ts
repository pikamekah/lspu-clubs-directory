import { supabase } from "./supabaseClient";

export type OrganizationInput = {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  short_desc?: string;
  department?: string;
  category?: string;
  members?: number;
  location?: string;
  contact?: string;
  officers?: Record<string, string>;
  offers?: string[];
  logo_url?: string;
  banner_url?: string;
  status?: string;
  is_academic?: boolean;
};

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalize(data: OrganizationInput) {
  const department = data.department || data.category || "NON-ACAD";

  return {
    name: data.name.trim(),
    slug: data.slug?.trim() || makeSlug(data.name),
    description: data.description ?? "",
    short_desc: data.short_desc ?? "",
    department,
    category: data.category || department,
    members: Number(data.members ?? 0),
    location: data.location ?? "",
    contact: data.contact ?? "",
    officers: data.officers ?? {},
    offers: data.offers ?? [],
    logo_url: data.logo_url ?? null,
    banner_url: data.banner_url ?? null,
    status: data.status ?? "active",
    is_academic: data.is_academic ?? department !== "NON-ACAD",
  };
}

export async function upsertOrganization(data: OrganizationInput) {
  const payload = normalize(data);

  if (data.id) {
    const { data: updated, error } = await supabase
      .from("organizations")
      .update(payload)
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  const { data: inserted, error } = await supabase
    .from("organizations")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return inserted;
}

export async function deleteOrganization(id: string) {
  const { error } = await supabase
    .from("organizations")
    .update({ status: "inactive" })
    .eq("id", id);

  if (error) throw error;
}