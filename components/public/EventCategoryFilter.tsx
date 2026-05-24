"use client";

import { getCategoryStyle } from "@/app/lib/publicStyles";

type Props = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

export default function EventCategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div className="mt-5 rounded-[28px] border border-cyan-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const active = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`min-w-[72px] sm:min-w-[86px] rounded-full px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-extrabold transition ${
                active
                  ? cat === "All"
                    ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                    : `${getCategoryStyle(cat)} shadow-sm`
                  : "bg-[#f6fffb] text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}