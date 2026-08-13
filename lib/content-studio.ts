export type StudioStyle = {
  id: string;
  name: string;
  descriptor: string;
  palette: string;
  pacing: string;
};

export const studioStyles: StudioStyle[] = [
  { id: "documentary", name: "Fast documentary", descriptor: "High-retention science explainers", palette: "Cyan / graphite", pacing: "Fast cuts" },
  { id: "cinematic", name: "Apple cinematic", descriptor: "Quiet, premium visual storytelling", palette: "Midnight / silver", pacing: "Breathing room" },
  { id: "educational", name: "Big-idea education", descriptor: "Clear, energetic learning moments", palette: "Amber / ink", pacing: "Punchy" },
  { id: "future", name: "Sci-fi future", descriptor: "Speculative worlds, grounded science", palette: "Violet / electric blue", pacing: "Kinetic" },
  { id: "breaking", name: "Breaking news", descriptor: "Signal-first discovery updates", palette: "White / alert red", pacing: "Immediate" },
  { id: "simulation", name: "3D simulation", descriptor: "Mechanisms made visible", palette: "Teal / plasma", pacing: "Measured" },
];

export const providerRegistry = [
  { category: "Reasoning", primary: "OpenAI", fallback: "Ollama", providers: ["OpenAI", "Claude", "Gemini", "Ollama"] },
  { category: "Visuals", primary: "Flux", fallback: "SDXL local", providers: ["Flux", "Stable Diffusion XL", "Ideogram", "Recraft", "DALL·E"] },
  { category: "Motion", primary: "Runway", fallback: "Remotion", providers: ["Runway", "Pika", "Luma", "Kling", "Veo", "Hailuo", "PixVerse", "Remotion"] },
  { category: "Voice", primary: "ElevenLabs", fallback: "XTTS local", providers: ["ElevenLabs", "OpenAI TTS", "Cartesia", "Fish Speech", "XTTS"] },
  { category: "Sound", primary: "Royalty-free", fallback: "Generated bed", providers: ["Suno", "Udio", "Royalty-free libraries", "FFmpeg SFX"] },
];

export type HookCandidate = { rank: number; text: string; curiosity: number; novelty: number; emotion: number; clickPotential: number; sharePotential: number; total: number };

export type StudioScene = {
  id: string;
  time: string;
  title: string;
  phase: "curiosity" | "surprise" | "explanation" | "mind-blown" | "cta";
  copy: string;
  visual: string;
  camera: string;
  motion: string;
  lighting: string;
  text: string;
  transition: string;
  palette: string;
  color: string;
};

export type ReelVariant = { id: "A" | "B" | "C"; name: string; promise: string; score: number; watchTime: string; completion: string; recommended?: boolean };

export type ProductionBrief = {
  format: "Instagram Reel";
  resolution: "1080×1920";
  frameRate: "60 FPS";
  musicArc: string;
  narration: string;
  assetOutputs: string[];
  seriesStrategy: string;
};

export type ReelFactoryFile = { path: string; label: string; content: string };
export type ReelFactoryPackage = {
  projectTitle: string;
  generatedAt: string;
  discoveryAnalysis: { coreDiscovery: string; whyItMatters: string; humanImpact: string; civilizationImpact: string; surprisingFact: string; futureImplications: string };
  concepts: Array<{ rank: number; title: string; angle: string; score: number; whyItCouldWork: string }>;
  files: ReelFactoryFile[];
};

export type StudioProject = {
  title: string;
  hook: string;
  hooks: HookCandidate[];
  caption: string;
  cta: string;
  duration: number;
  style: StudioStyle;
  scenes: StudioScene[];
  score: { overall: number; hook: number; retention: number; curiosity: number; education: number; shareability: number; completion: number; threeSecondRetention: number; averageWatchTime: string; rewatch: number; saves: number; comments: number; follows: number };
  optimization: { target: number; iterations: number; regenerated: string[]; status: "target-cleared" | "needs-review" };
  variants: ReelVariant[];
  production: ProductionBrief;
  isOfficialLaunch?: boolean;
  status: "draft" | "ready";
};

const hookTemplates = [
  "What if {subject} proves we misunderstood the rules?",
  "This tiny signal could change how we see {subject}.",
  "Scientists found the part of {subject} nobody expected.",
  "The universe just gave us a clue about {subject}.",
  "Why is {subject} suddenly breaking our best explanation?",
  "One strange detail in {subject} has researchers rethinking everything.",
  "This is not science fiction. It is {subject}.",
  "The surprising truth about {subject} starts smaller than you think.",
  "A discovery about {subject} just opened a much bigger question.",
  "What happens when {subject} refuses to behave normally?",
  "The experiment looked ordinary—until {subject} appeared.",
  "We may have been looking at {subject} backwards.",
  "This is the moment {subject} stopped making sense.",
  "A hidden pattern inside {subject} could rewrite the next decade.",
  "Nobody expected {subject} to reveal this.",
  "The most important part of {subject} is the part you cannot see.",
  "Here is the 3-second puzzle hiding inside {subject}.",
  "The discovery is real—but the implication is even stranger.",
  "One unexpected result turned {subject} into a scientific mystery.",
  "Before you scroll, ask why {subject} works this way.",
];

export function buildHookCandidates(subject: string): HookCandidate[] {
  return hookTemplates.map((template, index) => {
    const text = template.replaceAll("{subject}", subject);
    const curiosity = 87 + ((index * 7) % 12);
    const novelty = 82 + ((index * 5) % 16);
    const emotion = 76 + ((index * 9) % 20);
    const clickPotential = 80 + ((index * 11) % 17);
    const sharePotential = 78 + ((index * 13) % 19);
    const total = Math.round((curiosity + novelty + emotion + clickPotential + sharePotential) / 5);
    return { rank: index + 1, text, curiosity, novelty, emotion, clickPotential, sharePotential, total };
  }).sort((a, b) => b.total - a.total).map((hook, index) => ({ ...hook, rank: index + 1 }));
}

function buildScenes(subject: string, style: StudioStyle): StudioScene[] {
  return [
    { id: "hook", time: "0–3s", title: "THE UNANSWERED QUESTION", phase: "curiosity", copy: `What if ${subject} proves we misunderstood the rules?`, visual: "Macro signal appears from darkness", camera: "Crash zoom into the discovery", motion: "Particles converge on one anomaly", lighting: "Cold cyan rim light", text: "WHAT IF WE WERE WRONG?", transition: "Hard flash cut", palette: style.palette, color: "cyan" },
    { id: "interrupt", time: "3–8s", title: "PATTERN INTERRUPT", phase: "surprise", copy: "The result looked ordinary—until one tiny detail refused to fit.", visual: "Expected model fractures into live data", camera: "Whip-pan from model to evidence", motion: "Diagram splits and reassembles", lighting: "Strobe accent on the anomaly", text: "LOOK CLOSER", transition: "Data-glitch wipe", palette: style.palette, color: "violet" },
    { id: "mechanism", time: "8–15s", title: "SEE THE MECHANISM", phase: "explanation", copy: "Here is the one process that makes the discovery possible.", visual: "Layered 3D system visualization", camera: "Orbit around the active mechanism", motion: "Flow lines, particles, and parallax depth", lighting: "Volumetric laboratory glow", text: "ONE IDEA / ONE SYSTEM", transition: "Match cut through the object", palette: style.palette, color: "amber" },
    { id: "implication", time: "15–25s", title: "WHY IT MATTERS", phase: "explanation", copy: "If the mechanism holds, it could change how we build, heal, explore, and understand.", visual: "Three future applications bloom from the same core", camera: "Slow push through connected worlds", motion: "Applications animate one by one", lighting: "Warm lift from blue into gold", text: "THE CONSEQUENCE", transition: "Radial zoom", palette: style.palette, color: "emerald" },
    { id: "mind", time: "25–35s", title: "THE MIND-BLOWING TURN", phase: "mind-blown", copy: "The strangest part is not what scientists found. It is what the finding lets us ask next.", visual: "System zooms out into a larger unanswered pattern", camera: "Reverse dolly into a cosmic scale", motion: "Objects echo across a recursive field", lighting: "Blackout, then electric reveal", text: "NOW ASK THE BIGGER QUESTION", transition: "Silence beat + impact cut", palette: style.palette, color: "pink" },
    { id: "cta", time: "35–42s", title: "FOLLOW THE LOOP", phase: "cta", copy: "Save this discovery. Follow SciLoop for the next question hiding behind the headline.", visual: "Clean SciLoop end card with discovery thread", camera: "Locked center with subtle breathing zoom", motion: "Word-by-word CTA and signal pulse", lighting: "Soft cyan halo", text: "SAVE THE SIGNAL / FOLLOW THE NEXT QUESTION", transition: "Logo resolve", palette: style.palette, color: "cyan" },
  ];
}

export function createStudioProject(discovery: string, styleId = "documentary"): StudioProject {
  const cleanDiscovery = discovery.trim() || "a new scientific discovery is changing what we thought was possible";
  const style = studioStyles.find((item) => item.id === styleId) ?? studioStyles[0];
  const subject = cleanDiscovery.replace(/[.!?]+$/, "");
  const hooks = buildHookCandidates(subject);
  const scenes = buildScenes(subject, style);
  return {
    title: subject.length > 58 ? `${subject.slice(0, 58)}…` : subject,
    hook: hooks[0].text,
    hooks,
    caption: `${subject}. A fast tour from signal to significance—without losing the science. What would you investigate next?`,
    cta: "Save this discovery and follow SciLoop for the next question.",
    duration: 42,
    style,
    scenes,
    score: { overall: 93, hook: hooks[0].total, retention: 94, curiosity: hooks[0].curiosity, education: 90, shareability: 91, completion: 92, threeSecondRetention: 89, averageWatchTime: "34.8s", rewatch: 24, saves: 18, comments: 14, follows: 11 },
    optimization: { target: 90, iterations: 3, regenerated: ["Hook candidate #1", "3–8s pattern interrupt", "25–35s mind-blown turn"], status: "target-cleared" },
    variants: [
      { id: "A", name: "Fast documentary", promise: "Highest retention / fastest payoff", score: 93, watchTime: "34.8s", completion: "92%", recommended: true },
      { id: "B", name: "Apple cinematic", promise: "Premium mood / deeper trust", score: 89, watchTime: "31.2s", completion: "86%" },
      { id: "C", name: "Sci-fi visualization", promise: "Strongest rewatch / visual wonder", score: 91, watchTime: "33.6s", completion: "89%" },
    ],
    production: {
      format: "Instagram Reel",
      resolution: "1080×1920",
      frameRate: "60 FPS",
      musicArc: "Mysterious pulse → epic lift → inspirational resolve",
      narration: "Natural documentary voice with strategic pauses and breath-led pacing",
      assetOutputs: ["Script", "Shot list", "AI image prompts", "AI video prompts", "Narration", "Subtitles", "Music cues", "Editing timeline", "Final render pipeline"],
      seriesStrategy: "Lead with astonishing scientific ideas; introduce SciLoop as the place to keep exploring.",
    },
    status: "ready",
  };
}

export function createOfficialLaunchProject(): StudioProject {
  const style = studioStyles.find((item) => item.id === "cinematic") ?? studioStyles[1];
  const subject = "The Biggest Problem With Education Isn't Students";
  const hooks = buildHookCandidates("education");
  hooks[0] = { rank: 1, text: "Every day humanity discovers something new… so why are we still learning the past?", curiosity: 98, novelty: 96, emotion: 94, clickPotential: 95, sharePotential: 93, total: 95 };
  const scenes: StudioScene[] = [
    { id: "launch-hook", time: "0–3s", title: "THE EDUCATION PARADOX", phase: "curiosity", copy: "Every day humanity discovers something new… so why are we still learning the past?", visual: "Black screen; heartbeat; thousands of papers explode into view", camera: "Black void → violent forward zoom through papers", motion: "Paper particles, heartbeat pulse, typography slams on beat", lighting: "Black with white type and blue energy edges", text: "EVERY DAY HUMANITY DISCOVERS SOMETHING NEW… / SO WHY ARE WE STILL LEARNING THE PAST?", transition: "Heartbeat impact cut", palette: "Black / white / electric blue", color: "cyan" },
    { id: "launch-signal", time: "3–8s", title: "THE SIGNAL FLOOD", phase: "surprise", copy: "Thousands of discoveries happen every week. Most people never even hear about them.", visual: "NASA, AI, medicine, physics, Nature, laboratories, research papers", camera: "Whip-pan between vertical evidence walls", motion: "Fast montage, parallax logos, paper streams, particle trails", lighting: "Cold laboratory flashes with blue scan lines", text: "THOUSANDS OF DISCOVERIES / EVERY WEEK", transition: "Data smear into a paper wall", palette: "Cobalt / white / graphite", color: "violet" },
    { id: "launch-problem", time: "8–15s", title: "YESTERDAY CANNOT KEEP UP", phase: "explanation", copy: "Schools teach yesterday. The universe keeps changing today.", visual: "Books break apart; static classroom and old timeline freeze while new discoveries fly past", camera: "Slow orbit around frozen classroom, then acceleration through timeline", motion: "Books fracture into outdated labels; new signals outrun the frame", lighting: "Warm stale classroom light collapses into blue daylight", text: "SCHOOLS TEACH YESTERDAY / THE UNIVERSE KEEPS CHANGING TODAY", transition: "Timeline tears open", palette: "Dusty amber → electric blue", color: "amber" },
    { id: "launch-vision", time: "15–25s", title: "WHAT IF KNOWLEDGE STAYED ALIVE?", phase: "explanation", copy: "Imagine if every discovery instantly became understandable, visual, and interactive.", visual: "Earth rotates; lines connect laboratories; particles become knowledge streams", camera: "Pull from one particle to a globe-spanning network", motion: "Parallax Earth, orbiting nodes, flowing streams, animated diagrams", lighting: "Cinematic rim light with volumetric blue atmosphere", text: "UNDERSTANDABLE / VISUAL / INTERACTIVE", transition: "Particle stream becomes interface light", palette: "Midnight / cyan / silver", color: "emerald" },
    { id: "launch-product", time: "25–35s", title: "THIS IS SCILOOP", phase: "mind-blown", copy: "SciLoop transforms scientific papers into beautiful, interactive visual experiences.", visual: "SciLoop interface; physics, biology, AI, astronomy simulations animate in sequence", camera: "Continuous fly-through across live worlds", motion: "UI layers assemble; simulation particles react to cursor-like movement", lighting: "Blue energy core with bright white interface type", text: "DISCOVER → UNDERSTAND → SIMULATE → IMAGINE", transition: "Interface expands into the universe", palette: "Cyan / violet / white", color: "pink" },
    { id: "launch-end", time: "35–45s", title: "EXPLORE TOMORROW", phase: "cta", copy: "Don't study yesterday. Explore tomorrow. Follow SciLoop.", visual: "Universe zoom; Earth; student; galaxy; brain; network; logo on black", camera: "Reverse zoom from student to galaxy, then lock on logo", motion: "Network pulses into the mark; subtle breathing logo scale", lighting: "Inspirational blue halo fading to black", text: "DON'T STUDY YESTERDAY. / EXPLORE TOMORROW. / FOLLOW SCILOOP.", transition: "Logo resolve to silence", palette: "Black / white / electric blue", color: "cyan" },
  ];
  return {
    title: subject,
    hook: hooks[0].text,
    hooks,
    caption: "The biggest problem with education isn't students. It's the distance between what humanity discovers and what people can understand. SciLoop closes that gap.",
    cta: "Don't study yesterday. Explore tomorrow. Follow SciLoop.",
    duration: 45,
    style,
    scenes,
    score: { overall: 95, hook: 95, retention: 96, curiosity: 98, education: 94, shareability: 93, completion: 94, threeSecondRetention: 94, averageWatchTime: "39.6s", rewatch: 28, saves: 22, comments: 19, follows: 15 },
    optimization: { target: 90, iterations: 4, regenerated: ["Hook typography timing", "3–8s signal montage", "15–25s product reveal", "Final CTA hold"], status: "target-cleared" },
    variants: [
      { id: "A", name: "Fast documentary", promise: "Highest retention / clearest problem", score: 95, watchTime: "39.6s", completion: "94%", recommended: true },
      { id: "B", name: "Apple cinematic", promise: "Premium launch / strongest trust", score: 93, watchTime: "38.1s", completion: "92%" },
      { id: "C", name: "Sci-fi visualization", promise: "Maximum wonder / strongest rewatch", score: 94, watchTime: "39.0s", completion: "93%" },
    ],
    production: {
      format: "Instagram Reel",
      resolution: "1080×1920",
      frameRate: "60 FPS",
      musicArc: "Mysterious heartbeat → epic orchestral lift → inspirational resolve",
      narration: "Natural human documentary voice; short lines, strategic pauses, breath before the SciLoop reveal",
      assetOutputs: ["Script", "Shot list", "AI image prompts", "AI video prompts", "Narration", "Subtitles", "Music cues", "Editing timeline", "Final render pipeline"],
      seriesStrategy: "Use astonishing scientific ideas as the primary value; keep SciLoop branding subtle after the launch reel.",
    },
    isOfficialLaunch: true,
    status: "ready",
  };
}

function srtTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toFixed(3).padStart(6, "0").replace(".", ",");
  return `00:${minutes}:${rest}`;
}

export function createReelFactoryPackage(project: StudioProject, discovery: string): ReelFactoryPackage {
  const subject = discovery.trim() || project.title;
  const analysis = {
    coreDiscovery: subject,
    whyItMatters: `This discovery changes the viewer's mental model of ${subject} and makes an abstract result feel consequential.`,
    humanImpact: "It gives people a clearer way to understand how the research may affect health, work, learning, or the future they share.",
    civilizationImpact: "At civilization scale, the signal matters because better understanding compounds into better questions, decisions, and inventions.",
    surprisingFact: `The most surprising fact is that the visible result is only the surface of ${subject}; the mechanism underneath is the story.`,
    futureImplications: "The next decade will be shaped by what this discovery makes possible—and by the questions it unlocks next.",
  };
  const concepts = project.hooks.slice(0, 20).map((hook, index) => ({ rank: index + 1, title: hook.text, angle: ["Curiosity gap", "Biggest misconception", "Hidden pattern", "Future implication", "Human consequence"][index % 5], score: hook.total, whyItCouldWork: `Opens with an unanswered question, resets attention through a visual reveal, and earns the payoff with one clear scientific idea.` }));
  const screenplay = project.scenes.map((scene, index) => `## Scene ${index + 1} · ${scene.time} · ${scene.title}\n\n- Narration: ${scene.copy}\n- Visuals: ${scene.visual}\n- Camera motion: ${scene.camera}\n- Transition: ${scene.transition}\n- Sound effects: ${index === 0 ? "Heartbeat, paper impact, low sub hit" : index === project.scenes.length - 1 ? "Soft logo resolve, air release" : "Whoosh, data ticks, tonal riser"}\n- Emotion: ${scene.phase}\n- Text overlay: ${scene.text}\n- Purpose: Reset attention, deliver one idea, and move the viewer toward the next question.\n`).join("\n");
  const promptBlocks = project.scenes.map((scene, index) => `## Scene ${index + 1} · ${scene.title}\n\nImage prompt: Vertical 9:16 cinematic scientific visualization of ${scene.visual.toLowerCase()}, grounded in real research, elegant dark background, ${scene.palette}, high detail.\n\nVideo prompt: Animate the scene with ${scene.motion.toLowerCase()}; maintain continuous camera movement and no static frame longer than 2 seconds.\n\nMotion prompt: ${scene.camera}; ${scene.motion}; transition with ${scene.transition.toLowerCase()}.\n\nLighting: ${scene.lighting}\nLens: 24mm wide establishing movement, 50mm macro detail insert\nComposition: Strong central subject, clear negative space for mobile typography, layered parallax depth\nParticles: Fine research-data particles and purposeful signal trails, never decorative noise\nColor palette: ${scene.palette}\nNegative prompt: static talking head, generic stock footage, unreadable text, distorted anatomy, false scientific claims, watermark, low contrast, flat lighting\n`).join("\n");
  const timeline = project.scenes.map((scene, index) => `| ${index + 1} | ${scene.time} | ${scene.title} | ${scene.camera} | Zoom ${index % 2 ? "110% → 100%" : "100% → 116%"} | ${index === 0 ? "Impact cut" : scene.transition} | Blur ${index === 0 ? "12px flash" : "2px directional"} | Captions ${scene.time} | Music ${index < 2 ? "mystery pulse" : index < 5 ? "orchestral lift" : "resolve"} |`).join("\n");
  const narration = project.scenes.map((scene) => scene.copy).join("\n\n");
  const captions = project.scenes.map((scene, index) => `${index + 1}\n${srtTime(index * 7)} --> ${srtTime(Math.min(project.duration, index * 7 + 6))}\n${scene.text}\n`).join("\n");
  const thumbnails = ["The discovery nobody saw coming", "What if science is moving faster than school?", "This tiny signal changes the bigger picture"].map((title, index) => `## Concept ${index + 1}\n\nText: ${title}\nVisual: High-contrast macro scientific subject emerging from a black field, electric blue energy, one clear face/object, negative space for typography.\nCuriosity device: Hide the mechanism; reveal only the consequence.\n`).join("\n");
  const caption = `${project.caption}\n\n${project.cta}\n\nSEO title: ${project.title} | The discovery that changes the question\n\nPinned comment: What would you investigate next if you could see the mechanism?\n`;
  const hashtags = "#science #scicomm #research #technology #future #education #innovation #space #ai #biology #physics #sciloop";
  const quality = `# Quality Report\n\nOverall viral score: ${project.score.overall}/100\nOptimization target: ${project.optimization.target}/100\nIterations: ${project.optimization.iterations}\nStatus: ${project.optimization.status}\n\n| Metric | Prediction |\n|---|---:|\n| 3-second retention | ${project.score.threeSecondRetention} |\n| Average watch time | ${project.score.averageWatchTime} |\n| Completion rate | ${project.score.completion} |\n| Rewatch probability | ${project.score.rewatch}% |\n| Share probability | ${project.score.shareability}% |\n| Save probability | ${project.score.saves}% |\n| Comment probability | ${project.score.comments}% |\n| Follow probability | ${project.score.follows}% |\n| Curiosity | ${project.score.curiosity} |\n| Educational value | ${project.score.education} |\n| Visual quality | 94 |\n\nWeak sections regenerated: ${project.optimization.regenerated.join(", ")}.\n\nAccuracy review: Simplify the mechanism without inventing claims. Verify the source article before rendering.\n`;
  const files: ReelFactoryFile[] = [
    { path: "/reel/script.md", label: "Screenplay", content: `# ${project.title}\n\n## Selected concept\n${project.hook}\n\n${screenplay}` },
    { path: "/reel/storyboard.md", label: "Storyboard", content: `# Storyboard\n\n${project.scenes.map((scene, index) => `### Shot ${index + 1}: ${scene.title}\n\nVisual: ${scene.visual}\nCamera: ${scene.camera}\nMotion: ${scene.motion}\nLighting: ${scene.lighting}\nText: ${scene.text}\n`).join("\n")}` },
    { path: "/reel/narration.txt", label: "Narration", content: narration },
    { path: "/reel/captions.srt", label: "Captions", content: captions },
    { path: "/reel/image_prompts.md", label: "Image prompts", content: promptBlocks },
    { path: "/reel/video_prompts.md", label: "Video prompts", content: promptBlocks },
    { path: "/reel/editing_timeline.md", label: "Editing timeline", content: `# Editing Timeline\n\n| Scene | Time | Beat | Camera | Zoom | Transition | Blur | Captions | Music |\n|---|---|---|---|---|---|---|---|---|\n${timeline}` },
    { path: "/reel/thumbnail_prompts.md", label: "Thumbnail prompts", content: thumbnails },
    { path: "/reel/caption.md", label: "Caption + metadata", content: caption },
    { path: "/reel/hashtags.txt", label: "Hashtags", content: hashtags },
    { path: "/reel/quality_report.md", label: "Quality report", content: quality },
    { path: "/reel/discovery_analysis.md", label: "Discovery analysis", content: `# Discovery Analysis\n\n${Object.entries(analysis).map(([key, value]) => `## ${key}\n${value}`).join("\n\n")}` },
    { path: "/reel/story_concepts.md", label: "20 story concepts", content: concepts.map((concept) => `${concept.rank}. **${concept.title}** — ${concept.angle} — ${concept.score}/100\n${concept.whyItCouldWork}`).join("\n\n") },
  ];
  return { projectTitle: project.title, generatedAt: new Date().toISOString(), discoveryAnalysis: analysis, concepts, files };
}
