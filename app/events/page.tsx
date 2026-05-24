"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { supabase } from "../lib/supabaseClient";
import ScrollReveal from "@/components/dashboard/ScrollReveal";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";
import PublicNavbar from "@/components/PublicNavbar";
import LoadingScreen from "@/components/LoadingScreen";
import PublicFooter from "@/components/PublicFooter";
import EventCategoryFilter from "@/components/public/EventCategoryFilter";
import EventSearchBar from "@/components/public/EventSearchBar";
import EventCalendarView from "@/components/public/EventCalendarView";
import EventCard from "@/components/EventCard";
import PublicEventModal from "@/components/public/PublicEventModal";
import EventViewToggle from "@/components/public/EventViewToggle";

import type {
  PublicEvent,
  PublicOrganization,
} from "@/app/lib/publicTypes";

const categories = [
  "All",
  "Seminar",
  "Workshop",
  "Competition",
  "Recruitment",
  "Meeting",
  "Social",
];

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="UniLink"
          message="Loading events..."
        />
      }
    >
      <EventsPageContent />
    </Suspense>
  );
}

function EventsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [orgs, setOrgs] = useState<PublicOrganization[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const [view, setView] = useState<"list" | "calendar">("list");

  useEffect(() => {
    async function checkLogin() {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      }
    }

    checkLogin();
  }, [router]);

  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState("");
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  const orgMap = useMemo(() => {
    const mapped: Record<string, PublicOrganization> = {};

    orgs.forEach((org) => {
      mapped[org.id] = org;
    });

    return mapped;
  }, [orgs]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (eventError) {
      console.error("Event fetch error:", eventError);
      setEvents([]);
    } else {
      setEvents(eventData || []);
    }

    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, slug, banner_url, logo_url");

    if (orgError) {
      console.error("Org fetch error:", orgError);
      setOrgs([]);
    } else {
      setOrgs(orgData || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSearchInput(initialSearch);
    setActiveSearch(initialSearch);
  }, [initialSearch]);

  const getOrg = useCallback(
    (orgId: string) => {
      return orgs.find((org) => org.id === orgId || org.slug === orgId);
    },
    [orgs]
  );

  const getOrgName = useCallback(
    (orgId: string) => {
      return getOrg(orgId)?.name || "Organization Name";
    },
    [getOrg]
  );

  const getEventImage = useCallback(
    (event: PublicEvent) => {
      const org = getOrg(event.org_id || "");

      return (
        event.image_url ||
        org?.banner_url ||
        org?.logo_url ||
        "/lspu-campus.jpg"
      );
    },
    [getOrg]
  );

  const filteredEvents = useMemo(() => {
    const keyword = activeSearch.toLowerCase().trim();

    return events.filter((event) => {
      const category = event.category || "";

      const matchesCategory =
        selectedCategory === "All" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !keyword ||
        String(event.title || "").toLowerCase().includes(keyword) ||
        String(event.description || "").toLowerCase().includes(keyword) ||
        String(event.venue || "").toLowerCase().includes(keyword) ||
        String(event.category || "").toLowerCase().includes(keyword) ||
        getOrgName(event.org_id || "").toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [events, activeSearch, selectedCategory, getOrgName]);

  const searchSuggestions = useMemo(() => {
    const keyword = searchInput.toLowerCase().trim();

    if (!keyword) return [];

    return events
      .map((event) => ({
        id: event.id,
        title: event.title || "Untitled Event",
        subtitle: getOrgName(event.org_id || ""),
        category: event.category || "Event",
        event,
      }))
      .filter((item) =>
        [item.title, item.subtitle, item.category]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 6);
  }, [events, searchInput, getOrgName]);

  const monthName = new Date(calendarYear, calendarMonth).toLocaleString(
    "en-US",
    { month: "long" }
  );

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: 9 },
    (_, index) => currentYear - 4 + index
  );

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const startBlankDays = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Array<{ day: number | null; dateKey: string | null }> = [];

    for (let i = 0; i < startBlankDays; i++) {
      days.push({ day: null, dateKey: null });
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = `${calendarYear}-${String(calendarMonth + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      days.push({ day, dateKey });
    }

    while (days.length % 7 !== 0) {
      days.push({ day: null, dateKey: null });
    }

    return days;
  }, [calendarMonth, calendarYear]);

  function getEventsForDate(dateKey: string): PublicEvent[] {
    return filteredEvents.filter((event) => event.date === dateKey);
  }

  function selectCalendarDate(dateKey: string) {
    const eventsForDay = getEventsForDate(dateKey);

    if (eventsForDay.length === 0) {
      setSelectedDate("");
      return;
    }

    setSelectedDate(dateKey);
  }

  const selectedDateEvents: PublicEvent[] = selectedDate
    ? getEventsForDate(selectedDate)
    : [];

  function previousMonth() {
    setShowMonthYearPicker(false);

    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }

    setSelectedDate("");
  }

  function nextMonth() {
    setShowMonthYearPicker(false);

    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }

    setSelectedDate("");
  }

  function formatDateLabel(date?: string) {
    if (!date) return "TBA";

    return new Date(date).toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function applySearch(value: string) {
    const cleanValue = value.trim();

    setActiveSearch(cleanValue);
    setSearchInput(cleanValue);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  }

  function clearSearch() {
    setSearchInput("");
    setActiveSearch("");
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  }

  function openSuggestion(suggestion: {
    title: string;
    event: PublicEvent;
  }) {
    setSearchInput(suggestion.title);
    setActiveSearch(suggestion.title);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    setSelectedEvent(suggestion.event);
  }

  if (loading) {
    return (
      <LoadingScreen
        title="UniLink"
        message="Loading events..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020]">
      <PublicNavbar />

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
              UniLink Events
            </p>

            <h1 className="mt-6 text-3xl sm:text-4xl md:text-6xl font-black leading-tight">
              Browse All Events
            </h1>

            <p className="mt-5 max-w-3xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
              Discover seminars, workshops, meetings, competitions, and other
              activities organized by LSPU student organizations.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ScrollReveal once={false}>
          <div className="text-center mb-10">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Find Events
            </p>

            <h2 className="mt-5 text-2xl sm:text-3xl md:text-4xl font-black text-[#244543]">
              Search and Filter Events
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-relaxed">
              Use the search bar, category filters, or calendar view to quickly find
              upcoming organization activities.
            </p>
          </div>

          <div className="bg-white rounded-[26px] sm:rounded-[36px] border border-cyan-100 shadow-xl p-4 sm:p-5 md:p-6 transition duration-300 hover:shadow-2xl">
            <div className="mb-5">
              <EventViewToggle view={view} setView={setView} />
            </div>

            <EventSearchBar
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

            <EventCategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal once={false}>
          <div className="mt-10">
            {view === "calendar" ? (
              <EventCalendarView
                monthName={monthName}
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                monthOptions={monthOptions}
                yearOptions={yearOptions}
                calendarDays={calendarDays}
                selectedDate={selectedDate}
                selectedDateEvents={selectedDateEvents}
                showMonthYearPicker={showMonthYearPicker}
                setShowMonthYearPicker={setShowMonthYearPicker}
                setCalendarMonth={setCalendarMonth}
                setCalendarYear={setCalendarYear}
                setSelectedDate={setSelectedDate}
                previousMonth={previousMonth}
                nextMonth={nextMonth}
                selectCalendarDate={selectCalendarDate}
                getEventsForDate={getEventsForDate}
                getOrgName={getOrgName}
                getEventImage={getEventImage}
                setSelectedEvent={setSelectedEvent}
                formatDateLabel={formatDateLabel}
              />
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white rounded-[28px] p-10 text-center text-gray-600 border border-cyan-100 shadow-sm">
                No events found.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
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
                    <EventCard
                      event={event}
                      orgName={getOrgName(event.org_id || "")}
                      image={getEventImage(event)}
                      onClick={() => setSelectedEvent(event)}
                    />
                  </StaggerItem>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[30px] sm:rounded-[40px] p-7 sm:p-10 md:p-14 text-white flex flex-col md:flex-row items-center md:items-center justify-between gap-8 shadow-xl transition duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div>
              <p className="text-white/80 text-sm font-extrabold uppercase tracking-wide">
                Stay involved
              </p>

              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black">
                Looking for more campus opportunities?
              </h2>

              <p className="mt-3 text-white/90">
                Browse student organizations and find a community that matches your
                interests.
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
                href="/organizations"
                className="inline-flex items-center justify-center min-w-[190px] bg-[#101415] text-white px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-white hover:text-cyan-700 hover:-translate-y-0.5 transition"
              >
                Browse Organizations
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