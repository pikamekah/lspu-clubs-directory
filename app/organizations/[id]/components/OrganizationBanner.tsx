"use client";

import Image from "next/image";

type Props = {
  name?: string;
  bannerUrl?: string;
  logoUrl?: string;
};

export default function OrganizationBanner({
  name,
  bannerUrl,
  logoUrl,
}: Props) {
  return (
    <section className="relative bg-[#f6fffb]">
      <div className="relative h-[340px] sm:h-[380px] lg:h-[430px] w-full overflow-visible">
        <Image
          src={bannerUrl || "/lspu-campus.jpg"}
          alt={name || "Organization banner"}
          title={name || "Organization banner"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-cyan-900/25" />

        <div className="relative z-10 max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center">
          <div className="text-white max-w-4xl pt-6 sm:pt-8 pr-4">
            <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
              Organization Profile
            </p>

            <h1 className="mt-5 sm:mt-6 text-3xl sm:text-4xl md:text-6xl font-black leading-tight drop-shadow-lg">
              {name || "Organization Name"}
            </h1>
          </div>
        </div>

        <div className="absolute left-0 right-0 -bottom-12 sm:-bottom-16 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-center sm:justify-end">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 p-[4px] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white bg-white">
                <Image
                  src={logoUrl || bannerUrl || "/lspu-campus.jpg"}
                  alt={name || "Organization logo"}
                  title={name || "Organization logo"}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}