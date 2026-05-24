"use client";

export default function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 text-gray-500 border border-gray-200">
      {message}
    </div>
  );
}