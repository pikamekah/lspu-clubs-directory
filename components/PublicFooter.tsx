"use client";

import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="bg-[#e9fff5] border-t border-cyan-100 text-[#244543] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.85fr_1fr] gap-9 lg:gap-10">
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
              UniLink is a digital directory for LSPU students to discover
              campus organizations, view events, submit applications, and stay
              updated with organization announcements.
            </p>

            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              Built for students, organization officers, and authorized campus
              personnel.
            </p>
          </div>

          <FooterGroup title="Explore">
            <FooterLink href="/" label="Home" />
            <FooterLink href="/organizations" label="Organizations" />
            <FooterLink href="/events" label="Events" />
          </FooterGroup>

          <FooterGroup title="Support">
            <FooterLink href="/about" label="About Us" />
            <FooterLink href="/resources" label="Resources" />
            <FooterLink href="/contact" label="Contact" />
            <FooterLink href="/privacy" label="Privacy Policy" />
          </FooterGroup>

          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h3 className="font-black mb-4">Connected & Updated</h3>

            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Stay connected with campus organizations, upcoming activities, and
              important student organization updates through UniLink.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white border border-cyan-100 px-4 py-2 text-xs font-bold text-gray-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              Campus Connected
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-100 bg-[#ddfaee]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 text-center text-xs text-gray-500">
          <p>© 2026 UniLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h3 className="font-black mb-4">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-3 text-sm text-gray-600">
        {children}
      </div>
    </div>
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