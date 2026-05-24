"use client";

import Image from "next/image";
import { uploadImage } from "../../utils/uploadImage";
import GradientButton from "../shared/GradientButton";
import SectionTitle from "../shared/SectionTitle";
import { FadeIn } from "@/components/dashboard/Animated";

import type { AccountForm, StudentUser } from "../../types";

const DEPARTMENT_LABELS: Record<string, string> = {
  CCS: "College of Computer Studies",
  CTE: "College of Teacher Education",
  CAS: "College of Arts and Sciences",
  CBAA: "College of Business Administration and Accountancy",
  CCJE: "College of Criminal Justice Education",
  CIT: "College of Industrial Technology",
  CONAH: "College of Nursing and Allied Health",
  COE: "College of Engineering",
  CIHTM: "College of International Hospitality and Tourism Management",
};

const DEPARTMENT_PROGRAMS: Record<string, string[]> = {
  CCS: [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Information Technology",
  ],
  CTE: [
    "Bachelor of Elementary Education",
    "Bachelor of Physical Education",
    "Bachelor of Secondary Education",
    "Bachelor of Technical-Vocational Teacher Education",
    "Bachelor of Technology and Livelihood Education",
  ],
  CAS: [
    "Bachelor of Arts in Broadcasting",
    "Bachelor of Science in Biology",
    "Bachelor of Science in Chemistry",
    "Bachelor of Science in Mathematics",
    "Bachelor of Science in Psychology",
  ],
  CBAA: [
    "Bachelor of Public Administration",
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Entrepreneurship",
    "Bachelor of Science in Office Administration",
  ],
  CCJE: ["Bachelor of Science in Criminology"],
  CIT: [
    "Bachelor of Industrial Technology",
    "Bachelor of Science in Industrial Technology",
  ],
  CONAH: ["Bachelor of Science in Nursing"],
  COE: [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Computer Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Electronics Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],
  CIHTM: [
    "Bachelor of Science in Hospitality Management",
    "Bachelor of Science in Tourism Management",
  ],
};

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

const DEPARTMENTS = Object.keys(DEPARTMENT_PROGRAMS);

type Props = {
  accountForm: AccountForm;
  setAccountForm: React.Dispatch<React.SetStateAction<AccountForm>>;
  userRow: StudentUser | null;
  saveAccount: () => void;
};

function getFilteredSections(program: string, yearLevel: string) {
  if (!program || !yearLevel) return [];

  const code = PROGRAM_CODES[program] || "Course";

  return [
    `${code} - ${yearLevel}A`,
    `${code} - ${yearLevel}B`,
    `${code} - ${yearLevel}F`,
  ];
}

export default function AccountView({
  accountForm,
  setAccountForm,
  userRow,
  saveAccount,
}: Props) {
  return (
    <FadeIn>
      <div className="w-full">
        <SectionTitle
          title="My Account"
          subtitle="Manage your personal information and profile."
        />

        <div className="w-full max-w-[1120px] bg-white rounded-[28px] sm:rounded-[36px] px-5 sm:px-8 md:px-10 py-6 sm:py-9 shadow-sm border border-cyan-100">
          <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-6 xl:gap-10">
            <div className="bg-[#f6fffb] border border-cyan-100 rounded-[24px] sm:rounded-[30px] p-5 sm:p-6 h-fit">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload profile photo"
                  title="Upload profile photo"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const url = await uploadImage("profile-images", file);

                    if (url) {
                      setAccountForm((prev) => ({
                        ...prev,
                        profile_url: url,
                      }));
                    }
                  }}
                />

                <div className="mx-auto h-36 w-36 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[4px] shadow-md">
                  <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-white">
                    <Image
                      src={
                        accountForm.profile_url ||
                        userRow?.profile_url ||
                        "/lspu-campus.jpg"
                      }
                      alt="Profile"
                      fill
                      sizes="144px"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Click image to change profile photo
                </p>
              </label>

              <div className="mt-8">
                <p className="font-black text-[#244543] text-lg mb-4">
                  Gender
                </p>

                <div className="space-y-3">
                  <GenderOption
                    label="Female"
                    checked={accountForm.gender === "Female"}
                    onChange={() =>
                      setAccountForm({ ...accountForm, gender: "Female" })
                    }
                  />

                  <GenderOption
                    label="Male"
                    checked={accountForm.gender === "Male"}
                    onChange={() =>
                      setAccountForm({ ...accountForm, gender: "Male" })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 w-full min-w-0">
              <Field
                label="First Name"
                value={accountForm.first_name}
                placeholder="First Name"
                onChange={(v: string) =>
                  setAccountForm({ ...accountForm, first_name: v })
                }
              />

              <Field
                label="Last Name"
                value={accountForm.last_name}
                placeholder="Last Name"
                onChange={(v: string) =>
                  setAccountForm({ ...accountForm, last_name: v })
                }
              />

              <Field
                label="Student ID"
                value={accountForm.student_id}
                placeholder="0123-4567"
                readOnly
              />

              <Field
                label="Contact Number"
                value={accountForm.contact_number}
                placeholder="09123456789"
                onChange={(v: string) =>
                  setAccountForm({ ...accountForm, contact_number: v })
                }
              />

              <SelectField
                label="Year Level"
                value={accountForm.year_level}
                onChange={(v: string) =>
                  setAccountForm({
                    ...accountForm,
                    year_level: v,
                    course_section: "",
                  })
                }
                options={["1", "2", "3", "4"]}
                placeholder="Select Year"
              />

              <SelectField
                label="Department"
                value={accountForm.department}
                onChange={(v: string) =>
                  setAccountForm({
                    ...accountForm,
                    department: v,
                    program: "",
                    course_section: "",
                  })
                }
                options={DEPARTMENTS}
                placeholder="Select Department"
                getOptionLabel={(option) =>
                  `${option} - ${DEPARTMENT_LABELS[option] || option}`
                }
              />

              <SelectField
                label="Program"
                value={accountForm.program}
                onChange={(v: string) =>
                  setAccountForm({
                    ...accountForm,
                    program: v,
                    course_section: "",
                  })
                }
                options={DEPARTMENT_PROGRAMS[accountForm.department] || []}
                placeholder="Select Program"
              />

              <SelectField
                label="Course & Section"
                value={accountForm.course_section}
                onChange={(v: string) =>
                  setAccountForm({ ...accountForm, course_section: v })
                }
                options={getFilteredSections(
                  accountForm.program,
                  accountForm.year_level
                )}
                placeholder="Select Section"
              />

              <Field
                label="Email Address"
                value={accountForm.email}
                placeholder="hello@gmail.com"
                onChange={(v: string) =>
                  setAccountForm({ ...accountForm, email: v })
                }
                wide
              />

              <div className="lg:col-span-2 flex justify-stretch sm:justify-end pt-2">
                <GradientButton onClick={saveAccount}>
                  Save Changes
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function GenderOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 border cursor-pointer transition ${
        checked
          ? "bg-cyan-50 border-cyan-200 text-cyan-700"
          : "bg-white border-cyan-100 text-gray-600 hover:bg-cyan-50"
      }`}
    >
      <input
        type="radio"
        name="gender"
        checked={checked}
        onChange={onChange}
        className="accent-cyan-600"
      />

      <span className="font-extrabold">{label}</span>
    </label>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  wide?: boolean;
  placeholder?: string;
};

function Field({
  label,
  value,
  onChange,
  readOnly,
  wide,
  placeholder,
}: FieldProps) {
  return (
    <label className={`block min-w-0 ${wide ? "lg:col-span-2" : ""}`}>
      <span className="font-black text-sm block mb-2 text-[#244543]">
        {label}
      </span>

      <input
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full min-w-0 h-[54px] rounded-2xl px-5 outline-none bg-[#f6fffb] border border-cyan-100 focus:ring-2 focus:ring-cyan-200 ${
          readOnly
            ? "text-gray-500 cursor-not-allowed bg-gray-50"
            : "text-gray-700"
        }`}
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  getOptionLabel?: (option: string) => string;
};

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  getOptionLabel,
}: SelectFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="font-black text-sm block mb-2 text-[#244543]">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 h-[54px] rounded-2xl px-5 outline-none bg-[#f6fffb] border border-cyan-100 text-gray-700 focus:ring-2 focus:ring-cyan-200"
      >
        <option value="">{placeholder}</option>

        {options.map((option: string) => (
          <option key={option} value={option}>
            {getOptionLabel ? getOptionLabel(option) : option}
          </option>
        ))}
      </select>
    </label>
  );
}