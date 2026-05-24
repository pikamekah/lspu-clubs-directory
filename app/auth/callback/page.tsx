"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

function profileNeedsCompletion(profile: {
  student_id?: string | null;
  program?: string | null;
  year_level?: string | null;
  course_section?: string | null;
}) {
  return (
    !profile.student_id ||
    !profile.program ||
    !profile.year_level ||
    !profile.course_section
  );
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    async function handleCallback() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Google callback error:", error);
          setMessage("Google sign-in failed. Redirecting to login...");
          setTimeout(() => router.replace("/login"), 1200);
          return;
        }
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Google user fetch error:", userError);
        setMessage("Could not verify your account. Redirecting to login...");
        setTimeout(() => router.replace("/login"), 1200);
        return;
      }

      const { data: existingProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Google profile fetch error:", profileError);
        setMessage("Could not load your profile. Redirecting to login...");
        setTimeout(() => router.replace("/login"), 1200);
        return;
      }

      if (!existingProfile) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        const nameParts = fullName.trim().split(" ");
        const firstName =
          user.user_metadata?.first_name ||
          user.user_metadata?.given_name ||
          nameParts[0] ||
          "";
        const lastName =
          user.user_metadata?.last_name ||
          user.user_metadata?.family_name ||
          nameParts.slice(1).join(" ") ||
          "";

        const { error: insertError } = await supabase.from("users").insert([
          {
            auth_id: user.id,
            email: user.email || "",
            role: "student",
            first_name: firstName,
            last_name: lastName,
            full_name: fullName || `${firstName} ${lastName}`.trim(),
            profile_url:
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              null,
          },
        ]);

        if (insertError) {
          console.error("Google profile insert error:", insertError);
          setMessage("Could not create your profile. Redirecting to login...");
          setTimeout(() => router.replace("/login"), 1200);
          return;
        }

        router.replace("/complete-profile");
        return;
      }

      if (existingProfile.role === "main_admin") {
        router.replace("/dashboard/admin");
        return;
      }

      if (profileNeedsCompletion(existingProfile)) {
        router.replace("/complete-profile");
        return;
      }

      router.replace("/home");
    }

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f6fffb] flex items-center justify-center px-6">
      <div className="bg-white border border-cyan-100 rounded-[32px] shadow-xl p-10 text-center max-w-md">
        <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-gradient-to-r from-cyan-600 to-lime-500 flex items-center justify-center text-white font-black">
          U
        </div>

        <h1 className="text-2xl font-black text-[#244543]">UniLink</h1>

        <p className="mt-3 text-sm text-gray-600">{message}</p>
      </div>
    </main>
  );
}