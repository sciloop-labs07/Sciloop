export type PortalLike = {
  title?: string;
  name?: string;
  label?: string;
  slug?: string;
  href?: string;
  route?: string;
  description?: string;
  copy?: string;
  cta?: string;
  tags?: string[];
  sections?: unknown[];
  [key: string]: unknown;
};

const removedPortalTitles = new Set([
  "Reality Visualization Engine",
  "Enter Physics World",
]);

const visualLanguageAliases = new Set([
  "Physics World",
  "World Portal | Physics World",
  "Visual Language: Physics",
  "Visual Language: Biology",
  "Visual Language",
  "Visual Language Lab",
  "Enter Physics World",
  "Students Portal",
  "Survival Meaning Engine",
  "Cosmic Simulation",
  "Unity AI Sandbox",
]);

const nexusAliases = new Set(["SciLoop Nexus", "Platform Guide"]);

const knowledgeFrontierAliases = new Set([
  "Knowledge Frontier",
  "Scientist Legacy Portal",
  "Potential Explorer",
  "Portal 2: Potential Explorer",
]);

const localProblemSolverAliases = new Set([
  "Local Problem Solver",
  "Impact Hub",
  "Timeless Problems Lab",
  "Portal 1: Timeless Problems Lab",
]);

const miniExperimentAliases = new Set([
  "Mini Experiment Lab",
  "Simulation Lab: Reality Sandbox 3D",
  "Reality Sandbox 3D",
  "Physics Reality Sandbox",
]);

export const canonicalPortalCards = [
  {
    title: "Visual Language Portal",
    copy:
      "Physics, biology, student learning, cosmic simulation, Unity AI, layered reality, and simulation examples in one coherent portal.",
    href: "/visual-language",
    cta: "Open Visual Language Portal",
    tags: ["visual-language", "physics", "biology", "simulation"],
  },
  {
    title: "Knowledge Frontier",
    copy:
      "Latest frontier ideas, scientist legacy, invention timelines, historical breakthroughs, and lessons from great scientists.",
    href: "/knowledge-frontier",
    cta: "Open Knowledge Frontier",
    tags: ["knowledge", "scientists", "inventions", "history"],
  },
  {
    title: "Local Problem Solver",
    copy:
      "Local issues, global impact challenges, community solutions, contribution scoring, and shared problem-solving in one portal.",
    href: "/local-problem-solver",
    cta: "Open Local Problem Solver",
    tags: ["local", "impact", "challenges", "community"],
  },
  {
    title: "Mini Experiment Lab",
    copy:
      "Focused browser experiments and the full Reality Sandbox 3D gathered into one interactive laboratory.",
    href: "/mini-experiment-lab",
    cta: "Open Mini Experiment Lab",
    tags: ["experiments", "simulation", "reality-sandbox", "physics"],
  },
] as const;

function getPortalTitle(portal: PortalLike): string {
  return String(portal.title ?? portal.name ?? portal.label ?? "").trim();
}

export function consolidatePortals<T extends PortalLike>(portals: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const portal of portals) {
    const originalTitle = getPortalTitle(portal);
    if (!originalTitle || removedPortalTitles.has(originalTitle)) continue;

    let normalizedPortal: T = portal;

    if (nexusAliases.has(originalTitle)) {
      normalizedPortal = {
        ...portal,
        title: "SciLoop Nexus",
        name: "SciLoop Nexus",
        label: "SciLoop Nexus",
        slug: "",
        href: "/",
        route: "/",
        description:
          portal.description ||
          "SciLoop home, identity, platform orientation, and guide in one canonical portal.",
        tags: Array.from(
          new Set([...(portal.tags ?? []), "home", "guide", "orientation"]),
        ),
        mergedFrom: Array.from(nexusAliases),
      } as T;
    } else if (visualLanguageAliases.has(originalTitle)) {
      normalizedPortal = {
        ...portal,
        title: "Visual Language Portal",
        name: "Visual Language Portal",
        label: "Visual Language Portal",
        slug: "visual-language",
        href: "/visual-language",
        route: "/visual-language",
        description:
          portal.description ||
          "Unified SciLoop visual language system for physics, biology, layered reality, and simulation-based understanding.",
        tags: Array.from(
          new Set([
            ...(portal.tags ?? []),
            "visual-language",
            "physics",
            "biology",
            "simulation",
            "reality-layers",
          ]),
        ),
        mergedFrom: Array.from(visualLanguageAliases),
      } as T;
    } else if (knowledgeFrontierAliases.has(originalTitle)) {
      normalizedPortal = {
        ...portal,
        title: "Knowledge Frontier",
        name: "Knowledge Frontier",
        label: "Knowledge Frontier",
        slug: "knowledge-frontier",
        href: "/knowledge-frontier",
        route: "/knowledge-frontier",
        description:
          portal.description ||
          "Frontier knowledge, invention history, scientist legacy, and breakthrough timelines in one portal.",
        tags: Array.from(
          new Set([
            ...(portal.tags ?? []),
            "knowledge",
            "scientists",
            "inventions",
            "frontier",
            "history",
          ]),
        ),
        mergedFrom: Array.from(knowledgeFrontierAliases),
      } as T;
    } else if (localProblemSolverAliases.has(originalTitle)) {
      normalizedPortal = {
        ...portal,
        title: "Local Problem Solver",
        name: "Local Problem Solver",
        label: "Local Problem Solver",
        slug: "local-problem-solver",
        href: "/local-problem-solver",
        route: "/local-problem-solver",
        description:
          portal.description ||
          "Local problems, global challenges, community solutions, and impact tracking in one portal.",
        tags: Array.from(
          new Set([
            ...(portal.tags ?? []),
            "local",
            "impact",
            "challenges",
            "community",
          ]),
        ),
        mergedFrom: Array.from(localProblemSolverAliases),
      } as T;
    } else if (miniExperimentAliases.has(originalTitle)) {
      normalizedPortal = {
        ...portal,
        title: "Mini Experiment Lab",
        name: "Mini Experiment Lab",
        label: "Mini Experiment Lab",
        slug: "mini-experiment-lab",
        href: "/mini-experiment-lab",
        route: "/mini-experiment-lab",
        description:
          portal.description ||
          "Focused scientific experiments and Reality Sandbox 3D in one interactive laboratory.",
        tags: Array.from(
          new Set([
            ...(portal.tags ?? []),
            "experiments",
            "simulation",
            "reality-sandbox",
          ]),
        ),
        mergedFrom: Array.from(miniExperimentAliases),
      } as T;
    }

    const finalTitle = getPortalTitle(normalizedPortal);
    const finalHref = String(
      normalizedPortal.href ??
        normalizedPortal.route ??
        normalizedPortal.slug ??
        finalTitle,
    );
    const key = `${finalTitle}::${finalHref}`;
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(normalizedPortal);
  }

  return result;
}
