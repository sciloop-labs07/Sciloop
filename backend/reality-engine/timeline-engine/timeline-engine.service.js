export function buildTimeline(analysis = {}) {
  return [
    {
      id: "before-world",
      label: "Before World",
      camera: "wide establishing shot",
      event: analysis.before_world?.summary || "People live with the old limitation.",
      emotion: "friction, delay, scarcity"
    },
    {
      id: "pressure",
      label: "Pressure Builds",
      camera: "close-up on bottleneck",
      event: (analysis.system_bottlenecks || [])[0] || "The system bottleneck becomes visible.",
      emotion: "urgency"
    },
    {
      id: "discovery",
      label: "Discovery Event",
      camera: "cinematic transition flash",
      event: analysis.discovery_event?.summary || "A new mechanism changes the possible actions.",
      emotion: "clarity"
    },
    {
      id: "after-world",
      label: "After World",
      camera: "same world, upgraded behavior",
      event: analysis.after_world?.summary || "Infrastructure, behavior, and possibility space shift.",
      emotion: "acceleration"
    },
    {
      id: "future-branches",
      label: "Future Branches",
      camera: "branching holographic timeline",
      event: "Multiple futures open depending on incentives, access, and safety.",
      emotion: "wonder + responsibility"
    }
  ];
}
