"use client";

type Props = {
  label?: string;
  variant?: "success" | "pending" | "danger" | "info";
};

export default function StatusBadge({
  label = "Status",
  variant = "info",
}: Props) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap capitalize ${styles[variant]}`}
    >
      {label || "Status"}
    </span>
  );
}