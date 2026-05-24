"use client";

type Props = {
  onCancel: () => void;
  onSave: () => void;
};

export default function ModalActions({ onCancel, onSave }: Props) {
  return (
    <div className="flex justify-end gap-3 mt-8">
      <button
        type="button"
        onClick={onCancel}
        className="px-7 py-3 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 font-black transition"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white font-black shadow-sm hover:shadow-md hover:brightness-110 transition"
      >
        Save
      </button>
    </div>
  );
}