"use client";

import Image from "next/image";
import Modal from "../Modal";
import ModalField from "../ModalField";
import type { AdminOrganization } from "../../types";

type Props = {
  selectedOrganization: AdminOrganization | null;
  setSelectedOrganization: React.Dispatch<
    React.SetStateAction<AdminOrganization | null>
  >;
  departmentOptions: string[];
  uploadOrganizationImage: (
    file: File,
    type: "banner" | "logo"
  ) => Promise<string>;
  updateOrganization: () => void;
  deleteOrganization: (id: string) => void;
};

export default function OrganizationDetailsModal({
  selectedOrganization,
  setSelectedOrganization,
  departmentOptions,
  uploadOrganizationImage,
  updateOrganization,
  deleteOrganization,
}: Props) {
  if (!selectedOrganization) return null;

  const logoImage =
    selectedOrganization.logo_url ||
    selectedOrganization.banner_url ||
    "/lspu-campus.jpg";

  const bannerImage =
    selectedOrganization.banner_url ||
    selectedOrganization.logo_url ||
    "/lspu-campus.jpg";

  return (
    <Modal onClose={() => setSelectedOrganization(null)}>
      <div className="mb-6 sm:mb-7">
        <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
          Organization
        </p>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#244543]">
          Organization Details
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Update organization profile, images, contact details, and information.
        </p>
      </div>

      <div className="space-y-6">
        <label className="relative cursor-pointer block group overflow-hidden rounded-[22px] sm:rounded-[28px] border border-cyan-100">
          <input
            type="file"
            accept="image/*"
            aria-label="Upload organization banner"
            title="Upload organization banner"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const url = await uploadOrganizationImage(file, "banner");

              if (url) {
                setSelectedOrganization({
                  ...selectedOrganization,
                  banner_url: url,
                });
              }
            }}
          />

          <div className="relative h-[220px] w-full">
            <Image
              src={bannerImage}
              alt={selectedOrganization.name || "Organization banner"}
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 760px"
              className="object-cover transition duration-300 group-hover:brightness-95"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          <div className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-4 sm:bottom-6 text-white">
            <p className="inline-flex bg-white/20 backdrop-blur-sm border border-white/30 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
              Click banner to change
            </p>

            <h3 className="mt-3 sm:mt-4 text-xl sm:text-3xl font-black leading-tight drop-shadow line-clamp-2">
              {selectedOrganization.name || "Organization Name"}
            </h3>
          </div>
        </label>

        <div className="flex flex-col md:flex-row gap-6">
          <label className="cursor-pointer shrink-0 mx-auto md:mx-0">
            <input
              type="file"
              accept="image/*"
              aria-label="Upload organization logo"
              title="Upload organization logo"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = await uploadOrganizationImage(file, "logo");

                if (url) {
                  setSelectedOrganization({
                    ...selectedOrganization,
                    logo_url: url,
                  });
                }
              }}
            />

            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[4px] shadow-lg">
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-white">
                <Image
                  src={logoImage}
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

          <div className="grid sm:grid-cols-2 gap-4 flex-1 min-w-0 w-full">
            <ModalField
              label="Organization Name"
              placeholder="Organization name"
              value={selectedOrganization.name || ""}
              onChange={(value: string) =>
                setSelectedOrganization({
                  ...selectedOrganization,
                  name: value,
                })
              }
            />

            <label className="block min-w-0">
              <span className="text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
                Department
              </span>

              <select
                aria-label="Department"
                title="Department"
                value={selectedOrganization.department || ""}
                onChange={(e) =>
                  setSelectedOrganization({
                    ...selectedOrganization,
                    department: e.target.value,
                  })
                }
                className="w-full h-12 bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">Select Department</option>

                {departmentOptions.map((department: string) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </label>

            <ModalField
              label="President"
              placeholder="President"
              value={
                selectedOrganization.president ||
                selectedOrganization.officers?.President ||
                ""
              }
              onChange={(value: string) =>
                setSelectedOrganization({
                  ...selectedOrganization,
                  president: value,
                })
              }
            />

            <ModalField
              label="Contact"
              placeholder="Contact"
              value={selectedOrganization.contact || ""}
              onChange={(value: string) =>
                setSelectedOrganization({
                  ...selectedOrganization,
                  contact: value,
                })
              }
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <TextAreaField
            label="About this Club"
            placeholder="Write a description about this organization."
            value={selectedOrganization.description || ""}
            onChange={(value: string) =>
              setSelectedOrganization({
                ...selectedOrganization,
                description: value,
              })
            }
          />

          <TextAreaField
            label="What We Offer"
            placeholder="Write what the organization offers."
            value={
              Array.isArray(selectedOrganization.offers)
                ? selectedOrganization.offers.join(", ")
                : selectedOrganization.offers || ""
            }
            onChange={(value: string) =>
              setSelectedOrganization({
                ...selectedOrganization,
                offers: value,
              })
            }
          />

          <TextAreaField
            label="Location"
            placeholder="Organization office or meeting place."
            value={selectedOrganization.location || ""}
            onChange={(value: string) =>
              setSelectedOrganization({
                ...selectedOrganization,
                location: value,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={() => setSelectedOrganization(null)}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 font-black transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => deleteOrganization(selectedOrganization.id)}
          className="w-full sm:w-auto px-7 py-3 rounded-full bg-red-500/90 text-white border border-red-500 hover:bg-red-600 font-black transition shadow-sm"
        >
          Delete
        </button>

        <button
          type="button"
          onClick={updateOrganization}
          className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black shadow-sm hover:shadow-md hover:brightness-110 transition"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

function TextAreaField({
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
      <span className="text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
        {label}
      </span>

      <textarea
        aria-label={label}
        title={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[120px] bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-3 outline-none text-sm font-semibold text-[#244543] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-100 resize-none leading-relaxed"
      />
    </label>
  );
}