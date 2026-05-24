"use client";

import OrganizationCard from "../OrganizationCard";
import StatCard from "../StatCard";
import Legend from "../Legend";
import DonutChart from "../DonutChart";

import type {
  AdminOrganization,
  AdminEvent,
  AdminUser,
} from "../../types";

type Props = {
  filteredOrganizations: AdminOrganization[];
  organizations: AdminOrganization[];
  events: AdminEvent[];
  students: AdminUser[];
  firstYear: number;
  secondYear: number;
  thirdYear: number;
  fourthYear: number;
  setSelectedOrganization: (org: AdminOrganization) => void;
};

export default function DashboardView({
  filteredOrganizations,
  organizations,
  events,
  students,
  firstYear,
  secondYear,
  thirdYear,
  fourthYear,
  setSelectedOrganization,
}: Props) {
  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-5 sm:gap-6 w-full min-w-0">
      <div className="space-y-6 min-w-0">
        <section className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-cyan-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#244543]">
                Accredited School Organizations
              </h2>

              <p className="text-gray-500 mt-1 text-sm">
                Track all recognized organizations in UniLink.
              </p>
            </div>

            <span className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
              {organizations.length} Total
            </span>
          </div>

          {filteredOrganizations.length === 0 ? (
            <div className="mt-7 bg-[#f6fffb] border border-cyan-100 rounded-[24px] p-8 text-center">
              <p className="font-black text-[#244543]">
                No organizations found
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Matching organizations will appear here.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mt-7">
              {filteredOrganizations.slice(0, 2).map((org) => (
                <OrganizationCard
                  key={org.id}
                  org={org}
                  onView={() => setSelectedOrganization(org)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            value={organizations.length}
            label="Active Organizations"
            title="Total Clubs"
            icon="organizations"
          />

          <StatCard
            value={events.length}
            label="Managed Events"
            title="Events"
            icon="events"
          />

          <StatCard
            value={students.length}
            label="Registered Students"
            title="Students"
            icon="students"
          />
        </div>
      </div>

      <section className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-cyan-100 h-fit">
        <div>
          <h2 className="text-2xl font-black text-[#244543]">
            Student Category
          </h2>

          <p className="text-gray-500 mt-1 text-sm">
            Students grouped by year level.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <DonutChart
            total={students.length}
            data={[
              { value: firstYear, color: "#16a6a8" },
              { value: secondYear, color: "#65c85f" },
              { value: thirdYear, color: "#49bd77" },
              { value: fourthYear, color: "#55705f" },
            ]}
          />
        </div>

        <div className="mt-8">
          <div className="flex justify-between text-xs font-black uppercase tracking-wide text-gray-400 border-b border-cyan-100 pb-3">
            <span>Year Level</span>
            <span>Students</span>
          </div>

          <div className="space-y-4 mt-5">
            <Legend
              label="1st Year"
              value={firstYear}
              total={students.length}
              dotClass="bg-[#16a6a8]"
            />

            <Legend
              label="2nd Year"
              value={secondYear}
              total={students.length}
              dotClass="bg-[#65c85f]"
            />

            <Legend
              label="3rd Year"
              value={thirdYear}
              total={students.length}
              dotClass="bg-[#49bd77]"
            />

            <Legend
              label="4th Year"
              value={fourthYear}
              total={students.length}
              dotClass="bg-[#55705f]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}