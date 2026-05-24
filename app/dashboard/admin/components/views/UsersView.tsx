"use client";

import UserRow from "../UserRow";

import type {
  AdminUser,
  AdminOrganization,
} from "../../types";

type Props = {
  students: AdminUser[];
  organizations: AdminOrganization[];
  updateUserRole: (
    userId: string,
    authId: string,
    role: string,
    orgId: string
  ) => void;
};

export default function UsersView({
  students,
  organizations,
  updateUserRole,
}: Props) {
  return (
    <section className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-cyan-100">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#244543]">
            Enrolled Students
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            View enrolled students and assign officer admins.
          </p>
        </div>

        <span className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide">
          {students.length} Students
        </span>
      </div>

      {students.length === 0 ? (
        <div className="bg-[#f6fffb] border border-cyan-100 rounded-[24px] p-8 text-center">
          <p className="font-black text-[#244543]">
            No students found
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Enrolled students will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 min-w-0">
          {students.map((student) => (
            <UserRow
              key={student.id}
              user={student}
              organizations={organizations}
              onAssign={updateUserRole}
            />
          ))}
        </div>
      )}
    </section>
  );
}