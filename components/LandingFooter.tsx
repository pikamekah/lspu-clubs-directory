import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-[#e9fff5] border-t border-cyan-100 text-[#244543] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_1fr] gap-9 lg:gap-10 items-start">
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white font-black shadow-md shrink-0">
                U
              </div>

              <div className="min-w-0">
                <h2 className="text-2xl font-black leading-none">
                  Uni<span className="text-lime-500">Link</span>
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  LSPU Clubs Directory
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm text-gray-600 leading-relaxed">
              LSPU Clubs and Organizations Directory for students, officers,
              and administrators.
            </p>

            <p className="mt-4 text-xs text-gray-500">
              © 2026 UniLink. All rights reserved.
            </p>
          </div>

          <div className="min-w-0">
            <h3 className="font-black mb-4">Quick Links</h3>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-3 text-sm text-gray-600">
              <FooterLink href="/" label="Home" />
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/resources" label="Resources" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/privacy" label="Privacy Policy" />
            </div>
          </div>

          <div className="min-w-0 sm:col-span-2 lg:col-span-1 lg:text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-lime-500" />
              Connected & Updated
            </div>

            <p className="mt-4 text-sm text-gray-500 max-w-md lg:ml-auto leading-relaxed">
              Stay connected with campus organizations, upcoming activities, and
              student organization updates through UniLink.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-100 bg-[#ddfaee]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 text-center text-xs text-gray-500">
          Built for LSPU students and organization communities.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block w-fit hover:text-cyan-700 transition break-words"
    >
      {label}
    </Link>
  );
}