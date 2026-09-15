import { getEvolutionSnapshot, recordEvolutionExperiment } from "@/lib/evolution-store";

export async function GET() { return Response.json({ ok: true, evolution: await getEvolutionSnapshot() }); }
export async function POST(request: Request) { try { const body = await request.json(); return Response.json({ ok: true, evolution: await recordEvolutionExperiment(body) }); } catch { return Response.json({ ok: false, error: "Could not record the evolution experiment." }, { status: 400 }); } }
