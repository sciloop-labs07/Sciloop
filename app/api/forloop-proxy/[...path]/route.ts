import { NextResponse } from "next/server";

// ForLoop is retained in this repository only as local/admin tooling during
// the migration. A public route must never forward an admin access code or
// expose operational controls to the browser.
function retiredResponse() {
  return NextResponse.json(
    {
      ok: false,
      error: "The ForLoop admin bridge is not part of the public SciLoop product.",
      migration: "Use SciLoop's public API routes instead.",
    },
    { status: 410 },
  );
}

export function GET() {
  return retiredResponse();
}

export function POST() {
  return retiredResponse();
}
