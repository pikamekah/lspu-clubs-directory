"use client";

import Image from "next/image";
import type { AdminOrganization } from "../types";
import { getDepartmentStyle } from "@/app/lib/publicStyles";

type Props = {
  org: AdminOrganization;
  onView: () => void;
};

export default function OrganizationCard({
  org,
  onView,
}: Props) {
  const department = org.department || org.category || "NON-ACAD";

  return (
    <div className="group bg-[#f6fffb] rounded-[24px] sm:rounded-[28px] p-4 border border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 min-h-[360px] sm:min-h-[390px] flex flex-col">
      <div className="relative h-[135px] sm:h-[145px] overflow-hidden rounded-[20px] sm:rounded-[22px]">
        <Image
          src={org.banner_url || org.logo_url || "/lspu-campus.jpg"}
          alt={org.name || "Organization banner"}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <span
          className={`absolute right-3 top-3 inline-flex items-center justify-center min-w-[70px] h-8 px-4 rounded-full text-xs font-black whitespace-nowrap shadow-sm ${getDepartmentStyle(
            department
          )}`}
        >
          {department}
        </span>
      </div>

      <div className="mt-5 flex flex-col flex-1 min-w-0">
        <h3
          className="text-lg sm:text-xl font-black leading-tight text-[#244543] line-clamp-2"
          title={org.name || "Organization"}
        >
          {org.name || "Organization"}
        </h3>

        <p className="text-gray-500 text-sm mt-3 line-clamp-4 leading-relaxed">
          {org.short_desc || "No description available."}
        </p>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={onView}
            className="w-full h-[46px] rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black shadow-sm hover:shadow-md hover:brightness-110 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}