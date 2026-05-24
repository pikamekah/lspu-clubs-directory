"use client";

import Modal from "../Modal";
import ModalField from "../ModalField";
import ModalActions from "../ModalActions";
import type {
  AdminAnnouncement,
  AdminOrganization,
  AnnouncementTargetType,
} from "../../types";

type Props = {
  editingAnnouncement: AdminAnnouncement | null;
  setEditingAnnouncement: React.Dispatch<
    React.SetStateAction<AdminAnnouncement | null>
  >;
  organizations: AdminOrganization[];
  updateAnnouncement: () => void;
};

export default function EditAnnouncementModal({
  editingAnnouncement,
  setEditingAnnouncement,
  organizations,
  updateAnnouncement,
}: Props) {
  if (!editingAnnouncement) return null;

  const targetType =
    (editingAnnouncement.target_type || "all") as AnnouncementTargetType;

  const needsOrganization =
    targetType === "organization" || targetType === "officers";

  return (
    <Modal onClose={() => setEditingAnnouncement(null)}>
      <div className="mb-6 sm:mb-7">
        <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
          Announcement
        </p>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#244543]">
          Edit Announcement
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Update the announcement title, message, and target recipients.
        </p>
      </div>

      <div className="space-y-5">
        <ModalField
          label="Title"
          placeholder="Announcement title"
          value={editingAnnouncement.title || ""}
          onChange={(value: string) =>
            setEditingAnnouncement({
              ...editingAnnouncement,
              title: value,
            })
          }
        />

        <TextAreaField
          label="Message"
          placeholder="Write your announcement message."
          value={editingAnnouncement.message || ""}
          onChange={(value: string) =>
            setEditingAnnouncement({
              ...editingAnnouncement,
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
              aria-label="Target"
              title="Target"
              value={targetType}
              onChange={(e) =>
                setEditingAnnouncement({
                  ...editingAnnouncement,
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
                aria-label="Organization"
                title="Organization"
                value={editingAnnouncement.target_value || ""}
                onChange={(e) =>
                  setEditingAnnouncement({
                    ...editingAnnouncement,
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

      <ModalActions
        onCancel={() => setEditingAnnouncement(null)}
        onSave={updateAnnouncement}
      />
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