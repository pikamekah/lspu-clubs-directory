"use client";

import AdminIcon from "./AdminIcon";

type Props = {
  value: number;
  label: string;
  title: string;
  icon: string;
  active?: boolean;
};

export default function StatCard({
  value,
  label,
  title,
  icon,
  active = false,
}: Props) {
  return (
    <div
      className={`group min-h-[140px] sm:min-h-[150px] rounded-[24px] sm:rounded-[28px] px-5 sm:px-6 py-5 shadow-sm border transition duration-300 hover:shadow-xl hover:-translate-y-1 ${
        active
          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white border-transparent"
          : "bg-white text-[#244543] border-cyan-100"
      }`}
    >
      <div className="flex h-full items-start justify-between gap-4">
        <div className="min-w-0 flex flex-col">
          <p
            className={`min-h-[32px] text-xs font-black uppercase tracking-wide leading-4 ${
              active ? "text-white/80" : "text-gray-400"
            }`}
          >
            {title}
          </p>

          <p
            className={`mt-2 text-3xl sm:text-4xl font-black leading-none ${
              active ? "text-white" : "text-cyan-700"
            }`}
          >
            {value}
          </p>

          <p
            className={`mt-3 text-sm leading-relaxed ${
              active ? "text-white/90" : "text-gray-500"
            }`}
          >
            {label}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
            active
              ? "bg-white/20 text-white"
              : "bg-[#f6fffb] text-cyan-700 border border-cyan-100 group-hover:bg-cyan-50"
          }`}
        >
          <AdminIcon name={icon} />
        </div>
      </div>
    </div>
  );
}