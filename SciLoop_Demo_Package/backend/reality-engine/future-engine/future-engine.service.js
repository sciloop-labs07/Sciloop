export function buildFutureBranches({ field = "Applied Reality", keywords = [] } = {}) {
  const core = keywords.slice(0, 3).join(", ") || "the core mechanism";
  return [
    {
      id: "branch-human-amplification",
      title: "Human Capability Amplification",
      probabilityTone: "plausible",
      description: `People use ${core} to reduce repetitive limits and focus on higher-order work.`,
      risk: "access gap",
      opportunity: "education, medicine, engineering, and local problem solving accelerate."
    },
    {
      id: "branch-system-infrastructure",
      title: "Infrastructure Shift",
      probabilityTone: "medium",
      description: `${field} systems reorganize around the new mechanism, changing cost, speed, and reliability.`,
      risk: "fragile dependency",
      opportunity: "society gains a more efficient base layer."
    },
    {
      id: "branch-planetary-scale",
      title: "Planetary Scale Upgrade",
      probabilityTone: "long-range",
      description: `If the mechanism scales safely, it can change resource flow, coordination, or survival capacity at planetary level.`,
      risk: "misuse or uneven control",
      opportunity: "civilization handles bigger challenges with lower entropy."
    }
  ];
}
