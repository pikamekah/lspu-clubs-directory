"use client";

import { getDepartmentStyle } from "@/app/lib/publicStyles";

type OrganizationSuggestion = {
  id: string;
  slug?: string;
  label: string;
  subtitle: string;
  department: string;
};

type Props = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  activeSearch: string;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  selectedSuggestionIndex: number;
  setSelectedSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  searchSuggestions: OrganizationSuggestion[];
  applySearch: (value: string) => void;
  openSuggestion: (suggestion: OrganizationSuggestion) => void;
  clearSearch: () => void;
};

export default function OrganizationSearchBar({
  searchInput,
  setSearchInput,
  activeSearch,
  showSuggestions,
  setShowSuggestions,
  selectedSuggestionIndex,
  setSelectedSuggestionIndex,
  searchSuggestions,
  applySearch,
  openSuggestion,
  clearSearch,
}: Props) {
  return (
    <div className="relative mb-5">
      <div className="bg-white rounded-[26px] sm:rounded-full p-2 flex flex-col sm:flex-row sm:items-center gap-2 shadow-xl border border-cyan-100">
        <div className="hidden sm:flex items-center pl-5 pr-2 text-cyan-700">
          <SearchIcon />
        </div>

        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowSuggestions(true);
            setSelectedSuggestionIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (!showSuggestions || searchSuggestions.length === 0) {
              if (e.key === "Enter") {
                applySearch(searchInput);
              }

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

              applySearch(searchInput);
            }

            if (e.key === "Escape") {
              setShowSuggestions(false);
              setSelectedSuggestionIndex(-1);
            }
          }}
          placeholder="Search organizations by name or department..."
          title="Search organization"
          aria-label="Search organization"
          className="w-full sm:flex-1 px-4 sm:px-2 py-3 sm:py-0 outline-none text-gray-700 text-sm placeholder:text-gray-400 bg-transparent"
        />

        {(searchInput || activeSearch) && (
          <button
            type="button"
            onClick={clearSearch}
            className="h-9 w-9 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 font-bold transition"
            aria-label="Clear search"
            title="Clear search"
          >
            ×
          </button>
        )}

        <button
          type="button"
          onClick={() => applySearch(searchInput)}
          className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-9 py-3 rounded-full font-extrabold hover:brightness-110 hover:-translate-y-0.5 transition shadow-sm"
        >
          Search
        </button>
      </div>

      {showSuggestions && searchInput.trim() && searchSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[118px] sm:top-[66px] bg-white rounded-[28px] shadow-2xl border border-cyan-100 overflow-hidden z-30">
          {searchSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              onClick={() => openSuggestion(suggestion)}
              className={`w-full text-left px-6 py-4 transition flex items-center justify-between gap-4 ${
                selectedSuggestionIndex === index
                  ? "bg-cyan-50"
                  : "hover:bg-[#f6fffb]"
              }`}
            >
              <div className="min-w-0">
                <p className="font-extrabold text-[#244543] truncate">
                  {suggestion.label}
                </p>

                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                  {suggestion.subtitle}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full h-fit font-bold whitespace-nowrap ${getDepartmentStyle(
                  suggestion.department
                )}`}
              >
                {suggestion.department}
              </span>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && searchInput.trim() && searchSuggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-[118px] sm:top-[66px] bg-white rounded-[28px] shadow-2xl border border-cyan-100 z-30 p-6 text-gray-500">
          No suggestions found.
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-6 w-6"
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