import Image from "next/image";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";

export default function PrivacyPage() {
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

        <LandingNavbar activePage="privacy" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 text-center text-white">
            <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
              UniLink Policy
            </p>

            <h1 className="mt-6 sm:mt-7 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              Privacy Policy
            </h1>

            <p className="mt-5 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
              Your privacy matters to us. This page explains how UniLink handles
              information used in the LSPU Clubs and Organizations Directory.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-cyan-100 shadow-xl p-6 sm:p-8 md:p-12">
          <PolicySection number="01" title="Information We Collect">
            <p>
              UniLink may collect information that users provide during account
              registration, profile updates, organization applications, and
              contact form submissions.
            </p>

            <p>
              This may include names, email addresses, student numbers, program
              details, year level, course and section, membership information,
              and messages submitted through the platform.
            </p>
          </PolicySection>

          <PolicySection number="02" title="How We Use Your Information">
            <ul className="space-y-3">
              <PolicyListItem text="To create and manage student accounts." />
              <PolicyListItem text="To process club and organization membership applications." />
              <PolicyListItem text="To allow officers to manage organization members, events, and announcements." />
              <PolicyListItem text="To help administrators maintain accurate system records." />
              <PolicyListItem text="To improve the reliability, organization, and usability of UniLink." />
            </ul>
          </PolicySection>

          <PolicySection number="03" title="Account and Authentication">
            <p>
              UniLink uses account authentication to protect user access. Login
              information is handled through the authentication system connected
              to the platform.
            </p>

            <p>
              Users are responsible for keeping their passwords private and for
              logging out when using shared or public devices.
            </p>
          </PolicySection>

          <PolicySection number="04" title="Data Security">
            <p>
              We aim to protect user information through secure authentication,
              database access controls, and responsible data handling practices.
            </p>

            <p>
              While security measures are applied, users should still avoid
              sharing sensitive account information with other people.
            </p>
          </PolicySection>

          <PolicySection number="05" title="User Rights and Updates">
            <p>
              Users may request updates or corrections to their personal
              information through the appropriate account page or by contacting
              the system administrator.
            </p>

            <p>
              For privacy-related concerns, please visit our{" "}
              <Link
                href="/contact"
                className="font-bold text-cyan-600 hover:text-lime-600 transition"
              >
                Contact
              </Link>{" "}
              page.
            </p>
          </PolicySection>

          <PolicySection number="06" title="Changes to This Policy">
            <p>
              UniLink may update this Privacy Policy when needed to reflect
              changes in the platform, system process, or project requirements.
              Users are encouraged to review this page periodically.
            </p>
          </PolicySection>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-6 pb-14 sm:pb-20">
        <div className="bg-gradient-to-r from-cyan-600 to-lime-500 rounded-[28px] sm:rounded-[36px] p-7 sm:p-10 md:p-14 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8 shadow-xl">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black">
              Have questions about your data?
            </h2>

            <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
              Contact us for privacy-related concerns or account information
              requests.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-white text-cyan-700 px-8 py-3 rounded-full font-extrabold hover:bg-gray-100 transition shrink-0"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}

function PolicySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-cyan-600 to-lime-500 text-white flex items-center justify-center font-black shrink-0">
          {number}
        </div>

        <div className="min-w-0">
          <h2 className="text-2xl font-black text-[#244543] leading-tight">
            {title}
          </h2>

          <div className="mt-4 space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function PolicyListItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 text-sm sm:text-base text-gray-600">
      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 shrink-0" />
      <span>{text}</span>
    </li>
  );
}