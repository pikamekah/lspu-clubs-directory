"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

import PublicNavbar from "@/components/PublicNavbar";
import LoadingScreen from "@/components/LoadingScreen";
import PublicFooter from "@/components/PublicFooter";
import PublicEventModal from "@/components/public/PublicEventModal";
import PublicOrganizationCard from "@/components/public/PublicOrganizationCard";
import PublicEventCard from "@/components/public/PublicEventCard";
import HomeSearchBar from "@/components/public/HomeSearchBar";
import HomeStatCard from "@/components/public/HomeStatCard";
import ScrollReveal from "@/components/dashboard/ScrollReveal";

import type {
  PublicOrganization,
  PublicEvent,
} from "@/app/lib/publicTypes";

type HomeUserProfile = {
  role: string | null;
};

function getDashboardPath(role?: string | null) {
  if (role === "main_admin") return "/dashboard/admin";
  return "/dashboard/student";
}

export default function HomePage() {
  const router = useRouter();

  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [orgMap, setOrgMap] = useState<Record<string, PublicOrganization>>({});
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [userProfile, setUserProfile] = useState<HomeUserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("users")
        .select("role")
        .eq("auth_id", data.session.user.id)
        .single();

      if (error) {
        console.error("Home profile fetch error:", error);
        return;
      }

      setUserProfile(profile);
    }

    checkLogin();
  }, [router]);

  const loadHomeData = useCallback(async () => {
    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .select(
        "id, name, slug, short_desc, description, category, department, members, location, logo_url, banner_url, status"
      )
      .order("name", { ascending: true });

    if (orgError) {
      console.error("Organization fetch error:", orgError);
    }

    const safeOrgs = orgData || [];
    setOrganizations(safeOrgs);

    const mappedOrgs = safeOrgs.reduce(
      (acc: Record<string, PublicOrganization>, org: PublicOrganization) => {
        acc[org.id] = org;
        return acc;
      },
      {}
    );

    setOrgMap(mappedOrgs);

    const { data: memberRows, error: memberError } = await supabase
      .from("members")
      .select("org_id, user_id")
      .eq("status", "approved");

    const { data: officerRows, error: officerError } = await supabase
      .from("users")
      .select("org_id, auth_id")
      .eq("role", "officer_admin");

    if (memberError || officerError) {
      console.error("Member count fetch error:", memberError || officerError);
      setMemberCounts({});
    } else {
      const countMap: Record<string, Set<string>> = {};

      (memberRows || []).forEach((member) => {
        if (!member.org_id || !member.user_id) return;

        if (!countMap[member.org_id]) {
          countMap[member.org_id] = new Set();
        }

        countMap[member.org_id].add(member.user_id);
      });

      (officerRows || []).forEach((officer) => {
        if (!officer.org_id || !officer.auth_id) return;

        if (!countMap[officer.org_id]) {
          countMap[officer.org_id] = new Set();
        }

        countMap[officer.org_id].add(officer.auth_id);
      });

      const finalCounts: Record<string, number> = {};

      Object.entries(countMap).forEach(([orgId, users]) => {
        finalCounts[orgId] = users.size;
      });

      setMemberCounts(finalCounts);
    }

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .limit(6);

    if (eventError) {
      console.error("Event fetch error:", eventError);
    }

    setEvents(eventData || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    async function runLoadHomeData() {
      await loadHomeData();
    }

    runLoadHomeData();
  }, [loadHomeData]);

  function handleSearch() {
    const keyword = searchInput.trim();

    if (!keyword) return;

    const normalizedKeyword = keyword.toLowerCase();

    const organizationMatch = organizations.some((org) =>
      [
        org.name,
        org.short_desc,
        org.description,
        org.department,
        org.category,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedKeyword)
    );

    const eventMatch = events.some((event) =>
      [
        event.title,
        event.description,
        event.category,
        event.venue,
        orgMap[event.org_id || ""]?.name,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedKeyword)
    );

    if (organizationMatch) {
      router.push(`/organizations?search=${encodeURIComponent(keyword)}`);
      return;
    }

    if (eventMatch) {
      router.push(`/events?search=${encodeURIComponent(keyword)}`);
      return;
    }

    router.push(`/organizations?search=${encodeURIComponent(keyword)}`);
  }

  const featuredOrganizations = useMemo(() => {
    return organizations
      .filter((org) => org.status !== "inactive")
      .slice(0, 3);
  }, [organizations]);

  const featuredEvents = useMemo(() => {
    return events.slice(0, 3);
  }, [events]);

  const searchSuggestions = useMemo(() => {
    const keyword = searchInput.toLowerCase().trim();

    if (!keyword) return [];

    const orgSuggestions = organizations
      .filter((org) => org.status !== "inactive")
      .map((org) => ({
        id: `org-${org.id}`,
        type: "organization" as const,
        label: org.name || "Unnamed Organization",
        subtitle: org.short_desc || org.description || "Organization",
        tag: (org.department || org.category || "NON-ACAD").toUpperCase(),
        org,
        event: null,
      }));

    const eventSuggestions = events.map((event) => ({
      id: `event-${event.id}`,
      type: "event" as const,
      label: event.title || "Untitled Event",
      subtitle: orgMap[event.org_id || ""]?.name || "Organization",
      tag: event.category || "Event",
      org: null,
      event,
    }));

    return [...orgSuggestions, ...eventSuggestions]
      .filter((item) =>
        [item.label, item.subtitle, item.tag]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 6);
  }, [organizations, events, orgMap, searchInput]);

  const activeOrganizationCount = organizations.filter(
    (org) => org.status !== "inactive"
  ).length;

  const dashboardPath = getDashboardPath(userProfile?.role);

  function openSuggestion(suggestion: (typeof searchSuggestions)[number]) {
    setSearchInput(suggestion.label);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    if (suggestion.type === "organization" && suggestion.org) {
      router.push(`/organizations/${suggestion.org.slug || suggestion.org.id}`);
      return;
    }

    if (suggestion.type === "event" && suggestion.event) {
      setSelectedEvent(suggestion.event);
    }
  }

  function clearSearch() {
    setSearchInput("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  }

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink"
        message="Loading homepage..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020]">
      <PublicNavbar />

      <FadeIn>
        <section className="relative overflow-hidden">
          <Image
            src="/lspu-school-bg.jpg"
            alt="Laguna State Polytechnic University"
            title="Laguna State Polytechnic University"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-cyan-900/30" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-12 items-center">
            <div className="text-white">
              <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-[0.25em]">
                Student Home
              </p>

              <h1 className="mt-6 sm:mt-7 text-4xl sm:text-5xl md:text-7xl font-black leading-[0.98] tracking-tight">
                Find your
                <br />
                dream club.
              </h1>

              <p className="mt-5 sm:mt-7 max-w-xl text-white/90 text-base sm:text-lg leading-relaxed">
                Explore LSPU organizations, discover upcoming events, and stay
                connected with campus announcements through UniLink.
              </p>

              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/organizations"
                  className="w-full sm:w-auto text-center bg-gradient-to-r from-cyan-500 to-lime-400 text-white px-8 py-4 rounded-full font-extrabold shadow-lg hover:brightness-110 transition"
                >
                  Browse Organizations
                </Link>

                <Link
                  href="/events"
                  className="w-full sm:w-auto text-center bg-white/15 border border-white/40 text-white px-8 py-4 rounded-full font-extrabold backdrop-blur-sm hover:bg-white hover:text-cyan-700 transition"
                >
                  View Events
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400/40 to-lime-300/40 rounded-[42px] blur-2xl" />

              <div className="relative bg-white/95 rounded-[38px] p-7 shadow-2xl unilink-breathe-card">
                <div className="relative h-[260px] rounded-[30px] overflow-hidden">
                  <Image
                    src="/lspu-school-bg.jpg"
                    alt="LSPU campus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-cover"
                  />
                </div>

                <div className="mt-7">
                  <p className="text-sm font-extrabold text-cyan-600 uppercase tracking-wide">
                    Why use UniLink?
                  </p>

                  <h2 className="mt-2 text-3xl font-black leading-tight text-[#244543]">
                    One place for clubs, events, and updates.
                  </h2>

                  <div className="mt-6 space-y-4">
                    <MiniFeature
                      title="Explore organizations"
                      description="Find clubs that match your interests and goals."
                    />

                    <MiniFeature
                      title="Track events"
                      description="Stay updated with student organization activities."
                    />

                    <MiniFeature
                      title="Join communities"
                      description="Submit applications and connect with campus groups."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <StaggerItem delay="delay-0">
            <HomeStatCard
              value={`${activeOrganizationCount}`}
              label="Active Organizations"
              icon="users"
            />
          </StaggerItem>

          <StaggerItem delay="delay-100">
            <HomeStatCard
              value={`${events.length}`}
              label="Upcoming Events"
              icon="calendar"
            />
          </StaggerItem>

          <StaggerItem delay="delay-200">
            <HomeStatCard
              value="1000+"
              label="Student Members"
              icon="chart"
            />
          </StaggerItem>
        </div>
      </section>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
          <div className="text-center mb-8">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Search UniLink
            </p>

            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-black text-[#244543]">
              Find organizations and events faster
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
              Search for clubs, activities, categories, or organization names in one
              place.
            </p>
          </div>

          <div className="bg-white rounded-[26px] sm:rounded-[32px] border border-cyan-100 shadow-xl p-4 sm:p-5 md:p-7">
            <HomeSearchBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              selectedSuggestionIndex={selectedSuggestionIndex}
              setSelectedSuggestionIndex={setSelectedSuggestionIndex}
              searchSuggestions={searchSuggestions}
              handleSearch={handleSearch}
              openSuggestion={openSuggestion}
              clearSearch={clearSearch}
            />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
            <div>
              <p className="inline-flex bg-lime-50 text-lime-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                Featured Clubs
              </p>

              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-black text-[#244543]">
                Featured Organizations
              </h2>

              <p className="mt-3 text-gray-600">
                Start exploring active student organizations in UniLink.
              </p>
            </div>

            <Link
              href="/organizations"
              className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-6 py-3 rounded-full font-extrabold hover:brightness-110 transition"
            >
              View all →
            </Link>
          </div>

          {featuredOrganizations.length === 0 ? (
            <div className="bg-white text-gray-600 rounded-[28px] p-10 border border-cyan-100 shadow-sm text-center">
              No organizations available yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {featuredOrganizations.map((org, index) => (
                <StaggerItem
                  key={org.id}
                  delay={
                    index % 4 === 0
                      ? "delay-0"
                      : index % 4 === 1
                      ? "delay-100"
                      : index % 4 === 2
                      ? "delay-200"
                      : "delay-300"
                  }
                >
                  <PublicOrganizationCard
                    org={org}
                    memberCount={memberCounts[org.id] || 0}
                  />
                </StaggerItem>
              ))}
            </div>
          )}
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="bg-white px-4 sm:px-6 py-14 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
              <div>
                <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                  Campus Activities
                </p>

                <h2 className="mt-4 text-3xl md:text-4xl font-black text-[#244543]">
                  Upcoming Events
                </h2>

                <p className="mt-3 text-gray-600">
                  Check the latest activities organized by LSPU student
                  organizations.
                </p>
              </div>

              <Link
                href="/events"
                className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-6 py-3 rounded-full font-extrabold hover:brightness-110 transition"
              >
                View all →
              </Link>
            </div>

            {featuredEvents.length === 0 ? (
              <div className="bg-[#f8fffb] text-gray-600 rounded-[28px] p-10 border border-cyan-100 shadow-sm text-center">
                No upcoming events yet.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {featuredEvents.map((event: PublicEvent, index: number) => {
                  const eventOrg = event.org_id ? orgMap[event.org_id] : undefined;

                  return (
                    <StaggerItem
                      key={event.id}
                      delay={
                        index % 4 === 0
                          ? "delay-0"
                          : index % 4 === 1
                          ? "delay-100"
                          : index % 4 === 2
                          ? "delay-200"
                          : "delay-300"
                      }
                    >
                      <PublicEventCard
                        event={event}
                        org={eventOrg}
                        onClick={() => setSelectedEvent(event)}
                      />
                    </StaggerItem>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[28px] sm:rounded-[40px] p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-7 sm:gap-8 shadow-xl">
            <div>
              <p className="text-white/80 text-sm font-extrabold uppercase tracking-wide">
                Keep exploring
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-black">
                Ready to connect with more campus organizations?
              </h2>

              <p className="mt-3 text-white/90">
                Browse organizations, view events, and manage your student profile.
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 shrink-0">
              <Link
                href="/organizations"
                className="w-full sm:w-auto inline-flex items-center justify-center min-w-[150px] bg-white text-cyan-700 px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-gray-100 hover:-translate-y-0.5 transition"
              >
                Organizations
              </Link>

              <Link
                href={dashboardPath}
                className="w-full sm:w-auto inline-flex items-center justify-center min-w-[150px] bg-[#101415] text-white px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-white hover:text-cyan-700 hover:-translate-y-0.5 transition"
              >
                My Profile
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <PublicFooter />

      <PublicEventModal
        event={selectedEvent}
        orgMap={orgMap}
        onClose={() => setSelectedEvent(null)}
      />
    </main>
  );
}

function MiniFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 shrink-0 flex items-center justify-center text-white font-black">
        ✓
      </div>

      <div>
        <h3 className="font-extrabold text-[#244543]">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}