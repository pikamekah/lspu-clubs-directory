"use client";

type Props = {
  children: React.ReactNode;
};

export default function TableContainer({
  children,
}: Props) {
  return (
    <div className="
      bg-white
      rounded-3xl
      shadow-sm
      border
      border-gray-100
      overflow-x-auto
      p-5
    ">
      {children}
    </div>
  );
}