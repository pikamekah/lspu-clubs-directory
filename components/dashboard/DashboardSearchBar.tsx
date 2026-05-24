"use client";

type Suggestion = {
  id: string;
  label: string;
  subtitle?: string;
  tag?: string;
};

type Props<T extends Suggestion> = {
  search: string;
  setSearch: (value: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  selectedSuggestionIndex: number;
  setSelectedSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  suggestions: T[];
  placeholder?: string;
  onSearch: () => void;
  onOpenSuggestion: (item: T) => void;
  onClear: () => void;
};

export default function DashboardSearchBar<T extends Suggestion>({
  search,
  setSearch,
  showSuggestions,
  setShowSuggestions,
  selectedSuggestionIndex,
  setSelectedSuggestionIndex,
  suggestions,
  placeholder = "Search here...",
  onSearch,
  onOpenSuggestion,
  onClear,
}: Props<T>) {
  return (
    <div className="relative w-full min-w-0">
      <div className="w-full min-w-0 bg-white rounded-full p-2 flex items-center gap-2 shadow-xl border border-cyan-100">
        <div className="flex items-center justify-center pl-3 sm:pl-5 pr-1 sm:pr-2 text-cyan-700 shrink-0">
          <SearchIcon />
        </div>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
            setSelectedSuggestionIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (!showSuggestions || suggestions.length === 0) {
              if (e.key === "Enter") {
                onSearch();
              }

              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();

              setSelectedSuggestionIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();

              setSelectedSuggestionIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
              );
            }

            if (e.key === "Enter") {
              e.preventDefault();

              if (selectedSuggestionIndex >= 0) {
                const selectedSuggestion = suggestions[selectedSuggestionIndex];

                if (selectedSuggestion) {
                  onOpenSuggestion(selectedSuggestion);
                  return;
                }
              }

              onSearch();
            }

            if (e.key === "Escape") {
              setShowSuggestions(false);
              setSelectedSuggestionIndex(-1);
            }
          }}
          placeholder={placeholder}
          title="Search"
          aria-label="Search"
          className="flex-1 min-w-0 px-1 sm:px-2 outline-none text-gray-700 text-xs sm:text-sm placeholder:text-gray-400"
        />

        {search && (
          <button
            type="button"
            onClick={onClear}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 font-bold transition shrink-0"
            aria-label="Clear search"
            title="Clear search"
          >
            ×
          </button>
        )}

        <button
          type="button"
          onClick={onSearch}
          className="h-9 sm:h-11 w-9 sm:w-auto sm:px-7 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white text-xs sm:text-sm font-extrabold hover:brightness-110 transition shadow-sm shrink-0 flex items-center justify-center"
          aria-label="Search"
          title="Search"
        >
          <span className="hidden sm:inline">Search</span>
          <span className="sm:hidden">
            <SearchIconSmall />
          </span>
        </button>
      </div>

      {showSuggestions && search.trim() && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[58px] sm:top-[66px] bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl border border-cyan-100 overflow-hidden z-[999]">
          {suggestions.slice(0, 6).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              onClick={() => onOpenSuggestion(item)}
              className={`w-full text-left px-4 sm:px-6 py-4 transition flex items-center justify-between gap-3 ${
                selectedSuggestionIndex === index
                  ? "bg-cyan-50"
                  : "hover:bg-[#f6fffb]"
              }`}
            >
              <div className="min-w-0">
                <p className="font-extrabold text-sm text-[#244543] truncate">
                  {item.label}
                </p>

                {item.subtitle && (
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 mt-1">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {item.tag && (
                <span className="text-[10px] sm:text-xs px-3 py-1 rounded-full h-fit font-bold whitespace-nowrap bg-cyan-50 text-cyan-700">
                  {item.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {showSuggestions && search.trim() && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-[58px] sm:top-[66px] bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl border border-cyan-100 z-[999] p-5 text-sm text-gray-500">
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

function SearchIconSmall() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}