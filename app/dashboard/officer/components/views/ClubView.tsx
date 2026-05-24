"use client";

import Image from "next/image";
import type { ClubForm, MemberApplication } from "../../types";
import { getDepartmentStyle } from "@/app/lib/publicStyles";
import { FadeIn } from "@/components/dashboard/Animated";

type Props = {
  clubForm: ClubForm;
  setClubForm: React.Dispatch<React.SetStateAction<ClubForm>>;
  members: MemberApplication[];
  saveClub: () => void;
  uploadImage: (bucket: string, file: File) => Promise<string>;
};

export default function ClubView({
  clubForm,
  setClubForm,
  members,
  saveClub,
  uploadImage,
}: Props) {
  return (
    <FadeIn>
      <div className="w-full max-w-[1050px] mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#244543]">
            My Club
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update your organization profile, banner, logo, contact details, and club information.
          </p>
        </div>

        <div className="bg-white rounded-[26px] sm:rounded-[34px] overflow-hidden shadow-sm border border-cyan-100">
          <label className="relative cursor-pointer block group overflow-hidden h-[230px] sm:h-[300px]">
            <input
              type="file"
              accept="image/*"
              aria-label="Upload organization banner"
              title="Upload organization banner"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = await uploadImage("club-images", file);

                if (url) {
                  setClubForm((prev) => ({
                    ...prev,
                    banner_url: url,
                  }));
                }
              }}
            />

            <Image
              src={clubForm.banner_url || "/lspu-campus.jpg"}
              alt="Organization banner"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1050px"
              className="object-cover transition duration-300 group-hover:brightness-95"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            <div className="absolute left-5 right-5 sm:left-8 sm:right-8 bottom-5 sm:bottom-8 text-white">
              <p className="inline-flex bg-white/20 backdrop-blur-sm border border-white/30 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
                Click banner to change
              </p>

              <h1 className="mt-3 sm:mt-4 max-w-[780px] text-2xl sm:text-4xl md:text-5xl font-black leading-tight drop-shadow">
                {clubForm.name || "Organization Name"}
              </h1>

              <p className="mt-2 max-w-2xl text-white/90 line-clamp-2">
                {clubForm.short_desc || "Short organization description or tagline."}
              </p>
            </div>
          </label>

          <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row md:items-start gap-5 sm:gap-6">
              <label className="cursor-pointer block shrink-0 self-center md:self-start">
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload organization logo"
                  title="Upload organization logo"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const url = await uploadImage("club-images", file);

                    if (url) {
                      setClubForm((prev) => ({
                        ...prev,
                        logo_url: url,
                      }));
                    }
                  }}
                />

                <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[4px] shadow-xl">
                  <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-white">
                    <Image
                      src={clubForm.logo_url || "/lspu-campus.jpg"}
                      alt="Organization logo"
                      fill
                      sizes="112px"
                      className="object-cover hover:opacity-85 transition"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400 font-bold mt-2 text-center">
                  Change logo
                </p>
              </label>

              <div className="flex-1 min-w-0 pt-5">
                <span
                  className={`inline-flex items-center justify-center min-w-[70px] h-8 px-4 rounded-full text-xs font-black leading-none text-center whitespace-nowrap ${getDepartmentStyle(
                    clubForm.department || "NON-ACAD"
                  )}`}
                >
                  {clubForm.department || "NON-ACAD"}
                </span>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <InputField
                    label="Organization Name"
                    value={clubForm.name}
                    placeholder="Organization Name"
                    onChange={(value) =>
                      setClubForm({
                        ...clubForm,
                        name: value,
                      })
                    }
                  />

                  <InputField
                    label="Short Description"
                    value={clubForm.short_desc}
                    placeholder="Short Description or Tagline"
                    onChange={(value) =>
                      setClubForm({
                        ...clubForm,
                        short_desc: value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 mt-8">
              <EditableInfoCard
                title="About This Club"
                value={clubForm.description}
                placeholder="Write a brief description about your organization."
                onChange={(value) =>
                  setClubForm({ ...clubForm, description: value })
                }
              />

              <EditableInfoCard
                title="What We Offer"
                value={clubForm.offers}
                placeholder="Example: workshops, seminars, competitions, volunteering..."
                onChange={(value) =>
                  setClubForm({ ...clubForm, offers: value })
                }
              />

              <InfoCard
                title="Number of Members"
                value={`${members.length} Member${members.length === 1 ? "" : "s"}`}
              />

              <EditableInfoCard
                title="Location"
                value={clubForm.location}
                placeholder="Organization office or meeting place"
                onChange={(value) =>
                  setClubForm({ ...clubForm, location: value })
                }
              />

              <EditableInfoCard
                title="Contact"
                value={clubForm.contact || clubForm.contact_email}
                placeholder="Email, phone number, or social media contact"
                onChange={(value) =>
                  setClubForm({
                    ...clubForm,
                    contact: value,
                    contact_email: value,
                  })
                }
              />
            </div>

            <div className="flex justify-stretch sm:justify-end mt-8">
              <button
                type="button"
                onClick={saveClub}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-10 py-3 rounded-full font-black shadow-sm hover:shadow-md hover:brightness-110 transition"
              >
                Save Club
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-black uppercase tracking-wide text-gray-400">
        {label}
      </span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-12 rounded-2xl bg-[#f6fffb] border border-cyan-100 px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
      />
    </label>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-[#f6fffb] border border-cyan-100 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-gray-400">
        {title}
      </p>

      <p className="mt-3 text-sm font-semibold text-[#244543] leading-relaxed">
        {value || "N/A"}
      </p>
    </div>
  );
}

function EditableInfoCard({
  title,
  value,
  placeholder,
  onChange,
}: {
  title: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="bg-[#f6fffb] border border-cyan-100 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6 block min-w-0">
      <span className="text-xs font-black uppercase tracking-wide text-gray-400">
        {title}
      </span>

      <textarea
        aria-label={title}
        title={title}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full bg-transparent outline-none text-sm font-semibold text-[#244543] min-h-[105px] resize-none placeholder:text-gray-400 leading-relaxed"
      />
    </label>
  );
}