"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import ReadOnlyField from "./components/ReadOnlyField";
import NoticeModal from "./components/NoticeModal";
import FormLoadingModal from "./components/FormLoadingModal";

type Props = {
  orgName: string;
  orgId: string;
  orgDepartment?: string;
  onClose: () => void;
  onSubmitted?: () => void;
};

type StudentUser = {
  auth_id: string;
  role?: string;
  full_name?: string;
  student_id?: string;
  program?: string;
  year_level?: string;
  course_section?: string;
  email?: string;
  contact_number?: string;
};

type OrganizationRules = {
  id: string;
  name?: string;
  department?: string;
  category?: string;
  is_academic?: boolean;
  allowed_programs?: string[];
};

type ExistingAcademicApplication = {
  id: string;
  status?: string;
  org_id?: string;
  organizations?: {
    name?: string;
    department?: string;
    category?: string;
    is_academic?: boolean;
  } | null;
};

export default function JoinForm({
  orgName,
  orgId,
  orgDepartment,
  onClose,
  onSubmitted,
}: Props) {
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState<StudentUser | null>(null);
  const [orgData, setOrgData] = useState<OrganizationRules | null>(null);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    phone: "",
    interest: "",
  });

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotice("You must be logged in to apply.");
      setLoadingUser(false);
      return;
    }

    const { data: student, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (userError || !student) {
      setNotice("Failed to load your student information.");
      setLoadingUser(false);
      return;
    }

    const allowedApplicantRoles = ["student", "officer_admin"];

    if (!allowedApplicantRoles.includes(student.role)) {
      setNotice("Only student accounts can apply to organizations.");
      setLoadingUser(false);
      return;
    }

    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, department, category, is_academic, allowed_programs")
      .eq("id", orgId)
      .maybeSingle();

    if (orgError || !organization) {
      setNotice("Failed to load organization rules.");
      setLoadingUser(false);
      return;
    }

    setUserData(student);
    setOrgData(organization);

    setForm((prev) => ({
      ...prev,
      phone: student.contact_number || "",
    }));

    setLoadingUser(false);
  }, [orgId]);

  useEffect(() => {
    async function runLoadData() {
      await loadData();
    }

    runLoadData();
  }, [loadData]);

  function isNonAcademicOrg(
    org?: OrganizationRules | ExistingAcademicApplication["organizations"] | null
  ) {
    const department = String(org?.department || org?.category || "").toUpperCase();

    return (
      org?.is_academic === false ||
      department === "NON-ACAD" ||
      department === "NON-ACADEMIC" ||
      department === "NON ACADEMIC"
    );
  }

  function isCurrentOrgNonAcademic() {
    const department = String(
      orgData?.department || orgData?.category || orgDepartment || ""
    ).toUpperCase();

    return (
      orgData?.is_academic === false ||
      department === "NON-ACAD" ||
      department === "NON-ACADEMIC" ||
      department === "NON ACADEMIC"
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userData || !orgData) {
      setNotice("Student or organization information is missing.");
      return;
    }

    if (!form.phone.trim()) {
      setNotice("Phone number is required.");
      return;
    }

    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotice("You must be logged in to apply.");
      setSubmitting(false);
      return;
    }

    const isNonAcad = isCurrentOrgNonAcademic();

    const { data: existingApplication, error: checkError } = await supabase
      .from("members")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("org_id", orgId)
      .maybeSingle();

    if (checkError) {
      setNotice("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    if (existingApplication) {
      setNotice(
        `You already applied to this organization.\n\nStatus: ${existingApplication.status}`
      );

      setSubmitting(false);
      return;
    }

    if (!isNonAcad) {
      const allowedPrograms: string[] = orgData.allowed_programs || [];
      const studentProgram = userData.program || "";

      if (
        allowedPrograms.length > 0 &&
        !allowedPrograms.includes(studentProgram)
      ) {
        setNotice(
          `You cannot join this academic organization because it is not related to your program.\n\nYour program:\n${studentProgram}`
        );

        setSubmitting(false);
        return;
      }

      const {
  data: existingAcademicApplications,
  error: academicCheckError,
} = await supabase
  .from("members")
  .select("id, status, org_id, organizations(name, department, category, is_academic)")
  .eq("user_id", user.id)
  .in("status", ["pending", "approved"]);

if (academicCheckError) {
  console.error("Academic organization check error:", academicCheckError);
  setNotice("Could not verify your current academic organization membership. Please try again.");
  setSubmitting(false);
  return;
}

      const existingAcademic = (
        existingAcademicApplications as ExistingAcademicApplication[] | null
      )?.find((item) => {
        if (item.org_id === orgId) return false;

        return !isNonAcademicOrg(item.organizations);
      });

      if (existingAcademic) {
        const existingOrgName =
          existingAcademic.organizations?.name || "another academic organization";

        setNotice(
          `You already joined or applied to ${existingOrgName}.\n\nStudents can only have one pending or approved academic organization.\n\nYou may still join non-academic organizations.`
        );

        setSubmitting(false);
        return;
      }
    }

    const { error } = await supabase.from("members").insert([
      {
        user_id: user.id,
        org_id: orgId,
        student_id: userData.student_id,
        program: userData.program,
        year_level: userData.year_level,
        course_section: userData.course_section,
        email: userData.email,
        phone: form.phone.trim(),
        interest: form.interest.trim(),
        status: "pending",
        full_name: userData.full_name,
      },
    ]);

    if (error) {
      setNotice(error.message || "Failed to submit application.");
      setSubmitting(false);
      return;
    }

    const { data: officerData } = await supabase
      .from("users")
      .select("auth_id")
      .eq("org_id", orgId)
      .eq("role", "officer_admin");

    const officerNotifications = (officerData || [])
      .filter((officer) => officer.auth_id)
      .map((officer) => ({
        user_id: officer.auth_id,
        org_id: orgId,
        title: "New membership application",
        message: `${
          userData.full_name || userData.email
        } applied to join ${orgName}.`,
        type: "application",
        is_read: false,
        target_role: "officer_admin",
      }));

    if (officerNotifications.length > 0) {
      await supabase.from("notifications").insert(officerNotifications);
    }

    setNotice("Application submitted! Waiting for approval.");

    setSubmitting(false);

    onSubmitted?.();

    setTimeout(() => {
      onClose();
    }, 1500);
  }

  if (loadingUser) {
    return <FormLoadingModal />;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4 py-5">
        <div className="bg-white rounded-[28px] sm:rounded-[36px] w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto border border-cyan-100">
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-cyan-100 px-5 sm:px-8 py-5 sm:py-6 rounded-t-[28px] sm:rounded-t-[36px] z-10">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                  Membership Application
                </p>

                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-black text-[#244543]">
                  Join {orgName}
                </h2>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Academic organizations must match your program. You may still
                  join non-academic organizations.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition font-black shrink-0 disabled:opacity-60"
                aria-label="Close form"
                title="Close form"
              >
                ×
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-6 sm:py-7 space-y-6">
            <div className="bg-[#f6fffb] border border-cyan-100 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5">
              <h3 className="text-lg font-black text-[#244543] mb-4">
                Student Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <ReadOnlyField
                  label="Full Name"
                  value={userData?.full_name || ""}
                />

                <ReadOnlyField
                  label="Student ID"
                  value={userData?.student_id || ""}
                />

                <ReadOnlyField
                  label="Course / Program"
                  value={userData?.program || ""}
                />

                <ReadOnlyField
                  label="Course & Section"
                  value={userData?.course_section || ""}
                />

                <ReadOnlyField
                  label="Year Level"
                  value={userData?.year_level || ""}
                />

                <ReadOnlyField
                  label="Email Address"
                  value={userData?.email || ""}
                />
              </div>
            </div>

            <div className="bg-white border border-cyan-100 rounded-[24px] sm:rounded-[28px] p-4 sm:p-5">
              <h3 className="text-lg font-black text-[#244543] mb-4">
                Application Details
              </h3>

              <div className="space-y-5">
                <label className="block">
                  <span className="font-black text-sm block mb-2 text-[#244543]">
                    Phone Number
                  </span>

                  <input
                    type="tel"
                    placeholder="09123456789"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                    className="w-full bg-[#f6fffb] border border-cyan-100 px-4 py-3 rounded-full outline-none text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200"
                  />
                </label>

                <label className="block">
                  <span className="font-black text-sm block mb-2 text-[#244543]">
                    Why do you want to join?
                  </span>

                  <textarea
                    placeholder="Tell us about your interests in this club..."
                    value={form.interest}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        interest: e.target.value,
                      }))
                    }
                    className="w-full bg-[#f6fffb] border border-cyan-100 px-4 py-3 rounded-2xl outline-none min-h-32 text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-200 resize-none"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-7 py-3 rounded-full bg-gray-100 text-gray-600 font-extrabold hover:bg-gray-200 transition disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-extrabold hover:brightness-110 transition disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <NoticeModal
        notice={notice}
        onClose={() => {
          setNotice("");

          if (!userData || !orgData) {
            onClose();
          }
        }}
      />
    </>
  );
}