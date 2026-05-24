"use client";

import Image from "next/image";
import Modal from "../Modal";
import ModalField from "../ModalField";
import ModalActions from "../ModalActions";
import SelectField from "../SelectField";
import type {
  AdminEvent,
  AdminOrganization,
} from "../../types";

import { uploadEventImage } from "../../services/uploadService";

type Props = {
  editingEvent: AdminEvent | null;
  setEditingEvent: React.Dispatch<React.SetStateAction<AdminEvent | null>>;
  organizations: AdminOrganization[];
  eventTagOptions: string[];
  updateEvent: () => void;
};

export default function EditEventModal({
  editingEvent,
  setEditingEvent,
  organizations,
  eventTagOptions,
  updateEvent,
}: Props) {
  if (!editingEvent) return null;

  const bannerImage = editingEvent.image_url || "/lspu-campus.jpg";

  return (
    <Modal onClose={() => setEditingEvent(null)}>
      <div className="mb-6 sm:mb-7">
        <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
          Event
        </p>

        <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#244543]">
          Edit Event
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Update event information, banner, schedule, venue, and organization.
        </p>
      </div>

      <div className="space-y-5">
        <label className="relative cursor-pointer block group overflow-hidden rounded-[22px] sm:rounded-[28px] border border-cyan-100">
          <input
            type="file"
            accept="image/*"
            aria-label="Upload event banner"
            title="Upload event banner"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const url = await uploadEventImage(file);

              if (url) {
                setEditingEvent({
                  ...editingEvent,
                  image_url: url,
                });
              }
            }}
          />

          <div className="relative h-[170px] sm:h-[220px] w-full">
            <Image
              src={bannerImage}
              alt="Event banner preview"
              fill
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
              {editingEvent.title || "Event Title"}
            </h3>

            <p className="mt-1 text-white/85 text-sm line-clamp-1">
              {editingEvent.venue || "Venue"}
            </p>
          </div>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <ModalField
            label="Event Title"
            placeholder="Event title"
            value={editingEvent.title || ""}
            onChange={(value: string) =>
              setEditingEvent({
                ...editingEvent,
                title: value,
              })
            }
          />

          <ModalField
            label="Venue"
            placeholder="Venue"
            value={editingEvent.venue || ""}
            onChange={(value: string) =>
              setEditingEvent({
                ...editingEvent,
                venue: value,
              })
            }
          />

          <ModalField
            label="Date"
            type="date"
            placeholder=""
            value={editingEvent.date || ""}
            onChange={(value: string) =>
              setEditingEvent({
                ...editingEvent,
                date: value,
              })
            }
          />

          <ModalField
            label="Time"
            type="time"
            placeholder=""
            value={editingEvent.time || ""}
            onChange={(value: string) =>
              setEditingEvent({
                ...editingEvent,
                time: value,
              })
            }
          />

          <SelectField
            label="Tag"
            value={editingEvent.category || ""}
            onChange={(value: string) =>
              setEditingEvent({
                ...editingEvent,
                category: value,
              })
            }
            options={eventTagOptions}
          />

          <label className="block min-w-0">
            <span className="text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
              Organization
            </span>

            <select
              title="Organization"
              aria-label="Organization"
              value={editingEvent.org_id || ""}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  org_id: e.target.value,
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
        </div>

        <TextAreaField
          label="Description"
          placeholder="Write the event description."
          value={editingEvent.description || ""}
          onChange={(value: string) =>
            setEditingEvent({
              ...editingEvent,
              description: value,
            })
          }
        />
      </div>

      <ModalActions
        onCancel={() => setEditingEvent(null)}
        onSave={updateEvent}
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