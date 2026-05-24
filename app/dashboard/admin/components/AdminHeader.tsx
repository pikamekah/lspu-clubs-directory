"use client";

import type { AdminView } from "../types";

type SearchSuggestion = {
  label: string;
  type: AdminView;
};

type Props = {
  search: string;
  setSearch: (value: string) => void;
  searchSuggestions: SearchSuggestion[];
  selectedSuggestionIndex: number;
  setSelectedSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  goToSearchResult: (result: SearchSuggestion) => void;
};

export default function AdminHeader({
  search,
  setSearch,
  searchSuggestions,
  selectedSuggestionIndex,
  setSelectedSuggestionIndex,
  goToSearchResult,
}: Props) {
  return (
    <header className="relative z-30 mb-10">
      <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between gap-5 lg:gap-6">
        <div>
          <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
            Main Administrator
          </p>

          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black text-[#244543] leading-tight">
            Welcome back, Admin!
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl">
            Create and monitor organizations, events, users, and announcements.
          </p>
        </div>

        <div className="relative w-full lg:w-[460px] min-w-0">
          <div className="h-12 sm:h-14 rounded-full bg-white pl-4 sm:pl-6 pr-2 flex items-center shadow-md border border-cyan-100 min-w-0 overflow-hidden">
            <SearchIcon />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedSuggestionIndex(-1);
              }}
              onKeyDown={(e) => {
                if (searchSuggestions.length === 0) return;

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedSuggestionIndex((prev) =>
                    prev < searchSuggestions.length - 1 ? prev + 1 : 0
                  );
                }

                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedSuggestionIndex((prev) =>
                    prev > 0 ? prev - 1 : searchSuggestions.length - 1
                  );
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  goToSearchResult(
                    selectedSuggestionIndex >= 0
                      ? searchSuggestions[selectedSuggestionIndex]
                      : searchSuggestions[0]
                  );
                }

                if (e.key === "Escape") {
                  setSearch("");
                  setSelectedSuggestionIndex(-1);
                }
              }}
              placeholder="Search organizations, events, users..."
              className="ml-3 sm:ml-4 flex-1 bg-transparent outline-none text-xs sm:text-sm text-gray-700 placeholder:text-gray-400 min-w-0"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedSuggestionIndex(-1);
                }}
                className="h-10 w-10 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 font-black transition shrink-0"
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {search.trim() && searchSuggestions.length > 0 && (
            <div className="absolute top-[56px] sm:top-[64px] left-0 right-0 bg-white rounded-[24px] shadow-xl border border-cyan-100 overflow-hidden z-50 p-2">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.label}-${index}`}
                  type="button"
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  onClick={() => goToSearchResult(suggestion)}
                  className={`w-full text-left px-4 py-3 rounded-2xl transition text-sm ${
                    selectedSuggestionIndex === index
                      ? "bg-cyan-50 text-cyan-700"
                      : "hover:bg-cyan-50 text-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-extrabold truncate">
                      {suggestion.label}
                    </span>

                    <span className="shrink-0 text-[11px] font-black uppercase tracking-wide text-gray-400">
                      {getViewLabel(suggestion.type)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {search.trim() && searchSuggestions.length === 0 && (
            <div className="absolute top-[56px] sm:top-[64px] left-0 right-0 bg-white rounded-[24px] shadow-xl border border-cyan-100 z-50 p-5">
              <p className="text-sm font-bold text-gray-500">
                No results found.
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getViewLabel(type: AdminView) {
  if (type === "dashboard") return "Dashboard";
  if (type === "organizations") return "Organization";
  if (type === "events") return "Event";
  if (type === "announcement") return "Announcement";
  if (type === "users") return "Student";

  return "Result";
}

function SearchIcon() {
  return (
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-700 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}