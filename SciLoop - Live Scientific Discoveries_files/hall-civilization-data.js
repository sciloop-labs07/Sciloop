(function () {
  function makeWikipediaUrl(title) {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(String(title || '').replace(/\s+/g, '_'))}`;
  }

  function createHallProfile(profile) {
    const wikiTitle = profile.wikiTitle || profile.name;
    const impactBreakdown = {
      science: 72,
      engineering: 72,
      influence: 72,
      future: 72,
      ...(profile.impact_breakdown || {})
    };
    const sourceUrls = [
      { label: 'Wikipedia', url: makeWikipediaUrl(wikiTitle) },
      ...(profile.source_urls || [])
    ].filter((item, index, items) => item && item.url && items.findIndex((other) => other.url === item.url) === index);

    const calculatedScore = Math.round(
      (impactBreakdown.science * 0.32)
      + (impactBreakdown.engineering * 0.24)
      + (impactBreakdown.influence * 0.24)
      + (impactBreakdown.future * 0.2)
    );

    return {
      id: profile.id,
      name: profile.name,
      wikiTitle,
      photo: profile.photo || '',
      field: profile.field || 'Frontier science',
      years: profile.years || '',
      era: profile.era || 'modern',
      summaryFallback: profile.summaryFallback || `${profile.name} changed how civilization thinks, builds, or computes.`,
      key_contributions: profile.key_contributions || [],
      major_breakthroughs: profile.major_breakthroughs || [],
      civilization_impact_score: profile.civilization_impact_score || calculatedScore,
      year_of_major_discovery: profile.year_of_major_discovery || '',
      inspirational_quote: profile.inspirational_quote || '',
      innovation_dna: profile.innovation_dna || [],
      impact_breakdown: impactBreakdown,
      timeline: profile.timeline || [],
      source_urls: sourceUrls,
      webSummary: '',
      webPhoto: ''
    };
  }

  const HALL_FRONTIER_SOURCES = [
    { name: 'Nature', field: 'Frontier research', url: 'https://www.nature.com/nature.rss' },
    { name: 'ScienceDaily', field: 'Research journal', url: 'https://www.sciencedaily.com/rss/all.xml' },
    { name: 'MIT Technology Review', field: 'Emerging technology', url: 'https://www.technologyreview.com/feed/' },
    { name: 'arXiv', field: 'AI', url: 'https://export.arxiv.org/rss/cs.AI' },
    { name: 'arXiv', field: 'Biotechnology', url: 'https://export.arxiv.org/rss/q-bio' }
  ];

  const HALL_TIMELINE = [
    {
      year: '1687',
      title: "Newton's Principia",
      blurb: 'Classical mechanics becomes a formal language for the physical world.',
      detail: 'Newton compressed force, motion, and gravity into one mathematical framework, giving civilization a predictive physics engine.',
      focus: 'Mechanics becomes the operating system of engineering.',
      profileId: 'legend_newton'
    },
    {
      year: '1905',
      title: "Einstein's miracle year",
      blurb: 'Relativity, quanta, and Brownian motion reshape modern physics.',
      detail: 'Einstein showed that space, time, light, and matter had to be understood together, not as separate intuitions.',
      focus: 'Conceptual leaps can reorganize entire scientific eras.',
      profileId: 'legend_einstein'
    },
    {
      year: '1947',
      title: 'Transistor era begins',
      blurb: 'Electronics shrink, computation scales, and the modern digital world becomes possible.',
      detail: 'The transistor turned information processing into something manufacturable, portable, and eventually global.',
      focus: 'Miniaturization unlocks civilization-scale computation.'
    },
    {
      year: '1953',
      title: 'DNA structure era',
      blurb: 'Biology becomes readable, writable, and increasingly engineerable.',
      detail: 'Once heredity gained structure, medicine and biotechnology gained a long-term roadmap toward design rather than observation alone.',
      focus: 'Life starts to look like programmable chemistry.'
    },
    {
      year: '1969',
      title: 'Moon landing',
      blurb: 'Systems engineering, rocketry, and computation converge into planetary-scale achievement.',
      detail: 'The Moon landing showed that civilization can coordinate science, manufacturing, software, and ambition at historic scale.',
      focus: 'Complex systems can be aligned toward frontier goals.'
    },
    {
      year: '2012',
      title: 'Deep learning breakthrough',
      blurb: 'Representation learning moves from niche promise to dominant capability.',
      detail: 'Modern AI acceleration was unlocked when large neural networks, data, and compute began outperforming older handcrafted pipelines.',
      focus: 'Computation becomes a discovery multiplier.',
      profileId: 'modern_yoshua_bengio'
    },
    {
      year: '2020s',
      title: 'AI and biotech acceleration',
      blurb: 'Foundation models, protein design, CRISPR, and accelerated compute begin to compress discovery cycles.',
      detail: 'The current frontier is defined by systems that not only analyze knowledge, but help generate new experiments, new designs, and new engineering pathways.',
      focus: 'Civilization enters a more feedback-driven discovery age.',
      profileId: 'modern_demis_hassabis'
    }
  ];

  const HALL_GRAPH_DATA = {
    nodes: [
      { id: 'mechanics', label: 'Mechanics', x: 64, y: 74, detail: 'The mathematical control of motion, force, and structure. Newton made it the backbone of engineering.' },
      { id: 'thermodynamics', label: 'Thermodynamics', x: 180, y: 62, detail: 'Heat, work, energy, and efficiency define the limits of machines and civilization-scale power systems.' },
      { id: 'statistical_mechanics', label: 'Statistical Mechanics', x: 304, y: 110, detail: 'Microscopic randomness becomes macroscopic law, linking matter, energy, and information.' },
      { id: 'information_theory', label: 'Information Theory', x: 424, y: 72, detail: 'Encoding, compression, and uncertainty become a language for communication and computation.' },
      { id: 'computer_architecture', label: 'Computer Architecture', x: 500, y: 194, detail: 'Von Neumann style computing, modern chips, and accelerators turn abstract logic into world infrastructure.' },
      { id: 'machine_learning', label: 'Machine Learning', x: 392, y: 230, detail: 'Learning systems transform information into pattern recognition, prediction, and increasingly autonomous capability.' },
      { id: 'molecular_biology', label: 'Molecular Biology', x: 158, y: 218, detail: 'Once biology became molecular, life itself became a system that could be modeled and engineered.' },
      { id: 'gene_editing', label: 'Gene Editing', x: 274, y: 258, detail: 'Programmable biology turns genomic understanding into intervention, repair, and design.' }
    ],
    edges: [
      ['mechanics', 'thermodynamics'],
      ['thermodynamics', 'statistical_mechanics'],
      ['statistical_mechanics', 'information_theory'],
      ['information_theory', 'computer_architecture'],
      ['computer_architecture', 'machine_learning'],
      ['molecular_biology', 'gene_editing'],
      ['statistical_mechanics', 'machine_learning'],
      ['information_theory', 'machine_learning']
    ]
  };

  const HALL_LEVELS = [
    { level: 1, label: 'Curious Mind', threshold: 0, note: 'You are gathering concepts, building taste, and learning what matters.' },
    { level: 5, label: 'Problem Solver', threshold: 28, note: 'You are moving from interest into repeated action and useful contribution.' },
    { level: 10, label: 'Systems Thinker', threshold: 56, note: 'You can connect multiple domains into one coherent map and work across them.' },
    { level: 20, label: 'Innovator', threshold: 96, note: 'You are producing original ideas, tested solutions, or meaningful platform impact.' },
    { level: 50, label: 'Civilization Builder', threshold: 148, note: 'You are operating at the level where new tools, institutions, or discoveries change the trajectory of others.' }
  ];

  const FUTURE_SLOT_THEMES = [
    'Planetary resilience architect',
    'Fusion systems engineer',
    'AI alignment pioneer',
    'Longevity platform builder',
    'Space infrastructure designer',
    'Clean-energy manufacturing leader',
    'Biology systems inventor',
    'Mathematics of emergence explorer'
  ];

  const HISTORICAL_LEGENDS = [];
  const MODERN_FRONTIER_SEEDS = [];

  const SCIENTIST_WIKI_OVERRIDES_EXTRA = {
    'Jim Keller': 'Jim Keller (engineer)',
    'George Church': 'George Church (geneticist)',
    'David Baker': 'David Baker (biochemist)'
  };

  HISTORICAL_LEGENDS.push(
    createHallProfile({
      id: 'legend_newton',
      name: 'Isaac Newton',
      field: 'Physics / Mathematics',
      years: '1643-1727',
      era: 'history',
      civilization_impact_score: 99,
      year_of_major_discovery: '1687',
      inspirational_quote: 'If I have seen further, it is by standing on the shoulders of giants.',
      summaryFallback: 'Newton unified motion, gravity, optics, and calculus into a mathematical framework for the physical world.',
      key_contributions: ['Laws of motion', 'Universal gravitation', 'Calculus foundations', 'Optics and prism experiments'],
      major_breakthroughs: ['1687 - Principia formalizes classical mechanics', '1666 - Fluxions and early calculus work', '1704 - Opticks turns light into experiment-backed theory'],
      innovation_dna: ['Mathematical compression', 'Deep abstraction', 'Theory fused with experiment'],
      impact_breakdown: { science: 100, engineering: 84, influence: 100, future: 97 },
      timeline: [
        { year: '1666', title: 'Calculus and optics notebooks', detail: 'Newton begins inventing new mathematics while studying light and color.' },
        { year: '1687', title: 'Principia', detail: 'Motion and gravitation become one coherent predictive framework.' },
        { year: '1704', title: 'Opticks', detail: 'A new model of light, color, and experimental method reshapes physics.' }
      ]
    }),
    createHallProfile({
      id: 'legend_einstein',
      name: 'Albert Einstein',
      field: 'Physics',
      years: '1879-1955',
      era: 'history',
      civilization_impact_score: 99,
      year_of_major_discovery: '1905',
      inspirational_quote: 'Imagination is more important than knowledge.',
      summaryFallback: 'Einstein reorganized physics around relativity, quanta, and the deep structure of spacetime.',
      key_contributions: ['Special relativity', 'General relativity', 'Photoelectric effect', 'Brownian motion explanation'],
      major_breakthroughs: ['1905 - Special relativity and mass-energy equivalence', '1915 - General relativity', '1921 - Nobel Prize for the photoelectric effect'],
      innovation_dna: ['Thought experiments', 'Conceptual clarity', 'Mathematical intuition'],
      impact_breakdown: { science: 100, engineering: 70, influence: 99, future: 98 },
      timeline: [
        { year: '1905', title: 'Miracle year papers', detail: 'Einstein remaps light, motion, atoms, and time in a single burst of work.' },
        { year: '1915', title: 'General relativity', detail: 'Gravity becomes geometry and spacetime becomes dynamic.' },
        { year: '1930s+', title: 'Quantum debates', detail: 'His critiques sharpen the conceptual foundations of modern physics.' }
      ]
    }),
    createHallProfile({
      id: 'legend_tesla',
      name: 'Nikola Tesla',
      field: 'Electrical Engineering / Energy',
      years: '1856-1943',
      era: 'history',
      civilization_impact_score: 95,
      year_of_major_discovery: '1888',
      inspirational_quote: 'The present is theirs; the future is mine.',
      summaryFallback: 'Tesla pushed electricity into an infrastructure age through alternating current systems, motors, and bold high-voltage engineering.',
      key_contributions: ['AC power systems', 'Induction motor', 'High-frequency engineering', 'Wireless power experimentation'],
      major_breakthroughs: ['1888 - AC induction motor', '1891 - Tesla coil', '1890s - Large-scale AC transmission advocacy'],
      innovation_dna: ['First-principles engineering', 'Visionary prototyping', 'Extreme system ambition'],
      impact_breakdown: { science: 79, engineering: 100, influence: 95, future: 91 },
      timeline: [
        { year: '1888', title: 'Induction motor', detail: 'Tesla makes rotating magnetic fields practical for industrial power.' },
        { year: '1891', title: 'Tesla coil', detail: 'High-voltage resonance experiments expand what electrical systems can do.' },
        { year: '1895+', title: 'AC grid era', detail: 'Alternating current wins as the backbone of large electrical networks.' }
      ]
    }),
    createHallProfile({
      id: 'legend_curie',
      name: 'Marie Curie',
      field: 'Physics / Chemistry',
      years: '1867-1934',
      era: 'history',
      civilization_impact_score: 97,
      year_of_major_discovery: '1898',
      inspirational_quote: 'Nothing in life is to be feared; it is only to be understood.',
      summaryFallback: 'Curie transformed radioactivity from anomaly into a new domain of matter, medicine, and measurement.',
      key_contributions: ['Radioactivity research', 'Polonium discovery', 'Radium discovery', 'Medical radiology leadership'],
      major_breakthroughs: ['1898 - Polonium and radium isolation', '1903 - Nobel Prize in Physics', '1911 - Nobel Prize in Chemistry'],
      innovation_dna: ['Experimental endurance', 'Precision measurement', 'Fearless frontier work'],
      impact_breakdown: { science: 98, engineering: 78, influence: 97, future: 94 },
      timeline: [
        { year: '1898', title: 'New radioactive elements', detail: 'Curie identifies polonium and radium, opening a new scientific frontier.' },
        { year: '1903', title: 'Physics Nobel', detail: 'Radioactivity becomes globally recognized as foundational science.' },
        { year: '1910s', title: 'Portable X-ray service', detail: 'Curie helps move radiological tools into real medical practice.' }
      ]
    }),
    createHallProfile({
      id: 'legend_turing',
      name: 'Alan Turing',
      field: 'Computer Science / Mathematics',
      years: '1912-1954',
      era: 'history',
      civilization_impact_score: 97,
      year_of_major_discovery: '1936',
      inspirational_quote: 'We can only see a short distance ahead.',
      summaryFallback: 'Turing made computation a formal concept, helped win a world war, and opened the path toward machine intelligence.',
      key_contributions: ['Universal computation model', 'Codebreaking methods', 'Foundations of AI inquiry', 'Cryptanalytic engineering'],
      major_breakthroughs: ['1936 - Universal Turing machine', '1940s - Bletchley Park codebreaking systems', '1950 - Computing machinery and intelligence'],
      innovation_dna: ['Formal reasoning', 'Algorithmic reduction', 'Crossing theory into machines'],
      impact_breakdown: { science: 95, engineering: 84, influence: 97, future: 100 },
      timeline: [
        { year: '1936', title: 'Computable numbers', detail: 'Turing defines the architecture of general computation.' },
        { year: '1940s', title: 'Wartime cryptanalysis', detail: 'Theory becomes machinery, process, and operational advantage.' },
        { year: '1950', title: 'AI test enters culture', detail: 'The machine intelligence question becomes a serious scientific target.' }
      ]
    }),
    createHallProfile({
      id: 'legend_feynman',
      name: 'Richard Feynman',
      field: 'Physics',
      years: '1918-1988',
      era: 'history',
      civilization_impact_score: 93,
      year_of_major_discovery: '1948',
      inspirational_quote: 'What I cannot create, I do not understand.',
      summaryFallback: 'Feynman translated deep physics into visual reasoning, new calculational tools, and a builder mindset that still inspires engineers.',
      key_contributions: ['Quantum electrodynamics', 'Feynman diagrams', 'Path integrals', 'Early quantum computing vision'],
      major_breakthroughs: ['1948 - Path integral formulation', '1949 - Feynman diagrams spread', '1981 - Quantum simulation challenge'],
      innovation_dna: ['Visual intuition', 'Playful rigor', 'Build-to-understand thinking'],
      impact_breakdown: { science: 95, engineering: 80, influence: 92, future: 94 },
      timeline: [
        { year: '1948', title: 'Path integrals', detail: 'Quantum behavior is reframed as a sum over histories.' },
        { year: '1949', title: 'Diagrammatic physics', detail: 'Complex particle interactions become far more tractable to calculate.' },
        { year: '1981', title: 'Quantum computing seed', detail: 'Feynman points out that nature may require quantum machines to simulate efficiently.' }
      ]
    }),
    createHallProfile({
      id: 'legend_vonneumann',
      name: 'John von Neumann',
      field: 'Mathematics / Computing',
      years: '1903-1957',
      era: 'history',
      civilization_impact_score: 96,
      year_of_major_discovery: '1945',
      inspirational_quote: 'There is no sense in being precise when you do not even know what you are talking about.',
      summaryFallback: 'Von Neumann helped turn mathematics into computation, architecture, game theory, and the systems logic of the modern state.',
      key_contributions: ['Stored-program architecture', 'Game theory', 'Computational mathematics', 'Operations and systems analysis'],
      major_breakthroughs: ['1928 - Minimax theorem', '1945 - Stored-program computer architecture', '1940s-50s - Monte Carlo and systems methods'],
      innovation_dna: ['Systems synthesis', 'Mathematical generality', 'Extreme analytical speed'],
      impact_breakdown: { science: 92, engineering: 96, influence: 96, future: 96 },
      timeline: [
        { year: '1928', title: 'Game theory foundations', detail: 'Strategic interaction becomes a formal mathematical object.' },
        { year: '1945', title: 'Computer architecture memo', detail: 'Digital computing gains a scalable blueprint.' },
        { year: '1950s', title: 'Systems-era mathematics', detail: 'Computation, simulation, and modern control thinking accelerate together.' }
      ]
    })
  );

  MODERN_FRONTIER_SEEDS.push(
    createHallProfile({
      id: 'modern_elon_musk',
      name: 'Elon Musk',
      field: 'Space / Energy / Engineering',
      years: '1971-present',
      era: 'modern',
      civilization_impact_score: 94,
      year_of_major_discovery: '2010s',
      inspirational_quote: 'Reason from first principles.',
      summaryFallback: 'Musk pushed reusable rockets, electric vehicles, and industrial ambition back into mainstream engineering culture.',
      key_contributions: ['Reusable launch systems', 'EV manufacturing scale', 'Battery and energy infrastructure', 'High-ambition engineering execution'],
      major_breakthroughs: ['2015 - Orbital booster landing', '2020 - EV scale reaches global inflection', '2020s - Starship and heavy-lift iteration'],
      innovation_dna: ['First-principles engineering', 'Vertical integration', 'Extreme risk tolerance'],
      impact_breakdown: { science: 68, engineering: 98, influence: 98, future: 97 },
      timeline: [
        { year: '2008', title: 'Falcon 1 reaches orbit', detail: 'Private spaceflight becomes a credible systems-engineering path.' },
        { year: '2015', title: 'Reusable booster landing', detail: 'Rocket economics and cadence begin to change structurally.' },
        { year: '2020s', title: 'Space and energy scale-up', detail: 'Launch, EVs, storage, and manufacturing merge into one industrial platform.' }
      ]
    }),
    createHallProfile({
      id: 'modern_demis_hassabis',
      name: 'Demis Hassabis',
      field: 'Artificial Intelligence',
      years: '1976-present',
      era: 'modern',
      civilization_impact_score: 95,
      year_of_major_discovery: '2020s',
      inspirational_quote: 'Solve intelligence, then use it to solve everything else.',
      summaryFallback: 'Hassabis linked neuroscience, game AI, and research leadership to build systems that learn and accelerate science.',
      key_contributions: ['DeepMind research leadership', 'Game-playing AI breakthroughs', 'AlphaFold platform', 'AI-for-science strategy'],
      major_breakthroughs: ['2016 - AlphaGo', '2020 - AlphaFold 2', '2020s - Frontier AI for scientific discovery'],
      innovation_dna: ['Grand-challenge framing', 'Interdisciplinary synthesis', 'Long-horizon research leadership'],
      impact_breakdown: { science: 93, engineering: 86, influence: 93, future: 99 },
      timeline: [
        { year: '2016', title: 'AlphaGo', detail: 'Deep reinforcement learning becomes a public milestone for strategic intelligence.' },
        { year: '2020', title: 'AlphaFold 2', detail: 'Protein structure prediction becomes dramatically more useful for biology.' },
        { year: '2020s', title: 'AI for science', detail: 'The lab-to-discovery loop tightens around machine learning systems.' }
      ]
    }),
    createHallProfile({
      id: 'modern_yoshua_bengio',
      name: 'Yoshua Bengio',
      field: 'Artificial Intelligence',
      years: '1964-present',
      era: 'modern',
      civilization_impact_score: 94,
      year_of_major_discovery: '2012',
      inspirational_quote: 'We need AI that helps humans flourish.',
      summaryFallback: 'Bengio is one of the central architects of deep learning and a leading voice on safe, beneficial AI.',
      key_contributions: ['Deep representation learning', 'Neural language modeling', 'AI safety leadership', 'Montreal AI ecosystem building'],
      major_breakthroughs: ['2003 - Neural probabilistic language model', '2012 - Deep learning inflection', '2020s - Beneficial AI advocacy'],
      innovation_dna: ['Representation focus', 'Open research culture', 'Long-term safety awareness'],
      impact_breakdown: { science: 95, engineering: 80, influence: 90, future: 98 },
      timeline: [
        { year: '2003', title: 'Language modeling breakthrough', detail: 'Neural nets begin to handle words as learned representations.' },
        { year: '2012', title: 'Deep learning takeoff', detail: 'The wider world recognizes neural networks as a general-purpose paradigm.' },
        { year: '2020s', title: 'Safe AI leadership', detail: 'Capability and safety become inseparable parts of frontier work.' }
      ]
    }),
    createHallProfile({
      id: 'modern_geoffrey_hinton',
      name: 'Geoffrey Hinton',
      field: 'Artificial Intelligence',
      years: '1947-present',
      era: 'modern',
      civilization_impact_score: 95,
      year_of_major_discovery: '2012',
      inspirational_quote: 'Neural networks can discover structure.',
      summaryFallback: 'Hinton advanced backpropagation, representation learning, and the neural methods that ignited modern AI.',
      key_contributions: ['Backpropagation era revival', 'Boltzmann machines', 'Deep belief methods', 'Deep learning evangelism'],
      major_breakthroughs: ['1986 - Backpropagation influence expands', '2012 - ImageNet deep network breakthrough', '2020s - AI risk warnings from an insider'],
      innovation_dna: ['Belief in learning systems', 'Unfashionable persistence', 'Pattern-first reasoning'],
      impact_breakdown: { science: 97, engineering: 79, influence: 92, future: 97 },
      timeline: [
        { year: '1980s', title: 'Connectionist revival', detail: 'Hinton helps keep neural ideas alive when the field is skeptical.' },
        { year: '2012', title: 'ImageNet breakthrough', detail: 'Deep learning becomes impossible for the broader AI field to ignore.' },
        { year: '2020s', title: 'Risk-focused public role', detail: 'A core pioneer warns that capability growth needs stronger safety thinking.' }
      ]
    }),
    createHallProfile({
      id: 'modern_yann_lecun',
      name: 'Yann LeCun',
      field: 'Artificial Intelligence',
      years: '1960-present',
      era: 'modern',
      civilization_impact_score: 93,
      year_of_major_discovery: '1990s',
      inspirational_quote: 'Build systems that learn world models.',
      summaryFallback: 'LeCun made convolutional learning practical and continues pushing self-supervised, world-model based AI.',
      key_contributions: ['Convolutional neural networks', 'Self-supervised learning', 'World-model AI direction', 'Large-scale AI research leadership'],
      major_breakthroughs: ['1990s - CNNs for document recognition', '2010s - Convnet renaissance', '2020s - Self-supervised world-model agenda'],
      innovation_dna: ['Data-efficient learning', 'Architectural pragmatism', 'Model-the-world framing'],
      impact_breakdown: { science: 92, engineering: 84, influence: 88, future: 97 },
      timeline: [
        { year: '1990s', title: 'Practical convnets', detail: 'Neural vision systems begin working reliably on real tasks.' },
        { year: '2010s', title: 'Deep vision dominance', detail: 'Convnets become standard across perception problems.' },
        { year: '2020s', title: 'World-model push', detail: 'The frontier shifts toward richer internal models and less supervision.' }
      ]
    }),
    createHallProfile({
      id: 'modern_feifei_li',
      name: 'Fei-Fei Li',
      wikiTitle: 'Fei-Fei Li',
      field: 'Artificial Intelligence / Computer Vision',
      years: '1976-present',
      era: 'modern',
      civilization_impact_score: 92,
      year_of_major_discovery: '2009',
      inspirational_quote: 'AI must serve humanity.',
      summaryFallback: 'Fei-Fei Li built ImageNet and helped make data-driven computer vision central to modern AI.',
      key_contributions: ['ImageNet creation', 'Human-centered AI advocacy', 'Computer vision leadership', 'AI education and institution building'],
      major_breakthroughs: ['2009 - ImageNet launch', '2012 - ImageNet catalyzes deep vision era', '2020s - Human-centered AI leadership'],
      innovation_dna: ['Scale the dataset', 'Bridge science and society', 'Visual intelligence focus'],
      impact_breakdown: { science: 88, engineering: 82, influence: 92, future: 95 },
      timeline: [
        { year: '2009', title: 'ImageNet', detail: 'Visual recognition gains a benchmark and training corpus large enough to change the field.' },
        { year: '2012', title: 'Vision inflection', detail: 'Deep learning plus ImageNet reshapes the trajectory of computer vision.' },
        { year: '2020s', title: 'Human-centered AI', detail: 'Technical progress is paired with values, governance, and societal framing.' }
      ]
    }),
    createHallProfile({
      id: 'modern_jensen_huang',
      name: 'Jensen Huang',
      field: 'Computing / AI Infrastructure',
      years: '1963-present',
      era: 'modern',
      civilization_impact_score: 94,
      year_of_major_discovery: '2010s',
      inspirational_quote: 'Accelerated computing changes every industry.',
      summaryFallback: 'Huang turned GPUs into the backbone of modern AI, simulation, graphics, and accelerated scientific computing.',
      key_contributions: ['GPU platform leadership', 'CUDA software stack', 'AI infrastructure scaling', 'Accelerated computing evangelism'],
      major_breakthroughs: ['2006 - CUDA', '2010s - GPU becomes AI substrate', '2020s - AI infrastructure at civilization scale'],
      innovation_dna: ['Full-stack platform building', 'Hardware-software co-design', 'Compounding ecosystem strategy'],
      impact_breakdown: { science: 74, engineering: 97, influence: 95, future: 98 },
      timeline: [
        { year: '2006', title: 'CUDA', detail: 'General-purpose GPU programming becomes practical for researchers and engineers.' },
        { year: '2010s', title: 'Deep learning compute era', detail: 'GPUs become the default engine for training large neural networks.' },
        { year: '2020s', title: 'AI factories', detail: 'Compute infrastructure becomes a central lever of technological power.' }
      ]
    })
  );

  MODERN_FRONTIER_SEEDS.push(
    createHallProfile({
      id: 'modern_lisa_su',
      name: 'Lisa Su',
      field: 'Semiconductors / High-Performance Computing',
      years: '1969-present',
      era: 'modern',
      civilization_impact_score: 90,
      year_of_major_discovery: '2017',
      inspirational_quote: 'Focus on execution and the rest follows.',
      summaryFallback: 'Su led a high-impact semiconductor turnaround and reopened competition in CPUs, GPUs, and high-performance computing.',
      key_contributions: ['Zen architecture era leadership', 'High-performance CPU resurgence', 'Advanced packaging strategy', 'Broader access to compute competition'],
      major_breakthroughs: ['2017 - Zen architecture scale-up', '2019+ - High-performance chiplet momentum', '2020s - HPC and AI platform expansion'],
      innovation_dna: ['Execution discipline', 'Architecture bets', 'Relentless focus on product cadence'],
      impact_breakdown: { science: 66, engineering: 94, influence: 87, future: 91 },
      timeline: [
        { year: '2017', title: 'Zen era launches', detail: 'A new CPU architecture family reopens high-performance competition.' },
        { year: '2019', title: 'Chiplet scale-up', detail: 'Packaging and architecture strategy shift industry cost-performance curves.' },
        { year: '2020s', title: 'HPC and AI expansion', detail: 'The compute stack broadens across data centers, labs, and AI workloads.' }
      ]
    }),
    createHallProfile({
      id: 'modern_andrew_ng',
      name: 'Andrew Ng',
      field: 'Artificial Intelligence / Education',
      years: '1976-present',
      era: 'modern',
      civilization_impact_score: 89,
      year_of_major_discovery: '2010s',
      inspirational_quote: 'AI is the new electricity.',
      summaryFallback: 'Ng scaled machine learning education, applied AI deployment, and practical adoption across industries.',
      key_contributions: ['Online AI education', 'Applied machine learning leadership', 'Computer vision and deep learning influence', 'AI democratization'],
      major_breakthroughs: ['2011 - Large-scale online AI education', '2010s - Applied deep learning leadership', '2020s - Practical enterprise AI platforms'],
      innovation_dna: ['Teach at scale', 'Operationalize ideas', 'Lower barriers to entry'],
      impact_breakdown: { science: 79, engineering: 83, influence: 93, future: 91 },
      timeline: [
        { year: '2011', title: 'Mass AI education', detail: 'Machine learning education reaches a truly global audience.' },
        { year: '2010s', title: 'Practical deep learning', detail: 'Ng helps move AI from papers into products and organizations.' },
        { year: '2020s', title: 'Broader adoption layer', detail: 'The focus shifts toward workflows, tooling, and business integration.' }
      ]
    }),
    createHallProfile({
      id: 'modern_sam_altman',
      name: 'Sam Altman',
      field: 'Artificial Intelligence / Platforms',
      years: '1985-present',
      era: 'modern',
      civilization_impact_score: 90,
      year_of_major_discovery: '2020s',
      inspirational_quote: 'Make powerful tools broadly useful.',
      summaryFallback: 'Altman became a central platform operator in frontier AI deployment, productization, and ecosystem scaling.',
      key_contributions: ['Frontier AI platform leadership', 'Generative AI deployment at scale', 'Developer ecosystem acceleration', 'AI governance visibility'],
      major_breakthroughs: ['2022 - Mass-market generative AI adoption', '2023 - Platform ecosystem expansion', '2020s - AI infrastructure and product scale'],
      innovation_dna: ['Platform leverage', 'Rapid iteration', 'Market-shaping deployment'],
      impact_breakdown: { science: 60, engineering: 82, influence: 96, future: 94 },
      timeline: [
        { year: '2022', title: 'Consumer AI moment', detail: 'Generative AI becomes a daily-use interface for millions.' },
        { year: '2023', title: 'Developer platform acceleration', detail: 'APIs and product layers spread the capability into many domains.' },
        { year: '2020s', title: 'Compute and policy visibility', detail: 'AI platform leadership becomes entangled with infrastructure and governance.' }
      ]
    }),
    createHallProfile({
      id: 'modern_vitalik_buterin',
      name: 'Vitalik Buterin',
      field: 'Cryptography / Distributed Systems',
      years: '1994-present',
      era: 'modern',
      civilization_impact_score: 88,
      year_of_major_discovery: '2015',
      inspirational_quote: 'Build systems that are open and credible.',
      summaryFallback: 'Buterin created Ethereum and pushed programmable blockchains into a real design space for decentralized computation.',
      key_contributions: ['Ethereum architecture', 'Smart contract ecosystems', 'Cryptoeconomic systems thinking', 'Open governance experiments'],
      major_breakthroughs: ['2015 - Ethereum launch', '2020s - Proof-of-stake transition', 'Ongoing - Layered decentralized infrastructure design'],
      innovation_dna: ['Protocol thinking', 'Public reasoning', 'Systems design under incentives'],
      impact_breakdown: { science: 65, engineering: 85, influence: 89, future: 92 },
      timeline: [
        { year: '2015', title: 'Ethereum launches', detail: 'Blockchains become programmable platforms rather than narrow ledgers.' },
        { year: '2018+', title: 'Scaling and governance era', detail: 'The challenge shifts from invention to sustainable architecture and incentives.' },
        { year: '2022', title: 'Proof-of-stake transition', detail: 'A major public network executes a deep consensus redesign.' }
      ]
    }),
    createHallProfile({
      id: 'modern_jim_keller',
      name: 'Jim Keller',
      field: 'Computer Architecture',
      years: '1958-present',
      era: 'modern',
      civilization_impact_score: 87,
      year_of_major_discovery: '2010s',
      inspirational_quote: 'First understand the problem deeply.',
      summaryFallback: 'Keller helped design multiple influential CPU architectures, shaping performance, efficiency, and modern compute trajectories.',
      key_contributions: ['CPU architecture leadership', 'Microprocessor design across generations', 'High-performance compute strategy', 'Engineering mentorship'],
      major_breakthroughs: ['2000s - K8 influence', '2017 - Zen architecture era impact', '2020s - New AI hardware and systems leadership'],
      innovation_dna: ['Architecture clarity', 'Trade-off mastery', 'Engineer-the-system mindset'],
      impact_breakdown: { science: 58, engineering: 95, influence: 82, future: 90 },
      timeline: [
        { year: '2000s', title: 'K8 and core CPU influence', detail: 'Architectural choices change the performance envelope of mainstream computing.' },
        { year: '2010s', title: 'Zen-era impact', detail: 'Competitive CPU design returns as a major force.' },
        { year: '2020s', title: 'AI hardware leadership', detail: 'Architecture thinking expands toward accelerator-rich future systems.' }
      ]
    }),
    createHallProfile({
      id: 'modern_jennifer_doudna',
      name: 'Jennifer Doudna',
      field: 'Biotechnology',
      years: '1964-present',
      era: 'modern',
      civilization_impact_score: 95,
      year_of_major_discovery: '2012',
      inspirational_quote: 'Rewrite the code of life carefully.',
      summaryFallback: 'Doudna helped turn CRISPR into a programmable gene-editing platform with profound biomedical and civilizational implications.',
      key_contributions: ['CRISPR-Cas9 co-development', 'RNA structure research', 'Genome engineering leadership', 'Biotech policy engagement'],
      major_breakthroughs: ['2012 - CRISPR-Cas9 editing method', '2020 - Nobel Prize in Chemistry', '2020s - Gene editing translation'],
      innovation_dna: ['Molecular precision', 'Curiosity into platform', 'Science-to-society awareness'],
      impact_breakdown: { science: 98, engineering: 84, influence: 92, future: 98 },
      timeline: [
        { year: '2012', title: 'CRISPR breakthrough paper', detail: 'Gene editing becomes dramatically more programmable and accessible.' },
        { year: '2020', title: 'Nobel recognition', detail: 'The wider scientific world marks genome editing as foundational.' },
        { year: '2020s', title: 'Clinical translation era', detail: 'Gene editing moves deeper into therapy, agriculture, and platform biology.' }
      ]
    }),
    createHallProfile({
      id: 'modern_emmanuelle_charpentier',
      name: 'Emmanuelle Charpentier',
      field: 'Biotechnology',
      years: '1968-present',
      era: 'modern',
      civilization_impact_score: 94,
      year_of_major_discovery: '2012',
      inspirational_quote: 'Curiosity opens new biology.',
      summaryFallback: 'Charpentier helped transform bacterial immune mechanisms into one of the most important engineering tools in modern biology.',
      key_contributions: ['CRISPR-Cas9 co-development', 'Bacterial RNA mechanism research', 'Genome editing platform science', 'Biotechnology leadership'],
      major_breakthroughs: ['2011-2012 - tracrRNA and CRISPR mechanism work', '2012 - Programmable gene editing framework', '2020 - Nobel Prize in Chemistry'],
      innovation_dna: ['Mechanism-first biology', 'Cross-lab collaboration', 'Translate discovery into tool'],
      impact_breakdown: { science: 97, engineering: 82, influence: 89, future: 97 },
      timeline: [
        { year: '2011', title: 'CRISPR mechanism clarification', detail: 'A bacterial defense system becomes legible enough to engineer.' },
        { year: '2012', title: 'Editing platform emerges', detail: 'A biological mechanism becomes a general tool for genome intervention.' },
        { year: '2020s', title: 'Biology platform era', detail: 'Editing, screening, and translational use expand rapidly.' }
      ]
    })
  );

  MODERN_FRONTIER_SEEDS.push(
    createHallProfile({
      id: 'modern_george_church',
      name: 'George Church',
      field: 'Genomics / Synthetic Biology',
      years: '1954-present',
      era: 'modern',
      civilization_impact_score: 91,
      year_of_major_discovery: '2000s',
      inspirational_quote: 'Read, write, and edit genomes.',
      summaryFallback: 'Church advanced large-scale genomics, synthetic biology, and genome engineering with unusually broad frontier reach.',
      key_contributions: ['Next-generation genomics influence', 'Synthetic biology vision', 'Genome engineering platforms', 'Biological systems design'],
      major_breakthroughs: ['2000s - High-throughput genomics leadership', '2010s - Large-scale genome engineering', '2020s - Synthetic biology moonshots'],
      innovation_dna: ['Scale the biology stack', 'Platform ecosystems', 'Long-range scientific daring'],
      impact_breakdown: { science: 91, engineering: 86, influence: 85, future: 96 },
      timeline: [
        { year: '2000s', title: 'Genomics at scale', detail: 'Sequencing and biological data generation accelerate rapidly.' },
        { year: '2010s', title: 'Genome engineering expansion', detail: 'Church pushes from reading DNA toward writing and redesigning it.' },
        { year: '2020s', title: 'Synthetic biology frontier', detail: 'The field leans toward complete systems rather than isolated edits.' }
      ]
    }),
    createHallProfile({
      id: 'modern_david_baker',
      name: 'David Baker',
      field: 'Biotechnology / Protein Design',
      years: '1962-present',
      era: 'modern',
      civilization_impact_score: 93,
      year_of_major_discovery: '2020s',
      inspirational_quote: 'Design proteins that nature never tried.',
      summaryFallback: 'Baker pioneered protein design and structure prediction methods that turn biology into a designable engineering space.',
      key_contributions: ['Rosetta platform', 'Protein structure prediction', 'De novo protein design', 'AI-guided molecular engineering'],
      major_breakthroughs: ['2000s - Rosetta influence expands', '2010s - De novo protein design matures', '2020s - AI-accelerated protein engineering'],
      innovation_dna: ['Search the design space', 'Computation-guided biology', 'Tool-building for communities'],
      impact_breakdown: { science: 95, engineering: 87, influence: 85, future: 97 },
      timeline: [
        { year: '2000s', title: 'Rosetta ecosystem', detail: 'Protein structure and design become more computationally tractable.' },
        { year: '2010s', title: 'De novo proteins', detail: 'Researchers begin designing proteins with functions nature did not previously explore.' },
        { year: '2020s', title: 'AI-plus-design era', detail: 'Protein design becomes a faster and more generative frontier.' }
      ]
    }),
    createHallProfile({
      id: 'modern_ilya_sutskever',
      name: 'Ilya Sutskever',
      field: 'Artificial Intelligence',
      years: '1985-present',
      era: 'modern',
      civilization_impact_score: 93,
      year_of_major_discovery: '2010s',
      inspirational_quote: 'Scale reveals surprising capability.',
      summaryFallback: 'Sutskever helped scale deep learning from sequence modeling into the frontier foundation-model era.',
      key_contributions: ['Sequence learning breakthroughs', 'Large-model scaling', 'Generative model leadership', 'Frontier AI research direction'],
      major_breakthroughs: ['2014 - Sequence-to-sequence learning', '2010s - Large-scale deep learning research leadership', '2020s - Frontier foundation-model strategy'],
      innovation_dna: ['Believe in scaling', 'Long-range model intuition', 'Research taste for capability'],
      impact_breakdown: { science: 90, engineering: 85, influence: 88, future: 97 },
      timeline: [
        { year: '2014', title: 'Seq2seq milestone', detail: 'Neural networks become much more capable at flexible sequence transformation.' },
        { year: '2010s', title: 'Scaling era acceleration', detail: 'Larger data, larger compute, and larger models begin compounding together.' },
        { year: '2020s', title: 'Foundation-model frontier', detail: 'The emphasis shifts from narrow benchmarks to general capability stacks.' }
      ]
    }),
    createHallProfile({
      id: 'modern_nima_arkanihamed',
      name: 'Nima Arkani-Hamed',
      wikiTitle: 'Nima Arkani-Hamed',
      field: 'Theoretical Physics',
      years: '1972-present',
      era: 'modern',
      civilization_impact_score: 88,
      year_of_major_discovery: '2000s',
      inspirational_quote: 'Beauty can be a compass in physics.',
      summaryFallback: 'Arkani-Hamed developed influential ideas in high-energy physics and new mathematical frameworks for particle interactions.',
      key_contributions: ['Beyond-standard-model theory', 'Extra-dimension and hierarchy ideas', 'Scattering amplitudes revolution', 'Mathematical reframing of particle physics'],
      major_breakthroughs: ['Late 1990s - Hierarchy problem frameworks', '2010s - Amplituhedron-era influence', 'Ongoing - Fundamental structure of quantum field theory'],
      innovation_dna: ['Mathematical elegance', 'Conceptual audacity', 'Search for deeper structure'],
      impact_breakdown: { science: 94, engineering: 44, influence: 78, future: 91 },
      timeline: [
        { year: '1998', title: 'Hierarchy problem momentum', detail: 'New ideas challenge how fundamental scales should be understood.' },
        { year: '2010s', title: 'Scattering amplitudes shift', detail: 'Particle calculations gain radically cleaner mathematical descriptions.' },
        { year: '2020s', title: 'Foundations frontier', detail: 'The field keeps pushing toward more geometric and less brute-force formulations.' }
      ]
    }),
    createHallProfile({
      id: 'modern_juan_maldacena',
      name: 'Juan Maldacena',
      field: 'Theoretical Physics',
      years: '1968-present',
      era: 'modern',
      civilization_impact_score: 90,
      year_of_major_discovery: '1997',
      inspirational_quote: 'Geometry and quantum theory are deeply linked.',
      summaryFallback: 'Maldacena connected gravity and quantum field theory through AdS/CFT, reshaping modern theoretical physics.',
      key_contributions: ['AdS/CFT correspondence', 'Quantum gravity insights', 'Gauge-gravity duality influence', 'Foundational string theory impact'],
      major_breakthroughs: ['1997 - AdS/CFT correspondence', '2000s - Gauge-gravity duality expansion', 'Ongoing - Quantum gravity foundations'],
      innovation_dna: ['Deep duality thinking', 'Mathematical intuition', 'Link distant domains'],
      impact_breakdown: { science: 97, engineering: 32, influence: 82, future: 92 },
      timeline: [
        { year: '1997', title: 'AdS/CFT', detail: 'A powerful duality links gravity in higher dimensions with quantum field theory.' },
        { year: '2000s', title: 'Duality expands', detail: 'New tools emerge across string theory, black holes, and strongly coupled systems.' },
        { year: '2020s', title: 'Quantum gravity remains active', detail: 'The correspondence still anchors some of the deepest work on spacetime and information.' }
      ]
    }),
    createHallProfile({
      id: 'modern_frances_arnold',
      name: 'Frances Arnold',
      field: 'Biotechnology / Chemical Engineering',
      years: '1956-present',
      era: 'modern',
      civilization_impact_score: 92,
      year_of_major_discovery: '1990s',
      inspirational_quote: 'Innovation comes from letting evolution search.',
      summaryFallback: 'Arnold made directed evolution a powerful engineering method for enzymes, green chemistry, and biological design.',
      key_contributions: ['Directed evolution', 'Enzyme engineering', 'Sustainable chemistry applications', 'Engineering biology mindset'],
      major_breakthroughs: ['1990s - Directed evolution matures', '2018 - Nobel Prize in Chemistry', '2020s - Enzyme design and sustainable biotech'],
      innovation_dna: ['Iterate with selection', 'Engineer through evolution', 'Pragmatic experimentation'],
      impact_breakdown: { science: 90, engineering: 91, influence: 84, future: 95 },
      timeline: [
        { year: '1990s', title: 'Directed evolution', detail: 'Biological search becomes a practical engineering method.' },
        { year: '2018', title: 'Nobel recognition', detail: 'The field recognizes evolution itself as an engineering engine.' },
        { year: '2020s', title: 'Green chemistry and design', detail: 'Engineered enzymes continue expanding into new industrial roles.' }
      ]
    })
  );

  window.SCILOOP_HALL_DATA = {
    makeWikipediaUrl,
    createHallProfile,
    HALL_FRONTIER_SOURCES,
    HALL_TIMELINE,
    HALL_GRAPH_DATA,
    HALL_LEVELS,
    FUTURE_SLOT_THEMES,
    HISTORICAL_LEGENDS,
    MODERN_FRONTIER_SEEDS,
    SCIENTIST_WIKI_OVERRIDES_EXTRA
  };
})();
