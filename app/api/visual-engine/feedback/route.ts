import { NextResponse } from "next/server";

const limitation = {
  available: false,
  reason: "No database configured yet",
  fallback: "localStorage",
  message: "Visual Engine feedback currently remains in the user's browser. This route is reserved for a future validated database adapter.",
};

export function GET() {
  return NextResponse.json(limitation, { status: 503 });
}

export function POST() {
  return NextResponse.json(limitation, { status: 503 });
}

export function DELETE() {
  return NextResponse.json(limitation, { status: 503 });
}
