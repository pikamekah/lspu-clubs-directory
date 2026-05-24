"use client";

import Image from "next/image";
import type { EventForm } from "../types";
import { ScaleIn } from "@/components/dashboard/Animated";

type Props = {
  showEventModal: boolean;
  editingEventId: string | null;
  eventForm: EventForm;
  setEventForm: React.Dispatch<React.SetStateAction<EventForm>>;
  eventBanner: string;
  setEventBanner: React.Dispatch<React.SetStateAction<string>>;
  uploadImage: (bucket: string, file: File) => Promise<string>;
  saveEvent: () => void;
  onClose: () => void;
};

export default function EventModal({
  showEventModal,
  editingEventId,
  eventForm,
  setEventForm,
  eventBanner,
  setEventBanner,
  uploadImage,
  saveEvent,
  onClose,
}: Props) {
  if (!showEventModal) return null;

  const previewImage = eventBanner || eventForm.image_url || "/lspu-campus.jpg";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-3 sm:px-4 py-6">
      <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] w-full max-w-[760px] max-h-[90vh] overflow-hidden shadow-2xl border border-cyan-100">
        <div className="relative h-[210px] sm:h-[240px] overflow-hidden">
          <Image
            src={previewImage}
            alt="Event banner preview"
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 h-10 w-10 rounded-full bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-600 font-black shadow-md transition"
            aria-label="Close event modal"
            title="Close"
          >
            ×
          </button>

          <label className="absolute left-4 sm:left-6 top-5 sm:top-6 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              aria-label="Upload event banner"
              title="Upload event banner"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const url = await uploadImage("event-images", file);

                if (url) {
                  setEventBanner(url);
                }
              }}
            />

            <span className="inline-flex bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide hover:bg-white/30 transition">
              Change Banner
            </span>
          </label>

          <div className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-5 sm:bottom-6 text-white">
            <p className="text-sm font-bold text-white/80">
              {editingEventId ? "Edit Event" : "Create Event"}
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black leading-tight drop-shadow line-clamp-2">
              {eventForm.title || "Event Title"}
            </h2>
          </div>
        </div>

        <div className="max-h-[calc(90vh-210px)] sm:max-h-[calc(90vh-240px)] overflow-y-auto p-5 sm:p-7 md:p-8">
          <div className="grid sm:grid-cols-2 gap-5">
            <InputField
              label="Title"
              value={eventForm.title}
              placeholder="Enter event title"
              onChange={(value) =>
                setEventForm({ ...eventForm, title: value })
              }
            />

            <SelectField
              label="Category"
              value={eventForm.category}
              onChange={(value) =>
                setEventForm({
                  ...eventForm,
                  category: value,
                })
              }
            />

            <InputField
              label="Date"
              type="date"
              value={eventForm.date}
              placeholder="Select date"
              onChange={(value) =>
                setEventForm({ ...eventForm, date: value })
              }
            />

            <InputField
              label="Time"
              type="time"
              value={eventForm.time}
              placeholder="Select time"
              onChange={(value) =>
                setEventForm({ ...eventForm, time: value })
              }
            />

            <InputField
              label="Venue"
              value={eventForm.venue}
              placeholder="Enter event venue"
              onChange={(value) =>
                setEventForm({ ...eventForm, venue: value })
              }
              wide
            />

            <TextAreaField
              label="Description"
              value={eventForm.description}
              placeholder="Write event details, instructions, or short description."
              onChange={(value) =>
                setEventForm({ ...eventForm, description: value })
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 font-black transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveEvent}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black shadow-sm hover:shadow-md hover:brightness-110 transition"
            >
              {editingEventId ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </div>
      </ScaleIn>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  wide?: boolean;
};

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  wide,
}: InputFieldProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      htmlFor={inputId}
      className={`block min-w-0 ${wide ? "sm:col-span-2" : ""}`}
    >
      <span className="text-xs font-black uppercase tracking-wide text-gray-400">
        {label}
      </span>

      <input
        id={inputId}
        aria-label={label}
        title={label}
        placeholder={placeholder || label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-12 rounded-2xl bg-[#f6fffb] border border-cyan-100 px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
      />
    </label>
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
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block sm:col-span-2">
      <span className="text-xs font-black uppercase tracking-wide text-gray-400">
        {label}
      </span>

      <textarea
        id={inputId}
        aria-label={label}
        title={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full min-h-[120px] rounded-2xl bg-[#f6fffb] border border-cyan-100 px-4 py-3 text-sm font-semibold text-[#244543] outline-none resize-none focus:ring-2 focus:ring-cyan-100 placeholder:text-gray-400 leading-relaxed"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label htmlFor={inputId} className="block min-w-0">
      <span className="text-xs font-black uppercase tracking-wide text-gray-400">
        {label}
      </span>

      <select
        id={inputId}
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-12 rounded-2xl bg-[#f6fffb] border border-cyan-100 px-4 text-sm font-bold text-[#244543] outline-none focus:ring-2 focus:ring-cyan-100"
      >
        <option value="">Select Category</option>
        <option value="Seminar">Seminar</option>
        <option value="Workshop">Workshop</option>
        <option value="Competition">Competition</option>
        <option value="Recruitment">Recruitment</option>
        <option value="Social">Social</option>
        <option value="Meeting">Meeting</option>
      </select>
    </label>
  );
}