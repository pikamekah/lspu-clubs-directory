"use client";

import Image from "next/image";
import { useState } from "react";
import LandingNavbar from "@/components/LandingNavbar";
import LandingFooter from "@/components/LandingFooter";
import { supabase } from "@/app/lib/supabaseClient";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    concern: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.concern.trim() ||
      !form.message.trim()
    ) {
      alert("Please complete all fields.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        concern: form.concern.trim(),
        message: form.message.trim(),
        status: "unread",
      },
    ]);

    setSending(false);

    if (error) {
      console.error("Contact message error:", error);
      alert("Message failed to send. Please try again.");
      return;
    }

    alert("Message sent! Thank you for contacting UniLink.");

    setForm({
      name: "",
      email: "",
      concern: "",
      message: "",
    });
  }

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

        <LandingNavbar activePage="contact" />

        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-16 text-center text-white">
            <p className="inline-flex bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
              Contact UniLink
            </p>

            <h1 className="mt-6 sm:mt-7 text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              We’d Love to Hear From You
            </h1>

            <p className="mt-5 sm:mt-6 max-w-3xl mx-auto text-sm sm:text-base text-white/90 leading-relaxed">
              Have questions, suggestions, or concerns about UniLink? Send us a
              message and we’ll help you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div>
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Get in Touch
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl font-black leading-tight text-[#244543]">
              Contact us for account, organization, or membership concerns.
            </h2>

            <p className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed">
              UniLink is designed to help students, organization officers, and
              authorized campus personnel manage club-related activities more
              conveniently. Use this page for questions or concerns about the
              platform.
            </p>

            <div className="mt-8 space-y-5">
              <ContactInfoCard
                title="Campus"
                value="Laguna State Polytechnic University"
                icon="🏫"
              />

              <ContactInfoCard
                title="Support Concerns"
                value="Account access, student profiles, organizations, membership applications, events, and announcements."
                icon="💬"
              />

              <ContactInfoCard
                title="Office Hours"
                value="Monday to Friday, 8:00 AM - 5:00 PM"
                icon="🕘"
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-8 md:p-10 shadow-xl border border-cyan-100"
          >
            <div className="text-center mb-8">
              <p className="inline-flex bg-lime-50 text-lime-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
                Send a Message
              </p>

              <h2 className="mt-4 text-3xl font-black text-[#244543]">
                Contact Form
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Fill out the form below and we’ll review your message.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="font-bold text-sm block mb-2 text-[#244543]">
                  Name
                </span>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                  className="w-full h-12 rounded-2xl bg-cyan-50/50 border border-cyan-100 px-5 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </label>

              <label className="block">
                <span className="font-bold text-sm block mb-2 text-[#244543]">
                  Email
                </span>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="your.email@example.com"
                  className="w-full h-12 rounded-2xl bg-cyan-50/50 border border-cyan-100 px-5 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </label>

              <label className="block">
                <span className="font-bold text-sm block mb-2 text-[#244543]">
                  Concern
                </span>

                <select
                  value={form.concern}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      concern: e.target.value,
                    })
                  }
                  className="w-full h-12 rounded-2xl bg-cyan-50/50 border border-cyan-100 px-5 text-sm outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                >
                  <option value="">Select concern type</option>
                  <option value="Account Concern">Account Concern</option>
                  <option value="Organization Concern">
                    Organization Concern
                  </option>
                  <option value="Membership Application">
                    Membership Application
                  </option>
                  <option value="Events or Announcements">
                    Events or Announcements
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </label>

              <label className="block">
                <span className="font-bold text-sm block mb-2 text-[#244543]">
                  Message
                </span>

                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Write your message here"
                  className="w-full min-h-[150px] rounded-2xl bg-cyan-50/50 border border-cyan-100 p-5 text-sm outline-none focus:ring-2 focus:ring-cyan-200 resize-none"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white py-3 rounded-full font-extrabold hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white px-5 sm:px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
              Common Concerns
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl font-black text-[#244543]">
              How We Can Help
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
              These are the most common concerns users may contact UniLink
              about.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <HelpCard
              icon="🔐"
              title="Account Access"
              description="For login, signup, student ID, password reset, or profile-related concerns."
            />

            <HelpCard
              icon="🏫"
              title="Organization Details"
              description="For club information, organization profiles, and officer-managed updates."
            />

            <HelpCard
              icon="📝"
              title="Membership Requests"
              description="For questions about applying, pending applications, or membership status."
            />
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}

function ContactInfoCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 shadow-sm border border-cyan-100 flex gap-4 sm:gap-5 items-start hover:shadow-lg hover:-translate-y-1 transition">
      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-xl sm:text-2xl shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-black text-[#244543]">{title}</h3>

        <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function HelpCard({
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