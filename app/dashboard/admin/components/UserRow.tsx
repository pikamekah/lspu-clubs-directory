"use client";

import { useState } from "react";
import type {
  AdminUser,
  AdminOrganization,
} from "../types";

type Props = {
  user: AdminUser;
  organizations: AdminOrganization[];
  onAssign: (
    userId: string,
    authId: string,
    role: string,
    orgId: string
  ) => void;
};

export default function UserRow({
  user,
  organizations,
  onAssign,
}: Props) {
  const [selectedOrg, setSelectedOrg] = useState(user.org_id || "");
  const [selectedRole, setSelectedRole] = useState(user.role || "student");

  const studentName = user.full_name || "Unnamed Student";

  const courseSection =
    user.course_section ||
    user.section ||
    user.program ||
    "Not provided";

  const roleLabel =
    user.role === "officer_admin"
      ? "Officer Admin"
      : user.role || "student";

  const availableOrganizations = organizations.filter((org) => {
    const orgDept = (org.department || org.category || "").toUpperCase();
    const studentProgram = (user.program || "").toLowerCase();

    if (orgDept === "NON-ACAD") return true;

    if (orgDept === "COE") {
      return (
        studentProgram.includes("engineering") ||
        user.college === "COE"
      );
    }

    return orgDept === user.college;
  });

  return (
    <div className="bg-[#f6fffb] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 border border-cyan-100 shadow-sm hover:shadow-md transition min-w-0">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(260px,1.4fr)_minmax(160px,0.8fr)_minmax(240px,1.1fr)_auto] gap-4 items-stretch xl:items-center min-w-0">
        <div className="min-w-0">
          <h3
            className="text-base sm:text-lg font-black text-[#244543] truncate"
            title={studentName}
          >
            {studentName}
          </h3>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500 truncate">
              <span className="font-bold text-gray-400">Student ID:</span>{" "}
              {user.student_id || "Not provided"}
            </p>

            <p
              className="text-sm text-gray-500 truncate"
              title={courseSection}
            >
              <span className="font-bold text-gray-400">Course & Section:</span>{" "}
              {courseSection}
            </p>
          </div>

          <span className="mt-3 inline-flex rounded-full bg-white border border-cyan-100 px-3 py-1 text-xs font-black text-cyan-700 capitalize">
            {roleLabel}
          </span>
        </div>

        <SelectField
          label="Role"
          value={selectedRole}
          onChange={(value) => {
            setSelectedRole(value);

            if (value !== "officer_admin") {
              setSelectedOrg("");
            }
          }}
          options={[
            { label: "Student", value: "student" },
            { label: "Officer Admin", value: "officer_admin" },
          ]}
        />

        <label className="block min-w-0">
          <span className="text-xs font-black uppercase tracking-wide text-gray-400">
            Organization
          </span>

          <select
            aria-label="Select organization"
            title="Select organization"
            value={selectedOrg}
            disabled={selectedRole !== "officer_admin"}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="mt-2 h-12 w-full bg-white rounded-2xl px-4 border border-cyan-100 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select Organization</option>

            {availableOrganizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() =>
            onAssign(
              user.id,
              user.auth_id,
              selectedRole,
              selectedOrg
            )
          }
          className="h-12 w-full xl:w-auto px-7 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black whitespace-nowrap shadow-sm hover:shadow-md hover:brightness-110 transition"
        >
          Save Role
        </button>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-black uppercase tracking-wide text-gray-400">
        {label}
      </span>

      <select
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-12 w-full bg-white rounded-2xl px-4 border border-cyan-100 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}