"use client";

type Props = {
  title: string;
  subtitle: string;
  onCreate?: () => void;
  children: React.ReactNode;
};

export default function ContentPanel({
  title,
  subtitle,
  onCreate,
  children,
}: Props) {
  return (
    <section className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm border border-cyan-100">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-between gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#244543]">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>

        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-7 py-3 rounded-full text-sm font-black shadow-sm hover:shadow-md hover:brightness-110 transition"
          >
            Create
          </button>
        )}
      </div>

      {children}
    </section>
  );
}