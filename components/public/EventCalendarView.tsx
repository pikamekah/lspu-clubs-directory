"use client";

import { getCategoryStyle } from "@/app/lib/publicStyles";
import type { PublicEvent } from "@/app/lib/publicTypes";
import EventPanelCard from "@/components/public/EventPanelCard";

type CalendarDay = {
  day: number | null;
  dateKey: string | null;
};

type Props = {
  monthName: string;
  calendarYear: number;
  calendarMonth: number;
  monthOptions: string[];
  yearOptions: number[];
  calendarDays: CalendarDay[];
  selectedDate: string;
  selectedDateEvents: PublicEvent[];
  showMonthYearPicker: boolean;
  setShowMonthYearPicker: React.Dispatch<React.SetStateAction<boolean>>;
  setCalendarMonth: React.Dispatch<React.SetStateAction<number>>;
  setCalendarYear: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  previousMonth: () => void;
  nextMonth: () => void;
  selectCalendarDate: (dateKey: string) => void;
  getEventsForDate: (dateKey: string) => PublicEvent[];
  getOrgName: (orgId: string) => string;
  getEventImage: (event: PublicEvent) => string;
  setSelectedEvent: React.Dispatch<React.SetStateAction<PublicEvent | null>>;
  formatDateLabel: (date?: string) => string;
};

export default function EventCalendarView({
  monthName,
  calendarYear,
  calendarMonth,
  monthOptions,
  yearOptions,
  calendarDays,
  selectedDate,
  selectedDateEvents,
  showMonthYearPicker,
  setShowMonthYearPicker,
  setCalendarMonth,
  setCalendarYear,
  setSelectedDate,
  previousMonth,
  nextMonth,
  getEventsForDate,
  getOrgName,
  getEventImage,
  setSelectedEvent,
  formatDateLabel,
}: Props) {
  function openEventPanel(dateKey: string | null) {
    if (!dateKey) return;

    setSelectedDate(dateKey);
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="bg-white rounded-[28px] sm:rounded-[36px] shadow-xl border border-cyan-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 sm:px-6 py-5 border-b border-cyan-100 bg-[#f6fffb]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const now = new Date();

                setCalendarMonth(now.getMonth());
                setCalendarYear(now.getFullYear());
                setSelectedDate("");
                setShowMonthYearPicker(false);
              }}
              className="px-4 sm:px-5 py-2.5 rounded-full bg-white border border-cyan-100 text-xs sm:text-sm font-extrabold text-cyan-700 hover:bg-cyan-50 transition shadow-sm"
            >
              Today
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousMonth}
                className="h-10 w-10 rounded-full bg-white border border-cyan-100 hover:bg-cyan-50 text-2xl text-cyan-700 font-black transition shadow-sm"
                aria-label="Previous month"
                title="Previous month"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={nextMonth}
                className="h-10 w-10 rounded-full bg-white border border-cyan-100 hover:bg-cyan-50 text-2xl text-cyan-700 font-black transition shadow-sm"
                aria-label="Next month"
                title="Next month"
              >
                ›
              </button>
            </div>

            <h2 className="ml-1 text-xl sm:text-2xl md:text-3xl font-black text-[#244543]">
              {monthName} {calendarYear}
            </h2>
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowMonthYearPicker((prev) => !prev)}
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white text-sm font-extrabold hover:brightness-110 transition flex items-center gap-2 shadow-sm"
            >
              Select Month
              <span className="text-xs">▾</span>
            </button>

            {showMonthYearPicker && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-14 w-full sm:w-[320px] bg-white rounded-[28px] shadow-2xl border border-cyan-100 p-5 z-30">
                <p className="text-sm font-black text-[#244543] mb-3">
                  Select Month
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {monthOptions.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        setCalendarMonth(index);
                        setSelectedDate("");
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-extrabold transition ${
                        calendarMonth === index
                          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                          : "bg-[#f6fffb] text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      {month.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <p className="text-sm font-black text-[#244543] mt-5 mb-3">
                  Select Year
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {yearOptions.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setCalendarYear(year);
                        setSelectedDate("");
                      }}
                      className={`px-3 py-2 rounded-full text-sm font-extrabold transition ${
                        calendarYear === year
                          ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                          : "bg-[#f6fffb] text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end mt-5">
                  <button
                    type="button"
                    onClick={() => setShowMonthYearPicker(false)}
                    className="px-6 py-2.5 rounded-full bg-[#101415] text-white text-sm font-extrabold hover:bg-cyan-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 bg-white w-full">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              className="min-w-0 border-b border-r border-cyan-100 last:border-r-0 px-1 sm:px-3 py-2 sm:py-3 text-center text-[9px] sm:text-xs font-black text-cyan-700 bg-cyan-50/50"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((item, index) => {
            const dayEvents = item.dateKey ? getEventsForDate(item.dateKey) : [];
            const isSelected = selectedDate === item.dateKey;

            return (
              <div
                key={`${item.dateKey || "blank"}-${index}`}
                className={`min-w-0 min-h-[88px] sm:min-h-[125px] border-r border-b border-cyan-100 p-1 sm:p-2 text-left transition flex flex-col justify-start overflow-hidden ${
                  item.dateKey
                    ? isSelected
                      ? "bg-cyan-50"
                      : "bg-white"
                    : "bg-gray-50"
                }`}
              >
                {item.day && (
                  <>
                    <div className="flex justify-center items-start mb-1.5 sm:mb-2 shrink-0">
                      <span
                        className={`h-6 w-6 sm:h-8 sm:w-8 rounded-full flex items-center justify-center text-[11px] sm:text-sm font-black transition ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-600 to-lime-500 text-white shadow-sm"
                            : "text-[#244543]"
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>

                    <div className="space-y-1 w-full min-w-0">
                      {dayEvents.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => openEventPanel(item.dateKey)}
                          className={`block w-full min-w-0 rounded-full px-1 sm:px-2.5 py-1 text-[9px] sm:text-[11px] font-extrabold truncate text-left hover:ring-2 hover:ring-cyan-200 transition ${getCategoryStyle(
                            event.category
                          )}`}
                          title={event.title || "Event"}
                          aria-label={`Open events for ${formatDateLabel(
                            item.dateKey || undefined
                          )}`}
                        >
                          <span className="hidden sm:inline">
                            {event.time ? `${event.time} ` : ""}
                          </span>
                          {event.title || "Event"}
                        </button>
                      ))}

                      {dayEvents.length > 2 && (
                        <button
                          type="button"
                          onClick={() => openEventPanel(item.dateKey)}
                          className="block w-full text-left text-[9px] sm:text-[11px] font-bold text-gray-500 px-1 sm:px-2 hover:text-cyan-700 transition"
                        >
                          +{dayEvents.length - 2} more
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="fixed inset-0 z-[80] overflow-hidden">
          <div
            onClick={() => setSelectedDate("")}
            className="absolute inset-0 bg-black/45"
          />

          <aside className="absolute right-0 top-0 z-10 h-full w-full max-w-[430px] bg-[#f6fffb] shadow-2xl animate-slide-in-right">
            <div className="h-full overflow-y-auto">
              <div className="sticky top-0 z-10 bg-[#f6fffb] border-b border-cyan-100 px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
                      Calendar Events
                    </p>

                    <h2 className="mt-2 text-lg font-black text-[#244543]">
                      Selected Day
                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDateLabel(selectedDate)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedDate("")}
                    className="h-10 w-10 rounded-full bg-white border border-cyan-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-black shadow-sm transition"
                    aria-label="Close selected day events"
                    title="Close selected day events"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="px-4 sm:px-6 pt-3 pb-6 space-y-5">
                {selectedDateEvents.map((event) => (
                  <EventPanelCard
                    key={event.id}
                    event={event}
                    orgName={getOrgName(event.org_id || "")}
                    image={getEventImage(event)}
                    onClick={() => {
                      setSelectedDate("");
                      setSelectedEvent(event);
                    }}
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}