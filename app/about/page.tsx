import Image from "next/image";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import ScrollReveal from "@/components/dashboard/ScrollReveal";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

const teamMembers = [
  {
    name: "Micah Leyva",
    role: "Project Leader",
    description:
      "Led the team and managed the overall planning, development, database design, and coordination of UniLink.",
    image: "/team/Leyva.jpeg",
  },
  {
    name: "Lance Bitare",
    role: "Content and Testing Specialist",
    description:
      "Handled content writing, flowchart creation, and testing to ensure UniLink's information and features were clear and functional.",
    image: "/team/Bitare.jpg",
  },
  {
    name: "Tiffany Dorado",
    role: "Design and Research Specialist",
    description:
      "Focused on UI/UX design, graphics, research, flowcharts, and testing to improve UniLink's usability and visual quality.",
    image: "/team/Dorado.jpg",
  },
  {
    name: "Roxanne Plantilla",
    role: "UI/UX and Research Specialist",
    description:
      "Worked on interface design, user research, flowcharts, and testing to support UniLink's user experience and functionality.",
    image: "/team/Plantilla.jpg",
  },
  {
    name: "Kreivenne Sales",
    role: "Documentation and Design Specialist",
    description:
      "Managed documentation, flowcharts, graphics, and testing to support UniLink's project organization and presentation.",
    image: "/team/Sales.jpg",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020] overflow-x-hidden">
      <section className="relative min-h-[440px] sm:min-h-[480px] overflow-hidden flex items-center">
        <Image
          src="/lspu-school-bg.jpg"
          alt="LSPU campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-cyan-900/35" />

        <LandingNavbar activePage="about" />

        <div className="relative z-10 w-full">
          <FadeIn>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 text-center text-white">
              <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
                About UniLink
              </p>

              <h1 className="mt-6 sm:mt-7 text-4xl sm:text-5xl md:text-6xl font-black leading-tight max-w-5xl mx-auto">
                Connecting Students with Campus Organizations
              </h1>

              <p className="mt-5 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
                UniLink is a digital platform designed to help LSPU students
                discover organizations, join clubs, view events, and stay
                updated with announcements in one convenient place.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
            <div>
              <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                Our Purpose
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl font-black leading-tight text-[#244543]">
                Making student organization access easier, faster, and more
                organized.
              </h2>

              <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                UniLink was created to support students, organization officers,
                and administrators by providing a centralized system for club
                discovery, membership applications, event management, and
                official announcements.
              </p>

              <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                Instead of relying only on manual processes or scattered posts,
                students can explore available organizations while officers can
                manage their club information more efficiently.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-cyan-200 to-lime-200 rounded-[30px] sm:rounded-[36px] blur-2xl opacity-70" />

              <div className="relative bg-white rounded-[28px] sm:rounded-[34px] p-3 sm:p-4 shadow-xl border border-cyan-100 unilink-breathe-card">
                <div className="relative h-[250px] sm:h-[340px] lg:h-[420px] overflow-hidden rounded-[22px] sm:rounded-[28px]">
                  <Image
                    src="/lspu-school-bg.jpg"
                    alt="LSPU campus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="bg-white px-5 sm:px-6 py-14 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className="inline-flex bg-lime-50 text-lime-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                What UniLink Offers
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#244543]">
                Built for Students, Officers, and Campus Management
              </h2>

              <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
                UniLink helps students, organization officers, and authorized
                campus personnel manage organization-related tasks in a simpler
                and more accessible way.
              </p>
            </div>

            <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <StaggerItem delay="delay-0">
                <FeatureCard
                  icon="🎓"
                  title="For Students"
                  description="Browse organizations, apply for membership, view events, and receive announcements."
                />
              </StaggerItem>

              <StaggerItem delay="delay-100">
                <FeatureCard
                  icon="🧑‍💼"
                  title="For Officers"
                  description="Manage organization profiles, review applications, create events, and update members."
                />
              </StaggerItem>

              <StaggerItem delay="delay-200">
                <FeatureCard
                  icon="🏢"
                  title="For Campus Management"
                  description="Authorized university personnel or OSAS can oversee organizations, users, events, announcements, and platform records."
                />
              </StaggerItem>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="bg-[#e9fff5] px-5 sm:px-6 py-14 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <p className="inline-flex bg-white text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide border border-cyan-100">
                Our Team
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#244543]">
                Meet the Team
              </h2>

              <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
                Meet the five members behind UniLink, working together to create
                a better digital experience for LSPU student organizations.
              </p>
            </div>

            <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
              {teamMembers.map((member, index) => (
                <StaggerItem
                  key={member.name}
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
                  <TeamMemberCard
                    name={member.name}
                    role={member.role}
                    description={member.description}
                    image={member.image}
                  />
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <LandingFooter />
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="h-full bg-[#f8fffb] border border-cyan-100 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-black text-[#244543]">{title}</h3>

      <p className="mt-3 text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function TeamMemberCard({
  name,
  role,
  description,
  image,
}: {
  name: string;
  role: string;
  description: string;
  image: string;
}) {
  return (
    <div className="h-full bg-[#f8fffb] border border-cyan-100 rounded-[24px] sm:rounded-[28px] px-5 py-7 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition flex flex-col items-center">
      <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      <div className="mt-6 min-h-[58px] flex items-center justify-center">
        <h3 className="text-[18px] font-black text-[#244543] leading-tight">
          {name}
        </h3>
      </div>

      <div className="min-h-[54px] flex items-start justify-center">
        <p className="text-[13px] font-extrabold text-cyan-700 leading-snug">
          {role}
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}