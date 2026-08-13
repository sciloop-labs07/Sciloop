import { createOfficialLaunchProject, createReelFactoryPackage, createStudioProject } from "@/lib/content-studio";
import { simulateViralPerformance } from "@/lib/viral-simulation";
import { buildKnowledgeGraph } from "@/lib/knowledge-graph";
import { runDirectorAI } from "@/lib/director-ai";
import { getEvolutionSnapshot } from "@/lib/evolution-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { discovery?: string; styleId?: string; officialLaunch?: boolean };
    const project = body.officialLaunch ? createOfficialLaunchProject() : createStudioProject(body.discovery ?? "", body.styleId);
    const simulation = simulateViralPerformance(project);
    const knowledgeGraph = buildKnowledgeGraph(body.officialLaunch ? project.title : body.discovery ?? project.title);
    const evolution = await getEvolutionSnapshot();
    const director = runDirectorAI(body.officialLaunch ? project.title : body.discovery ?? project.title, body.styleId, evolution.rules.map((rule) => rule.rule));
    const factory = createReelFactoryPackage(project, body.officialLaunch ? project.title : body.discovery ?? project.title);
    factory.files.push({ path: "/reel/viral_report.md", label: "Viral simulation report", content: simulation.report });
    factory.files.push({ path: "/reel/knowledge_graph.json", label: "Knowledge graph", content: knowledgeGraph.outputs.graphJson });
    factory.files.push({ path: "/reel/learning_paths.md", label: "Learning paths", content: knowledgeGraph.outputs.learningPaths });
    factory.files.push({ path: "/reel/visualization_prompts.md", label: "Visualization prompts", content: knowledgeGraph.outputs.visualizationPrompts });
    for (const [name, content] of Object.entries(director.outputs)) factory.files.push({ path: `/reel/${name}`, label: name.replaceAll("_", " "), content });
    return Response.json({ ok: true, project, factory, simulation, knowledgeGraph, director, mode: "local-first" });
  } catch {
    return Response.json({ ok: false, error: "Could not generate a studio project." }, { status: 400 });
  }
}
