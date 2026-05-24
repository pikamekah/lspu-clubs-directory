"use client";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[999] bg-black/50 flex items-end sm:items-center justify-center px-3 sm:px-4 py-3 sm:py-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-[36px] p-5 sm:p-8 md:p-10 w-full max-w-[720px] max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-cyan-100"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}