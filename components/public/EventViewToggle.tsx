"use client";

type Props = {
  view: "list" | "calendar";
  setView: (view: "list" | "calendar") => void;
};

export default function EventViewToggle({ view, setView }: Props) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-[#f6fffb] border border-cyan-100 p-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setView("list")}
          className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition ${
            view === "list"
              ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
              : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
          }`}
        >
          Upcoming Events
        </button>

        <button
          type="button"
          onClick={() => setView("calendar")}
          className={`px-6 py-2.5 rounded-full text-sm font-extrabold transition ${
            view === "calendar"
              ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
              : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
          }`}
        >
          Calendar View
        </button>
      </div>
    </div>
  );
}