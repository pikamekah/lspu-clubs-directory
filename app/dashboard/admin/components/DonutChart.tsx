"use client";

type Props = {
  total: number;
  data: { value: number; color: string }[];
};

export default function DonutChart({ total, data }: Props) {
  const radius = 80;
  const strokeWidth = 34;
  const circumference = 2 * Math.PI * radius;

  function getOffset(index: number) {
    const previousTotal = data
      .slice(0, index)
      .reduce((sum, item) => sum + item.value, 0);

    return total ? (previousTotal / total) * circumference : 0;
  }

  return (
    <div className="relative w-[230px] h-[230px] flex items-center justify-center">
      <svg
        viewBox="0 0 220 220"
        className="w-[230px] h-[230px] -rotate-90"
        aria-label="Student year level donut chart"
        role="img"
      >
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#ecfeff"
          strokeWidth={strokeWidth}
        />

        {data.map((item, index) => {
          const dash = total ? (item.value / total) * circumference : 0;
          const offset = getOffset(index);

          return (
            <circle
              key={`${item.color}-${index}`}
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="absolute w-[118px] h-[118px] bg-white rounded-full flex flex-col items-center justify-center shadow-sm border border-cyan-50">
        <p className="text-5xl font-black leading-none text-[#244543]">
          {total}
        </p>

        <p className="mt-2 text-cyan-700 text-xs font-black uppercase tracking-wide">
          Enrolled
        </p>
      </div>
    </div>
  );
}