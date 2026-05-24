"use client";

import { getDepartmentStyle } from "@/app/lib/publicStyles";

type Props = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};

export default function DepartmentFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div className="mt-5 rounded-[28px] border border-cyan-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((category) => {
          const active = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`min-w-[68px] sm:min-w-[78px] rounded-full px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-extrabold transition ${
                active
                  ? category === "All"
                    ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                    : `${getDepartmentStyle(category)} shadow-sm`
                  : "bg-[#f6fffb] text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}