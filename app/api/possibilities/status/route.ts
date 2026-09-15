import { NextResponse } from "next/server";

import { configuredPossibilityProviders, possibilityProviderStatus } from "@/src/possibilities/aiProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    status: "ready",
    providers: possibilityProviderStatus(),
    configuredOrder: configuredPossibilityProviders(),
    workflow: {
      ai1: "validated-evidence-preparation",
      ai2: "conditional-future-reasoning",
      visual: "optional-visual-description",
      failover: "configured-provider-loop",
    },
    checkedAt: new Date().toISOString(),
  });
}
