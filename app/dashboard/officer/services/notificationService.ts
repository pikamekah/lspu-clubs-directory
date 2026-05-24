import { supabase } from "@/app/lib/supabaseClient";
import type { Dispatch, SetStateAction } from "react";
import type { OfficerNotification } from "../types";

export async function openNotification(
    note: OfficerNotification,
    setSelectedNotification: Dispatch<SetStateAction<OfficerNotification | null>>,
    setNotifications: Dispatch<SetStateAction<OfficerNotification[]>>
) {
  setSelectedNotification(note);

  const notificationId = note.notification_id || note.id;

  if (!note.is_read && notificationId) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notificationId
          ? { ...item, is_read: true }
          : item
      )
    );
  }
}

export async function markAllNotificationsAsRead(
    combinedNotifications: OfficerNotification[],
    setNotifications: Dispatch<SetStateAction<OfficerNotification[]>>
) {
  const unreadIds = combinedNotifications
    .filter((note) => !note.is_read)
    .map((note) => note.notification_id || note.id)
    .filter(Boolean);

  if (unreadIds.length === 0) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .in("id", unreadIds);

  if (error) {
    alert(error.message);
    return;
  }

  setNotifications((prev) =>
    prev.map((note) =>
      unreadIds.includes(note.id)
        ? { ...note, is_read: true }
        : note
    )
  );
}