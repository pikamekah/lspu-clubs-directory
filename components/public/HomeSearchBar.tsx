"use client";

import type {
  PublicEvent,
  PublicOrganization,
} from "@/app/lib/publicTypes";
import {
  getCategoryStyle,
  getDepartmentStyle,
} from "@/app/lib/publicStyles";

type SearchSuggestion =
  | {
      id: string;
      type: "organization";
      label: string;
      subtitle: string;
      tag: string;
      org: PublicOrganization;
      event: null;
    }
  | {
      id: string;
      type: "event";
      label: string;
      subtitle: string;
      tag: string;
      org: null;
      event: PublicEvent;
    };

type Props = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  selectedSuggestionIndex: number;
  setSelectedSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  searchSuggestions: SearchSuggestion[];
  handleSearch: () => void;
  openSuggestion: (suggestion: SearchSuggestion) => void;
  clearSearch: () => void;
};

export default function HomeSearchBar({
  searchInput,
  setSearchInput,
  showSuggestions,
  setShowSuggestions,
  selectedSuggestionIndex,
  setSelectedSuggestionIndex,
  searchSuggestions,
  handleSearch,
  openSuggestion,
  clearSearch,
}: Props) {
  return (
    <div className="relative w-full min-w-0">
      <div className="bg-white rounded-[26px] sm:rounded-full p-2 flex flex-col sm:flex-row sm:items-center gap-2 shadow-xl border border-cyan-100">
        <div className="flex items-center gap-2 w-full min-w-0">
          <div className="flex items-center pl-4 sm:pl-5 pr-1 sm:pr-2 text-cyan-700 shrink-0">
            <SearchIcon />
          </div>

          <input
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
              setSelectedSuggestionIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (!showSuggestions || searchSuggestions.length === 0) {
                if (e.key === "Enter") handleSearch();
                return;
              }

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

                if (selectedSuggestionIndex >= 0) {
                  const selectedSuggestion =
                    searchSuggestions[selectedSuggestionIndex];

                  if (selectedSuggestion) {
                    openSuggestion(selectedSuggestion);
                    return;
                  }
                }

                handleSearch();
              }

              if (e.key === "Escape") {
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
              }
            }}
            placeholder="Search organizations or events..."
            className="flex-1 min-w-0 text-gray-700 outline-none px-2 py-3 sm:py-0 text-sm placeholder:text-gray-400 bg-transparent"
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="h-9 w-9 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 font-bold transition shrink-0"
              aria-label="Clear search"
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-8 sm:px-9 py-3 rounded-full font-extrabold hover:brightness-110 hover:-translate-y-0.5 transition shadow-sm"
        >
          Search
        </button>
      </div>

      {showSuggestions && searchInput.trim() && searchSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[118px] sm:top-[66px] bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl border border-cyan-100 overflow-hidden z-30 max-h-[360px] overflow-y-auto">
          {searchSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              onClick={() => openSuggestion(suggestion)}
              className={`w-full text-left px-4 sm:px-6 py-4 transition flex items-start sm:items-center justify-between gap-3 sm:gap-4 ${
                selectedSuggestionIndex === index
                  ? "bg-cyan-50"
                  : "hover:bg-[#f6fffb]"
              }`}
            >
              <div className="min-w-0">
                <p className="font-extrabold text-[#244543] line-clamp-1">
                  {suggestion.label}
                </p>

                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 sm:line-clamp-1 mt-1">
                  {suggestion.type === "organization"
                    ? `Organization • ${suggestion.subtitle}`
                    : `Event • ${suggestion.subtitle}`}
                </p>
              </div>

              <span
                className={`text-[10px] sm:text-xs px-3 py-1 rounded-full h-fit font-bold whitespace-nowrap shrink-0 ${
                  suggestion.type === "organization"
                    ? getDepartmentStyle(suggestion.tag)
                    : getCategoryStyle(suggestion.tag)
                }`}
              >
                {suggestion.tag}
              </span>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && searchInput.trim() && searchSuggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-[118px] sm:top-[66px] bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl border border-cyan-100 z-30 p-5 sm:p-6 text-gray-500">
          No suggestions found.
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 sm:h-6 sm:w-6"
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