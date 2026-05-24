"use client";

import { ScaleIn } from "@/components/dashboard/Animated";

type OfficerNotification = {
  id?: string;
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  created_at?: string;
};

type Props = {
  selectedNotification: OfficerNotification | null;
  onClose: () => void;
};

export default function NotificationModal({
  selectedNotification,
  onClose,
}: Props) {
  if (!selectedNotification) return null;

  const notificationType = String(selectedNotification.type || "").toLowerCase();

  const isAnnouncement = notificationType === "announcement";
  const isApplication = notificationType === "application";

  const label = isAnnouncement
    ? "Announcement"
    : isApplication
    ? "Application"
    : "Notification";

  const icon = isAnnouncement ? "📢" : isApplication ? "👤" : "🔔";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] px-3 sm:px-4 py-6">
      <ScaleIn className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-8 w-full max-w-[520px] shadow-2xl border border-cyan-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 sm:gap-5">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#f6fffb] border border-cyan-100 flex items-center justify-center text-xl sm:text-2xl shrink-0">
              {icon}
            </div>

            <div className="min-w-0">
              <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
                {label}
              </p>

              <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-black text-[#244543] leading-tight">
                {selectedNotification.title || "New notification"}
              </h2>

              {selectedNotification.created_at && (
                <p className="text-xs text-gray-400 font-semibold mt-2">
                  {new Date(selectedNotification.created_at).toLocaleString(
                    "en-PH"
                  )}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition font-black shrink-0"
            aria-label="Close notification"
            title="Close notification"
          >
            ×
          </button>
        </div>

        <div className="mt-6 sm:mt-7 bg-[#f6fffb] border border-cyan-100 rounded-[22px] sm:rounded-[24px] p-5 sm:p-6">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {selectedNotification.message || "No message available."}
          </p>
        </div>
      </ScaleIn>
    </div>
  );
}