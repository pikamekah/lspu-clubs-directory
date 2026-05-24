"use client";

import { StaggerItem } from "@/components/dashboard/Animated";

type Props = {
  offers: string[];
};

export default function OrganizationOffers({ offers }: Props) {
  return (
    <section className="bg-white rounded-[36px] p-8 shadow-xl border border-cyan-100 transition duration-300 hover:shadow-2xl hover:-translate-y-1">
      <p className="inline-flex bg-lime-50 text-lime-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
        Benefits
      </p>

      <h2 className="mt-5 text-2xl md:text-3xl font-black text-[#244543]">
        What We Offer
      </h2>

      {offers.length > 0 ? (
        <div className="mt-6 grid gap-3">
          {offers.map((offer, index) => (
            <StaggerItem
              key={`${offer}-${index}`}
              delay={
                index % 4 === 0
                  ? "delay-0"
                  : index % 4 === 1
                  ? "delay-100"
                  : index % 4 === 2
                  ? "delay-200"
                  : "delay-300"
              }
            >
              <div className="group flex gap-4 rounded-2xl bg-[#f6fffb] border border-cyan-100 p-4 transition duration-300 hover:bg-lime-50 hover:shadow-md hover:-translate-y-0.5">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white flex items-center justify-center font-black shrink-0 transition duration-300 group-hover:scale-110">
                  ✓
                </div>

                <p className="text-gray-600 leading-relaxed">{offer}</p>
              </div>
            </StaggerItem>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-gray-600">No offers listed yet.</p>
      )}
    </section>
  );
}