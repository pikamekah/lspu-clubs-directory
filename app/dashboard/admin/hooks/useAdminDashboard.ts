"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type {
  AdminUser,
  AdminOrganization,
  AdminEvent,
  AdminMember,
  AdminAnnouncement,
} from "../types";

type AdminRouter = {
  push: (path: string) => void;
};

export default function useAdminDashboard(router: AdminRouter) {
  const [loading, setLoading] = useState(true);
  const [adminRow, setAdminRow] = useState<AdminUser | null>(null);

  const [organizations, setOrganizations] = useState<AdminOrganization[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Admin profile error:", profileError);
        router.push("/login");
        return;
      }

      if (!profile || profile.role !== "main_admin") {
        router.push("/login");
        return;
      }

      setAdminRow(profile);

      const [
        orgResult,
        eventResult,
        userResult,
        memberResult,
        announcementResult,
      ] = await Promise.all([
        supabase
          .from("organizations")
          .select("*")
          .order("name", { ascending: true }),

        supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true })
          .order("time", { ascending: true }),

        supabase
          .from("users")
          .select("*")
          .order("full_name", { ascending: true }),

        supabase
          .from("members")
          .select("*"),

        supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (orgResult.error) console.error("Organizations error:", orgResult.error);
      if (eventResult.error) console.error("Events error:", eventResult.error);
      if (userResult.error) console.error("Users error:", userResult.error);
      if (memberResult.error) console.error("Members error:", memberResult.error);
      if (announcementResult.error) {
        console.error("Announcements error:", announcementResult.error);
      }

      setOrganizations(orgResult.data || []);
      setEvents(eventResult.data || []);
      setUsers(userResult.data || []);
      setMembers(memberResult.data || []);

      const uniqueAnnouncements = Array.from(
        new Map(
          (announcementResult.data || []).map((note) => [note.id, note])
        ).values()
      );

      setAnnouncements(uniqueAnnouncements);
    } catch (error) {
      console.error("Admin dashboard load failed:", error);
      alert("Admin dashboard failed to load. Please check the browser console.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
        },
        () => {
          void loadDashboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "members",
        },
        () => {
          void loadDashboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          void loadDashboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        () => {
          void loadDashboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "organizations",
        },
        () => {
          void loadDashboard();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
        },
        () => {
          void loadDashboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadDashboard]);

  return {
    loading,
    adminRow,
    organizations,
    events,
    users,
    members,
    announcements,
    refreshDashboard: loadDashboard,
  };
}