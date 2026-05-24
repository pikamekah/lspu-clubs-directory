"use client";

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

export default function SectionTitle({ title, subtitle, right }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-3xl font-black text-[#244543]">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}