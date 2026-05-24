"use client";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

export default function ModalField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: Props) {
  return (
    <label className="block min-w-0">
      <span className="text-[11px] sm:text-xs font-black uppercase tracking-wide text-gray-400 block mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 sm:h-12 bg-[#f6fffb] border border-cyan-100 rounded-2xl px-4 outline-none text-sm font-bold text-[#244543] placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-100"
      />
    </label>
  );
}