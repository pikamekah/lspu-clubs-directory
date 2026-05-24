"use client";

export default function AdminIcon({ name }: { name: string }) {
  const common = "w-5 h-5 shrink-0";

  if (name === "organizations") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.5" />
        <path d="M3 20c.6-4 3-7 6-7s5.4 3 6 7H3z" />
        <path d="M13 20c.4-3 2-5 4-5s3.5 2 4 5h-8z" />
      </svg>
    );
  }

  if (name === "events") {
    return (
      <svg
        className={common}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    );
  }

  if (name === "students") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1-5 4-8 8-8s7 3 8 8H4z" />
      </svg>
    );
  }

  if (name === "dashboard") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor">
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </svg>
    );
  }

  return (
    <svg
      className={common}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}