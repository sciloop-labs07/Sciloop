import { buildKnowledgeGraph } from "@/lib/knowledge-graph";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { discovery?: string };
    return Response.json({ ok: true, graph: buildKnowledgeGraph(body.discovery ?? "") });
  } catch {
    return Response.json({ ok: false, error: "Could not build the knowledge graph." }, { status: 400 });
  }
}
