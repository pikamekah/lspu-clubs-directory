"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import ScrollReveal from "@/components/dashboard/ScrollReveal";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

import PublicNavbar from "@/components/PublicNavbar";
import LoadingScreen from "@/components/LoadingScreen";
import PublicFooter from "@/components/PublicFooter";
import OrganizationSearchBar from "@/components/public/OrganizationSearchBar";
import DepartmentFilter from "@/components/public/DepartmentFilter";

import PublicOrganizationCard from "@/components/public/PublicOrganizationCard";
import type { PublicOrganization } from "@/app/lib/publicTypes";

const categories = [
  "All",
  "CAS",
  "CBAA",
  "CCJE",
  "CIHTM",
  "CCS",
  "CIT",
  "COE",
  "CONAH",
  "CTE",
  "NON-ACAD",
];

export default function OrganizationsPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="UniLink"
          message="Loading organizations..."
        />
      }
    >
      <OrganizationsPageContent />
    </Suspense>
  );
}

function OrganizationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function checkLogin() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      }
    }

    checkLogin();
  }, [router]);

  const fetchOrganizations = useCallback(async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select(
        "id, name, slug, short_desc, description, department, category, members, location, logo_url, banner_url, status"
      )
      .order("name", { ascending: true });

    if (error) {
      console.error("Organizations fetch error:", error);
      setOrganizations([]);
    } else {
      setOrganizations(data || []);
    }

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

    setLoading(false);
  }, []);

  useEffect(() => {
    async function runFetchOrganizations() {
      await fetchOrganizations();
    }

    runFetchOrganizations();
  }, [fetchOrganizations]);

  function getDepartment(org: PublicOrganization) {
    return (org.department || org.category || "NON-ACAD").toUpperCase();
  }

  const filteredOrganizations = useMemo(() => {
    const keyword = activeSearch.toLowerCase().trim();

    return organizations.filter((org) => {
      const isActive = org.status !== "inactive";
      const department = getDepartment(org);

      const matchesCategory =
        selectedCategory === "All" || department === selectedCategory;

      const matchesSearch =
        !keyword ||
        String(org.name || "").toLowerCase().includes(keyword) ||
        String(org.short_desc || "").toLowerCase().includes(keyword) ||
        String(org.description || "").toLowerCase().includes(keyword) ||
        String(org.department || "").toLowerCase().includes(keyword) ||
        String(org.category || "").toLowerCase().includes(keyword) ||
        String(org.location || "").toLowerCase().includes(keyword);

      return isActive && matchesCategory && matchesSearch;
    });
  }, [organizations, selectedCategory, activeSearch]);

  const searchSuggestions = useMemo(() => {
    const keyword = searchInput.toLowerCase().trim();

    if (!keyword) return [];

    return organizations
      .filter((org) => org.status !== "inactive")
      .map((org) => ({
        id: org.id,
        slug: org.slug,
        label: org.name || "Unnamed Organization",
        subtitle:
          org.short_desc || org.description || "No description available.",
        department: getDepartment(org),
      }))
      .filter((item) =>
        [item.label, item.subtitle, item.department]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 6);
  }, [organizations, searchInput]);

  function applySearch(value: string) {
    const cleanValue = value.trim();

    setSearchInput(cleanValue);
    setActiveSearch(cleanValue);
    setShowSuggestions(false);
  }

  function clearSearch() {
    setSearchInput("");
    setActiveSearch("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  }

  function openSuggestion(suggestion: {
    id: string;
    slug?: string;
    label: string;
  }) {
    setSearchInput(suggestion.label);
    setActiveSearch(suggestion.label);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    router.push(`/organizations/${suggestion.slug || suggestion.id}`);
  }

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink"
        message="Loading organizations..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020]">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <Image
          src="/lspu-school-bg.jpg"
          alt="LSPU campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-cyan-900/30" />

        <FadeIn>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center text-white">
            <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-[0.25em]">
              UniLink Organizations
            </p>

            <h1 className="mt-6 text-3xl sm:text-4xl md:text-6xl font-black leading-tight">
              Browse All Organizations
            </h1>

            <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
              Discover LSPU student organizations, explore club profiles, and find
              the community that matches your interests.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ScrollReveal once={false}>
          <div className="text-center mb-10">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Find Your Club
            </p>

            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-black text-[#244543]">
              Search and Filter Organizations
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
              Use the search bar or department filters to quickly find
              organizations available in UniLink.
            </p>
          </div>

          <div className="bg-white rounded-[26px] sm:rounded-[32px] border border-cyan-100 shadow-xl p-4 sm:p-5 md:p-6 transition duration-300 hover:shadow-2xl">
            <OrganizationSearchBar
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              activeSearch={activeSearch}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              selectedSuggestionIndex={selectedSuggestionIndex}
              setSelectedSuggestionIndex={setSelectedSuggestionIndex}
              searchSuggestions={searchSuggestions}
              applySearch={applySearch}
              openSuggestion={openSuggestion}
              clearSearch={clearSearch}
            />

            <DepartmentFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </ScrollReveal>

                <div className="mt-10">
                  {filteredOrganizations.length === 0 ? (
                    <FadeIn>
                      <div className="bg-white rounded-[28px] p-10 text-center text-gray-600 border border-cyan-100 shadow-sm">
                        No organizations found.
                      </div>
                    </FadeIn>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOrganizations.map((org, index) => (
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
                </div>
      </section>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[30px] sm:rounded-[40px] p-7 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center md:items-center justify-between gap-8 shadow-xl transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div>
              <p className="text-white/80 text-sm font-extrabold uppercase tracking-wide">
                Start exploring
              </p>

              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black">
                Found an organization you like?
              </h2>

              <p className="mt-3 text-white/90">
                Open a club profile to learn more and submit a membership
                application.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/home"
                className="inline-flex items-center justify-center min-w-[130px] bg-white text-cyan-700 px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-gray-100 hover:-translate-y-0.5 transition"
              >
                Home
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center justify-center min-w-[130px] bg-[#101415] text-white px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-white hover:text-cyan-700 hover:-translate-y-0.5 transition"
              >
                View Events
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <PublicFooter />
    </main>
  );
}