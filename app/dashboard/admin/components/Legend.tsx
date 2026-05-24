"use client";

type Props = {
  label: string;
  value: number;
  total: number;
  dotClass: string;
};

function getProgressWidth(percentage: number) {
  if (percentage <= 0) return "w-0";
  if (percentage <= 10) return "w-[10%]";
  if (percentage <= 20) return "w-[20%]";
  if (percentage <= 30) return "w-[30%]";
  if (percentage <= 40) return "w-[40%]";
  if (percentage <= 50) return "w-[50%]";
  if (percentage <= 60) return "w-[60%]";
  if (percentage <= 70) return "w-[70%]";
  if (percentage <= 80) return "w-[80%]";
  if (percentage <= 90) return "w-[90%]";
  return "w-full";
}

export default function Legend({
  label,
  value,
  total,
  dotClass,
}: Props) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />

          <span className="text-sm text-gray-600 font-bold truncate">
            {label}
          </span>
        </div>

        <div className="text-right shrink-0">
          <p className="font-black text-sm text-[#244543]">
            {value}
          </p>

          <p className="text-[11px] text-gray-400 font-bold">
            {percentage}%
          </p>
        </div>
      </div>

      <div className="h-2 rounded-full bg-cyan-50 overflow-hidden">
        <div
          className={`h-full rounded-full ${dotClass} ${getProgressWidth(
            percentage
          )}`}
        />
      </div>
    </div>
  );
}