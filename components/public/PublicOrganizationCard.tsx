"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicOrganization } from "@/app/lib/publicTypes";
import { getDepartmentStyle } from "@/app/lib/publicStyles";

type Props = {
  org: PublicOrganization;
  memberCount?: number;
};

export default function PublicOrganizationCard({ org, memberCount }: Props) {
  const department = org.department || org.category || "NON-ACAD";
  const count = memberCount ?? 0;

  return (
    <Link
      href={`/organizations/${org.slug || org.id}`}
      className="group block h-full overflow-hidden rounded-[24px] sm:rounded-[30px] bg-white border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
    >
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <Image
          src={org.banner_url || org.logo_url || "/lspu-campus.jpg"}
          alt={org.name || "Organization image"}
          title={org.name || "Organization image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        <span
          className={`absolute top-4 right-4 text-[10px] sm:text-xs px-3 py-1.5 rounded-full font-extrabold shadow-sm whitespace-nowrap max-w-[150px] truncate ${getDepartmentStyle(
            department
          )}`}
        >
          {department}
        </span>

        <div className="absolute left-5 bottom-4 right-5">
          <h3 className="text-lg sm:text-xl font-black leading-tight text-white drop-shadow line-clamp-2">
            {org.name || "Organization Name"}
          </h3>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[44px]">
          {org.short_desc || org.description || "No description available."}
        </p>

        <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 text-xs">
          <InfoPill
            label="Members"
            value={`${count} ${count <= 1 ? "member" : "members"}`}
          />

          <InfoPill
            label="Location"
            value={org.location?.trim() || "Not listed"}
          />
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-cyan-700 group-hover:text-lime-600 transition">
          View Club
          <span className="group-hover:translate-x-1 transition">→</span>
        </div>
      </div>
    </Link>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f6fffb] border border-cyan-100 px-4 py-3 min-w-0">
      <p className="text-[10px] uppercase tracking-wide font-extrabold text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-black text-[#244543] truncate" title={value}>
        {value}
      </p>
    </div>
  );
}