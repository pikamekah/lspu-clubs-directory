"use client";

import { FadeIn } from "@/components/dashboard/Animated";

type Props = {
  orgName?: string;
  applicationStatus: string | null;
  onJoinClick: () => void;
};

function getStatusStyle(status: string | null) {
  const key = String(status || "").toLowerCase();

  if (key === "approved") {
    return "bg-emerald-50 border-emerald-200 text-emerald-700";
  }

  if (key === "rejected") {
    return "bg-red-50 border-red-200 text-red-700";
  }

  return "bg-amber-50 border-amber-200 text-amber-700";
}

function getStatusMessage(status: string | null) {
  const key = String(status || "").toLowerCase();

  if (key === "approved") {
    return "Your application has been approved. You are now a member of this organization.";
  }

  if (key === "rejected") {
    return "Your application was rejected. Please contact the organization if you need more information.";
  }

  return "Your application is waiting for officer approval.";
}

export default function OrganizationJoinCard({
  orgName,
  applicationStatus,
  onJoinClick,
}: Props) {
  return (
    <section className="bg-white rounded-[36px] p-8 shadow-xl border border-cyan-100 transition duration-300 hover:shadow-2xl hover:-translate-y-1">
      <p className="inline-flex bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide">
        Membership
      </p>

      <h2 className="mt-5 text-2xl md:text-3xl font-black text-[#244543]">
        Ready to Join?
      </h2>

      {applicationStatus ? (
        <FadeIn>
          <div
            className={`mt-6 rounded-2xl border px-5 py-4 text-sm leading-relaxed transition duration-300 hover:shadow-md ${getStatusStyle(
              applicationStatus
            )}`}
          >
            <p className="font-extrabold">
              Status:{" "}
              <span className="capitalize">
                {applicationStatus}
              </span>
            </p>

            <p className="mt-2">
              {getStatusMessage(applicationStatus)}
            </p>
          </div>
        </FadeIn>
      ) : (
        <FadeIn>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Become a member today and start your journey with{" "}
            <strong className="text-[#244543]">
              {orgName || "this organization"}
            </strong>
            .
          </p>

          <button
            type="button"
            onClick={onJoinClick}
            className="mt-7 w-full bg-gradient-to-r from-cyan-600 to-lime-500 text-white py-3.5 rounded-full font-extrabold hover:brightness-110 hover:-translate-y-0.5 transition shadow-sm hover:shadow-md"
          >
            Sign Up Now
          </button>
        </FadeIn>
      )}
    </section>
  );
}