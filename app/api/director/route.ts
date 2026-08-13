import { runDirectorAI } from "@/lib/director-ai";
import { getEvolutionSnapshot } from "@/lib/evolution-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { discovery?: string; styleId?: string };
    const evolution = await getEvolutionSnapshot();
    return Response.json({ ok: true, director: runDirectorAI(body.discovery ?? "", body.styleId, evolution.rules.map((rule) => rule.rule)) });
  } catch {
    return Response.json({ ok: false, error: "Could not run Director AI." }, { status: 400 });
  }
}
