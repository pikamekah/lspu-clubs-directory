"use client";

type Props = {
  label: string;
  value: string;
};

export default function ReadOnlyField({ label, value }: Props) {
  return (
    <label className="block">
      <span className="font-black text-sm block mb-2 text-[#244543]">
        {label}
      </span>

      <input
        value={value}
        readOnly
        title={label}
        aria-label={label}
        className="w-full bg-gray-50 border border-cyan-100 px-4 py-3 rounded-full outline-none text-gray-600 font-semibold cursor-not-allowed"
      />
    </label>
  );
}