import { supabase } from "@/app/lib/supabaseClient";

import type {
  AdminUser,
  AdminMember,
  AdminAnnouncement,
  AnnouncementForm,
} from "../types";

type AdminRow = {
  auth_id?: string;
};

export type EditableAnnouncement = AdminAnnouncement & {
  announcement_group?: string;
  title?: string;
  message?: string;
  target_type?: string;
  target_value?: string | null;
};

type TargetRole = "student" | "officer_admin";

type NotificationInsert = {
  user_id?: string;
  org_id?: string | null;
  title: string;
  message: string;
  type: "announcement";
  is_read: boolean;
  announcement_group: string;
  created_by?: string;
  target_type: string;
  target_value: string | null;
  target_role: TargetRole;
};

function uniqueUsers(users: AdminUser[]) {
  return Array.from(
    new Map(
      users
        .filter((user) => user.auth_id)
        .map((user) => [user.auth_id, user])
    ).values()
  );
}

function createNotificationInsert({
  user,
  announcementForm,
  announcementId,
  adminAuthId,
  targetType,
  targetValue,
  targetRole,
  orgId,
}: {
  user: AdminUser;
  announcementForm: AnnouncementForm;
  announcementId: string;
  adminAuthId?: string;
  targetType: string;
  targetValue: string | null;
  targetRole: TargetRole;
  orgId?: string | null;
}): NotificationInsert {
  return {
    user_id: user.auth_id,
    org_id: orgId ?? user.org_id ?? null,
    title: announcementForm.title,
    message: announcementForm.message,
    type: "announcement",
    is_read: false,
    announcement_group: announcementId,
    created_by: adminAuthId,
    target_type: targetType,
    target_value: targetValue,
    target_role: targetRole,
  };
}

function buildAnnouncementNotifications({
  announcementForm,
  users,
  members,
  announcementId,
  adminAuthId,
}: {
  announcementForm: AnnouncementForm;
  users: AdminUser[];
  members: AdminMember[];
  announcementId: string;
  adminAuthId?: string;
}) {
  const targetType = announcementForm.target_type;
  const targetValue = announcementForm.target_value || null;

  if (targetType === "all") {
    const studentSideRecipients = uniqueUsers(
      users.filter(
        (user) => user.role === "student" || user.role === "officer_admin"
      )
    );

    const officerSideRecipients = uniqueUsers(
      users.filter((user) => user.role === "officer_admin")
    );

    return [
      ...studentSideRecipients.map((user) =>
        createNotificationInsert({
          user,
          announcementForm,
          announcementId,
          adminAuthId,
          targetType,
          targetValue,
          targetRole: "student",
        })
      ),

      ...officerSideRecipients.map((user) =>
        createNotificationInsert({
          user,
          announcementForm,
          announcementId,
          adminAuthId,
          targetType,
          targetValue,
          targetRole: "officer_admin",
        })
      ),
    ];
  }

  if (targetType === "officers") {
    const officerRecipients = uniqueUsers(
      users.filter(
        (user) =>
          user.role === "officer_admin" &&
          user.org_id === announcementForm.target_value
      )
    );

    return officerRecipients.map((user) =>
      createNotificationInsert({
        user,
        announcementForm,
        announcementId,
        adminAuthId,
        targetType,
        targetValue,
        targetRole: "officer_admin",
        orgId: user.org_id || targetValue,
      })
    );
  }

  if (targetType === "organization") {
    const approvedMemberIds = members
      .filter(
        (member) =>
          member.org_id === announcementForm.target_value &&
          member.status === "approved"
      )
      .map((member) => member.user_id)
      .filter(Boolean);

    const studentSideRecipients = uniqueUsers(
      users.filter((user) => approvedMemberIds.includes(user.auth_id))
    );

    const officerSideRecipients = uniqueUsers(
      users.filter(
        (user) =>
          user.role === "officer_admin" &&
          user.org_id === announcementForm.target_value
      )
    );

    return [
      ...studentSideRecipients.map((user) =>
        createNotificationInsert({
          user,
          announcementForm,
          announcementId,
          adminAuthId,
          targetType,
          targetValue,
          targetRole: "student",
          orgId: targetValue,
        })
      ),

      ...officerSideRecipients.map((user) =>
        createNotificationInsert({
          user,
          announcementForm,
          announcementId,
          adminAuthId,
          targetType,
          targetValue,
          targetRole: "officer_admin",
          orgId: targetValue,
        })
      ),
    ];
  }

  return [];
}

export async function sendAnnouncement(
  announcementForm: AnnouncementForm,
  users: AdminUser[],
  members: AdminMember[],
  adminRow: AdminRow | null,
  setShowAnnouncementModal: (value: boolean) => void,
  setAnnouncementForm: (value: AnnouncementForm) => void,
  refreshDashboard: () => void
) {
  if (!announcementForm.title.trim() || !announcementForm.message.trim()) {
    alert("Complete announcement fields.");
    return;
  }

  if (
    (announcementForm.target_type === "officers" ||
      announcementForm.target_type === "organization") &&
    !announcementForm.target_value
  ) {
    alert("Please select an organization.");
    return;
  }

  const announcementId = crypto.randomUUID();
  const targetType = announcementForm.target_type;
  const targetValue = announcementForm.target_value || null;

  const inserts = buildAnnouncementNotifications({
    announcementForm,
    users,
    members,
    announcementId,
    adminAuthId: adminRow?.auth_id,
  });

  if (inserts.length === 0) {
    alert("No recipients found for this announcement.");
    return;
  }

  const { error: announcementError } = await supabase
    .from("announcements")
    .insert([
      {
        id: announcementId,
        title: announcementForm.title,
        message: announcementForm.message,
        target_type: targetType,
        target_value: targetValue,
        created_by: adminRow?.auth_id,
      },
    ]);

  if (announcementError) {
    alert(announcementError.message);
    return;
  }

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert(inserts);

  if (notificationError) {
    await supabase
      .from("announcements")
      .delete()
      .eq("id", announcementId);

    alert(notificationError.message);
    return;
  }

  alert("Announcement sent!");

  setShowAnnouncementModal(false);

  setAnnouncementForm({
    title: "",
    message: "",
    target_type: "all",
    target_value: "",
  });

  refreshDashboard();
}

export async function updateAnnouncement(
  editingAnnouncement: EditableAnnouncement | null,
  setEditingAnnouncement: (value: EditableAnnouncement | null) => void,
  refreshDashboard: () => void
) {
  if (!editingAnnouncement) return;

  const announcementId =
    editingAnnouncement.announcement_group || editingAnnouncement.id;

  const targetValue = editingAnnouncement.target_value || null;

  const { error: announcementError } = await supabase
    .from("announcements")
    .update({
      title: editingAnnouncement.title,
      message: editingAnnouncement.message,
      target_type: editingAnnouncement.target_type,
      target_value: targetValue,
    })
    .eq("id", announcementId);

  if (announcementError) {
    alert(announcementError.message);
    return;
  }

  const { error: notificationError } = await supabase
    .from("notifications")
    .update({
      title: editingAnnouncement.title,
      message: editingAnnouncement.message,
      target_type: editingAnnouncement.target_type,
      target_value: targetValue,
    })
    .eq("announcement_group", announcementId);

  if (notificationError) {
    alert(notificationError.message);
    return;
  }

  setEditingAnnouncement(null);
  refreshDashboard();
}

export async function deleteAnnouncement(
  note: EditableAnnouncement,
  refreshDashboard: () => void
) {
  if (!confirm("Delete this announcement?")) return;

  const announcementId = note.announcement_group || note.id;

  const { error: notificationError } = await supabase
    .from("notifications")
    .delete()
    .eq("announcement_group", announcementId);

  if (notificationError) {
    alert(notificationError.message);
    return;
  }

  const { error: announcementError } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

  if (announcementError) {
    alert(announcementError.message);
    return;
  }

  refreshDashboard();
}