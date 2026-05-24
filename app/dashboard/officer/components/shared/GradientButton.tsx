"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

export default function GradientButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}