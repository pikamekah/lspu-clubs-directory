"use client";

import { StaggerItem } from "@/components/dashboard/Animated";

type Props = {
  memberCount: number;
  location?: string;
  president: string;
  contact?: string;
};

export default function OrganizationInfoCard({
  memberCount,
  location,
  president,
  contact,
}: Props) {
  return (
    <aside className="bg-white rounded-[36px] p-7 shadow-xl border border-cyan-100 transition duration-300 hover:shadow-2xl hover:-translate-y-1">
      <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
        Club Details
      </p>

      <h2 className="mt-5 font-black text-2xl text-[#244543]">
        Club Information
      </h2>

      <div className="mt-7 space-y-4">
        <StaggerItem delay="delay-0">
          <InfoRow
            label="Members"
            value={`${memberCount} active ${
              memberCount <= 1 ? "member" : "members"
            }`}
            icon="members"
          />
        </StaggerItem>

        <StaggerItem delay="delay-100">
          <InfoRow
            label="Location"
            value={location || "Location not listed"}
            icon="location"
          />
        </StaggerItem>

        <StaggerItem delay="delay-200">
          <InfoRow label="President" value={president} icon="president" />
        </StaggerItem>

        <StaggerItem delay="delay-300">
          <InfoRow
            label="Contact"
            value={contact || "Contact not listed"}
            icon="contact"
          />
        </StaggerItem>
      </div>
    </aside>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "members" | "location" | "president" | "contact";
}) {
  return (
    <div className="group flex items-start gap-4 rounded-2xl bg-[#f6fffb] border border-cyan-100 p-4 transition duration-300 hover:bg-cyan-50 hover:shadow-md hover:-translate-y-0.5">
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white flex items-center justify-center shrink-0 shadow-sm transition duration-300 group-hover:scale-110">
        {icon === "members" && "👥"}
        {icon === "location" && "📍"}
        {icon === "president" && "🏛️"}
        {icon === "contact" && "📞"}
      </div>

      <div className="min-w-0">
        <p className="font-black text-[#244543] leading-tight">{label}</p>
        <p className="mt-1 text-sm text-gray-600 break-words">{value}</p>
      </div>
    </div>
  );
}