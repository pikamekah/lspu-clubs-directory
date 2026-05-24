"use client";

type Props = {
  children: React.ReactNode;
};

export default function TableContainer({ children }: Props) {
  return (
    <div className="mt-6 w-full overflow-x-auto rounded-[28px] bg-white border border-cyan-100 shadow-sm">
      {children}
    </div>
  );
}