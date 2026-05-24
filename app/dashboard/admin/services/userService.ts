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

  if (role === "officer_admin") {
    const { data: existingMember, error: existingMemberError } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", authId)
      .eq("org_id", orgId)
      .maybeSingle();

    if (existingMemberError) {
      alert(existingMemberError.message);
      return;
    }

    if (existingMember) {
      const { error: memberUpdateError } = await supabase
        .from("members")
        .update({
          status: "approved",
          role: "Officer",
        })
        .eq("id", existingMember.id);

      if (memberUpdateError) {
        alert(memberUpdateError.message);
        return;
      }
    } else {
      const { error: memberInsertError } = await supabase
        .from("members")
        .insert([
          {
            user_id: authId,
            org_id: orgId,
            status: "approved",
            role: "Officer",
          },
        ]);

      if (memberInsertError) {
        alert(memberInsertError.message);
        return;
      }
    }
  }

  if (role === "student") {
    const { error: memberRoleError } = await supabase
      .from("members")
      .update({
        role: "Member",
      })
      .eq("user_id", authId)
      .eq("role", "Officer");

    if (memberRoleError) {
      alert(memberRoleError.message);
      return;
    }
  }

  alert("User role updated successfully.");
  refreshDashboard();
}