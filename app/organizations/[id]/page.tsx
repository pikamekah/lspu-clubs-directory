"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/app/lib/supabaseClient";
import { getDepartmentStyle } from "@/app/lib/publicStyles";
import type { PublicOrganization, PublicEvent } from "@/app/lib/publicTypes";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";
import ScrollReveal from "@/components/dashboard/ScrollReveal";

import JoinForm from "./JoinForm";
import PublicNavbar from "@/components/PublicNavbar";
import LoadingScreen from "@/components/LoadingScreen";
import PublicFooter from "@/components/PublicFooter";

import OrganizationBanner from "./components/OrganizationBanner";
import OrganizationInfoCard from "./components/OrganizationInfoCard";
import OrganizationOffers from "./components/OrganizationOffers";
import OrganizationJoinCard from "./components/OrganizationJoinCard";
import OrganizationEventsList from "./components/OrganizationEventsList";

export default function OrganizationPage() {
  const params = useParams();
  const slug = params.id as string;

  const [org, setOrg] = useState<PublicOrganization | null>(null);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  function isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    );
  }

  const fetchData = useCallback(async () => {
    let orgData: PublicOrganization | null = null;
    let orgError = null;

    const { data: slugData, error: slugError } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    orgData = slugData;
    orgError = slugError;

    if (!orgData && isUuid(slug)) {
      const { data: idData, error: idError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", slug)
        .maybeSingle();

      orgData = idData;
      orgError = idError;
    }

    if (orgError || !orgData) {
      console.error("Organization fetch error:", orgError);
      setOrg(null);
      setLoading(false);
      return;
    }

    setOrg(orgData);

    const today = new Date().toISOString().split("T")[0];

    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("org_id", orgData.id)
      .gte("date", today)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    setEvents(eventData || []);

    const { data: approvedMembers } = await supabase
      .from("members")
      .select("user_id")
      .eq("org_id", orgData.id)
      .ilike("status", "approved");

    const { data: assignedOfficers } = await supabase
      .from("users")
      .select("auth_id")
      .eq("org_id", orgData.id)
      .eq("role", "officer_admin");

    const uniqueMembers = new Set<string>();

    (approvedMembers || []).forEach((member) => {
      if (member.user_id) uniqueMembers.add(member.user_id);
    });

    (assignedOfficers || []).forEach((officer) => {
      if (officer.auth_id) uniqueMembers.add(officer.auth_id);
    });

    setMemberCount(uniqueMembers.size);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existingApplication } = await supabase
        .from("members")
        .select("status")
        .eq("user_id", user.id)
        .eq("org_id", orgData.id)
        .maybeSingle();

      setApplicationStatus(existingApplication?.status || null);
    }

    setLoading(false);
  }, [slug]);

  useEffect(() => {
    async function runFetchData() {
      if (slug) {
        await fetchData();
      }
    }

    runFetchData();
  }, [slug, fetchData]);

  async function handleOpenJoinForm() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please log in first before joining an organization.");
      return;
    }

    setShowJoinForm(true);
  }

  function handleApplicationSubmitted() {
    setApplicationStatus("pending");
    setShowJoinForm(false);
  }

  function getDepartment() {
    return org?.department || org?.category || "Tag";
  }

  function getPresident() {
    return (
      org?.president ||
      org?.officers?.President ||
      org?.officers?.president ||
      "Not listed"
    );
  }

  const normalizedOffers = normalizeOffers(org?.offers);

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink"
        message="Loading organization details..."
      />
    );
  }

  if (!org) {
    return (
      <main className="min-h-screen bg-[#f6fffb] text-[#202020]">
        <PublicNavbar />

        <FadeIn>
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-cyan-100 shadow-xl p-7 sm:p-10 md:p-14">
              <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                Not Found
              </p>

              <h1 className="mt-5 text-3xl md:text-4xl font-black text-[#244543]">
                Organization not found
              </h1>

              <p className="mt-4 text-gray-600">
                The organization may have been removed or the link is incorrect.
              </p>

              <Link
                href="/organizations"
                className="inline-flex mt-8 bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-8 py-3 rounded-full font-extrabold hover:brightness-110 transition"
              >
                Back to Organizations
              </Link>
            </div>
          </section>
        </FadeIn>

        <PublicFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020]">
      <PublicNavbar />

      <FadeIn>
        <OrganizationBanner
          name={org.name}
          bannerUrl={org.banner_url}
          logoUrl={org.logo_url}
        />
      </FadeIn>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-10 sm:pb-12">
        <ScrollReveal once={false}>
          <Link
            href="/organizations"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-cyan-700 hover:text-lime-600 transition"
          >
            ← Back to Organizations
          </Link>
        </ScrollReveal>

        <div className="mt-6 grid lg:grid-cols-[1.55fr_0.95fr] gap-6 lg:gap-10 items-start">
          <StaggerItem delay="delay-0">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-cyan-100 shadow-xl p-6 sm:p-8 md:p-10 transition duration-300 hover:shadow-2xl hover:-translate-y-1">
              <span
                className={`inline-flex text-sm px-5 py-2 rounded-full mb-5 font-extrabold ${getDepartmentStyle(
                  getDepartment()
                )}`}
              >
                {getDepartment()}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight text-[#244543]">
                {org.name || "Organization Name"}
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
                {org.short_desc || "Short description of the club"}
              </p>

              <div className="mt-8 border-t border-cyan-100 pt-7">
                <h3 className="text-xl font-black text-[#244543]">
                  About Us
                </h3>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  {org.description || "No description added yet."}
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem delay="delay-100">
            <OrganizationInfoCard
              memberCount={memberCount}
              location={org.location}
              president={getPresident()}
              contact={org.contact || org.contact_email}
            />
          </StaggerItem>
        </div>
      </section>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-16 grid lg:grid-cols-[1.35fr_1fr] gap-6 lg:gap-10 items-start">
          <StaggerItem delay="delay-0">
            <OrganizationOffers offers={normalizedOffers} />
          </StaggerItem>

          <StaggerItem delay="delay-100">
            <OrganizationJoinCard
              orgName={org.name}
              applicationStatus={applicationStatus}
              onJoinClick={handleOpenJoinForm}
            />
          </StaggerItem>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <OrganizationEventsList
          events={events}
          orgName={org.name}
          orgBannerUrl={org.banner_url}
        />
      </ScrollReveal>

      <PublicFooter />

      {showJoinForm && (
        <JoinForm
          orgName={org.name || "Organization"}
          orgId={org.id}
          orgDepartment={org.department || org.category || ""}
          onClose={() => setShowJoinForm(false)}
          onSubmitted={handleApplicationSubmitted}
        />
      )}
    </main>
  );
}

function normalizeOffers(offers: string | string[] | undefined): string[] {
  if (!offers) return [];

  if (Array.isArray(offers)) return offers;

  if (typeof offers === "string") {
    try {
      const parsed = JSON.parse(offers);

      if (Array.isArray(parsed)) return parsed;

      if (typeof parsed === "string") {
        return parsed
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      return offers
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}