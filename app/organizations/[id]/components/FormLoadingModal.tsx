"use client";

type Props = {
  message?: string;
};

export default function FormLoadingModal({
  message = "Loading form...",
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-cyan-100 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-4 border-cyan-100 border-t-cyan-600 animate-spin" />

        <h2 className="mt-5 text-2xl font-black text-[#244543]">
          Please wait
        </h2>

        <p className="mt-2 text-gray-600">{message}</p>
      </div>
    </div>
  );
}