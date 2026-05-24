"use client";

type Props = {
  title?: string;
  message: string;
};

export default function EmptyState({
  title = "Nothing to show yet",
  message,
}: Props) {
  return (
    <div className="bg-white rounded-[30px] p-8 text-center shadow-sm border border-cyan-100">
      <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white font-black shadow-sm">
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 5h16v12H7l-3 3z" />
        </svg>
      </div>

      <p className="mt-5 font-black text-[#244543] text-lg">
        {title}
      </p>

      <p className="text-sm mt-2 text-gray-500 leading-relaxed">
        {message}
      </p>
    </div>
  );
}