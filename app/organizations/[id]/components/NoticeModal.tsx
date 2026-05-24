"use client";

type Props = {
  notice: string;
  onClose: () => void;
};

export default function NoticeModal({ notice, onClose }: Props) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[60] flex items-center justify-center px-4">
      <div className="bg-white rounded-[32px] p-7 max-w-sm w-full shadow-2xl text-center border border-cyan-100">
        <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white font-black">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
          </svg>
        </div>

        <h3 className="mt-5 text-xl font-black text-[#244543]">
          Notice
        </h3>

        <p className="mt-3 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
          {notice}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-8 py-3 rounded-full font-extrabold hover:brightness-110 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}