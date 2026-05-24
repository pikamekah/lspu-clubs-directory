import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import ScrollReveal from "@/components/dashboard/ScrollReveal";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";

const resources = [
  {
    icon: "🏫",
    title: "Organizations Directory",
    description:
      "Browse student organizations, view their profiles, and learn what each club offers.",
    link: "/organizations",
    button: "View Organizations",
  },
  {
    icon: "📅",
    title: "Events Page",
    description:
      "View upcoming activities, seminars, meetings, workshops, and organization events.",
    link: "/events",
    button: "View Events",
  },
  {
    icon: "📝",
    title: "Membership Applications",
    description:
      "Students can apply for organizations and track their membership application status.",
    link: "/signup",
    button: "Create Account",
  },
  {
    icon: "📢",
    title: "Announcements",
    description:
      "Stay updated with important organization updates, reminders, and campus announcements.",
    link: "/login",
    button: "Log in",
  },
  {
    icon: "👥",
    title: "Officer Tools",
    description:
      "Organization officers can manage members, review applications, create events, and update club details.",
    link: "/login",
    button: "Officer Login",
  },
  {
    icon: "🏢",
    title: "Campus Management Support",
    description:
      "Authorized university personnel or OSAS can oversee users, organizations, events, announcements, and system records.",
    link: "/login",
    button: "Authorized Login",
  },
];

const guides = [
  {
    title: "How to Join an Organization",
    steps: [
      "Create a student account or log in.",
      "Browse available organizations.",
      "Open the organization profile.",
      "Submit a membership application.",
      "Wait for the officer to approve your request.",
    ],
  },
  {
    title: "How Officers Manage Applications",
    steps: [
      "Log in using an officer account.",
      "Open the officer dashboard from the student dashboard.",
      "Go to the Applications tab.",
      "Approve or reject incoming membership requests.",
      "Manage approved members in the Members tab.",
    ],
  },
];

export default function ResourcesPage() {
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

        <LandingNavbar activePage="resources" />

        <div className="relative z-10 w-full">
          <FadeIn>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 text-center text-white">
              <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
                UniLink Resources
              </p>

              <h1 className="mt-6 sm:mt-7 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                Resources & Tools
              </h1>

              <p className="mt-5 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
                Explore the main features, pages, and tools available in
                UniLink. These resources help students, officers, and admins
                understand how to use the platform.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
          <div className="text-center">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Platform Features
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#244543]">
              What You Can Access in UniLink
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
              UniLink brings organization discovery, events, applications,
              announcements, and management tools into one organized platform.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {resources.map((resource, index) => (
              <StaggerItem
                key={resource.title}
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
                <ResourceCard
                  icon={resource.icon}
                  title={resource.title}
                  description={resource.description}
                  link={resource.link}
                  button={resource.button}
                />
              </StaggerItem>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="bg-[#e9fff5] px-5 sm:px-6 py-14 sm:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-cyan-100 shadow-xl p-6 sm:p-8 md:p-12 unilink-breathe-card">
              <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                Development Resources
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#244543]">
                Resources & Tools Used in UniLink
              </h2>

              <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                UniLink uses modern web development tools to provide a fast,
                organized, and user-friendly experience for students,
                organization officers, and authorized university personnel.
              </p>

              <div className="mt-10 grid md:grid-cols-2 gap-8">
                <StaggerItem delay="delay-0">
                  <TechGroup
                    title="Core Stack"
                    items={[
                      {
                        name: "Next.js",
                        description:
                          "framework used for building the full-stack web application.",
                      },
                      {
                        name: "React",
                        description:
                          "JavaScript library used for creating interactive user interfaces.",
                      },
                      {
                        name: "TypeScript",
                        description:
                          "adds type safety and helps reduce coding errors.",
                      },
                      {
                        name: "Tailwind CSS",
                        description:
                          "utility-first CSS framework used for fast and consistent styling.",
                      },
                    ]}
                  />
                </StaggerItem>

                <StaggerItem delay="delay-100">
                  <TechGroup
                    title="Backend & Services"
                    items={[
                      {
                        name: "Supabase",
                        description:
                          "used for authentication, database, and storage services.",
                      },
                      {
                        name: "PostgreSQL",
                        description:
                          "database system used by Supabase to store platform records.",
                      },
                      {
                        name: "Supabase Storage",
                        description:
                          "used for organization logos, banners, event images, and profile photos.",
                      },
                      {
                        name: "Vercel",
                        description:
                          "deployment platform used to host the web application.",
                      },
                    ]}
                  />
                </StaggerItem>
              </div>

              <div className="mt-10">
                <TechGroup
                  title="Platform Features Supported"
                  items={[
                    {
                      name: "Authentication",
                      description:
                        "allows students, officers, and authorized users to access their accounts securely.",
                    },
                    {
                      name: "Organization Management",
                      description:
                        "supports club profiles, membership applications, events, announcements, and members.",
                    },
                    {
                      name: "Responsive Interface",
                      description:
                        "keeps the website usable on different screen sizes.",
                    },
                  ]}
                />
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
                Quick Guides
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#244543]">
                How to Use UniLink
              </h2>

              <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
                Follow these simple steps to get started with the most common
                actions in the system.
              </p>
            </div>

            <div className="mt-10 sm:mt-12 grid lg:grid-cols-2 gap-5 sm:gap-7">
              {guides.map((guide, index) => (
                <StaggerItem
                  key={guide.title}
                  delay={index === 0 ? "delay-0" : "delay-100"}
                >
                  <GuideCard title={guide.title} steps={guide.steps} />
                </StaggerItem>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-center">
            <div>
              <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                Need Help?
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl font-black leading-tight text-[#244543]">
                Contact us for concerns about accounts, organizations, or
                membership.
              </h2>

              <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                If you need assistance using UniLink, you can contact the team
                through the Contact page. This is useful for account concerns,
                organization profile concerns, or application-related questions.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center justify-center bg-gradient-to-r from-cyan-600 to-lime-500 text-white px-8 py-3 rounded-full font-extrabold hover:brightness-110 transition"
              >
                Contact Support
              </Link>
            </div>

            <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-cyan-100 shadow-xl p-5 sm:p-8">
              <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 text-white">
                <p className="text-sm font-bold text-white/80">
                  Resource Summary
                </p>

                <h3 className="mt-3 text-2xl sm:text-3xl font-black">
                  One platform for campus organization access.
                </h3>

                <div className="mt-8 space-y-4">
                  <SummaryRow label="Students" value="Discover & Apply" />
                  <SummaryRow label="Officers" value="Manage & Update" />
                  <SummaryRow
                    label="University / OSAS"
                    value="Oversee & Maintain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <LandingFooter />
    </main>
  );
}

function ResourceCard({
  icon,
  title,
  description,
  link,
  button,
}: {
  icon: string;
  title: string;
  description: string;
  link: string;
  button: string;
}) {
  return (
    <div className="h-full bg-white rounded-[24px] sm:rounded-[28px] border border-cyan-100 shadow-sm p-6 sm:p-7 hover:shadow-xl hover:-translate-y-1 transition">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-2xl">
        {icon}
      </div>

      <h2 className="mt-5 text-xl font-black text-[#244543]">{title}</h2>

      <p className="mt-3 text-gray-600 leading-relaxed text-sm">
        {description}
      </p>

      <Link
        href={link}
        className="mt-6 inline-flex text-sm font-extrabold text-cyan-600 hover:text-lime-600 transition"
      >
        {button} →
      </Link>
    </div>
  );
}

function GuideCard({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="h-full bg-[#f8fffb] border border-cyan-100 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-sm">
      <h3 className="text-2xl font-black text-[#244543]">{title}</h3>

      <div className="mt-7 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-start gap-4">
            <div className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white flex items-center justify-center font-black text-sm shrink-0">
              {index + 1}
            </div>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechGroup({
  title,
  items,
}: {
  title: string;
  items: { name: string; description: string }[];
}) {
  return (
    <div>
      <h3 className="text-2xl font-black text-[#244543]">{title}</h3>

      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-start gap-3 text-sm sm:text-base text-gray-600"
          >
            <span className="mt-2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 shrink-0" />

            <span className="leading-relaxed">
              <span className="font-extrabold text-[#244543]">
                {item.name}
              </span>{" "}
              – {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 border border-white/20 rounded-2xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <span className="font-bold text-sm sm:text-base">{label}</span>

      <span className="bg-white text-cyan-700 px-4 py-1.5 rounded-full text-xs font-extrabold w-fit">
        {value}
      </span>
    </div>
  );
}