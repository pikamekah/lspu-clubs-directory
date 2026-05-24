"use client";

type Props = {
  value: string;
  label: string;
  icon: "users" | "calendar" | "chart";
};

export default function HomeStatCard({ value, label, icon }: Props) {
  return (
    <div className="bg-white text-gray-900 rounded-[22px] px-7 py-4 shadow-xl border border-gray-200 flex items-center gap-4 min-h-[78px]">
      <div className="text-green-700">
        {icon === "users" && <UsersIcon />}
        {icon === "calendar" && <CalendarIcon />}
        {icon === "chart" && <ChartIcon />}
      </div>

      <div className="text-left">
        <p className="text-sm font-bold leading-none">{value}</p>
        <p className="text-sm leading-tight">{label}</p>
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 20c.6-4 3-7 6-7s5.4 3 6 7H3z" />
      <path d="M13 20c.4-3 2-5 4-5s3.5 2 4 5h-8z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-10 w-10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className="h-10 w-10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19h16" />
      <path d="M7 16v-5" />
      <path d="M12 16V8" />
      <path d="M17 16v-9" />
    </svg>
  );
}