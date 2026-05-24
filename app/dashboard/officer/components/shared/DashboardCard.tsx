"use client";

export default function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}