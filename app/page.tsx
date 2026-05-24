import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import { FadeIn, StaggerItem } from "@/components/dashboard/Animated";
import ScrollReveal from "@/components/dashboard/ScrollReveal";

export default function PublicLandingPage() {
  return (
    <main className="min-h-screen bg-[#f6fffb] text-[#202020] overflow-x-hidden">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/lspu-school-bg.jpg"
          alt="LSPU campus"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-cyan-900/35" />

        <LandingNavbar activePage="home" />

        <FadeIn>
          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-14 items-center">
            <div className="text-white">
              <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
                Campus Organization Platform
              </p>

              <h2 className="mt-6 sm:mt-7 text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight">
                Discover.
                <br />
                Join.
                <br />
                Connect.
              </h2>

              <p className="mt-6 sm:mt-7 max-w-xl text-white/85 text-base sm:text-lg leading-relaxed">
                UniLink helps LSPU students explore clubs and organizations,
                view events, submit membership applications, and stay updated
                with campus announcements.
              </p>

              <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-lime-400 text-white px-8 py-4 rounded-full font-extrabold shadow-lg hover:brightness-110 transition"
                >
                  Get Started
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center bg-white/15 border border-white/40 text-white px-8 py-4 rounded-full font-extrabold backdrop-blur-sm hover:bg-white hover:text-cyan-700 transition"
                >
                  Log in to Browse Clubs
                </Link>
              </div>

              <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-xl">
                <StaggerItem delay="delay-0">
                  <StatCard value="Clubs" label="Explore organizations" />
                </StaggerItem>

                <StaggerItem delay="delay-100">
                  <StatCard value="Events" label="Find activities" />
                </StaggerItem>

                <StaggerItem delay="delay-200">
                  <StatCard value="Updates" label="Stay informed" />
                </StaggerItem>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400/40 to-lime-300/40 rounded-[42px] blur-2xl" />

              <div className="relative bg-white/95 rounded-[38px] p-7 shadow-2xl animate-[heroFloat_5s_ease-in-out_infinite]">
                <div className="relative h-[280px] rounded-[30px] overflow-hidden">
                  <Image
                    src="/lspu-school-bg.jpg"
                    alt="Students and campus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-cover"
                  />
                </div>

                <div className="mt-7">
                  <p className="text-sm font-extrabold text-cyan-600 uppercase tracking-wide">
                    Why use UniLink?
                  </p>

                  <h3 className="mt-2 text-3xl font-black leading-tight">
                    One place for campus clubs, events, and announcements.
                  </h3>

                  <div className="mt-6 space-y-4">
                    <MiniFeature
                      title="Easy club discovery"
                      description="Students can browse organizations and learn what each club offers."
                    />

                    <MiniFeature
                      title="Faster applications"
                      description="Membership requests can be submitted and reviewed online."
                    />

                    <MiniFeature
                      title="Organized updates"
                      description="Events and announcements are easier to manage and access."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <ScrollReveal once={false}>
        <section className="px-5 sm:px-6 py-14 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              What You Can Do
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-[#244543]">
              Built for the LSPU Community
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
              UniLink supports students, organization officers, and main admins
              with tools that make campus organization management easier.
            </p>

            <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 text-left">
              <StaggerItem delay="delay-0">
                <FeatureCard
                  icon="🔎"
                  title="Find Organizations"
                  description="Browse academic and non-academic organizations in one directory."
                />
              </StaggerItem>

              <StaggerItem delay="delay-100">
                <FeatureCard
                  icon="📝"
                  title="Apply for Membership"
                  description="Students can send applications and track their membership status."
                />
              </StaggerItem>

              <StaggerItem delay="delay-200">
                <FeatureCard
                  icon="📢"
                  title="View Announcements"
                  description="Stay updated with official organization and campus-related updates."
                />
              </StaggerItem>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="px-5 sm:px-6 py-14 sm:py-20 bg-[#f6fffb]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <p className="inline-flex bg-lime-50 text-lime-700 px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                For Officers
              </p>

              <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#244543]">
                Manage your organization with less manual work.
              </h2>

              <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
                Organization officers can review applications, manage member
                roles, create events, update club information, and receive
                notifications in one dashboard.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <StaggerItem delay="delay-0">
                  <InfoPill text="Application review" />
                </StaggerItem>

                <StaggerItem delay="delay-100">
                  <InfoPill text="Event management" />
                </StaggerItem>

                <StaggerItem delay="delay-200">
                  <InfoPill text="Member roles" />
                </StaggerItem>

                <StaggerItem delay="delay-300">
                  <InfoPill text="Club profile updates" />
                </StaggerItem>
              </div>
            </div>

            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-7 shadow-xl border border-cyan-100">
              <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 text-white">
                <p className="text-sm font-bold text-white/80">
                  Officer Dashboard Preview
                </p>

                <h3 className="mt-3 text-2xl sm:text-3xl font-black">
                  Events, Members, Notifications
                </h3>

                <div className="mt-8 space-y-4">
                  <PreviewRow label="Pending Applications" value="Review" />
                  <PreviewRow label="Upcoming Events" value="Manage" />
                  <PreviewRow label="Club Profile" value="Update" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal once={false}>
        <section className="px-5 sm:px-6 py-14 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[28px] sm:rounded-[40px] p-7 sm:p-10 md:p-14 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-xl">
            <div>
              <p className="text-white/80 text-sm font-extrabold uppercase tracking-wide">
                Start using UniLink
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-black">
                Ready to connect with campus organizations?
              </h2>

              <p className="mt-3 text-white/90">
                Create an account or log in to access your UniLink home page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/login"
                className="inline-flex items-center justify-center min-w-[130px] bg-white text-cyan-700 px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-gray-100 hover:-translate-y-0.5 transition"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center justify-center min-w-[130px] bg-[#101415] text-white px-8 py-3.5 rounded-full font-extrabold shadow-lg hover:bg-white hover:text-cyan-700 hover:-translate-y-0.5 transition"
              >
                Sign up
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <LandingFooter />
    </main>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/15 border border-white/25 rounded-2xl p-4 backdrop-blur-sm">
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs text-white/75 mt-1">{label}</p>
    </div>
  );
}

function MiniFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 shrink-0 flex items-center justify-center text-white font-black">
        ✓
      </div>

      <div>
        <h4 className="font-extrabold">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
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
    <div className="h-full bg-[#f8fffb] border border-cyan-100 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-2xl">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-black text-[#244543]">{title}</h3>

      <p className="mt-3 text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function InfoPill({ text }: { text: string }) {
  return (
    <div className="bg-white border border-cyan-100 rounded-2xl px-5 py-4 font-bold text-gray-700 shadow-sm">
      {text}
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 border border-white/20 rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
      <span className="font-bold text-sm sm:text-base">{label}</span>

      <span className="bg-white text-cyan-700 px-4 py-1.5 rounded-full text-xs font-extrabold shrink-0">
        {value}
      </span>
    </div>
  );
}