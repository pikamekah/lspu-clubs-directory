"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function DashboardCard({
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`bg-white rounded-[30px] shadow-sm border border-cyan-100 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}