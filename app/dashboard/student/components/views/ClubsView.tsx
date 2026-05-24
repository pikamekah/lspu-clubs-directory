"use client";

import Image from "next/image";
import Link from "next/link";
import type { StudentApplication } from "../../types";

import EmptyState from "../shared/EmptyState";
import SectionTitle from "../shared/SectionTitle";
import DashboardCard from "../shared/DashboardCard";
import StatusBadge from "../shared/StatusBadge";
import { getDepartmentStyle } from "@/app/lib/publicStyles";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

type Props = {
  filteredApplications: StudentApplication[];
};

export default function ClubsView({ filteredApplications }: Props) {
  return (
    <FadeIn>
      <SectionTitle
        title="My Clubs"
        subtitle="Manage your joined clubs and applications."
      />

      {filteredApplications.length === 0 ? (
        <EmptyState
          title="No clubs found"
          message="Your club applications and joined clubs will appear here."
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[1050px]">
          {filteredApplications.map((app, index) => {
            const department =
              app.organizations?.department ||
              app.organizations?.category ||
              "NON-ACAD";

            return (
              <StaggerItem
                key={app.id}
                delay={
                  index % 4 === 0
                    ? "delay-0"
                    : index % 4 === 1
                    ? "delay-100"
                    : index % 4 === 2
                    ? "delay-200"
                    : "delay-300"
                }
              >
                <Link
                  href={`/organizations/${
                    app.organizations?.slug || app.org_id
                  }`}
                  className="block group"
                >
                  <DashboardCard className="overflow-hidden p-0 hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-cyan-100 rounded-[30px]">
                    <div className="relative h-[190px] sm:h-[220px] overflow-hidden">
                      <Image
                        src={
                          app.organizations?.banner_url ||
                          app.organizations?.logo_url ||
                          "/lspu-campus.jpg"
                        }
                        alt={app.organizations?.name || "Club"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 525px"
                        unoptimized
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                      <span
                        className={`absolute top-4 right-4 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-extrabold leading-none text-center whitespace-nowrap shrink-0 ${getDepartmentStyle(
                          department
                        )}`}
                      >
                        {department}
                      </span>

                      <div className="absolute left-5 right-5 bottom-4">
                        <h3 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow line-clamp-2">
                          {app.organizations?.name || "Organization name"}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[44px]">
                        {app.organizations?.short_desc ||
                          app.organizations?.description ||
                          "No description available."}
                      </p>

                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <StatusBadge
                          label={app.status}
                          variant={
                            app.status === "approved"
                              ? "success"
                              : app.status === "pending"
                              ? "pending"
                              : "danger"
                          }
                        />

                        <span className="text-sm font-extrabold text-cyan-700 group-hover:text-lime-600 transition">
                          {app.status === "approved"
                            ? "View Club →"
                            : "View Application →"}
                        </span>
                      </div>
                    </div>
                  </DashboardCard>
                </Link>
              </StaggerItem>
            );
          })}
        </div>
      )}
    </FadeIn>
  );
}