"use client";

import ContentPanel from "../ContentPanel";
import OrganizationCard from "../OrganizationCard";
import type { AdminOrganization } from "../../types";

type Props = {
  filteredOrganizations: AdminOrganization[];
  organizationFilter: string;
  setOrganizationFilter: (value: string) => void;
  setShowOrgModal: (show: boolean) => void;
  setSelectedOrganization: (org: AdminOrganization) => void;
};

const organizationFilters = [
  "All",
  "CAS",
  "CBAA",
  "CCJE",
  "CIHTM",
  "CCS",
  "CIT",
  "COE",
  "CONAH",
  "CTE",
  "NON-ACAD",
];

export default function OrganizationsView({
  filteredOrganizations,
  organizationFilter,
  setOrganizationFilter,
  setShowOrgModal,
  setSelectedOrganization,
}: Props) {
  return (
    <ContentPanel
      title="Organizations"
      subtitle="Manage accredited school organizations."
      onCreate={() => setShowOrgModal(true)}
    >
      <div className="mb-6 sm:mb-7">
        <p className="text-xs font-black uppercase tracking-wide text-gray-400 mb-3">
          Filter by Department
        </p>

        <div className="flex flex-wrap gap-2 max-w-full">
          {organizationFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setOrganizationFilter(item)}
              className={`px-3 sm:px-4 py-2 rounded-full font-black text-[11px] sm:text-xs transition shadow-sm ${
                organizationFilter === item
                  ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white"
                  : "bg-[#f6fffb] border border-cyan-100 text-cyan-700 hover:bg-cyan-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="bg-[#f6fffb] border border-cyan-100 rounded-[24px] p-8 text-center">
          <p className="font-black text-[#244543]">
            No organizations found
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Try changing the department filter or search keyword.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredOrganizations.map((org) => (
            <OrganizationCard
              key={org.id}
              org={org}
              onView={() => setSelectedOrganization(org)}
            />
          ))}
        </div>
      )}
    </ContentPanel>
  );
}