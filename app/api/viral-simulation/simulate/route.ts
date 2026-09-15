import { createReelFactoryPackage, createStudioProject } from "@/lib/content-studio";
import { simulateViralPerformance } from "@/lib/viral-simulation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { discovery?: string; styleId?: string };
    const project = createStudioProject(body.discovery ?? "", body.styleId);
    const simulation = simulateViralPerformance(project);
    return Response.json({ ok: true, simulation, factory: createReelFactoryPackage(project, body.discovery ?? project.title) });
  } catch {
    return Response.json({ ok: false, error: "Could not simulate the reel." }, { status: 400 });
  }
}
