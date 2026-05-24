"use client";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

export default function SelectField({
  label,
  value,
  onChange,
  options,
}: Props) {
  return (
    <label className="block min-w-0">
      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
        {label}
      </span>

      <select
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 sm:h-12 bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 outline-none text-sm font-bold text-[#244543] focus:ring-2 focus:ring-cyan-100"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}