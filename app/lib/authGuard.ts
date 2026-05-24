import { supabase } from "./supabaseClient";

export async function getCurrentUserRole() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("role, org_id, email")
    .eq("auth_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}