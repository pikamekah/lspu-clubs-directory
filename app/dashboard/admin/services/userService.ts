import { supabase } from "@/app/lib/supabaseClient";

export async function updateUserRole(
  userId: string,
  authId: string,
  role: string,
  orgId: string,
  refreshDashboard: () => void
) {
  if (!userId || !authId) {
    alert("User information is missing.");
    return;
  }

  if (role === "officer_admin" && !orgId) {
    alert("Please select an organization for the officer admin.");
    return;
  }

  const { error: userError } = await supabase
    .from("users")
    .update({
      role,
      org_id: role === "officer_admin" ? orgId : null,
    })
    .eq("id", userId);

  if (userError) {
    alert(userError.message);
    return;
  }

  alert("User role updated successfully.");
  refreshDashboard();
}