"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type CollegeGroup = {
  code: string;
  name: string;
  programs: string[];
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

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    studentId: "",
    program: "",
    yearLevel: "",
    courseSection: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "program" || field === "yearLevel") {
        next.courseSection = "";
      }

      return next;
    });
  }

  function getCollegeCode(program: string) {
    return (
      COLLEGES.find((college) => college.programs.includes(program))?.code ||
      ""
    );
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

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const studentIdPattern = /^\d{4}-\d{4}$/;

    if (!studentIdPattern.test(form.studentId)) {
      alert("Student ID must follow this format: 0123-4567");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!form.program || !form.yearLevel || !form.courseSection) {
      alert("Please select your program, year level, and course section.");
      return;
    }

    setLoading(true);

    const email = form.email.trim().toLowerCase();

    const { data: existingStudentId, error: studentIdCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("student_id", form.studentId)
      .maybeSingle();

    if (studentIdCheckError) {
      setLoading(false);
      console.error("Student ID check error:", studentIdCheckError);
      alert("Could not verify Student ID. Please try again.");
      return;
    }

    if (existingStudentId) {
      setLoading(false);
      alert(
        "Student ID already exists. Please check your Student ID number."
      );
      return;
    }

    const { data: existingEmail, error: emailCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailCheckError) {
      setLoading(false);
      console.error("Email check error:", emailCheckError);
      alert("Could not verify email address. Please try again.");
      return;
    }

    if (existingEmail) {
      setLoading(false);
      alert("This email address is already registered. Please log in instead.");
      return;
    }

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const fullName = `${firstName} ${lastName}`.trim();
    const college = getCollegeCode(form.program);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          student_id: form.studentId,
          program: form.program,
          college,
          year_level: form.yearLevel,
          course_section: form.courseSection,
        },
      },
    });

    if (error) {
      setLoading(false);

      if (error.message.toLowerCase().includes("already registered")) {
        alert("User already registered. Please log in instead.");
      } else {
        alert(error.message);
      }

      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      alert("Signup failed. Please try again.");
      return;
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        auth_id: user.id,
        email,
        role: "student",
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        student_id: form.studentId,
        program: form.program,
        college,
        year_level: form.yearLevel,
        course_section: form.courseSection,
      },
    ]);

    setLoading(false);

    if (insertError) {
      console.error("Profile insert error:", insertError);

      alert(
        "Account was created, but profile saving failed. Please check users table policies."
      );

      return;
    }

    alert("Account created successfully!");

    router.push("/home");
  }

  async function handleGoogleSignup() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    }
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

      <div className="relative w-full max-w-[445px] lg:max-w-none lg:w-[1120px] lg:h-[590px]">
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

              <Link
                href="/signup"
                className="font-extrabold underline underline-offset-8 decoration-2"
              >
                Sign Up
              </Link>
            </nav>
          </div>

          <div className="absolute left-12 bottom-11 text-white">
            <h2 className="text-5xl font-extrabold drop-shadow-lg">
              Welcome!
            </h2>

            <p className="mt-3 max-w-md text-white/90">
              Create your account and start discovering student organizations.
            </p>
          </div>
        </section>

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

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-white text-cyan-700 text-xs font-black shadow-sm"
            >
              Log in
            </Link>
          </div>

          <div className="relative z-10 mt-10 text-center text-white">
            <div className="mx-auto h-16 w-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-2xl font-black shadow-lg">
              U
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight">
              Create Account
            </h2>

            <p className="mt-3 text-sm text-white/90 leading-relaxed">
              Join UniLink and start discovering LSPU student organizations.
            </p>

            <div className="mt-5 inline-flex rounded-full bg-white/15 border border-white/30 px-5 py-2 text-[11px] font-black">
              Laguna State Polytechnic University
            </div>
          </div>
        </section>

        <section className="relative z-30 w-full bg-white rounded-[32px] shadow-[0_18px_45px_rgba(0,0,0,0.22)] flex items-center justify-center px-7 py-8 -mt-16 lg:mt-0 lg:absolute lg:left-[595px] lg:top-[46px] lg:h-[510px] lg:w-[445px] lg:rounded-[42px] lg:px-9 lg:py-0">
          <div className="w-full max-w-[360px]">
            <h1 className="text-[32px] font-extrabold text-[#171717] mb-2">
              Sign up
            </h1>

            <p className="text-[11px] text-gray-500 mb-3">
              Fill out this form to create your student account.
            </p>

            <form onSubmit={handleSignup} className="space-y-2.5">
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

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Email address"
                className="h-9 lg:h-8 w-full rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Password"
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm Password"
                  className="h-9 lg:h-8 rounded-full bg-[#f6fffb] lg:bg-[#e4e4e4] border border-cyan-100 lg:border-0 px-4 text-[11px] text-gray-700 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-10 lg:h-9 w-full bg-gradient-to-r from-cyan-600 to-lime-500 lg:bg-none lg:bg-[#101415] text-white rounded-full text-xs font-black lg:font-medium hover:brightness-110 lg:hover:bg-black transition disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <div className="h-px bg-gray-400 flex-1" />
                <span>Or</span>
                <div className="h-px bg-gray-400 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="h-9 lg:h-8 w-full bg-white border border-gray-300 text-[#171717] rounded-full text-xs font-semibold hover:bg-gray-50 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="h-9 lg:h-8 w-full bg-[#e4e4e4] text-[#171717] rounded-full text-xs font-medium hover:bg-gray-300 transition"
              >
                Log in
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}