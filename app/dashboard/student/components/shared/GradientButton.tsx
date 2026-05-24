"use client";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
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
      className={`inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-8 py-3 rounded-full font-extrabold shadow-sm hover:brightness-110 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${className}`}
    >
      {children}
    </button>
  );
}