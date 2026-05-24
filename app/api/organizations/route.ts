import { NextRequest, NextResponse } from "next/server";
import { upsertOrganization } from "@/app/lib/orgService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("RAW API BODY:", body);

    const org = await upsertOrganization(body);

    console.log("AFTER SERVICE:", org);

    return NextResponse.json(org);
  } catch (err: unknown) {
    console.error("FULL ERROR:", err);

    const message =
      err instanceof Error ? err.message : "Failed to save organization.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}