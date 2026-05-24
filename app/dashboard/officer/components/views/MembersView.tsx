"use client";

import EmptyState from "../shared/EmptyState";
import SectionTitle from "../shared/SectionTitle";
import TableContainer from "../shared/TableContainer";
import { FadeIn } from "@/components/dashboard/Animated";

type CombinedMember = {
  id: string;
  name: string;
  student_id: string;
  role: string;
  course_section: string;
  email: string;
  contact: string;
};

type Props = {
  combinedMembers: CombinedMember[];
  updateMemberRole: (id: string, role: string) => void;
};

const roleOptions = [
  "Member",
  "President",
  "Vice President",
  "Secretary",
  "Assistant Secretary",
  "Treasurer",
  "Assistant Treasurer",
  "Auditor",
  "Public Information Officer",
  "Business Manager",
  "Event Coordinator",
  "Representative",
  "Officer",
];

const tableGrid =
  "min-w-[900px] grid-cols-[minmax(260px,1.5fr)_minmax(210px,1.1fr)_minmax(120px,0.7fr)_minmax(260px,1.4fr)]";

export default function MembersView({
  combinedMembers,
  updateMemberRole,
}: Props) {
  return (
    <FadeIn>
      <div className="w-full max-w-[1120px] mx-auto">
        <SectionTitle
          title="Members"
          subtitle="View approved members and assign their organization roles."
        />

        <TableContainer>
          <div
            className={`grid ${tableGrid} bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-extrabold text-sm px-6 py-4 gap-5`}
          >
            <div>Member</div>
            <div>Role</div>
            <div>Section</div>
            <div>Contact Info</div>
          </div>

          {combinedMembers.length === 0 ? (
            <div className="px-7 py-8 bg-white">
              <EmptyState message="No approved members yet." />
            </div>
          ) : (
            combinedMembers.map((member) => (
              <div
                key={member.id}
                className={`grid ${tableGrid} px-6 py-5 border-b border-cyan-50 last:border-b-0 items-center gap-5 bg-white hover:bg-cyan-50/40 transition`}
              >
                <div className="min-w-0">
                  <p
                    className="font-extrabold text-sm text-[#244543] truncate"
                    title={member.name || "Member Name"}
                  >
                    {member.name || "Member Name"}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    Student ID: {member.student_id || "N/A"}
                  </p>
                </div>

                <select
                  aria-label={`Role for ${member.name}`}
                  title={`Role for ${member.name}`}
                  value={member.role}
                  onChange={(e) => updateMemberRole(member.id, e.target.value)}
                  className="w-full h-11 rounded-full border border-cyan-100 bg-[#f6fffb] px-4 text-xs font-extrabold text-[#244543] outline-none shadow-sm transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 cursor-pointer"
                >
                  {roleOptions.map((role) => (
                    <option
                      key={role}
                      value={role}
                      className="bg-white text-gray-700"
                    >
                      {role}
                    </option>
                  ))}
                </select>

                <p
                  className="text-sm font-bold text-gray-600 truncate"
                  title={member.course_section || "N/A"}
                >
                  {member.course_section || "N/A"}
                </p>

                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold text-[#244543] truncate"
                    title={member.email || "N/A"}
                  >
                    {member.email || "N/A"}
                  </p>

                  <p
                    className="text-xs text-gray-400 truncate"
                    title={member.contact || "N/A"}
                  >
                    {member.contact || "N/A"}
                  </p>
                </div>
              </div>
            ))
          )}
        </TableContainer>
      </div>
    </FadeIn>
  );
}