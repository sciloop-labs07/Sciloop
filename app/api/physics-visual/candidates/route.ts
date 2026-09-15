import { NextResponse } from "next/server";
import { approveCandidate, createDraftCandidate, getCandidate, listCandidates, markCandidateForReview, rejectCandidate, validateCandidate } from "@/src/physics-visual-language/candidate-pipeline";
import type { DraftCandidateInput } from "@/src/physics-visual-language/candidate-pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 64 * 1024;

function available() {
  return process.env.SCILOOP_WORKBENCH_ENABLED === "true" && process.env.NODE_ENV !== "production";
}

function authorized(request: Request) {
  const expected = process.env.SCILOOP_WORKBENCH_TOKEN?.trim();
  return Boolean(expected && request.headers.get("x-sciloop-workbench-token") === expected);
}

function unavailable() { return NextResponse.json({ ok: false, error: "Candidate workbench is unavailable." }, { status: 404 }); }
function unauthorized() { return NextResponse.json({ ok: false, error: "Workbench authentication required." }, { status: 401 }); }

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_REQUEST_BYTES) throw new Error("Request is too large.");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) throw new Error("Request is too large.");
  const body = JSON.parse(text) as unknown;
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Request body must be an object.");
  return body as Record<string, unknown>;
}

export async function GET(request: Request) {
  if (!available()) return unavailable();
  if (!authorized(request)) return unauthorized();
  return NextResponse.json({ ok: true, candidates: listCandidates() });
}

export async function POST(request: Request) {
  if (!available()) return unavailable();
  if (!authorized(request)) return unauthorized();
  try {
    const body = await readBody(request);
    if ("status" in body || "publicEligible" in body) return NextResponse.json({ ok: false, errors: ["Status and public eligibility are server-controlled."] }, { status: 400 });
    const candidate = createDraftCandidate(body as unknown as DraftCandidateInput);
    const validation = validateCandidate(candidate);
    if (!validation.ok) return NextResponse.json({ ok: false, errors: validation.errors, warnings: validation.warnings }, { status: 422 });
    return NextResponse.json({ ok: true, candidate: getCandidate(candidate.id), warnings: validation.warnings }, { status: 201 });
  } catch { return NextResponse.json({ ok: false, error: "Candidate could not be created." }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  if (!available()) return unavailable();
  if (!authorized(request)) return unauthorized();
  try {
    const body = await readBody(request);
    const id = typeof body.id === "string" ? body.id : "";
    const action = typeof body.action === "string" ? body.action : "";
    const reviewer = request.headers.get("x-sciloop-reviewer") || "";
    const notes = Array.isArray(body.reviewerNotes) ? body.reviewerNotes.filter((note): note is string => typeof note === "string") : [];
    if (!id || !reviewer) return NextResponse.json({ ok: false, errors: ["Candidate id and reviewer header are required."] }, { status: 400 });
    const candidate = action === "validate" ? (validateCandidate(id), getCandidate(id)) : action === "review" ? markCandidateForReview(id, reviewer, notes) : action === "approve" ? approveCandidate(id, reviewer, notes) : action === "reject" ? rejectCandidate(id, reviewer, notes) : null;
    if (!candidate) return NextResponse.json({ ok: false, errors: ["Unsupported candidate action."] }, { status: 400 });
    return NextResponse.json({ ok: true, candidate });
  } catch { return NextResponse.json({ ok: false, error: "Candidate transition was rejected." }, { status: 422 }); }
}
