"use client";

import Modal from "../Modal";
import ModalField from "../ModalField";
import ModalActions from "../ModalActions";
import type {
  AnnouncementForm,
  AdminOrganization,
  AnnouncementTargetType,
} from "../../types";

type Props = {
  show: boolean;
  onClose: () => void;
  announcementForm: AnnouncementForm;
  setAnnouncementForm: React.Dispatch<React.SetStateAction<AnnouncementForm>>;
  organizations: AdminOrganization[];
  sendAnnouncement: () => void;
};

export default function CreateAnnouncementModal({
  show,
  onClose,
  announcementForm,
  setAnnouncementForm,
  organizations,
  sendAnnouncement,
}: Props) {
  if (!show) return null;

  const needsOrganization =
    announcementForm.target_type === "organization" ||
    announcementForm.target_type === "officers";

  return (
    <Modal onClose={onClose}>
      <div className="mb-6 sm:mb-7">
        <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
          Announcement
        </p>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#244543]">
          Send Announcement
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Create an announcement for everyone, officers, or a specific organization.
        </p>
      </div>

      <div className="space-y-5">
        <ModalField
          label="Title"
          placeholder="Announcement title"
          value={announcementForm.title}
          onChange={(value: string) =>
            setAnnouncementForm({
              ...announcementForm,
              title: value,
            })
          }
        />

        <TextAreaField
          label="Message"
          placeholder="Write your announcement message."
          value={announcementForm.message}
          onChange={(value: string) =>
            setAnnouncementForm({
              ...announcementForm,
              message: value,
            })
          }
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block min-w-0">
            <span className="text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
              Target
            </span>

            <select
              title="Select target"
              aria-label="Select target"
              value={announcementForm.target_type}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  target_type: e.target.value as AnnouncementTargetType,
                  target_value: "",
                })
              }
              className="w-full h-12 bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">Everyone</option>
              <option value="officers">Officers</option>
              <option value="organization">Specific Organization</option>
            </select>
          </label>

          {needsOrganization ? (
            <label className="block min-w-0">
              <span className="text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
                Organization
              </span>

              <select
                title="Select organization"
                aria-label="Select organization"
                value={announcementForm.target_value}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    target_value: e.target.value,
                  })
                }
                className="w-full h-12 bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
              >
                <option value="">Select Organization</option>

                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-3">
              <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                Recipient Scope
              </p>

              <p className="mt-1 text-sm font-bold text-[#244543]">
                All students and officers
              </p>
            </div>
          )}
        </div>
      </div>

      <ModalActions onCancel={onClose} onSave={sendAnnouncement} />
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
        title={label}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[150px] bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-3 outline-none text-sm font-semibold text-[#244543] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-100 resize-none leading-relaxed"
      />
    </label>
  );
}