"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type CollegeGroup = {
  code: string;
  name: string;
  programs: string[];
};

type UserProfile = {
  id: string;
  auth_id: string;
  email: string;
  role: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  student_id: string | null;
  program: string | null;
  college: string | null;
  year_level: string | null;
  course_section: string | null;
  contact_number: string | null;
  gender: string | null;
  profile_url: string | null;
};

const COLLEGES: CollegeGroup[] = [
  {
    code: "CCS",
    name: "College of Computer Studies",
    programs: [
      "Bachelor of Science in Computer Science",
      "Bachelor of Science in Information Technology",
    ],
  },
  {
    code: "CTE",
    name: "College of Teacher Education",
    programs: [
      "Bachelor of Elementary Education",
      "Bachelor of Physical Education",
      "Bachelor of Secondary Education",
      "Bachelor of Technical-Vocational Teacher Education",
      "Bachelor of Technology and Livelihood Education",
    ],
  },
  {
    code: "CAS",
    name: "College of Arts and Sciences",
    programs: [
      "Bachelor of Arts in Broadcasting",
      "Bachelor of Science in Biology",
      "Bachelor of Science in Chemistry",
      "Bachelor of Science in Mathematics",
      "Bachelor of Science in Psychology",
    ],
  },
  {
    code: "CBAA",
    name: "College of Business Administration and Accountancy",
    programs: [
      "Bachelor of Public Administration",
      "Bachelor of Science in Accountancy",
      "Bachelor of Science in Business Administration",
      "Bachelor of Science in Entrepreneurship",
      "Bachelor of Science in Office Administration",
    ],
  },
  {
    code: "CCJE",
    name: "College of Criminal Justice Education",
    programs: ["Bachelor of Science in Criminology"],
  },
  {
    code: "CIT",
    name: "College of Industrial Technology",
    programs: [
      "Bachelor of Industrial Technology",
      "Bachelor of Science in Industrial Technology",
    ],
  },
  {
    code: "CONAH",
    name: "College of Nursing and Allied Health",
    programs: ["Bachelor of Science in Nursing"],
  },
  {
    code: "COE",
    name: "College of Engineering",
    programs: [
      "Bachelor of Science in Civil Engineering",
      "Bachelor of Science in Computer Engineering",
      "Bachelor of Science in Electrical Engineering",
      "Bachelor of Science in Electronics Engineering",
      "Bachelor of Science in Mechanical Engineering",
    ],
  },
  {
    code: "CIHTM",
    name: "College of International Hospitality and Tourism Management",
    programs: [
      "Bachelor of Science in Hospitality Management",
      "Bachelor of Science in Tourism Management",
    ],
  },
];

const PROGRAM_CODES: Record<string, string> = {
  "Bachelor of Science in Computer Science": "CS",
  "Bachelor of Science in Information Technology": "IT",

  "Bachelor of Elementary Education": "BEED",
  "Bachelor of Physical Education": "BPEd",
  "Bachelor of Secondary Education": "BSEd",
  "Bachelor of Technical-Vocational Teacher Education": "BTVTEd",
  "Bachelor of Technology and Livelihood Education": "BTLEd",

  "Bachelor of Arts in Broadcasting": "BAB",
  "Bachelor of Science in Biology": "Bio",
  "Bachelor of Science in Chemistry": "Chem",
  "Bachelor of Science in Mathematics": "Math",
  "Bachelor of Science in Psychology": "Psych",

  "Bachelor of Public Administration": "BPA",
  "Bachelor of Science in Accountancy": "BSA",
  "Bachelor of Science in Business Administration": "BSBA",
  "Bachelor of Science in Entrepreneurship": "BSEntrep",
  "Bachelor of Science in Office Administration": "BSOA",

  "Bachelor of Science in Criminology": "Crim",

  "Bachelor of Industrial Technology": "BIT",
  "Bachelor of Science in Industrial Technology": "BSITech",

  "Bachelor of Science in Nursing": "BSN",

  "Bachelor of Science in Civil Engineering": "CE",
  "Bachelor of Science in Computer Engineering": "CpE",
  "Bachelor of Science in Electrical Engineering": "EE",
  "Bachelor of Science in Electronics Engineering": "ECE",
  "Bachelor of Science in Mechanical Engineering": "ME",

  "Bachelor of Science in Hospitality Management": "HM",
  "Bachelor of Science in Tourism Management": "TM",
};

function getCollegeCode(program: string) {
  return (
    COLLEGES.find((college) => college.programs.includes(program))?.code || ""
  );
}

function profileNeedsCompletion(profile: UserProfile) {
  return (
    !profile.first_name ||
    !profile.last_name ||
    !profile.student_id ||
    !profile.program ||
    !profile.year_level ||
    !profile.course_section ||
    !profile.contact_number ||
    !profile.gender
  );
}

export default function CompleteProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    program: "",
    yearLevel: "",
    courseSection: "",
    contactNumber: "",
    gender: "",
  });

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace("/login");
      return;
    }

    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Complete profile fetch error:", profileError);
      alert("Could not load your profile. Please log in again.");
      router.replace("/login");
      return;
    }

    if (!userProfile) {
      alert("Your account exists, but your profile is missing.");
      router.replace("/login");
      return;
    }

    const safeProfile = userProfile as UserProfile;
    const role = String(safeProfile.role || "").trim();

    if (role === "main_admin") {
      router.replace("/dashboard/admin");
      return;
    }

    if (!profileNeedsCompletion(safeProfile)) {
      router.replace("/home");
      return;
    }

    setProfile(safeProfile);
    setForm({
        firstName: safeProfile.first_name || "",
        lastName: safeProfile.last_name || "",
        studentId: safeProfile.student_id || "",
        program: safeProfile.program || "",
        yearLevel: safeProfile.year_level || "",
        courseSection: safeProfile.course_section || "",
        contactNumber: safeProfile.contact_number || "",
        gender: safeProfile.gender || "",
    });

    setChecking(false);
  }, [router]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadProfile();
        }, 0);

        return () => {
            window.clearTimeout(timer);
        };
    }, [loadProfile]);

  function updateField(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "program" || field === "yearLevel") {
        next.courseSection = "";
      }

      return next;
    });
  }

  function getCourseSectionOptions() {
    if (!form.program || !form.yearLevel) return [];

    const code = PROGRAM_CODES[form.program] || "Course";

    return [
      `${code} - ${form.yearLevel}A`,
      `${code} - ${form.yearLevel}B`,
      `${code} - ${form.yearLevel}F`,
    ];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!profile) return;

    const studentId = form.studentId.trim();
    const studentIdPattern = /^\d{4}-\d{4}$/;
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const contactNumber = form.contactNumber.trim();
    const gender = form.gender.trim();

    if (!firstName || !lastName) {
    alert("Please enter your first name and last name.");
    return;
    }

    if (!contactNumber) {
    alert("Please enter your contact number.");
    return;
    }

    if (!gender) {
    alert("Please select your gender.");
    return;
    }

    if (!studentIdPattern.test(studentId)) {
      alert("Student ID must follow this format: 0123-4567");
      return;
    }

    if (!form.program || !form.yearLevel || !form.courseSection) {
      alert("Please select your program, year level, and course section.");
      return;
    }

    setSaving(true);

    const { data: existingStudentId, error: studentIdCheckError } =
      await supabase
        .from("users")
        .select("id")
        .eq("student_id", studentId)
        .neq("auth_id", profile.auth_id)
        .maybeSingle();

    if (studentIdCheckError) {
      setSaving(false);
      console.error("Student ID check error:", studentIdCheckError);
      alert("Could not verify Student ID. Please try again.");
      return;
    }

    if (existingStudentId) {
      setSaving(false);
      alert("Student ID already exists. Please check your Student ID number.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const college = getCollegeCode(form.program);

    const { error: updateError } = await supabase
    .from("users")
    .update({
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        student_id: studentId,
        program: form.program,
        college,
        year_level: form.yearLevel,
        course_section: form.courseSection,
        contact_number: contactNumber,
        gender,
        role: profile.role || "student",
    })
    .eq("auth_id", profile.auth_id);

    setSaving(false);

    if (updateError) {
      console.error("Complete profile update error:", updateError);
      alert("Could not complete your profile. Please try again.");
      return;
    }

    alert("Profile completed successfully!");
    router.replace("/home");
  }

  if (checking) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#eeeeee] flex items-center justify-center px-4 py-8">
        <Image
          src="/lspu-school-bg.jpg"
          alt="LSPU campus background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-15"
        />

        <div className="absolute inset-0 bg-white/35" />

        <section className="relative z-10 w-full max-w-md bg-white border border-cyan-100 rounded-[32px] shadow-xl p-8 text-center">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white font-black">
            U
          </div>

          <h1 className="text-2xl font-black text-[#244543]">UniLink</h1>
          <p className="mt-3 text-gray-600">Checking your profile...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eeeeee] flex items-center justify-center px-4 py-8 lg:px-6 lg:py-0">
      <Image
        src="/lspu-school-bg.jpg"
        alt="LSPU campus background"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-15"
      />

      <div className="absolute inset-0 bg-white/35" />

      <div className="relative w-full max-w-[520px] lg:max-w-none lg:w-[1120px] lg:h-[640px]">
        {/* Desktop background panel */}
        <section className="hidden lg:block absolute left-0 top-0 h-full w-[1060px] overflow-hidden rounded-[42px] shadow-2xl">
          <Image
            src="/lspu-school-bg.jpg"
            alt="LSPU campus"
            fill
            sizes="1060px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/18" />

          <div className="relative z-10 px-12 pt-9 flex items-center text-white">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              LSPU.
            </Link>

            <nav className="ml-24 flex items-center gap-6 text-[10px] font-semibold uppercase tracking-wide drop-shadow">
              <Link href="/" className="hover:underline underline-offset-4">
                Home
              </Link>

              <Link href="/about" className="hover:underline underline-offset-4">
                About Us
              </Link>

              <Link href="/resources" className="hover:underline underline-offset-4">
                Resources
              </Link>

              <Link href="/contact" className="hover:underline underline-offset-4">
                Contact
              </Link>
            </nav>
          </div>

          <div className="absolute left-12 bottom-11 text-white">
            <h2 className="text-5xl font-extrabold drop-shadow-lg">
              Complete Profile
            </h2>

            <p className="mt-3 max-w-md text-white/90">
              Add your student information to continue using UniLink.
            </p>
          </div>
        </section>

        {/* Mobile top hero */}
        <section className="relative overflow-hidden rounded-t-[34px] bg-gradient-to-r from-cyan-700 to-lime-500 px-6 pt-6 pb-24 shadow-2xl lg:hidden">
          <Image
            src="/lspu-school-bg.jpg"
            alt="LSPU campus"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/80 via-cyan-700/60 to-lime-500/70" />

          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black shadow-md">
                U
              </div>

              <div>
                <h1 className="text-xl font-black leading-none">UniLink</h1>

                <p className="text-[10px] text-white/80 mt-1">
                  LSPU Clubs Directory
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                router.replace("/login");
              }}
              className="px-5 py-2.5 rounded-full bg-white text-cyan-700 text-xs font-black shadow-sm"
            >
              Log out
            </button>
          </div>

          <div className="relative z-10 mt-10 text-center text-white">
            <div className="mx-auto h-16 w-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black shadow-lg">
              U
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight">
              Complete Profile
            </h2>

            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              Your Google account is connected. Please add your student details
              to continue.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-white/15 border border-white/30 px-5 py-2 text-[11px] font-black">
              Laguna State Polytechnic University
            </div>
          </div>
        </section>

        {/* Complete profile card */}
        <section className="relative z-30 w-full bg-white rounded-[32px] shadow-[0_18px_45px_rgba(0,0,0,0.22)] flex items-center justify-center px-7 py-8 -mt-16 lg:mt-0 lg:absolute lg:left-[595px] lg:top-[40px] lg:h-[560px] lg:w-[445px] lg:rounded-[42px] lg:px-9 lg:py-0">
          <div className="w-full max-w-[390px] lg:max-w-[360px] lg:max-h-[500px] lg:overflow-y-auto lg:pr-1">
            <h1 className="text-[30px] lg:text-[32px] font-extrabold text-[#171717] mb-2">
              Complete Profile
            </h1>

            <p className="text-[11px] text-gray-500 mb-2">
              Add your student details to continue using UniLink.
            </p>

            {profile?.email && (
              <p className="mb-4 text-[11px] font-bold text-cyan-700 truncate">
                {profile.email}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  placeholder="First Name"
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  placeholder="Last Name"
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <input
                name="studentId"
                value={form.studentId}
                onChange={(e) => updateField("studentId", e.target.value)}
                placeholder="Student ID (0123-4567)"
                className="h-9 lg:h-8 w-full rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                required
              />

              <select
                name="program"
                aria-label="Select Program"
                value={form.program}
                onChange={(e) => updateField("program", e.target.value)}
                className="h-9 lg:h-8 w-full rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200"
                required
              >
                <option value="">Select your Program</option>

                {COLLEGES.map((college) => (
                  <optgroup
                    key={college.code}
                    label={`${college.code} - ${college.name}`}
                  >
                    {college.programs.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
                  name="yearLevel"
                  aria-label="Select Year Level"
                  value={form.yearLevel}
                  onChange={(e) => updateField("yearLevel", e.target.value)}
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                >
                  <option value="">Year Level</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>

                <select
                  name="courseSection"
                  aria-label="Select Course and Section"
                  value={form.courseSection}
                  onChange={(e) => updateField("courseSection", e.target.value)}
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200 disabled:opacity-60"
                  required
                  disabled={!form.program || !form.yearLevel}
                >
                  <option value="">Course & Section</option>

                  {getCourseSectionOptions().map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) => updateField("contactNumber", e.target.value)}
                  placeholder="Contact Number"
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />

                <select
                  name="gender"
                  aria-label="Select Gender"
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                >
                  <option value="">Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="h-10 lg:h-9 w-full bg-gradient-to-r from-cyan-600 to-lime-500 lg:bg-none lg:bg-[#101415] text-white rounded-full text-xs font-black lg:font-medium hover:brightness-110 lg:hover:bg-black transition disabled:opacity-60"
              >
                {saving ? "Saving Profile..." : "Complete Profile"}
              </button>

              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.replace("/login");
                }}
                className="h-9 lg:h-8 w-full bg-[#e4e4e4] text-[#171717] rounded-full text-xs font-medium hover:bg-gray-300 transition"
              >
                Log out instead
              </button>

              <div className="pt-2 text-center text-[10px] text-gray-400 lg:hidden">
                © 2026 UniLink | LSPU Clubs Directory
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}