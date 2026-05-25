import type { Subject } from "@/lib/types";
import { physicsWorldExperienceConfig } from "@/data/worlds/physics-world";

export const subjects: Subject[] = [
  {
    id: "physics",
    name: "Physics World",
    slug: "physics",
    tagline: "See physical law become visible, spatial, and reactive.",
    description:
      "The first SciLoop world shows how discoveries do not merely explain the universe. They visibly reshape it.",
    entryRoute: `/worlds/physics?discovery=${physicsWorldExperienceConfig.defaultDiscoverySlug}`,
    accent: "cyan",
  },
];
