import type { Discovery } from "@/lib/types";

export const physicsDiscoveries: Discovery[] = [
  {
    id: "physics-induction",
    slug: "electromagnetic-induction",
    subjectId: "physics",
    title: "Electromagnetic Induction",
    shortTitle: "Induction",
    year: "1831",
    scientists: ["Michael Faraday", "Joseph Henry"],
    tagline: "Motion through a field becomes usable power.",
    summary:
      "A changing magnetic field induces current in a conductor. In SciLoop, the same world shifts from latent structure to active energy conversion.",
    worldChange:
      "The quiet field becomes a current-bearing system: particles accelerate, glow rises, and the center behaves like a generator instead of an object.",
    confidence: 0.93,
    quickView: "Watch the system wake up as changing flux begins to drive charge motion.",
    mechanismView: "Track how field intensity, orbit speed, and particle density rise together as induction turns on.",
    cinematicView: "The scene stops feeling passive and starts behaving like an engine.",
    conceptNodes: [
      { id: "flux", label: "Magnetic Flux", kind: "law", weight: 0.88, links: ["coil", "generator"] },
      { id: "coil", label: "Conductive Coil", kind: "technology", weight: 0.78, links: ["flux", "generator"] },
      { id: "generator", label: "Generator", kind: "effect", weight: 0.82, links: ["coil"] },
    ],
    simulation: {
      before: {
        label: "Before discovery",
        summary:
          "The field exists, but it is not yet understood as a controllable source of current. Motion and magnetism sit nearby without a clear bridge.",
        state: {
          particleCount: 92,
          orbitSpeed: 0.24,
          fieldIntensity: 0.22,
          glowStrength: 0.14,
          instability: 0.16,
          uncertaintyHalo: 0.18,
          colorBias: 0.56,
          brightnessBias: 0.22,
          waveAmplitude: 0.22,
          lensing: 0.12,
          orbitSpread: 0.3,
          ringTilt: 0.16,
          annotations: [
            "Field is present but mostly passive.",
            "Charge motion stays weak and localized.",
            "The world holds potential rather than output.",
          ],
        },
      },
      after: {
        label: "After discovery",
        summary:
          "Changing magnetic flux is readable as induced current. The same geometry now behaves like a power system instead of a static arrangement.",
        state: {
          particleCount: 228,
          orbitSpeed: 0.78,
          fieldIntensity: 0.86,
          glowStrength: 0.88,
          instability: 0.3,
          uncertaintyHalo: 0.34,
          colorBias: 0.61,
          brightnessBias: 0.84,
          waveAmplitude: 0.74,
          lensing: 0.22,
          orbitSpread: 0.42,
          ringTilt: 0.34,
          annotations: [
            "Changing flux drives visible current.",
            "Energy begins to propagate across the system.",
            "Mechanical motion can now scale into electricity.",
          ],
        },
      },
      mechanism:
        "A changing magnetic flux through a conductor induces an electromotive force, so the visual system shifts from quiet field presence to active current circulation.",
      implication:
        "Generators, transformers, and modern electrical infrastructure become possible once motion through fields can be converted into controllable current.",
    },
  },
  {
    id: "physics-relativity",
    slug: "general-relativity",
    subjectId: "physics",
    title: "General Relativity",
    shortTitle: "Relativity",
    year: "1915",
    scientists: ["Albert Einstein"],
    tagline: "Gravity becomes geometry instead of force alone.",
    summary:
      "Mass bends spacetime. In SciLoop, the world moves from a flat force-picture into a curved geometry where light and motion follow the shape of space itself.",
    worldChange:
      "The world contracts into a deeper well: lensing grows, orbital bands tighten, and the scene reads as curvature rather than pull.",
    confidence: 0.97,
    quickView: "See paths bow inward as spacetime curvature takes over.",
    mechanismView: "Watch curvature, lensing, and orbital compression emerge as one connected geometry.",
    cinematicView: "The scene stops behaving like machinery and starts behaving like spacetime.",
    conceptNodes: [
      { id: "curvature", label: "Spacetime Curvature", kind: "law", weight: 0.96, links: ["lensing", "orbits"] },
      { id: "lensing", label: "Gravitational Lensing", kind: "effect", weight: 0.84, links: ["curvature"] },
      { id: "orbits", label: "Orbital Precession", kind: "experiment", weight: 0.74, links: ["curvature"] },
    ],
    simulation: {
      before: {
        label: "Before discovery",
        summary:
          "Gravity is treated mainly as a clean radial pull. Space remains visually simple, and light paths stay close to straight.",
        state: {
          particleCount: 152,
          orbitSpeed: 0.36,
          fieldIntensity: 0.34,
          glowStrength: 0.26,
          instability: 0.1,
          uncertaintyHalo: 0.18,
          colorBias: 0.58,
          brightnessBias: 0.28,
          waveAmplitude: 0.28,
          lensing: 0.14,
          orbitSpread: 0.62,
          ringTilt: 0.1,
          annotations: [
            "Gravity reads as a simple force field.",
            "Light paths remain mostly straight.",
            "Orbital structure stays broad and shallow.",
          ],
        },
      },
      after: {
        label: "After discovery",
        summary:
          "Mass curves spacetime itself. The visible world becomes denser, more compressed, and more geometric as light and matter follow curvature.",
        state: {
          particleCount: 132,
          orbitSpeed: 0.48,
          fieldIntensity: 0.72,
          glowStrength: 0.68,
          instability: 0.16,
          uncertaintyHalo: 0.62,
          colorBias: 0.74,
          brightnessBias: 0.66,
          waveAmplitude: 0.46,
          lensing: 0.88,
          orbitSpread: 0.26,
          ringTilt: 0.22,
          annotations: [
            "Space bends visibly near the mass.",
            "Lensing arcs compress the field.",
            "Orbital trajectories tighten into a deeper well.",
          ],
        },
      },
      mechanism:
        "General relativity rewrites gravity as geometry. The simulation therefore changes not just force strength but the shape of the space particles and light move through.",
      implication:
        "Black holes, lensing, orbital precession, and cosmological structure all become more understandable when gravity is modeled as curvature rather than an invisible pull.",
    },
  },
  {
    id: "physics-higgs",
    slug: "higgs-field",
    subjectId: "physics",
    title: "The Higgs Field",
    shortTitle: "Higgs Field",
    year: "2012",
    scientists: ["CERN ATLAS", "CERN CMS", "Peter Higgs"],
    tagline: "Mass emerges from interaction with an invisible field.",
    summary:
      "The Higgs field changes how particles move through reality. In SciLoop, the world shifts from bright, agile motion into a denser medium with visible resistance and weight.",
    worldChange:
      "Fast trajectories slow, the halo thickens, and the center stops feeling weightless. The same world gains material presence.",
    confidence: 0.89,
    quickView: "See a light, fast world become slower and more substantial.",
    mechanismView: "Compare how orbit speed, density, and brightness rebalance when particles acquire mass through field interaction.",
    cinematicView: "Reality gains drag, density, and physical presence.",
    conceptNodes: [
      { id: "field", label: "Higgs Field", kind: "law", weight: 0.92, links: ["mass", "boson"] },
      { id: "mass", label: "Mass Acquisition", kind: "effect", weight: 0.86, links: ["field"] },
      { id: "boson", label: "Boson Detection", kind: "experiment", weight: 0.72, links: ["field"] },
    ],
    simulation: {
      before: {
        label: "Before discovery",
        summary:
          "Particles cut through the scene with little resistance. The world feels energetic, radiant, and almost weightless.",
        state: {
          particleCount: 220,
          orbitSpeed: 0.82,
          fieldIntensity: 0.18,
          glowStrength: 0.76,
          instability: 0.42,
          uncertaintyHalo: 0.24,
          colorBias: 0.49,
          brightnessBias: 0.78,
          waveAmplitude: 0.52,
          lensing: 0.14,
          orbitSpread: 0.56,
          ringTilt: 0.26,
          annotations: [
            "Particles move quickly through the scene.",
            "The field offers little visible resistance.",
            "The world looks bright but insubstantial.",
          ],
        },
      },
      after: {
        label: "After discovery",
        summary:
          "Interaction with the Higgs field gives motion more resistance. The world slows, thickens, and takes on a heavier visual character.",
        state: {
          particleCount: 154,
          orbitSpeed: 0.34,
          fieldIntensity: 0.64,
          glowStrength: 0.58,
          instability: 0.18,
          uncertaintyHalo: 0.42,
          colorBias: 0.68,
          brightnessBias: 0.56,
          waveAmplitude: 0.34,
          lensing: 0.24,
          orbitSpread: 0.38,
          ringTilt: 0.18,
          annotations: [
            "Field interaction adds drag and weight.",
            "Particle trajectories slow into steadier paths.",
            "Reality feels denser and more materially anchored.",
          ],
        },
      },
      mechanism:
        "Particles gain mass through interaction with the Higgs field. In the scene, that appears as slower motion, denser halos, and reduced radiative excess.",
      implication:
        "Without the Higgs mechanism, matter would not organize into the stable massive structures that make atoms, stars, planets, and observers possible.",
    },
  },
];
