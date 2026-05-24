"use client";

import EmptyState from "../shared/EmptyState";
import SectionTitle from "../shared/SectionTitle";
import TableContainer from "../shared/TableContainer";
import StatusBadge from "@/app/dashboard/student/components/shared/StatusBadge";
import type { MemberApplication } from "../../types";
import { FadeIn } from "@/components/dashboard/Animated";

type Props = {
  filteredApplications: MemberApplication[];
  applicationSort: string;
  setApplicationSort: (value: string) => void;
  approveMember: (id: string) => void;
  rejectMember: (id: string) => void;
};

const tableGrid =
  "min-w-[980px] grid-cols-[minmax(220px,1.45fr)_minmax(120px,0.75fr)_minmax(150px,0.85fr)_minmax(130px,0.75fr)_minmax(210px,1.15fr)]";

export default function ApplicationsView({
  filteredApplications,
  applicationSort,
  setApplicationSort,
  approveMember,
  rejectMember,
}: Props) {
  return (
    <FadeIn>
      <div className="w-full max-w-[1120px] mx-auto">
        <div className="flex flex-wrap justify-between items-start gap-5 mb-6">
          <SectionTitle
            title="Applications"
            subtitle="Review and manage incoming membership applications."
          />

          <div className="flex flex-wrap gap-2 bg-white border border-cyan-100 rounded-[24px] sm:rounded-full p-1 shadow-sm">
            {[
              { label: "Recently", value: "recent" },
              { label: "Oldest", value: "oldest" },
              { label: "By Name", value: "name" },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setApplicationSort(item.value)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition ${
                  applicationSort === item.value
                    ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-cyan-50 hover:text-cyan-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <TableContainer>
          <div
            className={`grid ${tableGrid} bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-extrabold text-sm px-6 py-4 gap-5`}
          >
            <div>Applicant</div>
            <div>Student ID</div>
            <div>Applied</div>
            <div>Status</div>
            <div className="text-center">Action</div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="px-7 py-8 bg-white">
              <EmptyState message="Incoming membership applications will appear here." />
            </div>
          ) : (
            filteredApplications.map((app) => {
              const studentName =
                app.full_name ||
                app.student_name ||
                app.name ||
                `${app.first_name || ""} ${app.last_name || ""}`.trim() ||
                "Unknown Student";

              const section =
                app.course_section ||
                app.section ||
                app.year_section ||
                "No Section";

              const studentId = app.student_id || "N/A";

              const appliedDate = app.created_at
                ? new Date(app.created_at).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Today";

              return (
                <div
                  key={app.id}
                  className={`grid ${tableGrid} border-b border-cyan-50 last:border-b-0 items-center gap-5 px-6 py-5 bg-white hover:bg-cyan-50/40 transition`}
                >
                  <div className="min-w-0">
                    <p
                      className="font-extrabold text-[#244543] truncate"
                      title={studentName}
                    >
                      {studentName}
                    </p>

                    <p className="text-gray-400 text-sm truncate">
                      {section}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-600">
                      {studentId}
                    </p>
                  </div>

                  <div>
                    <p className="font-extrabold text-sm text-[#244543]">
                      {appliedDate}
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      Application date
                    </p>
                  </div>

                  <div>
                    {app.status === "pending" && (
                      <StatusBadge label="pending" variant="pending" />
                    )}

                    {app.status === "approved" && (
                      <StatusBadge label="approved" variant="success" />
                    )}

                    {app.status === "rejected" && (
                      <StatusBadge label="rejected" variant="danger" />
                    )}
                  </div>

                  <div className="flex justify-center">
                    {app.status === "pending" ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => approveMember(app.id)}
                          className="px-5 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white text-xs font-extrabold shadow-sm hover:brightness-110 transition"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() => rejectMember(app.id)}
                          className="px-5 py-2 rounded-full bg-red-500/90 text-white border border-red-500 text-xs font-extrabold shadow-sm hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-400">
                        No action
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </TableContainer>
      </div>
    </FadeIn>
  );
}