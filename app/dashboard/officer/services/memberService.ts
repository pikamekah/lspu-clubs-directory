import { supabase } from "@/app/lib/supabaseClient";
import type { MemberApplication, Organization } from "../types";
import type { Dispatch, SetStateAction } from "react";

export async function approveMember(
  id: string,
  organization: Organization | null,
  refreshDashboard: () => Promise<void>
) {
  const { data: app, error: appError } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (appError || !app) {
    alert("Application not found.");
    return;
  }

  const { error } = await supabase
    .from("members")
    .update({
      status: "approved",
      role: "Member",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: app.user_id,
        org_id: app.org_id,
        title: "Application Approved",
        message: `Your application to ${
          organization?.name || "the organization"
        } was approved.`,
        type: "membership",
        target_role: "student",
        is_read: false,
      },
    ]);

  if (notificationError) {
    alert(notificationError.message);
    return;
  }

  alert("Application approved.");
  await refreshDashboard();
}

export async function rejectMember(
  id: string,
  organization: Organization | null,
  refreshDashboard: () => Promise<void>
) {
  const { data: app, error: appError } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (appError || !app) {
    alert("Application not found.");
    return;
  }

  const { error } = await supabase
    .from("members")
    .update({
      status: "rejected",
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert([
      {
        user_id: app.user_id,
        org_id: app.org_id,
        title: "Application Rejected",
        message: `Your application to ${
          organization?.name || "the organization"
        } was rejected.`,
        type: "membership",
        target_role: "student",
        is_read: false,
      },
    ]);

  if (notificationError) {
    alert(notificationError.message);
    return;
  }

  alert("Application rejected.");
  await refreshDashboard();
}

export async function updateMemberRole(
  id: string,
  role: string,
  setMembers: Dispatch<SetStateAction<MemberApplication[]>>
) {
  const { error } = await supabase
    .from("members")
    .update({ role })
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  setMembers((prev) =>
    prev.map((member) =>
      member.id === id ? { ...member, role } : member
    )
  );
}