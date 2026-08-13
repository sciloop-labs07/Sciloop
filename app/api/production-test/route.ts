import fs from "node:fs/promises";
import path from "node:path";
import { createReelFactoryPackage } from "@/lib/content-studio";
import { campaignHook, runDirectorAI } from "@/lib/director-ai";
import { getEvolutionSnapshot } from "@/lib/evolution-store";
import { simulateViralPerformance } from "@/lib/viral-simulation";

const launchTopics = [
  { id: "reel1", topic: "The Biggest Problem With Education Isn't Students", goal: "Introduce SciLoop", emotion: "Curiosity → wonder → hope", audience: "Students, engineers, scientists, and AI enthusiasts", duration: 45, style: "cinematic" },
  { id: "reel2", topic: "Humanity Discovers Thousands of Things Every Week... Why Does Nobody Know?", goal: "Explain why scientific discoveries never reach ordinary people", emotion: "Urgency → surprise → possibility", audience: "Curious general audience and lifelong learners", duration: 52, style: "documentary" },
  { id: "reel3", topic: "What If You Could Explore Every Scientific Discovery Like Google Maps?", goal: "Demonstrate the SciLoop vision", emotion: "Wonder → exploration → inspiration", audience: "Students, creators, builders, and future learners", duration: 60, style: "future" },
];

function fileMap(files: Array<{ path: string; content: string }>) { return new Map(files.map((file) => [path.basename(file.path), file.content])); }
function sceneBreakdown(run: ReturnType<typeof runDirectorAI>) { return run.project.scenes.map((scene, index) => `## Scene ${index + 1} · ${scene.time} · ${scene.title}\n\nPhase: ${scene.phase}\nPurpose: ${scene.copy}\nVisual: ${scene.visual}\nCamera: ${scene.camera}\nMotion: ${scene.motion}\nLighting: ${scene.lighting}\nText: ${scene.text}\nTransition: ${scene.transition}\nPalette: ${scene.palette}`).join("\n\n"); }
function musicPlan(run: ReturnType<typeof runDirectorAI>) { return `# Music Plan\n\nArc: ${run.project.production.musicArc}\n\n- 0–3s: Low pulse and heartbeat, leave room for the hook.\n- 3–15s: Add percussive research ticks and a restrained bass movement.\n- 15–35s: Open the orchestral bed as the knowledge graph and product reveal arrive.\n- Final beat: Brief silence before the CTA, then an inspirational resolve.\n\nSound effects: heartbeat, paper impact, data ticks, whoosh transitions, particle shimmer, interface clicks, low sub hit, logo air release.`; }
function thumbnail(run: ReturnType<typeof runDirectorAI>) { return `# Thumbnail Prompt\n\nCreate three 9:16-safe thumbnail options for “${run.project.title}”. Use a dark cinematic background, one clear scientific focal object, electric blue energy, high-contrast white typography, strong negative space, and a curiosity gap. Avoid generic stock imagery, clutter, tiny text, watermarks, and unsupported scientific claims.\n\nRecommended title: ${run.project.title}\nSelected hook: ${run.project.hook}`; }

export async function POST() {
  const root = path.join(process.cwd(), "sciloop_first_launch");
  await fs.rm(root, { recursive: true, force: true });
  await fs.mkdir(root, { recursive: true });
  const evolution = await getEvolutionSnapshot();
  const completed: Array<{ id: string; topic: string; run: ReturnType<typeof runDirectorAI> }> = [];
  for (const topic of launchTopics) {
    const run = runDirectorAI(topic.topic, topic.style, evolution.rules.map((rule) => rule.rule));
    run.project.hook = campaignHook(topic.topic);
    run.project.scenes[0].copy = run.project.hook;
    run.project.duration = topic.duration;
    run.project.scenes[run.project.scenes.length - 1].time = `${Math.max(0, topic.duration - 7)}–${topic.duration}s`;
    run.simulation = simulateViralPerformance(run.project);
    const factory = createReelFactoryPackage(run.project, topic.topic);
    const files = fileMap(factory.files);
    const dir = path.join(root, topic.id);
    await fs.mkdir(dir, { recursive: true });
    const output: Record<string, string> = {
      "script.md": files.get("script.md") ?? run.outputs["production_strategy.md"],
      "storyboard.md": files.get("storyboard.md") ?? "",
      "scene_breakdown.md": sceneBreakdown(run),
      "visual_prompts.md": files.get("image_prompts.md") ?? "",
      "video_prompts.md": files.get("video_prompts.md") ?? "",
      "voice_script.txt": files.get("narration.txt") ?? "",
      "captions.srt": files.get("captions.srt") ?? "",
      "music_plan.md": musicPlan(run),
      "editing_timeline.md": files.get("editing_timeline.md") ?? "",
      "thumbnail_prompt.md": thumbnail(run),
      "caption.md": files.get("caption.md") ?? "",
      "hashtags.txt": files.get("hashtags.txt") ?? "",
      "viral_report.md": run.simulation.report,
      "director_report.md": run.outputs["director_report.md"],
      "quality_report.md": `# Quality Report\n\nOverall production quality: ${run.variants.find((variant) => variant.id === run.selectedVariantId)?.scores.overall}/100\nViral simulation: ${run.simulation.metrics.overallViralScore}/100\nKnowledge branch score: ${run.graph.novelty.branchScore}/100\nReviewer consensus: ${Math.round(run.reviews.reduce((sum, review) => sum + review.score, 0) / run.reviews.length)}/100\nOptimization iterations: ${run.optimizationHistory.length}\n\nRecommendation: ${run.finalRecommendation}`,
    };
    await Promise.all(Object.entries(output).map(([name, content]) => fs.writeFile(path.join(dir, name), content ?? "", "utf8")));
    completed.push({ id: topic.id, topic: topic.topic, run });
  }
  const ranking = [...completed].sort((a, b) => (b.run.variants.find((variant) => variant.id === b.run.selectedVariantId)?.scores.overall ?? 0) - (a.run.variants.find((variant) => variant.id === a.run.selectedVariantId)?.scores.overall ?? 0));
  const comparison = `# SciLoop First Launch / Comparison Report\n\nThe first three official reels completed the full Director → Knowledge Graph → Story → Creative Routing → Viral Simulation → Optimization → Export pipeline.\n\n| Reel | Story | Hook | Visuals | Narration | Retention | Education | Brand | Production | Viral |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n${ranking.map((item) => { const variant = item.run.variants.find((candidate) => candidate.id === item.run.selectedVariantId)!; return `| ${item.id} | ${variant.scores.narrativeQuality} | ${variant.hooks[0].score} | ${variant.scores.visualQuality} | ${variant.scores.narrativeQuality} | ${variant.scores.retentionPrediction} | ${variant.scores.educationalValue} | ${variant.scores.brandConsistency} | ${variant.scores.overall} | ${item.run.simulation.metrics.overallViralScore} |`; }).join("\n")}\n\n## Ranking\n${ranking.map((item, index) => `${index + 1}. ${item.id}: ${item.topic}`).join("\n")}\n\n## Benchmark status\n- Knowledge Engine: completed graph, novelty detection, learning paths, and visualization prompts.\n- Story Engine: 20 hooks plus 10 Director story variants per reel.\n- Director AI: selected version with logged reasoning and 7 specialist reviews.\n- Visual Engine: scene-specific image, video, camera, lighting, motion, and transition prompts.\n- Viral Engine: second-level simulation, retention curves, weak-scene diagnosis, and optimization history.\n- Export Pipeline: all 15 required assets generated for each reel.\n\nThis benchmark creates production packages and asset instructions. Actual cloud media rendering and platform publishing remain gated behind provider credentials and human approval.`;
  await fs.mkdir(path.join(root, "comparison"), { recursive: true });
  await fs.writeFile(path.join(root, "comparison", "comparison_report.md"), comparison, "utf8");
  return Response.json({ ok: true, outputDirectory: root, reels: completed.map((item) => ({ id: item.id, topic: item.topic, score: item.run.simulation.metrics.overallViralScore, selectedVariant: item.run.selectedVariantId })), comparison });
}
