"use client";

import type { AdminContactMessage } from "../../types";

type Props = {
  contactMessages: AdminContactMessage[];
  contactLoading: boolean;
  markContactMessageAsRead: (id: string) => void;
  deleteContactMessage: (id: string) => void;
};

export default function ContactMessagesView({
  contactMessages,
  contactLoading,
  markContactMessageAsRead,
  deleteContactMessage,
}: Props) {
  return (
    <section className="w-full max-w-[1180px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-7">
        <div>
          <p className="inline-flex bg-cyan-50 text-cyan-700 px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
            Contact Messages
          </p>

          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-[#244543]">
            User Concerns
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            View messages submitted from the UniLink contact form.
          </p>
        </div>

        <div className="bg-white border border-cyan-100 rounded-2xl px-5 py-4 shadow-sm w-full sm:w-auto">
          <p className="text-xs font-black uppercase tracking-wide text-gray-400">
            Total Messages
          </p>

          <p className="mt-1 text-2xl font-black text-[#244543]">
            {contactMessages.length}
          </p>
        </div>
      </div>

      {contactLoading ? (
        <div className="bg-white rounded-[28px] border border-cyan-100 shadow-sm p-10 text-center text-gray-500">
          Loading contact messages...
        </div>
      ) : contactMessages.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-cyan-100 shadow-sm p-10 text-center text-gray-500">
          No contact messages found.
        </div>
      ) : (
        <div className="grid gap-5">
          {contactMessages.map((message) => {
            const isUnread = message.status !== "read";

            return (
              <article
                key={message.id}
                className="bg-white rounded-[24px] sm:rounded-[28px] border border-cyan-100 shadow-sm p-5 sm:p-6 hover:shadow-xl transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg sm:text-xl font-black text-[#244543] break-words">
                        {message.name}
                      </h3>

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase ${
                          isUnread
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {isUnread ? "Unread" : "Read"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500 break-words">
                      {message.email}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 font-bold">
                    {message.created_at
                      ? new Date(message.created_at).toLocaleString("en-PH")
                      : "No date"}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)] gap-4">
                  <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-3">
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-wide">
                      Concern
                    </p>

                    <p className="mt-1 font-black text-[#244543] break-words">
                      {message.concern}
                    </p>
                  </div>

                  <div className="bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 py-3">
                    <p className="text-[11px] text-gray-400 font-black uppercase tracking-wide">
                      Message
                    </p>

                    <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words">
                      {message.message}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:justify-end gap-3">
                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => markContactMessageAsRead(message.id)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black text-sm hover:brightness-110 transition shadow-sm"
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteContactMessage(message.id)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-red-500/90 text-white border border-red-500 font-black text-sm hover:bg-red-600 transition shadow-sm"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}