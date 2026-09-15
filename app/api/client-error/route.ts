import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const message = typeof payload?.message === "string" ? payload.message.slice(0, 500) : "Unknown client error";
    const error = new Error(message);

    Sentry.withScope((scope) => {
      scope.setTag("source", "sciloop-live-html");
      scope.setExtra("page", typeof payload?.page === "string" ? payload.page.slice(0, 500) : undefined);
      scope.setExtra("sourceFile", typeof payload?.sourceFile === "string" ? payload.sourceFile.slice(0, 500) : undefined);
      scope.setExtra("line", typeof payload?.line === "number" ? payload.line : undefined);
      Sentry.captureException(error);
    });

    await Sentry.flush(1500);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
