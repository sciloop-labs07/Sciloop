import type {
  MeaningConcept,
  MeaningEngineSubject,
  MeaningEngineSubjectId,
} from "@/lib/types";

export const meaningEngineSubjects: MeaningEngineSubject[] = [
  {
    id: "mathematics",
    label: "Mathematics",
    shortLabel: "Math",
    tagline: "Turn symbols into change, pattern, and prediction.",
    accent: "#7ce7ff",
    glow: "rgba(124, 231, 255, 0.32)",
    symbol: "∂",
  },
  {
    id: "physics",
    label: "Physics",
    shortLabel: "Physics",
    tagline: "See motion, force, and waves as real behavior.",
    accent: "#8fb6ff",
    glow: "rgba(143, 182, 255, 0.32)",
    symbol: "g",
  },
  {
    id: "chemistry",
    label: "Chemistry",
    shortLabel: "Chem",
    tagline: "Watch matter rearrange, react, and become useful.",
    accent: "#8ff4cf",
    glow: "rgba(143, 244, 207, 0.3)",
    symbol: "H2O",
  },
  {
    id: "biology",
    label: "Biology",
    shortLabel: "Bio",
    tagline: "Connect life processes to cells, genes, and survival.",
    accent: "#9de98f",
    glow: "rgba(157, 233, 143, 0.28)",
    symbol: "DNA",
  },
  {
    id: "economics",
    label: "Economics",
    shortLabel: "Econ",
    tagline: "Translate markets and money into human choices.",
    accent: "#f3c88d",
    glow: "rgba(243, 200, 141, 0.28)",
    symbol: "$",
  },
  {
    id: "geography",
    label: "Geography",
    shortLabel: "Geo",
    tagline: "Read planet systems instead of memorizing places.",
    accent: "#9cc7ff",
    glow: "rgba(156, 199, 255, 0.3)",
    symbol: "⛰",
  },
];

export const meaningEngineConcepts: MeaningConcept[] = [
  // Mathematics
  {
    id: "math-derivatives",
    subject: "mathematics",
    conceptName: "Derivatives",
    essence: "The derivative measures how fast something changes right now.",
    simpleMeaning: "It is the speed of change at one exact moment.",
    symbolToReality: "dy/dx -> how steep the change is right here, not across the whole graph.",
    whyItExists:
      "Humans needed a way to predict motion, growth, and turning points instead of only comparing before and after values.",
    discoveredBy: [
      { name: "Madhava of Sangamagrama", role: "early infinite-series pioneer", era: "c. 14th century" },
      { name: "Isaac Newton", role: "motion and fluxions", era: "1660s" },
      { name: "Gottfried Wilhelm Leibniz", role: "symbolic calculus notation", era: "1670s" },
    ],
    timeline: [
      {
        year: "c. 1400",
        label: "Kerala groundwork",
        detail: "Infinite-series thinking begins to make continuous change calculable.",
      },
      {
        year: "1666",
        label: "Newton studies motion",
        detail: "Change becomes a tool for tracking moving bodies and falling objects.",
      },
      {
        year: "1675",
        label: "Leibniz writes dx and dy",
        detail: "Compact notation makes calculus easier to teach, share, and extend.",
      },
    ],
    realWorldExamples: [
      { label: "Car speedometer", context: "instant speed is a derivative of distance" },
      { label: "Rocket guidance", context: "course correction needs local slope and change" },
      { label: "Disease growth curves", context: "public-health teams track how fast spread is rising" },
    ],
    impact: [
      { label: "Engineering design", detail: "Bridges, engines, and circuits rely on local change models." },
      { label: "Modern AI training", detail: "Gradient descent uses derivatives to reduce error." },
      { label: "Physics prediction", detail: "Motion, fields, and waves become computable." },
    ],
    futureInnovation: [
      { label: "Adaptive medical twins", detail: "Live derivatives could track organ change in real time." },
      { label: "Safer autonomous systems", detail: "Vehicles can respond earlier when they detect change sooner." },
      { label: "Climate tipping alerts", detail: "Derivative-based warning systems can flag rapid shifts faster." },
    ],
    examTranslation: {
      exam: "Differentiate y = x^2",
      meaning: "Tell me how the steepness of this curve changes as x moves.",
    },
    visualMode: "derivative-slope",
  },
  {
    id: "math-probability",
    subject: "mathematics",
    conceptName: "Probability",
    essence: "Probability measures how likely different futures are.",
    simpleMeaning: "It is math for uncertainty, risk, and chance.",
    symbolToReality: "P(event) -> the share of possible futures where that event happens.",
    whyItExists:
      "People needed a rational way to make decisions when outcomes were uncertain, from games to insurance to science.",
    discoveredBy: [
      { name: "Gerolamo Cardano", role: "early chance analysis", era: "1500s" },
      { name: "Blaise Pascal", role: "formal probability problems", era: "1654" },
      { name: "Pierre de Fermat", role: "correspondence on expected outcomes", era: "1654" },
    ],
    timeline: [
      {
        year: "1564",
        label: "Cardano writes on games",
        detail: "Chance starts being counted instead of guessed.",
      },
      {
        year: "1654",
        label: "Pascal and Fermat",
        detail: "A gambling problem pushes probability into formal mathematics.",
      },
      {
        year: "1700s",
        label: "Risk enters society",
        detail: "Insurance, statistics, and forecasting begin scaling with probability.",
      },
    ],
    realWorldExamples: [
      { label: "Weather forecasts", context: "rain percentages express uncertain futures" },
      { label: "Medical testing", context: "doctors estimate false positives and true risk" },
      { label: "Finance", context: "investors compare likely reward against likely loss" },
    ],
    impact: [
      { label: "Insurance systems", detail: "Large groups can share risk because uncertainty became measurable." },
      { label: "Scientific experiments", detail: "Data confidence and significance depend on probability." },
      { label: "Machine learning", detail: "Models classify, predict, and rank with probabilistic reasoning." },
    ],
    futureInnovation: [
      { label: "Personalized risk engines", detail: "Health and safety tools can model risk per person, not only per population." },
      { label: "Smarter disaster planning", detail: "Probability can guide earlier action for floods, fires, and heat." },
      { label: "Trustworthy AI decisions", detail: "Systems can show uncertainty instead of pretending to be fully sure." },
    ],
    examTranslation: {
      exam: "Find the probability of drawing a red ball",
      meaning: "Compare how many futures end with red to how many futures exist overall.",
    },
    visualMode: "probability-field",
  },

  // Physics
  {
    id: "physics-gravity",
    subject: "physics",
    conceptName: "Gravity",
    essence: "Gravity is the rule that makes mass pull mass.",
    simpleMeaning: "It explains falling, orbiting, and weight.",
    symbolToReality: "F = Gm1m2/r^2 -> bigger masses pull more, and distance weakens the pull.",
    whyItExists:
      "Humans needed one rule that explains why stones fall, moons orbit, and planets stay in ordered paths.",
    discoveredBy: [
      { name: "Galileo Galilei", role: "falling-body evidence", era: "1600s" },
      { name: "Johannes Kepler", role: "planetary orbit laws", era: "1609-1619" },
      { name: "Isaac Newton", role: "universal gravitation", era: "1687" },
    ],
    timeline: [
      {
        year: "1604",
        label: "Falling bodies studied",
        detail: "Motion on Earth becomes measurable rather than purely philosophical.",
      },
      {
        year: "1609",
        label: "Kepler maps orbits",
        detail: "Planet motion gains mathematical regularity.",
      },
      {
        year: "1687",
        label: "Newton unifies the rule",
        detail: "The same law now explains apples and planets together.",
      },
    ],
    realWorldExamples: [
      { label: "Satellites", context: "gravity keeps them in orbit" },
      { label: "Ocean tides", context: "the Moon and Sun pull Earth's water" },
      { label: "Human movement", context: "jumping, lifting, and balance always fight gravity" },
    ],
    impact: [
      { label: "Space travel", detail: "Launch windows, orbits, and missions depend on gravity models." },
      { label: "Civil engineering", detail: "Load, fall, and structural safety calculations use gravity." },
      { label: "Planet science", detail: "Gravity reveals how stars, planets, and galaxies organize." },
    ],
    futureInnovation: [
      { label: "More efficient orbital traffic", detail: "Better gravity use can lower fuel for satellites and missions." },
      { label: "Asteroid deflection planning", detail: "Precise gravity models can improve planetary defense." },
      { label: "Habitat design beyond Earth", detail: "Future stations need smarter control of low-gravity living." },
    ],
    examTranslation: {
      exam: "State Newton's law of gravitation",
      meaning: "Everything with mass pulls other mass, so falling and orbiting follow one shared rule.",
    },
    visualMode: "gravity-orbit",
  },
  {
    id: "physics-waves",
    subject: "physics",
    conceptName: "Waves",
    essence: "A wave is a traveling disturbance that carries energy.",
    simpleMeaning: "Something wiggles here and the effect moves there.",
    symbolToReality: "v = f lambda -> wave speed links rhythm and spacing.",
    whyItExists:
      "People needed to explain light, sound, water motion, signals, and how energy can travel without matter moving with it.",
    discoveredBy: [
      { name: "Christiaan Huygens", role: "wave model of light", era: "1678" },
      { name: "Thomas Young", role: "interference evidence", era: "1801" },
      { name: "James Clerk Maxwell", role: "electromagnetic waves", era: "1860s" },
    ],
    timeline: [
      {
        year: "1678",
        label: "Huygens wave principle",
        detail: "Wavefronts become a way to model spreading motion.",
      },
      {
        year: "1801",
        label: "Young shows interference",
        detail: "Light behaves like overlapping waves, not only straight particles.",
      },
      {
        year: "1865",
        label: "Maxwell unifies electromagnetism",
        detail: "Light becomes an electromagnetic wave with calculable speed.",
      },
    ],
    realWorldExamples: [
      { label: "Sound in air", context: "pressure waves carry speech and music" },
      { label: "Wi-Fi and radio", context: "electromagnetic waves carry information" },
      { label: "Earthquakes", context: "seismic waves reveal what is inside the Earth" },
    ],
    impact: [
      { label: "Telecommunications", detail: "Radio, fiber optics, and wireless systems are wave engineering." },
      { label: "Medical imaging", detail: "Ultrasound and other techniques read wave behavior." },
      { label: "Signal processing", detail: "Audio, video, and sensor systems all depend on wave analysis." },
    ],
    futureInnovation: [
      { label: "Cleaner wireless power", detail: "Wave control could send energy more safely and efficiently." },
      { label: "Better quake warnings", detail: "Faster seismic wave interpretation can save lives." },
      { label: "Precision brain interfaces", detail: "Wave-based sensing may improve noninvasive neural tools." },
    ],
    examTranslation: {
      exam: "Define wavelength and frequency",
      meaning: "Tell me how far apart the pattern is and how fast it repeats.",
    },
    visualMode: "wave-motion",
  },

  // Chemistry
  {
    id: "chemistry-equilibrium",
    subject: "chemistry",
    conceptName: "Chemical Equilibrium",
    essence: "Equilibrium is when forward and reverse reactions balance each other.",
    simpleMeaning: "The change has not stopped, but both sides are trading evenly.",
    symbolToReality: "A + B ⇌ C + D -> matter can move both ways until the rates match.",
    whyItExists:
      "Chemists needed to explain why many reactions never go fully one way and how temperature or pressure can shift outcomes.",
    discoveredBy: [
      { name: "Claude Louis Berthollet", role: "reversible reactions", era: "1803" },
      { name: "Cato Guldberg", role: "law of mass action", era: "1864" },
      { name: "Peter Waage", role: "law of mass action", era: "1864" },
    ],
    timeline: [
      {
        year: "1803",
        label: "Reversibility noticed",
        detail: "Chemists realize reactions can push in both directions.",
      },
      {
        year: "1864",
        label: "Mass action law",
        detail: "Reaction balance becomes mathematical and predictive.",
      },
      {
        year: "1884",
        label: "Le Chatelier shift logic",
        detail: "Disturb a system and equilibrium moves to resist the change.",
      },
    ],
    realWorldExamples: [
      { label: "Blood chemistry", context: "body pH control depends on equilibrium systems" },
      { label: "Ammonia production", context: "industry shifts equilibrium to make fertilizer" },
      { label: "Carbonated drinks", context: "gas dissolving in liquid follows equilibrium behavior" },
    ],
    impact: [
      { label: "Industrial chemistry", detail: "Factories optimize yield by shifting pressure, heat, and concentration." },
      { label: "Medicine", detail: "Drug behavior and body buffering depend on equilibrium understanding." },
      { label: "Environmental science", detail: "Ocean carbon chemistry and pollution reactions can be modeled." },
    ],
    futureInnovation: [
      { label: "Greener reactors", detail: "Finer equilibrium control can reduce waste and energy use." },
      { label: "Better carbon capture", detail: "Balanced chemical systems may trap CO2 more efficiently." },
      { label: "Responsive smart materials", detail: "Materials that shift state on demand can use equilibrium tuning." },
    ],
    examTranslation: {
      exam: "State Le Chatelier's principle",
      meaning: "When you disturb a balanced reaction, it shifts to push back against that disturbance.",
    },
    visualMode: "equilibrium-shift",
  },
  {
    id: "chemistry-catalysis",
    subject: "chemistry",
    conceptName: "Catalysis",
    essence: "A catalyst helps a reaction happen faster without being used up.",
    simpleMeaning: "It opens an easier path for change.",
    symbolToReality: "Catalyst -> lower energy hill, faster reaction route.",
    whyItExists:
      "Many useful reactions are too slow or too energy-hungry, so chemistry needed a way to speed them up efficiently.",
    discoveredBy: [
      { name: "Jons Jacob Berzelius", role: "named catalysis", era: "1835" },
      { name: "Wilhelm Ostwald", role: "reaction-rate theory", era: "1894" },
      { name: "Nature's enzymes", role: "biological catalysis model", era: "ancient life" },
    ],
    timeline: [
      {
        year: "1835",
        label: "Catalysis named",
        detail: "Chemists identify substances that accelerate change without vanishing.",
      },
      {
        year: "1894",
        label: "Rate theory develops",
        detail: "Catalysts become understood through reaction speed and energy barriers.",
      },
      {
        year: "1909",
        label: "Haber process scales",
        detail: "Catalysts help transform industry and food production.",
      },
    ],
    realWorldExamples: [
      { label: "Car catalytic converters", context: "toxic gases are converted into safer ones" },
      { label: "Digestive enzymes", context: "your body speeds reactions at body temperature" },
      { label: "Fertilizer plants", context: "catalysts make large-scale ammonia production possible" },
    ],
    impact: [
      { label: "Food systems", detail: "Catalysis helped scale fertilizer and global crop yield." },
      { label: "Cleaner industry", detail: "Catalysts lower energy cost and reduce pollution." },
      { label: "Biotechnology", detail: "Enzyme catalysis powers diagnostics and manufacturing." },
    ],
    futureInnovation: [
      { label: "Low-temperature green chemistry", detail: "New catalysts could cut factory emissions sharply." },
      { label: "Plastic-to-value conversion", detail: "Catalysts may turn waste into useful molecules." },
      { label: "Artificial enzyme design", detail: "Custom catalysts could unlock faster medicine production." },
    ],
    examTranslation: {
      exam: "What is a catalyst?",
      meaning: "It is a helper that makes change easier without becoming the final product.",
    },
    visualMode: "catalyst-energy",
  },

  // Biology
  {
    id: "biology-cell-membrane",
    subject: "biology",
    conceptName: "Cell Membrane",
    essence: "The cell membrane is a smart boundary, not a dead wall.",
    simpleMeaning: "It decides what enters, leaves, and signals the cell.",
    symbolToReality: "Selective permeability -> some things pass, some are blocked, some need gates.",
    whyItExists:
      "Life needs a controlled inside space, otherwise useful molecules leak out and harmful things rush in.",
    discoveredBy: [
      { name: "Charles Overton", role: "lipid membrane insight", era: "1890s" },
      { name: "Gorter and Grendel", role: "bilayer proposal", era: "1925" },
      { name: "Singer and Nicolson", role: "fluid mosaic model", era: "1972" },
    ],
    timeline: [
      {
        year: "1895",
        label: "Lipid clue appears",
        detail: "Scientists infer that cell boundaries behave like fats.",
      },
      {
        year: "1925",
        label: "Bilayer proposed",
        detail: "The membrane is modeled as two lipid layers facing opposite ways.",
      },
      {
        year: "1972",
        label: "Fluid mosaic model",
        detail: "Proteins and lipids are understood as a moving, functional surface.",
      },
    ],
    realWorldExamples: [
      { label: "Nerve signaling", context: "ion channels in membranes help neurons fire" },
      { label: "Immune defense", context: "cells use membrane receptors to detect threats" },
      { label: "Drug delivery", context: "medicine must cross membranes to reach targets" },
    ],
    impact: [
      { label: "Medicine design", detail: "Drugs are built around membrane crossing and receptor binding." },
      { label: "Neuroscience", detail: "Membrane voltage explains how signals travel in the body." },
      { label: "Cell engineering", detail: "Synthetic biology depends on membrane control." },
    ],
    futureInnovation: [
      { label: "Smarter drug carriers", detail: "Membrane-aware particles could target cells more precisely." },
      { label: "Artificial cells", detail: "Engineered membranes may support programmable living systems." },
      { label: "Better brain therapies", detail: "Control of ion channels can improve neural treatment." },
    ],
    examTranslation: {
      exam: "Why is the cell membrane selectively permeable?",
      meaning: "Because life survives only if the cell controls what gets in and what gets out.",
    },
    visualMode: "cell-membrane",
  },
  {
    id: "biology-dna-replication",
    subject: "biology",
    conceptName: "DNA Replication",
    essence: "DNA replication is how life copies instructions before making new cells.",
    simpleMeaning: "The cell opens DNA and builds matching strands.",
    symbolToReality: "A pairs with T, C pairs with G -> the code can be copied with matching rules.",
    whyItExists:
      "Organisms need a reliable way to pass biological instructions forward during growth, repair, and reproduction.",
    discoveredBy: [
      { name: "James Watson", role: "double-helix model", era: "1953" },
      { name: "Francis Crick", role: "double-helix model", era: "1953" },
      { name: "Meselson and Stahl", role: "semi-conservative proof", era: "1958" },
    ],
    timeline: [
      {
        year: "1953",
        label: "Double helix published",
        detail: "DNA structure suggests a built-in copying mechanism.",
      },
      {
        year: "1958",
        label: "Copying method proven",
        detail: "Each new DNA molecule keeps one old strand and one new strand.",
      },
      {
        year: "1970s",
        label: "Replication enzymes mapped",
        detail: "Helicase, polymerase, and repair machinery become clearer.",
      },
    ],
    realWorldExamples: [
      { label: "Embryo growth", context: "every new body cell needs copied DNA" },
      { label: "Wound repair", context: "replacement cells rely on accurate replication" },
      { label: "Cancer research", context: "replication errors can trigger dangerous mutations" },
    ],
    impact: [
      { label: "Genetic medicine", detail: "Replication understanding supports diagnostics and gene therapies." },
      { label: "Forensics", detail: "DNA matching depends on stable biological copying." },
      { label: "Biotech manufacturing", detail: "Controlled DNA copying helps produce proteins and vaccines." },
    ],
    futureInnovation: [
      { label: "Error-correcting gene therapies", detail: "Replication-aware tools may repair harmful mutations more safely." },
      { label: "Faster synthetic genomes", detail: "Programmable DNA assembly can scale with better replication control." },
      { label: "Cancer interception", detail: "Earlier replication-fault detection may stop tumors sooner." },
    ],
    examTranslation: {
      exam: "Explain semi-conservative replication",
      meaning: "Each new DNA copy keeps half of the old instruction set so the code stays reliable.",
    },
    visualMode: "dna-replication",
  },

  // Economics
  {
    id: "economics-supply-demand",
    subject: "economics",
    conceptName: "Supply and Demand",
    essence: "Price moves when what people want meets what sellers can offer.",
    simpleMeaning: "Markets are conversations between desire and availability.",
    symbolToReality: "Demand curve + supply curve -> the meeting point sets likely price and quantity.",
    whyItExists:
      "Societies needed a simple way to explain why prices rise, fall, or stabilize when scarcity and desire change.",
    discoveredBy: [
      { name: "Ibn Khaldun", role: "early market reasoning", era: "1300s" },
      { name: "Adam Smith", role: "market coordination", era: "1776" },
      { name: "Alfred Marshall", role: "formal supply-demand curves", era: "1890" },
    ],
    timeline: [
      {
        year: "1377",
        label: "Early market insight",
        detail: "Scarcity, labor, and value begin to be linked in social analysis.",
      },
      {
        year: "1776",
        label: "Market coordination explained",
        detail: "Self-interest and exchange become a system-level idea.",
      },
      {
        year: "1890",
        label: "Curves formalized",
        detail: "Supply and demand become a standard visual language for price movement.",
      },
    ],
    realWorldExamples: [
      { label: "Concert tickets", context: "high demand and low supply push prices up" },
      { label: "Vegetable markets", context: "bumper harvests increase supply and lower prices" },
      { label: "Housing", context: "limited homes in popular cities raise rent" },
    ],
    impact: [
      { label: "Policy design", detail: "Governments forecast shortages, taxes, and subsidies with supply-demand logic." },
      { label: "Business planning", detail: "Firms price products and estimate demand shifts." },
      { label: "Trade analysis", detail: "Economists model how shocks spread through markets." },
    ],
    futureInnovation: [
      { label: "Smarter food distribution", detail: "Real-time supply-demand systems could reduce waste and shortages." },
      { label: "Adaptive city pricing", detail: "Transit and utilities may balance demand more fairly." },
      { label: "Transparent digital markets", detail: "Better market data can reduce panic spikes and hidden manipulation." },
    ],
    examTranslation: {
      exam: "Draw the demand curve",
      meaning: "Show how buyers usually want less when price gets higher.",
    },
    visualMode: "supply-demand",
  },
  {
    id: "economics-inflation",
    subject: "economics",
    conceptName: "Inflation",
    essence: "Inflation is the broad rise of prices over time.",
    simpleMeaning: "Money buys less when prices keep climbing.",
    symbolToReality: "Inflation rate -> how quickly purchasing power is shrinking.",
    whyItExists:
      "People needed a way to explain why salaries, savings, rent, and food costs change across months and years, not just shop to shop.",
    discoveredBy: [
      { name: "Irving Fisher", role: "money and price analysis", era: "early 1900s" },
      { name: "John Maynard Keynes", role: "macro demand insights", era: "1930s" },
      { name: "Milton Friedman", role: "money supply influence", era: "1960s" },
    ],
    timeline: [
      {
        year: "1911",
        label: "Purchasing power studied",
        detail: "Economists begin measuring how money value shifts over time.",
      },
      {
        year: "1936",
        label: "Demand enters macro policy",
        detail: "Spending, employment, and prices become linked at national scale.",
      },
      {
        year: "1963",
        label: "Money supply focus",
        detail: "Inflation is tied more directly to monetary growth and expectations.",
      },
    ],
    realWorldExamples: [
      { label: "Groceries", context: "the same basket of goods costs more over time" },
      { label: "Savings accounts", context: "money loses real value if returns stay below inflation" },
      { label: "Wage bargaining", context: "workers ask for raises to protect purchasing power" },
    ],
    impact: [
      { label: "Central banking", detail: "Interest-rate policy tries to cool or support inflation." },
      { label: "Household planning", detail: "Families decide spending and saving based on expected inflation." },
      { label: "Global markets", detail: "Currencies and bond markets react strongly to inflation data." },
    ],
    futureInnovation: [
      { label: "Faster cost-of-living alerts", detail: "Real-time price tracking can protect households sooner." },
      { label: "Targeted support systems", detail: "Policy tools may adjust aid by local inflation instead of national averages." },
      { label: "Smarter salary contracts", detail: "Automated purchasing-power adjustments could reduce income shocks." },
    ],
    examTranslation: {
      exam: "Define inflation",
      meaning: "It is the process by which the same money buys fewer real things over time.",
    },
    visualMode: "inflation-cycle",
  },

  // Geography
  {
    id: "geography-plate-tectonics",
    subject: "geography",
    conceptName: "Plate Tectonics",
    essence: "Plate tectonics explains why Earth's surface moves, cracks, and builds mountains.",
    simpleMeaning: "The crust is broken into giant moving pieces.",
    symbolToReality: "Plate boundaries -> moving slabs create quakes, volcanoes, trenches, and ranges.",
    whyItExists:
      "Geographers and geologists needed one framework for continents, earthquakes, volcanoes, and ocean-floor patterns.",
    discoveredBy: [
      { name: "Alfred Wegener", role: "continental drift proposal", era: "1912" },
      { name: "Harry Hess", role: "seafloor spreading", era: "1962" },
      { name: "Marie Tharp", role: "ocean-floor mapping", era: "1950s" },
    ],
    timeline: [
      {
        year: "1912",
        label: "Drift proposed",
        detail: "Continents are suggested to have moved from earlier positions.",
      },
      {
        year: "1957",
        label: "Ocean floor mapped",
        detail: "Mid-ocean ridges and trenches reveal a moving planet surface.",
      },
      {
        year: "1967",
        label: "Plate theory accepted",
        detail: "A unified explanation emerges for crustal movement and hazards.",
      },
    ],
    realWorldExamples: [
      { label: "Earthquakes", context: "stress releases where plates lock and slip" },
      { label: "Himalayas", context: "mountains grow where continental plates collide" },
      { label: "Pacific Ring of Fire", context: "volcanoes cluster along active plate edges" },
    ],
    impact: [
      { label: "Hazard planning", detail: "Cities can map risk from faults, tsunamis, and eruptions." },
      { label: "Resource discovery", detail: "Oil, gas, and minerals often connect to tectonic history." },
      { label: "Planet science", detail: "Earth becomes a dynamic system, not a fixed shell." },
    ],
    futureInnovation: [
      { label: "Better quake forecasting", detail: "Dense sensors may read plate stress earlier." },
      { label: "Safer infrastructure maps", detail: "Dynamic tectonic models can improve where we build." },
      { label: "Comparative planet geology", detail: "Tectonic insight can guide how we read Mars and icy moons." },
    ],
    examTranslation: {
      exam: "Explain plate tectonics",
      meaning: "Earth's outer shell is moving in giant pieces, and that motion reshapes the planet.",
    },
    visualMode: "plate-tectonics",
  },
  {
    id: "geography-water-cycle",
    subject: "geography",
    conceptName: "Water Cycle",
    essence: "The water cycle is Earth's recycling system for water.",
    simpleMeaning: "Water keeps moving through air, land, rivers, and life.",
    symbolToReality: "Evaporation -> condensation -> rain -> flow -> repeat.",
    whyItExists:
      "Students and scientists needed a connected way to explain rain, rivers, groundwater, climate, and life support on the planet.",
    discoveredBy: [
      { name: "Ancient civilizations", role: "observed seasonal water movement", era: "antiquity" },
      { name: "Bernard Palissy", role: "rain and groundwater explanation", era: "1580" },
      { name: "Pierre Perrault", role: "measured rainfall and river flow", era: "1674" },
    ],
    timeline: [
      {
        year: "Ancient era",
        label: "Seasonal patterns observed",
        detail: "People connect rain, rivers, farming, and dry periods.",
      },
      {
        year: "1580",
        label: "Modern explanation grows",
        detail: "Rain is recognized as the source feeding springs and streams.",
      },
      {
        year: "1674",
        label: "Water measured",
        detail: "Rainfall and river discharge are compared quantitatively.",
      },
    ],
    realWorldExamples: [
      { label: "Monsoon systems", context: "evaporation and condensation drive seasonal rainfall" },
      { label: "River basins", context: "water collects, flows, and reshapes landscapes" },
      { label: "Human bodies and crops", context: "life depends on the same planetary water movement" },
    ],
    impact: [
      { label: "Agriculture planning", detail: "Crop timing depends on rain, runoff, and soil moisture." },
      { label: "Flood management", detail: "Water-cycle models support reservoirs and early warnings." },
      { label: "Climate science", detail: "Clouds, rain, and heat transport are core climate processes." },
    ],
    futureInnovation: [
      { label: "City-scale water intelligence", detail: "Sensors can reduce flood loss and water waste together." },
      { label: "Precision drought response", detail: "Better cycle models can direct scarce water where it matters most." },
      { label: "Climate adaptation design", detail: "Future buildings and farms can work with local water flows instead of against them." },
    ],
    examTranslation: {
      exam: "Name the stages of the water cycle",
      meaning: "Show how one water molecule keeps traveling through sky, land, rivers, and living systems.",
    },
    visualMode: "water-cycle",
  },
];

export function getMeaningConceptsForSubject(subject: MeaningEngineSubjectId) {
  return meaningEngineConcepts.filter((concept) => concept.subject === subject);
}

export function getMeaningSubject(subject: MeaningEngineSubjectId) {
  return meaningEngineSubjects.find((entry) => entry.id === subject) ?? meaningEngineSubjects[0];
}

export function getMeaningConcept(subject: MeaningEngineSubjectId, conceptId?: string) {
  const subjectConcepts = getMeaningConceptsForSubject(subject);

  if (!conceptId) {
    return subjectConcepts[0];
  }

  return subjectConcepts.find((concept) => concept.id === conceptId) ?? subjectConcepts[0];
}
