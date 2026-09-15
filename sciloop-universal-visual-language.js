(function () {
  'use strict';

  const DEFAULT_WARNING = 'Local rule mode generated this plan. AI refinement can improve nuance when a safe backend is connected.';
  const SUBJECT_FALLBACK = 'applied-reality';
  const PROVIDER_ENDPOINT = 'http://localhost:5050/api/sciloop-ai/universal-visual-plan';

  const subjectSpecs = [
    {
      id: 'biology',
      title: 'Biology',
      icon: 'BIO',
      colorTheme: { primary: '#37f4c9', secondary: '#f8d66d', accent: '#8bf3ff' },
      alphabet: ['DNA helix', 'RNA strand', 'protein chain', 'enzyme', 'cell membrane', 'nucleus', 'mitochondria', 'ribosome', 'neuron', 'immune cell', 'pathogen', 'mutation spark'],
      templates: ['Sequence Template', 'Flow Template', 'Feedback Loop Template', 'Network Template', 'Hierarchy Template', 'Comparison Template', 'Evolution Template', 'Defense Template'],
      examples: ['DNA Replication', 'Protein Synthesis', 'Photosynthesis', 'Cellular Respiration', 'Mitosis', 'Enzyme Catalysis', 'Neuron Firing', 'Immune Response', 'Vaccination Memory', 'Evolution by Natural Selection', 'CRISPR Gene Editing', 'Microbiome Interaction'],
      processes: ['replication', 'transcription', 'translation', 'signaling', 'mutation', 'selection', 'infection', 'immunity', 'transport', 'catalysis', 'energy conversion', 'cell division', 'gene editing', 'growth', 'repair', 'regulation', 'adaptation'],
      laws: ['central dogma', 'homeostasis', 'natural selection', 'inheritance'],
      variables: ['gene expression', 'ATP', 'mutation rate', 'signal strength', 'population fitness'],
      keywords: ['biology', 'cell', 'cells', 'dna', 'rna', 'gene', 'genome', 'protein', 'enzyme', 'immune', 'virus', 'bacteria', 'microbiome', 'neuron', 'synapse', 'organism', 'ecosystem', 'crispr', 'vaccine', 'cancer', 'mitochondria', 'ribosome', 'chloroplast', 'antibody', 'pathogen', 'mutation'],
      newsLogic: 'living entity -> biological mechanism -> outcome for cells, organisms, or ecosystems',
      environment: 'cellular lab'
    },
    {
      id: 'physics',
      title: 'Physics',
      icon: 'PHY',
      colorTheme: { primary: '#70d7ff', secondary: '#f7c95f', accent: '#9aa7ff' },
      alphabet: ['force vector', 'energy packet', 'field line', 'wavefront', 'particle', 'mass body', 'orbit path', 'light ray', 'charge', 'measurement marker', 'potential well', 'spacetime grid'],
      templates: ['Force Diagram', 'Energy Flow', 'Field Interaction', 'Wave Propagation', 'Orbit and Motion', 'State Change', 'Quantum Event', 'Spacetime Curvature'],
      examples: ['Newton Force', 'Gravity Orbit', 'Energy Conservation', 'Electric Field', 'Magnetic Field', 'Wave Interference', 'Thermal Expansion', 'Particle Collision', 'Quantum Measurement', 'Spacetime Curvature'],
      processes: ['force', 'motion', 'acceleration', 'energy transfer', 'field interaction', 'wave propagation', 'measurement', 'collision', 'orbit', 'curvature', 'oscillation', 'conservation'],
      laws: ['newton law', 'conservation of energy', 'maxwell equations', 'wave equation', 'uncertainty principle', 'general relativity'],
      variables: ['mass', 'velocity', 'force', 'energy', 'charge', 'frequency', 'wavelength', 'time', 'field strength'],
      keywords: ['physics', 'force', 'gravity', 'energy', 'field', 'wave', 'particle', 'quantum', 'spacetime', 'relativity', 'electron', 'photon', 'plasma', 'magnetic', 'velocity', 'motion', 'mass'],
      newsLogic: 'physical object or field -> interaction law -> measurable effect',
      environment: 'field simulation lab'
    },
    {
      id: 'mathematics',
      title: 'Mathematics',
      icon: 'SUM',
      colorTheme: { primary: '#7df4ff', secondary: '#ffd166', accent: '#b9fbc0' },
      alphabet: ['number line', 'function curve', 'vector', 'matrix grid', 'graph node', 'geometric shape', 'proof chain', 'limit arrow', 'transformation', 'optimization landscape', 'probability curve'],
      templates: ['Equation Transformation', 'Graph Function', 'Geometry Construction', 'Proof Chain', 'Optimization Landscape', 'Vector Field', 'Matrix Operation'],
      examples: ['Quadratic Equation', 'Derivative as Slope', 'Integral as Area', 'Vectors', 'Matrices', 'Probability Distribution', 'Graph Theory', 'Optimization', 'Limits', 'Symmetry'],
      processes: ['solve', 'differentiate', 'integrate', 'transform', 'prove', 'optimize', 'approximate', 'map', 'compare', 'limit'],
      laws: ['theorem', 'identity', 'axiom', 'proof', 'formula'],
      variables: ['x', 'y', 'function', 'slope', 'area', 'matrix', 'vector', 'probability'],
      keywords: ['math', 'mathematics', 'theorem', 'proof', 'geometry', 'topology', 'algebra', 'calculus', 'derivative', 'integral', 'matrix', 'vector', 'probability', 'statistics', 'optimization', 'equation', 'function', 'graph', 'limit', 'symmetry'],
      newsLogic: 'abstract object -> rule or proof -> transformation -> insight',
      environment: 'abstract geometry space'
    },
    {
      id: 'computer-science',
      title: 'Computer Science',
      icon: 'CS',
      colorTheme: { primary: '#61f2ff', secondary: '#ffcf70', accent: '#b8ffec' },
      alphabet: ['data block', 'variable', 'function', 'memory cell', 'stack', 'queue', 'tree', 'graph', 'algorithm path', 'CPU thread', 'database table', 'network packet'],
      templates: ['Algorithm Flow', 'Data Structure Operation', 'Input Processing Pipeline', 'Memory Model', 'Graph Traversal', 'System Architecture', 'Complexity Comparison'],
      examples: ['Binary Search', 'Sorting', 'Hash Map', 'BFS and DFS', 'Recursion', 'Dynamic Programming', 'Database Indexing', 'Compiler Pipeline', 'Operating System Scheduling', 'Distributed Systems'],
      processes: ['search', 'sort', 'compile', 'schedule', 'traverse', 'store', 'query', 'cache', 'parallelize', 'encrypt', 'optimize'],
      laws: ['complexity', 'big o', 'correctness invariant', 'consistency model'],
      variables: ['input size', 'runtime', 'memory', 'latency', 'throughput', 'state'],
      keywords: ['computer science', 'algorithm', 'software', 'programming', 'computing', 'computation', 'complexity', 'processor', 'compiler', 'database', 'cybersecurity', 'binary search', 'data structure', 'memory', 'network packet', 'distributed', 'runtime', 'code', 'api', 'system'],
      newsLogic: 'input data -> algorithm or system -> output or performance change',
      environment: 'data center algorithm lab'
    },
    {
      id: 'information-theory',
      title: 'Information Theory',
      icon: 'BIT',
      colorTheme: { primary: '#42e8ff', secondary: '#f6d365', accent: '#d6faff' },
      alphabet: ['bit', 'entropy meter', 'channel', 'noisy signal', 'compression block', 'codeword', 'probability distribution', 'message source', 'decoder', 'redundancy shield'],
      templates: ['Signal Channel', 'Compression Flow', 'Noise Correction', 'Entropy Distribution', 'Encoding Decoding', 'Information Bottleneck'],
      examples: ['Entropy', 'Compression', 'Error Correction', 'Shannon Channel', 'Mutual Information', 'Data Transmission', 'Redundancy', 'Source Coding'],
      processes: ['encode', 'decode', 'compress', 'transmit', 'correct', 'measure entropy', 'filter noise', 'preserve information'],
      laws: ['shannon capacity', 'entropy', 'mutual information', 'coding theorem'],
      variables: ['bits', 'noise', 'capacity', 'redundancy', 'probability', 'message length'],
      keywords: ['information theory', 'information', 'entropy', 'compression', 'coding', 'signal', 'noise', 'channel', 'bits', 'data transmission', 'decoder', 'encoder', 'redundancy', 'error correction', 'source coding', 'mutual information', 'capacity', 'message'],
      newsLogic: 'source -> encoding -> noisy channel -> decoding -> information preserved or lost',
      environment: 'signal channel tunnel'
    },
    {
      id: 'thermodynamics',
      title: 'Thermodynamics',
      icon: 'HEAT',
      colorTheme: { primary: '#ffb84d', secondary: '#69e4ff', accent: '#fff3a3' },
      alphabet: ['hot reservoir', 'cold reservoir', 'heat arrow', 'work piston', 'entropy cloud', 'particles', 'pressure gauge', 'temperature field', 'engine cycle', 'energy loss'],
      templates: ['Heat Flow', 'Engine Cycle', 'Entropy Spread', 'State Variable Change', 'Phase Transition', 'Energy Conversion'],
      examples: ['Heat Flows Hot to Cold', 'Carnot Engine', 'Entropy Increase', 'Gas Expansion', 'Phase Change', 'Refrigerator', 'Thermal Equilibrium', 'Energy Dissipation'],
      processes: ['heat flow', 'work output', 'expansion', 'compression', 'phase change', 'dissipation', 'equilibration', 'energy conversion'],
      laws: ['first law', 'second law', 'entropy', 'carnot limit', 'thermal equilibrium'],
      variables: ['temperature', 'pressure', 'volume', 'entropy', 'heat', 'work', 'efficiency'],
      keywords: ['thermodynamics', 'thermal', 'heat', 'energy', 'work', 'efficiency', 'engine', 'temperature', 'phase transition', 'entropy', 'reservoir', 'pressure', 'gas', 'refrigerator', 'dissipation', 'equilibrium'],
      newsLogic: 'energy input -> transformation -> waste or entropy -> useful work or output',
      environment: 'heat engine chamber'
    },
    {
      id: 'statistical-mechanics',
      title: 'Statistical Mechanics',
      icon: 'STAT',
      colorTheme: { primary: '#9ef0ff', secondary: '#ffc86b', accent: '#c8ffda' },
      alphabet: ['particle swarm', 'microstate grid', 'macrostate meter', 'probability cloud', 'distribution curve', 'Boltzmann weight', 'ensemble box', 'phase boundary', 'fluctuation', 'thermal motion'],
      templates: ['Micro to Macro', 'Distribution Evolution', 'Phase Transition', 'Ensemble Comparison', 'Random Motion', 'Emergence Pattern'],
      examples: ['Many Particles Form Temperature', 'Boltzmann Distribution', 'Phase Transition', 'Diffusion', 'Random Walk', 'Thermal Equilibrium', 'Fluctuations', 'Emergence of Pressure'],
      processes: ['sample microstates', 'average motion', 'diffuse', 'fluctuate', 'transition phase', 'thermalize', 'emerge'],
      laws: ['boltzmann distribution', 'partition function', 'ensemble average', 'law of large numbers'],
      variables: ['microstate', 'macrostate', 'temperature', 'probability', 'energy level', 'particle count'],
      keywords: ['statistical mechanics', 'microstate', 'ensemble', 'boltzmann', 'phase transition', 'many-body', 'collective behavior', 'fluctuation', 'macrostate', 'distribution', 'partition function', 'thermal motion', 'diffusion', 'random walk'],
      newsLogic: 'many small units -> statistical pattern -> macroscopic law',
      environment: 'particle swarm chamber'
    },
    {
      id: 'quantum-mechanics',
      title: 'Quantum Mechanics',
      icon: 'Q',
      colorTheme: { primary: '#a78bfa', secondary: '#6ee7f9', accent: '#ffe082' },
      alphabet: ['wavefunction cloud', 'electron', 'photon', 'probability amplitude', 'measurement event', 'energy level', 'superposition marker', 'entanglement link', 'tunneling barrier', 'quantum gate'],
      templates: ['Probability Cloud', 'Measurement Collapse', 'Energy Level Transition', 'Entanglement Network', 'Quantum Circuit', 'Tunneling Barrier', 'Interference Pattern'],
      examples: ['Superposition', 'Measurement', 'Double Slit', 'Entanglement', 'Tunneling', 'Spin', 'Quantum Gate', 'Photon Absorption', 'Quantum Computing', 'Uncertainty'],
      processes: ['superpose', 'measure', 'entangle', 'tunnel', 'interfere', 'transition energy level', 'apply quantum gate', 'collapse'],
      laws: ['uncertainty principle', 'schrodinger equation', 'born rule', 'quantum measurement'],
      variables: ['amplitude', 'phase', 'spin', 'energy level', 'probability', 'qubit'],
      keywords: ['quantum mechanics', 'quantum', 'qubit', 'entanglement', 'superposition', 'wavefunction', 'particle', 'photon', 'electron', 'quantum computing', 'measurement', 'uncertainty', 'spin', 'tunneling', 'double slit', 'interference'],
      newsLogic: 'quantum state -> interaction or measurement -> probabilistic outcome',
      environment: 'quantum probability chamber'
    },
    {
      id: 'relativity',
      title: 'Relativity',
      icon: 'REL',
      colorTheme: { primary: '#80d8ff', secondary: '#ffd27a', accent: '#c5b8ff' },
      alphabet: ['spacetime grid', 'worldline', 'light cone', 'massive object', 'clock', 'observer frame', 'geodesic', 'gravitational wave', 'black hole', 'event horizon'],
      templates: ['Spacetime Curvature', 'Time Dilation', 'Frame Comparison', 'Light Cone', 'Orbit Geodesic', 'Gravitational Wave'],
      examples: ['Time Dilation', 'Length Contraction', 'Speed of Light Limit', 'Mass Curves Spacetime', 'Gravitational Lensing', 'Black Hole', 'Gravitational Waves', 'Twin Paradox'],
      processes: ['curve spacetime', 'dilate time', 'compare frames', 'bend light', 'emit gravitational waves', 'orbit geodesic'],
      laws: ['special relativity', 'general relativity', 'equivalence principle', 'speed of light limit'],
      variables: ['mass', 'spacetime curvature', 'velocity', 'time', 'light path', 'observer frame'],
      keywords: ['relativity', 'spacetime', 'gravity', 'black hole', 'gravitational wave', 'einstein', 'cosmology', 'time dilation', 'light cone', 'event horizon', 'geodesic', 'lensing', 'speed of light', 'worldline'],
      newsLogic: 'observer, frame, or mass -> spacetime geometry -> measured effect',
      environment: 'curved spacetime observatory'
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      icon: 'CHEM',
      colorTheme: { primary: '#7affcf', secondary: '#ffd166', accent: '#80bfff' },
      alphabet: ['atom', 'molecule', 'bond', 'electron shell', 'reaction arrow', 'catalyst', 'solvent', 'ion', 'pH meter', 'energy barrier', 'crystal lattice'],
      templates: ['Reaction Mechanism', 'Bond Formation', 'Molecular Structure', 'Energy Barrier', 'Catalyst Pathway', 'Equilibrium Shift', 'Material Formation'],
      examples: ['Chemical Reaction', 'Covalent Bond', 'Ionic Bond', 'Catalyst', 'Acid Base Reaction', 'Oxidation Reduction', 'Polymerization', 'Molecular Synthesis', 'Crystal Structure', 'Reaction Rate'],
      processes: ['react', 'bond', 'catalyze', 'dissolve', 'ionize', 'oxidize', 'reduce', 'polymerize', 'synthesize', 'shift equilibrium'],
      laws: ['activation energy', 'chemical equilibrium', 'conservation of mass', 'reaction kinetics'],
      variables: ['reactants', 'products', 'pH', 'temperature', 'activation energy', 'concentration'],
      keywords: ['chemistry', 'chemical', 'molecule', 'molecular', 'reaction', 'catalyst', 'catalysis', 'bond', 'polymer', 'synthesis', 'atom', 'ion', 'solvent', 'acid', 'base', 'oxidation', 'reduction', 'reaction rate', 'crystal', 'lattice'],
      newsLogic: 'reactants -> mechanism or pathway -> products or properties',
      environment: 'molecular reaction chamber'
    },
    {
      id: 'evolutionary-theory',
      title: 'Evolutionary Theory',
      icon: 'EVO',
      colorTheme: { primary: '#a7f070', secondary: '#ffd66b', accent: '#74e0ff' },
      alphabet: ['population cluster', 'mutation spark', 'selection filter', 'trait meter', 'fitness landscape', 'branching tree', 'reproduction arrow', 'environment pressure', 'adaptation marker', 'extinction fade'],
      templates: ['Variation Selection', 'Fitness Landscape', 'Evolutionary Tree', 'Population Shift', 'Arms Race', 'Adaptation Cycle'],
      examples: ['Natural Selection', 'Mutation', 'Adaptation', 'Speciation', 'Genetic Drift', 'Sexual Selection', 'Antibiotic Resistance', 'Coevolution', 'Extinction', 'Convergent Evolution'],
      processes: ['mutate', 'select', 'adapt', 'speciate', 'drift', 'reproduce', 'compete', 'coevolve', 'go extinct'],
      laws: ['natural selection', 'inheritance', 'fitness', 'population genetics'],
      variables: ['trait frequency', 'fitness', 'selection pressure', 'mutation rate', 'population size'],
      keywords: ['evolution', 'evolutionary', 'natural selection', 'adaptation', 'species', 'speciation', 'mutation', 'ancestry', 'population genetics', 'genetic drift', 'fitness', 'selection pressure', 'resistance', 'coevolution', 'extinction', 'trait'],
      newsLogic: 'variation -> pressure -> differential survival -> population change',
      environment: 'population landscape'
    },
    {
      id: 'neuroscience',
      title: 'Neuroscience',
      icon: 'BRAIN',
      colorTheme: { primary: '#8cf7ff', secondary: '#e9c46a', accent: '#ff9ed8' },
      alphabet: ['neuron', 'dendrite', 'axon', 'synapse', 'neurotransmitter', 'brain region', 'spike pulse', 'network circuit', 'plasticity marker', 'memory trace'],
      templates: ['Neural Signal', 'Synaptic Transmission', 'Brain Network', 'Learning Plasticity', 'Sensory Processing', 'Memory Formation'],
      examples: ['Neuron Firing', 'Synapse', 'Dopamine', 'Memory', 'Attention', 'Perception', 'Brain Waves', 'Neuroplasticity', 'Neural Circuit', 'Disease Model'],
      processes: ['fire spike', 'transmit signal', 'release neurotransmitter', 'encode memory', 'adapt synapse', 'process sensory input', 'synchronize waves'],
      laws: ['action potential', 'synaptic plasticity', 'hebbian learning', 'neural coding'],
      variables: ['spike rate', 'synaptic strength', 'neurotransmitter level', 'network activity', 'memory trace'],
      keywords: ['neuroscience', 'brain', 'neuron', 'neurons', 'neural', 'synapse', 'memory', 'cortex', 'nervous system', 'depression', 'mental health', 'dopamine', 'axon', 'dendrite', 'neurotransmitter', 'plasticity', 'brain wave', 'attention'],
      newsLogic: 'stimulus or signal -> neural circuit -> behavior or cognition output',
      environment: 'glowing neural network'
    },
    {
      id: 'cognitive-science',
      title: 'Cognitive Science',
      icon: 'MIND',
      colorTheme: { primary: '#b8f7ff', secondary: '#ffd166', accent: '#cdb4db' },
      alphabet: ['perception input', 'attention spotlight', 'working memory buffer', 'concept node', 'decision tree', 'prediction model', 'feedback loop', 'mental model', 'goal state', 'error signal'],
      templates: ['Perception to Action', 'Memory Loop', 'Decision Process', 'Prediction Error', 'Learning Feedback', 'Mental Model Update'],
      examples: ['Attention', 'Memory', 'Learning', 'Decision Making', 'Perception', 'Prediction', 'Cognitive Bias', 'Reasoning', 'Problem Solving', 'Language Comprehension'],
      processes: ['attend', 'remember', 'learn', 'decide', 'predict', 'reason', 'update model', 'compare error', 'comprehend language'],
      laws: ['prediction error', 'working memory limit', 'reinforcement learning', 'bounded rationality'],
      variables: ['attention weight', 'memory load', 'prediction error', 'confidence', 'goal value'],
      keywords: ['cognitive', 'cognition', 'learning', 'reasoning', 'perception', 'language', 'attention', 'decision making', 'psychology', 'working memory', 'mental model', 'prediction', 'bias', 'problem solving', 'comprehension'],
      newsLogic: 'input -> internal model -> prediction or decision -> action or learning',
      environment: 'mental model lab'
    },
    {
      id: 'systems-interaction',
      title: 'Systems & Interaction',
      icon: 'SYS',
      colorTheme: { primary: '#7de7ff', secondary: '#ffda77', accent: '#a7ff83' },
      alphabet: ['system boundary', 'component', 'interaction edge', 'feedback loop', 'input', 'output', 'constraint', 'disturbance', 'controller', 'emergent behavior'],
      templates: ['System Boundary', 'Input Output', 'Feedback Loop', 'Interaction Network', 'Constraint Propagation', 'Emergence Map'],
      examples: ['Feedback Systems', 'Interacting Components', 'Supply Chain', 'Ecosystem', 'Social System', 'Cyber Physical System', 'Disturbance Response', 'Resilience'],
      processes: ['interact', 'feedback', 'constrain', 'disturb', 'adapt', 'coordinate', 'stabilize', 'propagate'],
      laws: ['feedback principle', 'systems boundary', 'resilience', 'coupling'],
      variables: ['input', 'output', 'state', 'constraint', 'disturbance', 'coupling strength'],
      keywords: ['system', 'systems', 'interaction', 'feedback', 'interface', 'interdependence', 'dependency', 'coordination', 'boundary', 'component', 'input', 'output', 'constraint', 'disturbance', 'resilience', 'cyber physical'],
      newsLogic: 'components -> interactions -> feedback -> system level outcome',
      environment: 'interaction systems lab'
    },
    {
      id: 'complex-systems',
      title: 'Complex Systems',
      icon: 'CX',
      colorTheme: { primary: '#84fff2', secondary: '#ffd166', accent: '#ffab91' },
      alphabet: ['agent swarm', 'local rule', 'emergent pattern', 'phase transition', 'network cluster', 'cascade', 'tipping point', 'adaptation', 'self organization', 'nonlinear path'],
      templates: ['Agent Based Emergence', 'Cascade Model', 'Tipping Point', 'Self Organization', 'Multi Scale Interaction', 'Phase Shift'],
      examples: ['Flocking', 'Traffic', 'Markets', 'Ecosystems', 'Immune System', 'Cities', 'Epidemics', 'Social Contagion', 'Emergence', 'Tipping Points'],
      processes: ['follow local rule', 'cascade', 'self organize', 'tip', 'adapt', 'emerge', 'spread', 'cluster'],
      laws: ['emergence', 'nonlinearity', 'self organization', 'criticality'],
      variables: ['agent count', 'coupling', 'threshold', 'feedback strength', 'density'],
      keywords: ['complex system', 'complex systems', 'complexity', 'emergence', 'self-organization', 'self organization', 'agent-based', 'adaptive', 'nonlinear', 'cascade', 'tipping point', 'swarm', 'epidemic', 'traffic', 'cities', 'social contagion'],
      newsLogic: 'many agents plus local rules -> nonlinear emergent global pattern',
      environment: 'agent swarm arena'
    },
    {
      id: 'chaos-theory',
      title: 'Chaos Theory',
      icon: 'CHAOS',
      colorTheme: { primary: '#ff9fb2', secondary: '#7df4ff', accent: '#fff176' },
      alphabet: ['initial condition dot', 'trajectory', 'attractor', 'bifurcation branch', 'sensitivity marker', 'phase space', 'butterfly effect', 'nonlinear equation', 'strange attractor', 'divergence arrow'],
      templates: ['Sensitive Dependence', 'Phase Space Flow', 'Attractor', 'Bifurcation', 'Nonlinear Divergence'],
      examples: ['Butterfly Effect', 'Logistic Map', 'Lorenz Attractor', 'Weather Prediction', 'Nonlinear Dynamics', 'Bifurcation', 'Deterministic Chaos', 'Phase Space'],
      processes: ['diverge', 'iterate', 'bifurcate', 'orbit attractor', 'amplify initial change', 'flow through phase space'],
      laws: ['sensitive dependence', 'nonlinear dynamics', 'deterministic chaos', 'strange attractor'],
      variables: ['initial condition', 'trajectory', 'parameter', 'phase coordinate', 'lyapunov growth'],
      keywords: ['chaos', 'chaos theory', 'chaotic', 'nonlinear dynamics', 'turbulence', 'butterfly effect', 'sensitive dependence', 'fractal', 'attractor', 'bifurcation', 'phase space', 'lorenz', 'logistic map', 'initial conditions'],
      newsLogic: 'small initial change -> nonlinear dynamics -> large divergent outcome',
      environment: 'phase space chamber'
    },
    {
      id: 'network-theory',
      title: 'Network Theory',
      icon: 'NET',
      colorTheme: { primary: '#7df9ff', secondary: '#ffd166', accent: '#b5ead7' },
      alphabet: ['node', 'edge', 'hub', 'cluster', 'bridge', 'centrality meter', 'flow path', 'community', 'network failure', 'diffusion wave'],
      templates: ['Node Link Network', 'Hub Analysis', 'Community Detection', 'Flow Propagation', 'Network Failure', 'Influence Cascade'],
      examples: ['Social Network', 'Brain Network', 'Internet Routing', 'Disease Spread', 'Supply Network', 'Centrality', 'Resilience', 'Network Cascade'],
      processes: ['connect', 'diffuse', 'route', 'cascade', 'fail', 'cluster', 'bridge communities', 'measure centrality'],
      laws: ['graph connectivity', 'centrality', 'small world', 'scale free network'],
      variables: ['node degree', 'edge weight', 'centrality', 'path length', 'flow capacity'],
      keywords: ['network', 'network theory', 'graph', 'node', 'edge', 'connectivity', 'diffusion', 'contagion', 'social network', 'infrastructure', 'hub', 'cluster', 'centrality', 'routing', 'cascade', 'community detection', 'resilience'],
      newsLogic: 'nodes plus links -> flow, centrality, or cascade -> network outcome',
      environment: '3D node edge network world'
    },
    {
      id: 'control-theory',
      title: 'Control Theory',
      icon: 'CTRL',
      colorTheme: { primary: '#72f2ff', secondary: '#ffd166', accent: '#caffbf' },
      alphabet: ['plant system', 'sensor', 'controller', 'actuator', 'reference signal', 'feedback loop', 'error signal', 'stability meter', 'oscillation', 'disturbance'],
      templates: ['Feedback Control Loop', 'Error Correction', 'Stability Response', 'Disturbance Rejection', 'PID Control', 'Autonomous System'],
      examples: ['Thermostat', 'Robot Control', 'Autopilot', 'Feedback Loop', 'PID Controller', 'Stability', 'Error Correction', 'Control Signal', 'Self Driving System'],
      processes: ['sense', 'compare', 'control', 'actuate', 'stabilize', 'reject disturbance', 'correct error', 'oscillate'],
      laws: ['feedback control', 'stability criterion', 'PID control', 'error minimization'],
      variables: ['reference', 'error', 'gain', 'state', 'control signal', 'disturbance'],
      keywords: ['control theory', 'control system', 'feedback control', 'stability', 'controller', 'robotics', 'automation', 'regulation', 'sensor', 'actuator', 'thermostat', 'autopilot', 'pid', 'error signal', 'self-driving', 'autonomous'],
      newsLogic: 'target -> sensor error -> controller action -> corrected system',
      environment: 'robotic control lab'
    },
    {
      id: 'human-systems',
      title: 'Human Systems',
      icon: 'HUM',
      colorTheme: { primary: '#9df6ff', secondary: '#fbd38d', accent: '#ffc8dd' },
      alphabet: ['person node', 'group', 'institution', 'incentive', 'culture signal', 'communication link', 'norm', 'resource flow', 'conflict marker', 'coordination loop'],
      templates: ['Social Interaction', 'Institution Flow', 'Incentive System', 'Coordination Network', 'Conflict Resolution', 'Behavior Feedback'],
      examples: ['Education System', 'Healthcare System', 'City Behavior', 'Coordination', 'Policy Feedback', 'Culture', 'Institutions', 'Collective Action', 'Trust Networks'],
      processes: ['coordinate', 'communicate', 'incentivize', 'allocate resources', 'resolve conflict', 'change norms', 'form trust', 'adapt policy'],
      laws: ['collective action', 'institutional feedback', 'network trust', 'behavioral incentive'],
      variables: ['trust', 'incentive', 'resources', 'communication frequency', 'coordination cost'],
      keywords: ['human systems', 'society', 'social', 'education', 'policy', 'healthcare', 'city', 'urban', 'organization', 'community', 'institution', 'culture', 'incentive', 'coordination', 'trust', 'collective action', 'resource flow'],
      newsLogic: 'humans plus incentives plus institutions -> behavior pattern -> social outcome',
      environment: 'social system observatory'
    },
    {
      id: 'economics',
      title: 'Economics',
      icon: 'ECO',
      colorTheme: { primary: '#8fffd2', secondary: '#ffd166', accent: '#8ecae6' },
      alphabet: ['supply curve', 'demand curve', 'price signal', 'market', 'firm', 'consumer', 'resource', 'trade flow', 'inflation meter', 'productivity engine'],
      templates: ['Supply Demand', 'Resource Allocation', 'Incentive Flow', 'Market Equilibrium', 'Economic Shock', 'Growth Engine', 'Trade Network'],
      examples: ['Supply and Demand', 'Inflation', 'GDP', 'Productivity', 'Interest Rates', 'Scarcity', 'Opportunity Cost', 'Market Failure', 'Innovation Economics', 'Labor Market'],
      processes: ['price adjust', 'trade', 'allocate', 'incentivize', 'shock market', 'grow productivity', 'inflate', 'compete'],
      laws: ['supply and demand', 'equilibrium', 'scarcity', 'opportunity cost', 'market failure'],
      variables: ['price', 'supply', 'demand', 'income', 'cost', 'productivity', 'interest rate'],
      keywords: ['economics', 'market', 'markets', 'incentive', 'cost', 'price', 'productivity', 'trade', 'finance', 'economic', 'inflation', 'gdp', 'interest rates', 'scarcity', 'labor', 'consumer', 'firm', 'supply', 'demand'],
      newsLogic: 'scarcity or incentives -> market behavior -> price or resource outcome',
      environment: 'market flow city'
    },
    {
      id: 'game-theory',
      title: 'Game Theory',
      icon: 'GAME',
      colorTheme: { primary: '#ffc8dd', secondary: '#8ecae6', accent: '#ffd166' },
      alphabet: ['player node', 'strategy branch', 'payoff matrix', 'cooperation link', 'defection marker', 'Nash equilibrium', 'repeated game', 'trust meter', 'mechanism design', 'incentive signal'],
      templates: ['Payoff Matrix', 'Strategy Tree', 'Cooperation Game', 'Prisoners Dilemma', 'Nash Equilibrium', 'Mechanism Design'],
      examples: ['Prisoners Dilemma', 'Nash Equilibrium', 'Auction', 'Voting', 'Bargaining', 'Coordination Game', 'Tragedy of Commons', 'Signaling Game', 'Repeated Game'],
      processes: ['choose strategy', 'compare payoff', 'cooperate', 'defect', 'bargain', 'signal', 'auction', 'reach equilibrium'],
      laws: ['nash equilibrium', 'dominant strategy', 'mechanism design', 'payoff optimization'],
      variables: ['players', 'strategies', 'payoffs', 'trust', 'information', 'equilibrium'],
      keywords: ['game theory', 'strategy', 'strategic', 'cooperation', 'competition', 'equilibrium', 'auction', 'incentive design', 'payoff', 'player', 'nash', 'bargaining', 'voting', 'coordination game', 'signaling game', 'repeated game'],
      newsLogic: 'players plus strategies plus payoffs -> equilibrium or outcome',
      environment: 'strategy arena'
    },
    {
      id: 'applied-reality',
      title: 'Applied Reality',
      icon: 'APP',
      colorTheme: { primary: '#7df4ff', secondary: '#ffd166', accent: '#a7ff83' },
      alphabet: ['real world problem', 'constraint', 'resource', 'prototype', 'test loop', 'failure point', 'user', 'environment', 'feedback', 'deployment'],
      templates: ['Problem to Prototype', 'Constraint Map', 'Engineering Loop', 'Field Test', 'Cause Effect Chain', 'Solution Impact'],
      examples: ['Water Purification', 'Clean Energy Device', 'Medical Device', 'Disaster Response', 'Agriculture Tool', 'Education Tool', 'Logistics System', 'Urban Problem', 'Local Innovation'],
      processes: ['prototype', 'test', 'deploy', 'filter', 'measure impact', 'iterate', 'solve constraint', 'scale solution'],
      laws: ['design loop', 'field validation', 'cause effect', 'resource constraint'],
      variables: ['cost', 'users', 'resource', 'constraint', 'impact', 'failure rate'],
      keywords: ['applied', 'engineering', 'technology', 'breakthrough', 'innovation', 'device', 'prototype', 'tool', 'platform', 'application', 'field test', 'deployment', 'solution', 'impact', 'local problem', 'water filter', 'clean energy', 'medical device'],
      newsLogic: 'real problem -> constraints -> solution mechanism -> tested impact',
      environment: 'prototype test field'
    },
    {
      id: 'materials-science',
      title: 'Materials Science',
      icon: 'MAT',
      colorTheme: { primary: '#9cfffa', secondary: '#ffd166', accent: '#cdb4db' },
      alphabet: ['lattice', 'grain boundary', 'defect', 'crystal', 'polymer chain', 'composite layer', 'stress arrow', 'strain deformation', 'thermal property', 'conductivity path'],
      templates: ['Microstructure to Property', 'Stress Strain', 'Defect Engineering', 'Phase Transition', 'Composite Structure', 'Material Synthesis', 'Conductivity Path'],
      examples: ['Graphene', 'Semiconductor', 'Superconductor', 'Battery Material', 'Alloy', 'Polymer', 'Crystal Defect', 'Nanomaterial', 'Composite', 'Strength vs Weight'],
      processes: ['synthesize', 'stress', 'strain', 'conduct', 'defect engineer', 'phase transition', 'form lattice', 'strengthen'],
      laws: ['structure property relation', 'stress strain', 'band gap', 'conductivity', 'crystallography'],
      variables: ['defect density', 'grain size', 'strength', 'conductivity', 'temperature', 'strain'],
      keywords: ['materials science', 'material', 'materials', 'semiconductor', 'battery', 'alloy', 'composite', 'nanomaterial', 'surface', 'crystal', 'lattice', 'graphene', 'superconductor', 'polymer', 'defect', 'grain boundary', 'conductivity', 'stress', 'strain'],
      newsLogic: 'microstructure -> property -> application',
      environment: 'crystal lattice lab'
    },
    {
      id: 'artificial-intelligence',
      title: 'Artificial Intelligence',
      icon: 'AI',
      colorTheme: { primary: '#8cf7ff', secondary: '#ffd166', accent: '#b8c0ff' },
      alphabet: ['data', 'model', 'neural layer', 'embedding space', 'attention head', 'token', 'training loop', 'loss curve', 'agent', 'tool call', 'alignment guard', 'evaluation benchmark'],
      templates: ['Training Pipeline', 'Inference Flow', 'Neural Network', 'Attention Map', 'Agent Loop', 'Evaluation Benchmark', 'Alignment Feedback', 'Multimodal Pipeline'],
      examples: ['Neural Network', 'Transformer', 'Attention', 'Training', 'Inference', 'Embeddings', 'Reinforcement Learning', 'AI Agent', 'Multimodal Model', 'Alignment', 'Evaluation'],
      processes: ['train', 'infer', 'embed', 'attend', 'evaluate', 'align', 'call tool', 'optimize loss', 'generate'],
      laws: ['gradient descent', 'attention mechanism', 'loss minimization', 'evaluation benchmark', 'alignment constraint'],
      variables: ['tokens', 'parameters', 'loss', 'accuracy', 'latency', 'context', 'embedding distance'],
      keywords: ['artificial intelligence', 'ai', 'machine learning', 'deep learning', 'model', 'neural network', 'llm', 'agent', 'robot', 'chatbot', 'transformer', 'attention', 'training', 'inference', 'embedding', 'multimodal', 'reinforcement learning', 'alignment', 'benchmark', 'token'],
      newsLogic: 'data, model, and compute -> training or inference mechanism -> capability or risk outcome',
      environment: 'neural architecture lab'
    }
  ];

  const specById = subjectSpecs.reduce((acc, spec) => {
    acc[spec.id] = spec;
    return acc;
  }, {});

  const aliasToSubjectId = {
    biology: 'biology',
    bio: 'biology',
    physics: 'physics',
    math: 'mathematics',
    mathematics: 'mathematics',
    cs: 'computer-science',
    computerScience: 'computer-science',
    'computer-science': 'computer-science',
    informationTheory: 'information-theory',
    'information-theory': 'information-theory',
    thermodynamics: 'thermodynamics',
    statisticalMechanics: 'statistical-mechanics',
    'statistical-mechanics': 'statistical-mechanics',
    quantumMechanics: 'quantum-mechanics',
    'quantum-mechanics': 'quantum-mechanics',
    relativity: 'relativity',
    chemistry: 'chemistry',
    evolution: 'evolutionary-theory',
    evolutionaryTheory: 'evolutionary-theory',
    'evolutionary-theory': 'evolutionary-theory',
    neuroscience: 'neuroscience',
    cognitiveScience: 'cognitive-science',
    'cognitive-science': 'cognitive-science',
    systems: 'systems-interaction',
    systemsInteraction: 'systems-interaction',
    'systems-interaction': 'systems-interaction',
    complexSystems: 'complex-systems',
    'complex-systems': 'complex-systems',
    chaosTheory: 'chaos-theory',
    'chaos-theory': 'chaos-theory',
    networkTheory: 'network-theory',
    'network-theory': 'network-theory',
    controlTheory: 'control-theory',
    'control-theory': 'control-theory',
    humanSystems: 'human-systems',
    'human-systems': 'human-systems',
    economics: 'economics',
    gameTheory: 'game-theory',
    'game-theory': 'game-theory',
    appliedReality: 'applied-reality',
    'applied-reality': 'applied-reality',
    materialsScience: 'materials-science',
    'materials-science': 'materials-science',
    artificialIntelligence: 'artificial-intelligence',
    'artificial-intelligence': 'artificial-intelligence',
    ai: 'artificial-intelligence'
  };

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'item';
  }

  function toCamel(id) {
    return String(id || '').replace(/-([a-z])/g, (_, char) => char.toUpperCase());
  }

  function unique(values) {
    const seen = new Set();
    return (values || []).filter((value) => {
      const text = String(value || '').trim();
      const key = text.toLowerCase();
      if (!text || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
  }

  function cleanUniversalText(text) {
    return String(text || '')
      .replace(/https?:\/\/\S+/gi, ' ')
      .replace(/[^\w\s.+/%-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function tokenize(text) {
    return unique(cleanUniversalText(text).split(/\s+/).filter((token) => token.length > 2));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function matchTerms(text, terms, limit = 12) {
    const cleaned = cleanUniversalText(text);
    const matches = [];
    unique(terms).forEach((term) => {
      const phrase = String(term || '').toLowerCase();
      if (!phrase) return;
      const simple = phrase.replace(/[^a-z0-9]+/g, ' ').trim();
      if (!simple) return;
      const phraseRegex = new RegExp(`(^|\\s)${simple.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i');
      if (phraseRegex.test(cleaned) || simple.split(' ').some((part) => part.length > 4 && cleaned.includes(part))) {
        matches.push(term);
      }
    });
    return unique(matches).slice(0, limit);
  }

  function makeSymbol(name, spec, index) {
    const scaleHints = ['abstract', 'computational', 'information', 'molecular', 'cellular', 'system', 'population', 'cosmic', 'social', 'engineering'];
    return {
      id: slugify(name),
      name,
      emoji: spec.icon,
      meaning: `${name} as a reusable ${spec.title} visual unit.`,
      shape: index % 3 === 0 ? 'glowing node' : index % 3 === 1 ? 'labeled flow shape' : 'layered symbol tile',
      animation: index % 3 === 0 ? 'pulse and connect' : index % 3 === 1 ? 'move along pathway' : 'transform with glow',
      scale: scaleHints[index % scaleHints.length]
    };
  }

  function makeTemplate(name, spec, index) {
    const process = spec.processes[index % spec.processes.length] || 'transform';
    return {
      id: slugify(name),
      name,
      bestFor: `${spec.title} concepts where ${process} is the core mechanism.`,
      visualLayout: index % 3 === 0 ? 'left to right process stages' : index % 3 === 1 ? 'central mechanism with orbiting entities' : 'node network with labeled flows',
      animationSteps: [
        `Detect ${spec.title} entities`,
        `Show ${process} as the active mechanism`,
        'Move signals, matter, energy, or information through the scene',
        'Highlight the outcome node'
      ],
      interactionControls: ['labels', 'stage focus', 'explanation layer'],
      exampleConcepts: spec.examples.slice(index, index + 3).concat(spec.examples.slice(0, 3)).slice(0, 3),
      keywords: unique([name, process].concat(spec.keywords.slice(index, index + 4))).map((value) => String(value).toLowerCase())
    };
  }

  function makeGrammarRules(spec) {
    return [
      {
        id: 'entity-mechanism-outcome',
        name: 'Entity + Mechanism + Outcome',
        rule: `${spec.title} entity plus process becomes a visual scene ending in a result.`,
        example: spec.newsLogic
      },
      {
        id: 'input-transform-output',
        name: 'Input -> Transform -> Output',
        rule: 'Inputs enter a mechanism, change state, and produce labeled outputs.',
        example: `${spec.alphabet[0]} enters ${spec.templates[0]} and produces an outcome.`
      },
      {
        id: 'signal-response',
        name: 'Signal -> System -> Response',
        rule: 'Signals or constraints activate a response pathway in the system.',
        example: `${spec.alphabet[1]} changes ${spec.alphabet[2]} through ${spec.processes[0]}.`
      },
      {
        id: 'network-interaction',
        name: 'Parts + Links + Flow',
        rule: 'Connected nodes show dependency, propagation, and system effects.',
        example: `${spec.alphabet[2]} connects to ${spec.alphabet[3]} with a labeled flow.`
      },
      {
        id: 'scale-zoom',
        name: 'Scale Zoom',
        rule: 'Scene can move from small mechanism to wider outcome.',
        example: `${spec.title} concept expands from mechanism to application.`
      },
      {
        id: 'uncertainty-layer',
        name: 'Uncertainty Layer',
        rule: 'Low confidence plans keep the scene generic and mark assumptions.',
        example: 'Unknown news becomes input -> mechanism -> outcome.'
      }
    ];
  }

  function makeConceptExamples(spec) {
    return spec.examples.slice(0, 12).map((title, index) => {
      const entities = unique([
        spec.alphabet[index % spec.alphabet.length],
        spec.alphabet[(index + 2) % spec.alphabet.length],
        spec.alphabet[(index + 4) % spec.alphabet.length]
      ]);
      const process = spec.processes[index % spec.processes.length] || 'transform';
      const template = spec.templates[index % spec.templates.length];
      return {
        id: slugify(`${spec.id}-${title}`),
        title,
        simpleSentence: `${title} shows how ${entities[0]} uses ${process} to create a measurable result.`,
        scientificMeaning: `${title} is represented as ${spec.newsLogic}.`,
        scale: inferScaleFromSpec(spec, `${title} ${entities.join(' ')}`),
        entities,
        process,
        template,
        animationSteps: [
          `${entities[0]} appears as the starting subject`,
          `${entities[1]} connects through ${process}`,
          `${entities[2]} shows the visible result`,
          'Explanation layer names the mechanism and outcome'
        ],
        userControls: ['step through', 'show labels', 'show uncertainty'],
        simpleExplanation: `${title} is shown as a visual path from cause to mechanism to outcome.`,
        misconceptionWarning: 'This v0 visual is symbolic and simplified, not a full simulation.',
        innovationConnection: `${title} helps SciLoop connect discoveries to useful models, tools, and real-world decisions.`
      };
    });
  }

  function makeTrainingSeeds(spec, examples) {
    const seeds = [];
    const sourceExamples = examples.length ? examples : makeConceptExamples(spec);
    for (let i = 0; i < 18; i += 1) {
      const example = sourceExamples[i % sourceExamples.length];
      const process = spec.processes[i % spec.processes.length] || example.process || 'transform';
      const template = spec.templates[i % spec.templates.length] || example.template;
      const entities = unique((example.entities || []).concat(spec.alphabet.slice(i % spec.alphabet.length, (i % spec.alphabet.length) + 2))).slice(0, 4);
      seeds.push({
        input: `${example.title} uses ${process} in ${spec.title}.`,
        subject: spec.title,
        scale: example.scale || inferScaleFromSpec(spec, example.title),
        entities,
        process,
        template,
        visualPlan: [
          `${entities[0] || spec.title} enters scene`,
          `${process} becomes highlighted`,
          `${entities[1] || 'result'} changes state`,
          'outcome is labeled'
        ],
        explanation: example.simpleExplanation || `${example.title} becomes a visual mechanism.`,
        innovationConnection: example.innovationConnection || `${spec.title} visuals help connect discovery to action.`
      });
    }
    return seeds;
  }

  function expandKeywords(spec) {
    return unique(
      []
        .concat(spec.keywords || [])
        .concat(spec.alphabet || [])
        .concat(spec.templates || [])
        .concat(spec.examples || [])
        .concat(spec.processes || [])
        .concat(spec.laws || [])
        .concat(spec.variables || [])
        .concat([spec.title, spec.icon, spec.newsLogic])
    ).slice(0, 64);
  }

  function inferScaleFromSpec(spec, text) {
    const cleaned = cleanUniversalText(`${spec.id} ${text}`);
    if (/quantum|electron|photon|atom|molecule|molecular|dna|rna|protein|enzyme|bond|lattice|crystal/.test(cleaned)) return 'molecular';
    if (/cell|mitochondria|neuron|synapse|immune|brain|tissue/.test(cleaned)) return 'cellular';
    if (/population|species|market|society|city|network|ecosystem|institution/.test(cleaned)) return 'population/system';
    if (/spacetime|black hole|cosmic|gravity|relativity/.test(cleaned)) return 'cosmic';
    if (/algorithm|data|model|software|information|bit|channel/.test(cleaned)) return 'computational/information';
    if (/heat|temperature|entropy|pressure|engine/.test(cleaned)) return 'thermal';
    if (/proof|equation|function|matrix|vector/.test(cleaned)) return 'abstract';
    return 'mixed';
  }

  function normalizeExistingPack(spec) {
    const existing = spec.id === 'biology' ? window.biologyVisualLanguage : spec.id === 'physics' ? window.physicsVisualLanguage : null;
    const existingSeeds = spec.id === 'biology' ? window.biologyTrainingSeeds : spec.id === 'physics' ? window.physicsTrainingSeeds : null;
    const visualAlphabet = Array.isArray(existing?.visualAlphabet) && existing.visualAlphabet.length
      ? existing.visualAlphabet
      : spec.alphabet.map((name, index) => makeSymbol(name, spec, index));
    const templates = Array.isArray(existing?.templates) && existing.templates.length
      ? existing.templates.map((template, index) => ({
          id: template.id || slugify(template.name || spec.templates[index % spec.templates.length]),
          name: template.name || spec.templates[index % spec.templates.length],
          bestFor: template.bestFor || `${spec.title} visual template`,
          visualLayout: template.visualLayout || template.layout || 'stage based scene',
          animationSteps: template.animationSteps || template.animation || ['show inputs', 'run mechanism', 'show output'],
          interactionControls: template.interactionControls || ['labels', 'steps'],
          exampleConcepts: template.exampleConcepts || [],
          keywords: unique([template.name, template.id].concat(template.exampleConcepts || [])).map((value) => String(value).toLowerCase())
        }))
      : spec.templates.map((name, index) => makeTemplate(name, spec, index));
    const conceptExamples = Array.isArray(existing?.conceptExamples) && existing.conceptExamples.length
      ? existing.conceptExamples
      : makeConceptExamples(spec);
    const trainingSeeds = Array.isArray(existingSeeds) && existingSeeds.length ? existingSeeds : makeTrainingSeeds(spec, conceptExamples);
    return {
      id: spec.id,
      title: spec.title,
      subject: spec.title,
      version: existing?.version || '0.1',
      icon: spec.icon,
      colorTheme: spec.colorTheme,
      visualAlphabet,
      grammarRules: Array.isArray(existing?.grammarRules) && existing.grammarRules.length ? existing.grammarRules : makeGrammarRules(spec),
      templates,
      conceptExamples,
      trainingSeeds,
      newsKeywords: expandKeywords(spec),
      parserRules: {
        entities: spec.alphabet,
        processes: spec.processes,
        laws: spec.laws,
        variables: spec.variables,
        keywords: expandKeywords(spec)
      },
      sceneFamilies: unique(spec.templates.concat(['Node Flow', 'Process Pipeline', 'Network', 'Feedback Loop', 'Comparison', 'Hierarchy'])),
      newsLogic: spec.newsLogic,
      sceneEnvironment: spec.environment
    };
  }

  function buildSubjectPacks() {
    return subjectSpecs.map(normalizeExistingPack);
  }

  const subjectPacks = buildSubjectPacks();
  const subjectPackById = subjectPacks.reduce((acc, pack) => {
    acc[pack.id] = pack;
    return acc;
  }, {});

  const sciloopSubjectRegistry = subjectPacks.reduce((acc, pack) => {
    acc[pack.id] = pack;
    acc[toCamel(pack.id)] = pack;
    return acc;
  }, {});
  sciloopSubjectRegistry.byId = subjectPackById;
  sciloopSubjectRegistry.all = subjectPacks;

  const sciloopNewsSourceRegistry = subjectPacks.reduce((acc, pack) => {
    acc[pack.id] = [];
    acc[toCamel(pack.id)] = acc[pack.id];
    return acc;
  }, {});

  const sciloopRenderConfig = {
    defaultRenderMode: 'local-pseudo-3d'
  };

  function normalizeSubjectId(subject) {
    if (!subject || subject === 'auto') return 'auto';
    const raw = String(subject).trim();
    return aliasToSubjectId[raw] || aliasToSubjectId[raw.toLowerCase()] || slugify(raw);
  }

  function getSubjectPack(subjectId) {
    const normalized = normalizeSubjectId(subjectId);
    return subjectPackById[normalized] || subjectPackById[SUBJECT_FALLBACK];
  }

  function detectSubjectFromText(text) {
    const cleaned = cleanUniversalText(text);
    const tokens = new Set(tokenize(cleaned));
    const specificSubjectRules = [
      { id: 'mathematics', regex: /\b(derivative|slope|integral|area under|equation|theorem|proof|matrix|vector|function curve|optimization|limit|symmetry)\b/ },
      { id: 'relativity', regex: /\b(spacetime|black hole|gravitational wave|time dilation|event horizon|light cone|geodesic|gravitational lens|mass bends|bends spacetime|path of light|speed of light)\b/ },
      { id: 'quantum-mechanics', regex: /\b(quantum|qubit|entanglement|superposition|wavefunction|electron|photon|measurement|uncertainty|spin|tunneling|double slit)\b/ },
      { id: 'statistical-mechanics', regex: /\b(statistical mechanics|microstate|macrostate|boltzmann|ensemble|many-body|fluctuation|particle swarm|average motion)\b/ },
      { id: 'control-theory', regex: /\b(control theory|control system|controller|sensor|actuator|pid|feedback control|error signal|thermostat|autopilot|stability meter)\b/ },
      { id: 'cognitive-science', regex: /\b(cognitive science|cognition|working memory|attention selects|perception|mental model|decision making|cognitive bias|reasoning|prediction error)\b/ },
      { id: 'information-theory', regex: /\b(information theory|entropy meter|compression|error correction|shannon|noisy channel|bits|decoder|encoder|source coding)\b/ },
      { id: 'thermodynamics', regex: /\b(thermodynamics|thermal|heat|temperature|entropy|engine|carnot|pressure|gas expansion|hot object|cold object)\b/ },
      { id: 'artificial-intelligence', regex: /\b(artificial intelligence|machine learning|deep learning|transformer|attention|llm|embedding|training loop|neural network|ai agent|multimodal)\b/ },
      { id: 'materials-science', regex: /\b(materials science|graphene|semiconductor|superconductor|lattice|crystal defect|grain boundary|composite|alloy|nanomaterial)\b/ }
    ];
    const specificHit = specificSubjectRules.find((rule) => rule.regex.test(cleaned));
    if (specificHit && subjectPackById[specificHit.id]) {
      return {
        subjectId: specificHit.id,
        confidence: 0.88,
        scores: [{ id: specificHit.id, title: subjectPackById[specificHit.id].title, score: 24 }]
      };
    }
    const scores = subjectPacks.map((pack) => {
      let score = 0;
      const keywords = pack.newsKeywords || [];
      keywords.forEach((keyword) => {
        const term = cleanUniversalText(keyword);
        if (!term) return;
        if (term.includes(' ')) {
          if (cleaned.includes(term)) score += Math.min(8, term.split(' ').length + 2);
        } else if (tokens.has(term)) {
          score += term.length > 5 ? 3 : 2;
        } else if (term.length > 6 && cleaned.includes(term)) {
          score += 1;
        }
      });
      if (cleaned.includes(cleanUniversalText(pack.title))) score += 8;
      return { id: pack.id, title: pack.title, score };
    }).sort((a, b) => b.score - a.score);
    const top = scores[0] || { id: SUBJECT_FALLBACK, score: 0 };
    const second = scores[1] || { score: 0 };
    const confidence = top.score <= 0 ? 0.22 : clamp((top.score + Math.max(0, top.score - second.score)) / 28, 0.28, 0.96);
    return {
      subjectId: top.score > 0 ? top.id : SUBJECT_FALLBACK,
      confidence,
      scores: scores.slice(0, 5)
    };
  }

  function analyzeSubjectText(pack, text) {
    const spec = specById[pack.id] || {};
    const allText = cleanUniversalText(text);
    const entities = matchTerms(allText, (pack.parserRules?.entities || []).concat(pack.visualAlphabet.map((item) => item.name || item.id || item)), 14);
    const processes = matchTerms(allText, (pack.parserRules?.processes || []).concat((pack.templates || []).flatMap((template) => [template.name, template.id])), 10);
    const laws = matchTerms(allText, spec.laws || pack.parserRules?.laws || [], 8);
    const variables = matchTerms(allText, spec.variables || pack.parserRules?.variables || [], 8);
    const flows = matchTerms(allText, ['flow', 'transfer', 'signal', 'transport', 'transmit', 'convert', 'move', 'spread', 'diffuse', 'trade', 'route', 'pipeline', 'energy', 'information', 'resource'], 8);
    const fields = matchTerms(allText, ['field', 'gradient', 'force', 'spacetime', 'potential', 'temperature field', 'embedding space', 'probability cloud'], 8);
    const signals = matchTerms(allText, ['signal', 'message', 'feedback', 'error', 'receptor', 'attention', 'spike', 'price signal', 'control signal'], 8);
    const constraints = matchTerms(allText, ['constraint', 'limit', 'capacity', 'efficiency', 'stability', 'uncertainty', 'noise', 'scarcity', 'cost', 'activation energy'], 8);
    const outcomes = matchTerms(allText, ['accuracy', 'resistance', 'growth', 'survival', 'activation', 'suppression', 'repair', 'efficiency', 'capability', 'risk', 'strength', 'stable', 'faster', 'lower', 'higher'], 8);
    const keywords = matchTerms(allText, pack.newsKeywords || [], 16);
    const systems = matchTerms(allText, [pack.title, pack.newsLogic, 'system', 'network', 'engine', 'organism', 'market', 'material', 'model', 'ecosystem'], 8);
    return {
      entities: entities.length ? entities : pack.visualAlphabet.slice(0, 3).map((symbol) => symbol.name || symbol.id),
      processes: processes.length ? processes : [spec.processes?.[0] || 'transform'],
      systems: systems.length ? systems : [pack.title],
      scale: inferScaleFromSpec(spec, allText),
      laws,
      variables,
      flows,
      fields,
      signals,
      constraints,
      outcomes,
      keywords
    };
  }

  function scoreExample(example, cleanedText, tokens, pack) {
    const pieces = [
      example.title,
      example.simpleSentence,
      example.scientificMeaning,
      example.process,
      example.template
    ].concat(example.entities || [], example.animationSteps || []);
    const exampleText = cleanUniversalText(pieces.join(' '));
    let score = 0;
    tokens.forEach((token) => {
      if (token.length > 2 && exampleText.includes(token)) score += token.length > 5 ? 2 : 1;
    });
    (example.entities || []).forEach((entity) => {
      if (cleanedText.includes(cleanUniversalText(entity))) score += 4;
    });
    if (example.process && cleanedText.includes(cleanUniversalText(example.process))) score += 5;
    if (example.template && cleanedText.includes(cleanUniversalText(example.template))) score += 2;
    if (pack.newsKeywords?.some((keyword) => exampleText.includes(cleanUniversalText(keyword)) && cleanedText.includes(cleanUniversalText(keyword)))) score += 2;
    return score;
  }

  function findClosestSubjectExamples(subjectId, text, limit = 3) {
    const pack = getSubjectPack(subjectId);
    const cleaned = cleanUniversalText(text);
    const tokens = new Set(tokenize(cleaned));
    const scored = (pack.conceptExamples || []).map((example) => ({
      id: example.id || slugify(example.title),
      title: example.title,
      entities: example.entities || [],
      process: example.process || '',
      template: example.template || '',
      animationPattern: (example.animationSteps || []).join(' -> '),
      score: scoreExample(example, cleaned, tokens, pack)
    })).sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((item) => ({
      ...item,
      confidence: clamp(item.score / 16, 0.05, 0.98)
    }));
  }

  function chooseSubjectTemplate(subjectId, analysis, matchedExamples = []) {
    const pack = getSubjectPack(subjectId);
    const text = cleanUniversalText([
      analysis.entities,
      analysis.processes,
      analysis.laws,
      analysis.variables,
      analysis.flows,
      analysis.signals,
      analysis.outcomes,
      matchedExamples.map((match) => `${match.title} ${match.template}`)
    ].flat().join(' '));

    const ruleHints = [
      { regex: /feedback|homeostasis|control|regulat|stability|thermostat|error/, id: 'feedback', names: ['Feedback Control Loop', 'Feedback Loop Template', 'Feedback Loop', 'Stability Response'] },
      { regex: /network|node|edge|synapse|brain|hub|community|interact|signal|social|neuron/, id: 'network', names: ['Network Template', 'Brain Network', 'Node Link Network', 'Interaction Network', 'Neural Signal'] },
      { regex: /flow|transfer|transport|heat|energy|information|channel|trade|resource|metabolism|atp/, id: 'flow', names: ['Flow Template', 'Heat Flow', 'Signal Channel', 'Energy Flow', 'Resource Allocation', 'Inference Flow'] },
      { regex: /mutation|selection|adapt|resistance|species|population|fitness/, id: 'evolution', names: ['Evolution Template', 'Variation Selection', 'Fitness Landscape', 'Population Shift'] },
      { regex: /crispr|edit|intervention|prototype|engineer|method|improve|catalyst|lower/, id: 'intervention', names: ['Intervention', 'Reaction Mechanism', 'Catalyst Pathway', 'Engineering Loop', 'Problem to Prototype'] },
      { regex: /compare|healthy|disease|before|after|versus|vs|shock/, id: 'comparison', names: ['Comparison Template', 'Complexity Comparison', 'Frame Comparison', 'Economic Shock'] },
      { regex: /sequence|step|replication|synthesis|pipeline|algorithm|training|compile|sort|search/, id: 'sequence', names: ['Sequence Template', 'Algorithm Flow', 'Training Pipeline', 'Input Processing Pipeline', 'Equation Transformation'] },
      { regex: /curve|field|gradient|spacetime|probability|wavefunction|geometry/, id: 'field', names: ['Graph Function', 'Vector Field', 'Probability Cloud', 'Spacetime Curvature', 'Field Interaction'] }
    ];

    for (const hint of ruleHints) {
      if (!hint.regex.test(text)) continue;
      const template = (pack.templates || []).find((candidate) => {
        const candidateName = String(candidate.name || candidate.id || '').toLowerCase();
        return hint.names.some((name) => candidateName.includes(name.toLowerCase()) || candidateName.includes(hint.id));
      });
      if (template) return template;
    }

    const matchedTemplateName = matchedExamples.find((example) => example.template)?.template;
    const matchedTemplate = (pack.templates || []).find((template) => String(template.name || template.id).toLowerCase() === String(matchedTemplateName || '').toLowerCase());
    return matchedTemplate || pack.templates?.[0] || makeTemplate('Node Flow', specById[pack.id] || specById[SUBJECT_FALLBACK], 0);
  }

  function chooseSceneType(templateName, analysis) {
    const text = cleanUniversalText(`${templateName} ${(analysis.processes || []).join(' ')} ${(analysis.keywords || []).join(' ')}`);
    if (/network|node|link|synapse|brain|hub|community|interaction/.test(text)) return 'network';
    if (/feedback|control|loop|regulat|stability/.test(text)) return 'feedback-loop';
    if (/comparison|compare|before|after|shock/.test(text)) return 'comparison';
    if (/hierarchy|scale|tree/.test(text)) return 'hierarchy';
    if (/field|probability|spacetime|gradient|wave/.test(text)) return 'field-gradient';
    if (/flow|channel|heat|energy|resource|signal|trade|transport/.test(text)) return 'flow';
    return 'process-pipeline';
  }

  function buildUniversalScenePlan(subjectPack, analysis, template, inputTitle) {
    const entities = unique(analysis.entities || []).slice(0, 6);
    const processes = unique(analysis.processes || []).slice(0, 4);
    const sceneType = chooseSceneType(template.name || template.id, analysis);
    const nodes = entities.map((entity, index) => ({
      id: slugify(`${entity}-${index}`),
      label: entity,
      type: index === 0 ? 'primary' : 'support',
      role: index === 0 ? 'main subject' : 'supporting entity',
      x: 12 + index * (76 / Math.max(1, entities.length - 1 || 1)),
      y: index % 2 === 0 ? 42 : 58
    }));
    if (!nodes.length) {
      nodes.push({ id: 'subject-node', label: subjectPack.title, type: 'primary', role: 'main subject', x: 15, y: 50 });
      nodes.push({ id: 'mechanism-node', label: processes[0] || 'mechanism', type: 'process', role: 'mechanism', x: 50, y: 50 });
      nodes.push({ id: 'outcome-node', label: 'outcome', type: 'outcome', role: 'result', x: 85, y: 50 });
    }
    const stageLabels = [
      inputTitle || `${subjectPack.title} input`,
      processes[0] || 'mechanism',
      analysis.outcomes?.[0] || 'visible outcome'
    ];
    const stages = stageLabels.map((label, index) => ({
      id: `stage-${index + 1}`,
      label,
      detail: index === 0 ? 'Detect subject and entities' : index === 1 ? `Apply ${template.name || template.id}` : 'Explain result and uncertainty'
    }));
    const connections = nodes.slice(0, -1).map((node, index) => ({
      from: node.id,
      to: nodes[index + 1].id,
      label: processes[index % Math.max(1, processes.length)] || 'changes'
    }));
    const flows = connections.map((connection, index) => ({
      id: `flow-${index + 1}`,
      from: connection.from,
      to: connection.to,
      label: connection.label,
      kind: analysis.flows?.[index] || analysis.signals?.[index] || 'mechanism flow'
    }));
    return {
      sceneType,
      nodes,
      connections,
      flows,
      stages,
      annotations: [
        `${subjectPack.title} pack: ${template.name || template.id}`,
        `Scale: ${analysis.scale}`,
        analysis.keywords?.length ? `Keywords: ${analysis.keywords.slice(0, 5).join(', ')}` : 'Local parser used general subject grammar'
      ],
      labels: nodes.map((node) => node.label),
      legend: [
        { label: 'Primary node', meaning: 'Main subject detected from text' },
        { label: 'Flow arrows', meaning: 'Mechanism, signal, material, energy, or information movement' },
        { label: 'Outcome node', meaning: 'Visible result or claim from the input' }
      ],
      camera: { mode: 'local-2d', zoom: 1, focus: nodes[0]?.id || 'subject-node' },
      renderHints: {
        colorTheme: subjectPack.colorTheme,
        renderer: 'universal-generic',
        environment: subjectPack.sceneEnvironment,
        labels: true,
        legend: true,
        stageMarkers: true
      }
    };
  }

  function normalizeUniversalVisualPlan(plan, localPlan = null) {
    const base = localPlan || {};
    const subjectId = normalizeSubjectId(plan?.subjectId || base.subjectId || plan?.subject || base.subject || SUBJECT_FALLBACK);
    const pack = getSubjectPack(subjectId === 'auto' ? SUBJECT_FALLBACK : subjectId);
    const detected = plan?.detected || base.detected || {};
    const visualScene = plan?.visualScene || base.visualScene || {};
    const explanation = plan?.explanation || base.explanation || {};
    const normalized = {
      id: plan?.id || base.id || `uvp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      sourceType: plan?.sourceType || base.sourceType || 'manual-input',
      subjectId: pack.id,
      subject: pack.title,
      title: plan?.title || base.title || `${pack.title} Visual Plan`,
      rawText: plan?.rawText || base.rawText || '',
      cleanedText: plan?.cleanedText || base.cleanedText || cleanUniversalText(plan?.rawText || base.rawText || ''),
      confidence: clamp(plan?.confidence ?? base.confidence ?? 0.45, 0, 1),
      matchedExamples: Array.isArray(plan?.matchedExamples) ? plan.matchedExamples : Array.isArray(base.matchedExamples) ? base.matchedExamples : [],
      detected: {
        entities: Array.isArray(detected.entities) ? detected.entities : [],
        processes: Array.isArray(detected.processes) ? detected.processes : [],
        systems: Array.isArray(detected.systems) ? detected.systems : [],
        scale: detected.scale || 'mixed',
        laws: Array.isArray(detected.laws) ? detected.laws : [],
        variables: Array.isArray(detected.variables) ? detected.variables : [],
        flows: Array.isArray(detected.flows) ? detected.flows : [],
        fields: Array.isArray(detected.fields) ? detected.fields : [],
        signals: Array.isArray(detected.signals) ? detected.signals : [],
        constraints: Array.isArray(detected.constraints) ? detected.constraints : [],
        outcomes: Array.isArray(detected.outcomes) ? detected.outcomes : [],
        keywords: Array.isArray(detected.keywords) ? detected.keywords : []
      },
      chosenTemplate: plan?.chosenTemplate || base.chosenTemplate || pack.templates?.[0]?.name || 'Node Flow',
      visualScene: {
        sceneType: visualScene.sceneType || 'process-pipeline',
        nodes: Array.isArray(visualScene.nodes) ? visualScene.nodes : [],
        connections: Array.isArray(visualScene.connections) ? visualScene.connections : [],
        flows: Array.isArray(visualScene.flows) ? visualScene.flows : [],
        stages: Array.isArray(visualScene.stages) ? visualScene.stages : [],
        annotations: Array.isArray(visualScene.annotations) ? visualScene.annotations : [],
        labels: Array.isArray(visualScene.labels) ? visualScene.labels : [],
        legend: Array.isArray(visualScene.legend) ? visualScene.legend : [],
        camera: visualScene.camera && typeof visualScene.camera === 'object' ? visualScene.camera : {},
        renderHints: visualScene.renderHints && typeof visualScene.renderHints === 'object' ? visualScene.renderHints : {}
      },
      animationPlan: Array.isArray(plan?.animationPlan) ? plan.animationPlan : Array.isArray(base.animationPlan) ? base.animationPlan : [],
      explanation: {
        simple: explanation.simple || base.explanation?.simple || `${pack.title} concept mapped into a visual mechanism.`,
        scientific: explanation.scientific || base.explanation?.scientific || `${pack.newsLogic}.`,
        innovationConnection: explanation.innovationConnection || base.explanation?.innovationConnection || `${pack.title} visual plans help turn discoveries into reusable understanding.`,
        warnings: Array.isArray(explanation.warnings) ? explanation.warnings : Array.isArray(base.explanation?.warnings) ? base.explanation.warnings : []
      },
      renderMode: plan?.renderMode || base.renderMode || sciloopRenderConfig.defaultRenderMode,
      providerMeta: {
        mode: plan?.providerMeta?.mode || base.providerMeta?.mode || 'local-rule',
        provider: plan?.providerMeta?.provider || base.providerMeta?.provider || 'universal-local-rule-engine',
        verifiedBy: plan?.providerMeta?.verifiedBy || base.providerMeta?.verifiedBy || ''
      }
    };
    if (!normalized.visualScene.nodes.length) {
      const rebuilt = buildUniversalScenePlan(pack, normalized.detected, { name: normalized.chosenTemplate }, normalized.title);
      normalized.visualScene = rebuilt;
    }
    if (!normalized.animationPlan.length) {
      normalized.animationPlan = normalized.visualScene.stages.map((stage) => stage.detail || stage.label);
    }
    return normalized;
  }

  function validateUniversalVisualPlan(plan) {
    const errors = [];
    if (!plan || typeof plan !== 'object') errors.push('Plan is not an object.');
    if (plan && !plan.subject) errors.push('Missing subject.');
    if (plan && !plan.chosenTemplate) errors.push('Missing chosenTemplate.');
    if (plan && !Array.isArray(plan.detected?.entities)) errors.push('detected.entities must be an array.');
    if (plan && !Array.isArray(plan.detected?.processes)) errors.push('detected.processes must be an array.');
    if (plan && !plan.visualScene) errors.push('Missing visualScene.');
    if (plan && !Array.isArray(plan.animationPlan)) errors.push('animationPlan must be an array.');
    if (plan && !plan.explanation?.simple) errors.push('Missing explanation.simple.');
    return { ok: errors.length === 0, errors };
  }

  function generateUniversalVisualPlan(inputText, options = {}) {
    const payload = typeof inputText === 'object' && inputText !== null ? inputText : { fullText: inputText };
    const rawText = unique([payload.title, payload.summary, payload.fullText, payload.text].filter(Boolean)).join('\n');
    const cleanedText = cleanUniversalText(rawText);
    const requestedSubject = normalizeSubjectId(options.subject || payload.subject || payload.subjectId || 'auto');
    const detection = requestedSubject === 'auto'
      ? detectSubjectFromText(cleanedText)
      : { subjectId: requestedSubject, confidence: 0.9, scores: [{ id: requestedSubject, score: 10 }] };
    const pack = getSubjectPack(detection.subjectId);
    const analysis = analyzeSubjectText(pack, cleanedText);
    const matchedExamples = findClosestSubjectExamples(pack.id, cleanedText, 3);
    const template = chooseSubjectTemplate(pack.id, analysis, matchedExamples);
    const scene = buildUniversalScenePlan(pack, analysis, template, payload.title || matchedExamples[0]?.title || pack.title);
    const confidenceBoost = matchedExamples[0]?.score ? Math.min(0.22, matchedExamples[0].score / 80) : 0;
    const confidence = clamp((detection.confidence || 0.35) + confidenceBoost - (cleanedText.length < 18 ? 0.15 : 0), 0.18, 0.97);
    const warnings = [];
    if (requestedSubject === 'auto' && confidence < 0.45) {
      warnings.push('Low confidence subject detection. SciLoop used the closest reality subject grammar.');
    }
    if (!rawText.trim()) warnings.push('No input text was provided.');
    if (options.mode && options.mode !== 'local-rule') warnings.push(DEFAULT_WARNING);

    return normalizeUniversalVisualPlan({
      id: `uvp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      sourceType: options.sourceType || payload.sourceType || 'manual-input',
      subjectId: pack.id,
      subject: pack.title,
      title: payload.title || matchedExamples[0]?.title || `${pack.title} Visual Plan`,
      rawText,
      cleanedText,
      confidence,
      matchedExamples,
      detected: analysis,
      chosenTemplate: template.name || template.id,
      visualScene: scene,
      animationPlan: scene.stages.map((stage) => stage.detail || stage.label),
      explanation: {
        simple: `SciLoop maps this ${pack.title} input as: ${analysis.entities.slice(0, 3).join(', ')} -> ${analysis.processes[0] || 'mechanism'} -> ${analysis.outcomes[0] || 'observable outcome'}.`,
        scientific: `${pack.newsLogic}. The selected visual template is ${template.name || template.id}.`,
        innovationConnection: `${pack.title} visual grammar helps transform news and concepts into reusable scene plans that future AI and renderers can refine.`,
        warnings
      },
      renderMode: options.renderMode || payload.renderMode || sciloopRenderConfig.defaultRenderMode,
      providerMeta: {
        mode: options.mode || payload.mode || 'local-rule',
        provider: 'universal-local-rule-engine',
        verifiedBy: ''
      }
    });
  }

  function getCompactSubjectExampleContext(subjectId, text = '', maxExamples = 6) {
    const pack = getSubjectPack(subjectId);
    const matched = text ? findClosestSubjectExamples(pack.id, text, maxExamples) : (pack.conceptExamples || []).slice(0, maxExamples);
    return matched.slice(0, maxExamples).map((example) => ({
      title: example.title,
      entities: example.entities || [],
      process: example.process || '',
      template: example.template || '',
      animation: example.animationPattern || (example.animationSteps || []).join(' -> ')
    }));
  }

  function buildUniversalVisualPrompt(subjectPack, newsText, localPlan, compactExamples = []) {
    return [
      'You are SciLoop Universal Visual Planner.',
      'Convert the input into one valid JSON visual plan.',
      'Return ONLY JSON. No markdown. No explanation outside JSON.',
      '',
      `Subject: ${subjectPack.title}`,
      `Input: ${String(newsText || '').slice(0, 1600)}`,
      '',
      'Required JSON keys:',
      '{"subject":"","title":"","confidence":0,"detected":{"entities":[],"processes":[],"systems":[],"scale":"","laws":[],"variables":[],"flows":[],"fields":[],"signals":[],"constraints":[],"outcomes":[],"keywords":[]},"chosenTemplate":"","visualScene":{"sceneType":"","nodes":[],"connections":[],"flows":[],"stages":[],"annotations":[],"labels":[],"legend":[],"camera":{},"renderHints":{}},"animationPlan":[],"explanation":{"simple":"","scientific":"","innovationConnection":"","warnings":[]},"providerMeta":{"mode":"","provider":"","verifiedBy":""}}',
      '',
      'Template rules:',
      '- DNA/gene/CRISPR -> intervention or sequence',
      '- mitochondria/ATP/metabolism -> flow',
      '- immune/pathogen/tumor -> defense',
      '- neuron/synapse/brain signal -> network',
      '- mutation/evolution/resistance -> evolution',
      '- force/energy/field/wave -> physics field or energy scene',
      '- algorithm/data/software -> algorithm flow or system architecture',
      '- entropy/compression/noise/channel -> information channel',
      '- heat/temperature/engine -> thermodynamic flow',
      '- molecule/reaction/catalyst -> chemistry reaction mechanism',
      '- market/price/incentive -> economic flow',
      '- strategy/player/payoff -> game theory strategy scene',
      '- feedback/controller/sensor -> control loop',
      '- unknown concept -> input -> mechanism -> outcome',
      '',
      `Compact examples: ${JSON.stringify(compactExamples).slice(0, 2200)}`,
      `Local plan to improve: ${JSON.stringify(localPlan || {}).slice(0, 2500)}`
    ].join('\n');
  }

  function timeoutPromise(ms, message) {
    return new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message || 'Timed out')), ms);
    });
  }

  async function callUniversalProvider(providerName, payload, timeoutMs = 8000) {
    const provider = providerName || 'auto';
    try {
      if (provider === 'puter' && window.puter?.ai?.chat) {
        const response = await Promise.race([
          window.puter.ai.chat(payload.prompt),
          timeoutPromise(timeoutMs, 'Puter provider timed out.')
        ]);
        return { ok: true, provider: 'puter', response };
      }
      const response = await Promise.race([
        fetch(PROVIDER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider, ...payload })
        }),
        timeoutPromise(timeoutMs, `${provider} provider timed out.`)
      ]);
      if (!response.ok) {
        return { ok: false, provider, reason: `Provider endpoint returned ${response.status}.` };
      }
      const data = await response.json();
      return { ok: true, provider: data.provider || provider, response: data };
    } catch (error) {
      return { ok: false, provider, reason: error?.message || 'Provider endpoint not configured yet.' };
    }
  }

  function parseProviderVisualResponse(providerResponse) {
    const raw = providerResponse?.response?.visualPlan || providerResponse?.response?.content || providerResponse?.response?.text || providerResponse?.response;
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    const text = String(raw).trim().replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/i, '').trim();
    try {
      return JSON.parse(text);
    } catch (error) {
      return null;
    }
  }

  async function routeUniversalVisualRequest(inputPayload = {}, options = {}) {
    const mode = inputPayload.mode || options.mode || 'local-rule';
    const preferredProvider = inputPayload.preferredProvider || options.preferredProvider || 'auto';
    const localPlan = inputPayload.localPlan || generateUniversalVisualPlan(inputPayload, {
      subject: inputPayload.subject || 'auto',
      sourceType: inputPayload.sourceType || 'manual-input',
      mode: 'local-rule',
      renderMode: inputPayload.renderMode || options.renderMode
    });
    if (mode === 'local-rule') {
      return {
        ok: true,
        mode,
        providerUsed: 'universal-local-rule-engine',
        fallbackUsed: false,
        visualPlan: localPlan,
        warnings: [],
        rawProviderResponse: null
      };
    }
    const pack = getSubjectPack(localPlan.subjectId || inputPayload.subject || 'auto');
    const newsText = unique([inputPayload.title, inputPayload.summary, inputPayload.fullText, localPlan.rawText].filter(Boolean)).join('\n');
    const compactExamples = getCompactSubjectExampleContext(pack.id, newsText, 6);
    const prompt = buildUniversalVisualPrompt(pack, newsText, localPlan, compactExamples);
    const providers = mode === 'hybrid'
      ? unique([preferredProvider === 'auto' ? 'gemini' : preferredProvider, 'deepseek', 'groq', 'puter'])
      : unique([preferredProvider === 'auto' ? 'gemini' : preferredProvider, 'groq', 'puter']);
    const warnings = [];

    for (const provider of providers) {
      if (provider === 'stability') {
        warnings.push('Stability AI is reserved for future image mode, not structured visual planning.');
        continue;
      }
      const providerResult = await callUniversalProvider(provider, { prompt, localPlan, newsText, subject: pack.id }, options.timeoutMs || 8000);
      if (!providerResult.ok) {
        warnings.push(`${provider}: ${providerResult.reason || 'unavailable'}`);
        continue;
      }
      const parsed = parseProviderVisualResponse(providerResult);
      const normalized = normalizeUniversalVisualPlan(parsed, localPlan);
      const validation = validateUniversalVisualPlan(normalized);
      if (validation.ok) {
        normalized.providerMeta = {
          mode,
          provider: providerResult.provider || provider,
          verifiedBy: mode === 'hybrid' && provider !== 'deepseek' ? 'local-schema-validation' : ''
        };
        return {
          ok: true,
          mode,
          providerUsed: providerResult.provider || provider,
          fallbackUsed: false,
          visualPlan: normalized,
          warnings,
          rawProviderResponse: providerResult.response
        };
      }
      warnings.push(`${provider}: invalid visual plan (${validation.errors.join(', ')})`);
    }

    const fallbackPlan = normalizeUniversalVisualPlan({
      ...localPlan,
      providerMeta: { mode, provider: 'universal-local-rule-engine', verifiedBy: 'fallback' },
      explanation: {
        ...localPlan.explanation,
        warnings: unique([...(localPlan.explanation?.warnings || []), ...warnings, 'AI provider unavailable. Kept local visual plan.'])
      }
    }, localPlan);
    return {
      ok: false,
      mode,
      providerUsed: 'universal-local-rule-engine',
      fallbackUsed: true,
      visualPlan: fallbackPlan,
      warnings,
      rawProviderResponse: null
    };
  }

  function fallbackToLocalRenderer(reason, visualPlan) {
    const plan = normalizeUniversalVisualPlan({
      ...visualPlan,
      renderMode: 'local-pseudo-3d',
      explanation: {
        ...visualPlan?.explanation,
        warnings: unique([...(visualPlan?.explanation?.warnings || []), reason, 'Using local pseudo-3D renderer.'])
      }
    }, visualPlan);
    return { ok: false, mode: 'local-pseudo-3d', reason, visualPlan: plan };
  }

  function ensureUniversalStyles() {
    if (document.getElementById('sciloop-universal-visual-style')) return;
    const style = document.createElement('style');
    style.id = 'sciloop-universal-visual-style';
    style.textContent = `
      .universal-visual-wrap .universal-vl-shell { width: min(1180px, calc(100% - 28px)); margin: 0 auto; padding: 28px 0 70px; }
      .universal-subject-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 16px; }
      .universal-subject-card { border: 1px solid rgba(125,244,255,.22); background: rgba(6,18,30,.64); border-radius: 8px; padding: 12px; color: #eaffff; text-align: left; min-height: 102px; cursor: pointer; box-shadow: inset 0 0 18px rgba(125,244,255,.04); }
      .universal-subject-card strong { display: block; font-size: .9rem; margin-bottom: 6px; }
      .universal-subject-card span { display: inline-flex; min-width: 34px; height: 24px; align-items: center; justify-content: center; border: 1px solid rgba(255,209,102,.4); border-radius: 999px; color: #ffd166; font-size: .72rem; margin-bottom: 8px; }
      .universal-subject-card p { color: rgba(230,250,255,.72); font-size: .78rem; line-height: 1.35; margin: 0; }
      .universal-subject-card.active { border-color: rgba(255,209,102,.75); box-shadow: 0 0 22px rgba(255,209,102,.16), inset 0 0 24px rgba(125,244,255,.08); }
      .universal-lab-grid { display: grid; grid-template-columns: minmax(260px, .85fr) minmax(320px, 1.15fr); gap: 16px; align-items: start; }
      .universal-button-row { display: flex; flex-wrap: wrap; gap: 10px; }
      .universal-button-row button, .universal-news-visual-btn { border: 1px solid rgba(125,244,255,.35); background: linear-gradient(135deg, rgba(8,42,58,.96), rgba(8,22,32,.94)); color: #eaffff; border-radius: 8px; padding: 10px 13px; cursor: pointer; }
      .universal-button-row button:last-child { border-color: rgba(255,92,92,.65); color: #fff1f1; box-shadow: 0 0 20px rgba(255,92,92,.12); }
      .universal-analysis-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 10px; }
      .universal-mini-card { border: 1px solid rgba(125,244,255,.18); background: rgba(3,13,22,.56); border-radius: 8px; padding: 11px; min-height: 86px; overflow: hidden; }
      .universal-mini-card strong { display: block; color: #ffd166; margin-bottom: 7px; font-size: .82rem; }
      .universal-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
      .universal-chip-row span { border: 1px solid rgba(125,244,255,.24); background: rgba(125,244,255,.08); color: #e8fbff; border-radius: 999px; padding: 5px 8px; font-size: .72rem; }
      .universal-scene-host { min-height: 520px; }
      .universal-scene-frame { position: relative; min-height: 430px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(125,244,255,.22); background: radial-gradient(circle at 50% 18%, rgba(125,244,255,.16), transparent 34%), linear-gradient(145deg, rgba(3,10,18,.96), rgba(5,18,31,.92)); }
      .universal-scene-svg { width: 100%; height: 340px; display: block; }
      .universal-scene-caption { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px; color: rgba(234,255,255,.84); }
      .universal-stage-list { display: grid; gap: 8px; }
      .universal-stage-list div { border-left: 2px solid rgba(255,209,102,.72); padding-left: 9px; color: rgba(234,255,255,.84); }
      .universal-json-output { max-height: 300px; overflow: auto; white-space: pre-wrap; word-break: break-word; font-size: .72rem; border: 1px solid rgba(125,244,255,.18); background: rgba(0,0,0,.28); border-radius: 8px; padding: 12px; color: #dffbff; }
      .universal-pack-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px; }
      .universal-pack-list { margin: 0; padding-left: 16px; color: rgba(230,250,255,.76); font-size: .82rem; line-height: 1.45; }
      @media (max-width: 820px) {
        .universal-lab-grid, .universal-scene-caption { grid-template-columns: 1fr; }
        .universal-scene-host { min-height: 460px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .universal-scene-svg .pulse, .universal-scene-svg .flow-dot { animation: none !important; }
      }
      @keyframes universalPulse { 0%,100% { opacity: .58; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
      @keyframes universalFlow { from { offset-distance: 0%; opacity: .1; } 20% { opacity: 1; } to { offset-distance: 100%; opacity: .1; } }
    `;
    document.head.appendChild(style);
  }

  function renderChips(node, values, fallback = 'None detected') {
    if (!node) return;
    const items = unique(values || []).slice(0, 12);
    node.innerHTML = items.length ? items.map((item) => `<span>${escapeHtml(item)}</span>`).join('') : `<span>${escapeHtml(fallback)}</span>`;
  }

  function renderUniversalVisualScene(visualPlan, mountNode) {
    if (!mountNode) return;
    const plan = normalizeUniversalVisualPlan(visualPlan);
    const theme = plan.visualScene.renderHints?.colorTheme || getSubjectPack(plan.subjectId).colorTheme;
    const primary = theme.primary || '#7df4ff';
    const secondary = theme.secondary || '#ffd166';
    const accent = theme.accent || '#b8ffec';
    const nodes = plan.visualScene.nodes.slice(0, 7);
    const width = 860;
    const height = 340;
    const positioned = nodes.map((node, index) => {
      const network = plan.visualScene.sceneType === 'network' || plan.visualScene.sceneType === 'feedback-loop';
      const angle = (Math.PI * 2 * index) / Math.max(1, nodes.length);
      return {
        ...node,
        px: network ? 430 + Math.cos(angle) * 250 : 95 + index * (670 / Math.max(1, nodes.length - 1 || 1)),
        py: network ? 170 + Math.sin(angle) * 95 : index % 2 === 0 ? 145 : 205
      };
    });
    const byId = positioned.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {});
    const connections = plan.visualScene.connections.length
      ? plan.visualScene.connections
      : positioned.slice(0, -1).map((node, index) => ({ from: node.id, to: positioned[index + 1].id, label: plan.detected.processes[index] || 'flow' }));
    const svgConnections = connections.map((connection, index) => {
      const from = byId[connection.from] || positioned[index] || positioned[0];
      const to = byId[connection.to] || positioned[index + 1] || positioned[positioned.length - 1] || from;
      const pathId = `uv-flow-${plan.id}-${index}`.replace(/[^a-zA-Z0-9-]/g, '');
      const midX = (from.px + to.px) / 2;
      const midY = (from.py + to.py) / 2 - 34;
      return `
        <path id="${pathId}" d="M ${from.px} ${from.py} Q ${midX} ${midY} ${to.px} ${to.py}" fill="none" stroke="${escapeHtml(secondary)}" stroke-width="2" opacity=".58" marker-end="url(#uv-arrow)" />
        <circle r="4" fill="${escapeHtml(primary)}" opacity=".95">
          <animateMotion dur="${3 + index * .45}s" repeatCount="indefinite" path="M ${from.px} ${from.py} Q ${midX} ${midY} ${to.px} ${to.py}" />
        </circle>
        <text x="${midX}" y="${midY - 8}" fill="#eaffff" opacity=".75" font-size="11" text-anchor="middle">${escapeHtml(connection.label || 'flow')}</text>
      `;
    }).join('');
    const svgNodes = positioned.map((node, index) => {
      const radius = node.type === 'primary' ? 34 : 27;
      return `
        <g>
          <circle cx="${node.px}" cy="${node.py}" r="${radius + 13}" fill="${escapeHtml(primary)}" opacity=".05"></circle>
          <circle class="pulse" cx="${node.px}" cy="${node.py}" r="${radius}" fill="rgba(8,24,34,.96)" stroke="${escapeHtml(index === 0 ? secondary : primary)}" stroke-width="2.3" style="transform-origin:${node.px}px ${node.py}px; animation: universalPulse ${3 + index * .2}s ease-in-out infinite;"></circle>
          <text x="${node.px}" y="${node.py + 4}" fill="#eaffff" font-size="12" text-anchor="middle">${escapeHtml(String(node.label || '').slice(0, 18))}</text>
          <text x="${node.px}" y="${node.py + radius + 18}" fill="${escapeHtml(accent)}" opacity=".82" font-size="10" text-anchor="middle">${escapeHtml(node.role || node.type || 'node')}</text>
        </g>
      `;
    }).join('');
    const stages = plan.visualScene.stages.slice(0, 5);
    const stageHtml = stages.map((stage, index) => `<div><strong>${index + 1}. ${escapeHtml(stage.label)}</strong><br>${escapeHtml(stage.detail || '')}</div>`).join('');
    const legendHtml = (plan.visualScene.legend || []).slice(0, 4).map((item) => `<span>${escapeHtml(item.label || item)}: ${escapeHtml(item.meaning || '')}</span>`).join('<br>');

    mountNode.innerHTML = `
      <div class="universal-scene-frame" data-subject="${escapeHtml(plan.subjectId)}">
        <svg class="universal-scene-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(plan.title)} universal visual scene">
          <defs>
            <marker id="uv-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="${escapeHtml(secondary)}"></path>
            </marker>
            <radialGradient id="uv-bg-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="${escapeHtml(primary)}" stop-opacity=".2"></stop>
              <stop offset="100%" stop-color="#02070d" stop-opacity="0"></stop>
            </radialGradient>
          </defs>
          <rect x="0" y="0" width="${width}" height="${height}" fill="url(#uv-bg-glow)" opacity=".75"></rect>
          <g opacity=".22">
            ${Array.from({ length: 9 }).map((_, i) => `<line x1="${40 + i * 95}" y1="24" x2="${40 + i * 95}" y2="316" stroke="${escapeHtml(primary)}" stroke-width=".6"></line>`).join('')}
            ${Array.from({ length: 5 }).map((_, i) => `<line x1="30" y1="${58 + i * 56}" x2="830" y2="${58 + i * 56}" stroke="${escapeHtml(primary)}" stroke-width=".6"></line>`).join('')}
          </g>
          <text x="30" y="32" fill="${escapeHtml(secondary)}" font-size="13">${escapeHtml(plan.subject)} | ${escapeHtml(plan.chosenTemplate)} | ${escapeHtml(plan.visualScene.sceneType)}</text>
          ${svgConnections}
          ${svgNodes}
        </svg>
        <div class="universal-scene-caption">
          <div>
            <strong>What is happening?</strong>
            <p>${escapeHtml(plan.explanation.simple)}</p>
            <p class="compact">${escapeHtml(plan.explanation.scientific)}</p>
          </div>
          <div>
            <strong>Stages</strong>
            <div class="universal-stage-list">${stageHtml}</div>
          </div>
          <div>
            <strong>Legend</strong>
            <p class="compact">${legendHtml || 'Labels show detected entities, arrows show mechanism flow.'}</p>
          </div>
          <div>
            <strong>Innovation Connection</strong>
            <p class="compact">${escapeHtml(plan.explanation.innovationConnection)}</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderPackExplorer(pack) {
    const target = document.getElementById('universalPackExplorer');
    if (!target || !pack) return;
    target.innerHTML = `
      <div class="universal-pack-grid">
        <article class="universal-mini-card">
          <strong>Visual Alphabet</strong>
          <ul class="universal-pack-list">${(pack.visualAlphabet || []).slice(0, 12).map((item) => `<li>${escapeHtml(item.name || item)}</li>`).join('')}</ul>
        </article>
        <article class="universal-mini-card">
          <strong>Grammar Rules</strong>
          <ul class="universal-pack-list">${(pack.grammarRules || []).slice(0, 7).map((item) => `<li>${escapeHtml(item.name || item.id || item.rule || item)}</li>`).join('')}</ul>
        </article>
        <article class="universal-mini-card">
          <strong>Templates</strong>
          <ul class="universal-pack-list">${(pack.templates || []).slice(0, 8).map((item) => `<li>${escapeHtml(item.name || item.id || item)}</li>`).join('')}</ul>
        </article>
        <article class="universal-mini-card">
          <strong>Examples + Seeds</strong>
          <p>${escapeHtml(pack.conceptExamples?.length || 0)} concept examples</p>
          <p>${escapeHtml(pack.trainingSeeds?.length || 0)} symbolic training seeds</p>
          <p class="compact">${escapeHtml(pack.newsLogic || '')}</p>
        </article>
      </div>
    `;
  }

  function updateUniversalOutputs(plan) {
    const normalized = normalizeUniversalVisualPlan(plan);
    const setText = (id, value) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    };
    setText('universalDetectedSubjectOut', normalized.subject);
    setText('universalConfidenceOut', `${Math.round(normalized.confidence * 100)}%`);
    setText('universalTemplateOut', normalized.chosenTemplate);
    setText('universalSceneTypeOut', normalized.visualScene.sceneType);
    renderChips(document.getElementById('universalEntitiesOut'), normalized.detected.entities);
    renderChips(document.getElementById('universalProcessesOut'), normalized.detected.processes);
    renderChips(document.getElementById('universalLawsOut'), normalized.detected.laws.concat(normalized.detected.variables), 'No laws or variables detected');
    renderChips(document.getElementById('universalMatchesOut'), normalized.matchedExamples.map((match) => match.title), 'No close example match');
    setText('universalExplanationOut', normalized.explanation.simple);
    setText('universalScientificOut', normalized.explanation.scientific);
    setText('universalInnovationOut', normalized.explanation.innovationConnection);
    setText('universalWarningsOut', normalized.explanation.warnings.length ? normalized.explanation.warnings.join(' | ') : 'None');
    setText('universalProviderOut', `${normalized.providerMeta.mode} / ${normalized.providerMeta.provider}`);
    const jsonOut = document.getElementById('universalJsonOut');
    if (jsonOut) jsonOut.textContent = JSON.stringify(normalized, null, 2);
    renderUniversalVisualScene(normalized, document.getElementById('universalScenePreview'));
    renderPackExplorer(getSubjectPack(normalized.subjectId));
  }

  function setUniversalBusy(isBusy, text) {
    const button = document.getElementById('universalGenerateBtn');
    const status = document.getElementById('universalStatusOut');
    if (button) button.disabled = Boolean(isBusy);
    if (status && text) status.textContent = text;
  }

  async function handleUniversalGenerate() {
    const input = document.getElementById('universalInputText');
    const subjectSelect = document.getElementById('universalSubjectSelect');
    const modeSelect = document.getElementById('universalModeSelect');
    const renderSelect = document.getElementById('universalRenderModeSelect');
    const text = input?.value || '';
    const subject = subjectSelect?.value || 'auto';
    const mode = modeSelect?.value || 'local-rule';
    const renderMode = renderSelect?.value || sciloopRenderConfig.defaultRenderMode;
    let plan = generateUniversalVisualPlan(text, { subject, mode: 'local-rule', renderMode, sourceType: 'manual-input' });
    updateUniversalOutputs(plan);
    if (mode !== 'local-rule') {
      setUniversalBusy(true, 'AI refining visual plan...');
      const result = await routeUniversalVisualRequest({ fullText: text, subject, mode, localPlan: plan, renderMode }, { timeoutMs: 8000 });
      updateUniversalOutputs(result.visualPlan || plan);
      const status = document.getElementById('universalStatusOut');
      if (status) status.textContent = result.fallbackUsed ? `AI fallback used: ${result.warnings.join(' | ')}` : `AI provider used: ${result.providerUsed}`;
    }
    setUniversalBusy(false);
  }

  function fillUniversalSelectors() {
    const subjectSelect = document.getElementById('universalSubjectSelect');
    if (subjectSelect && !subjectSelect.dataset.bound) {
      subjectSelect.innerHTML = `<option value="auto">Auto detect</option>${subjectPacks.map((pack) => `<option value="${escapeHtml(pack.id)}">${escapeHtml(pack.title)}</option>`).join('')}`;
      subjectSelect.dataset.bound = '1';
      subjectSelect.addEventListener('change', () => {
        const pack = getSubjectPack(subjectSelect.value === 'auto' ? SUBJECT_FALLBACK : subjectSelect.value);
        renderPackExplorer(pack);
        document.querySelectorAll('.universal-subject-card').forEach((card) => {
          card.classList.toggle('active', card.dataset.subject === pack.id);
        });
      });
    }
    const grid = document.getElementById('universalSubjectGrid');
    if (grid && !grid.dataset.bound) {
      grid.innerHTML = subjectPacks.map((pack) => `
        <button class="universal-subject-card" type="button" data-subject="${escapeHtml(pack.id)}">
          <span>${escapeHtml(pack.icon)}</span>
          <strong>${escapeHtml(pack.title)}</strong>
          <p>${escapeHtml(pack.newsLogic)}</p>
        </button>
      `).join('');
      grid.dataset.bound = '1';
      grid.querySelectorAll('[data-subject]').forEach((button) => {
        button.addEventListener('click', () => {
          if (subjectSelect) {
            subjectSelect.value = button.dataset.subject;
            subjectSelect.dispatchEvent(new Event('change'));
          }
        });
      });
    }
  }

  function initUniversalVisualLanguagePortal() {
    ensureUniversalStyles();
    fillUniversalSelectors();
    const generateBtn = document.getElementById('universalGenerateBtn');
    if (generateBtn && !generateBtn.dataset.bound) {
      generateBtn.dataset.bound = '1';
      generateBtn.addEventListener('click', handleUniversalGenerate);
    }
    const latestBtn = document.getElementById('universalUseLatestNewsBtn');
    if (latestBtn && !latestBtn.dataset.bound) {
      latestBtn.dataset.bound = '1';
      latestBtn.addEventListener('click', () => {
        const latest = Array.isArray(window.latestVisibleNewsItems) ? window.latestVisibleNewsItems[0] : null;
        if (latest) openUniversalVisualFromItem(latest);
      });
    }
    const starterInput = document.getElementById('universalInputText');
    const currentJsonText = document.getElementById('universalJsonOut')?.textContent?.trim();
    const hasUserInput = Boolean(starterInput?.value?.trim());
    if ((!currentJsonText || currentJsonText === '{}') && !hasUserInput) {
      const starter = generateUniversalVisualPlan('A transformer uses attention to connect tokens in context.', { subject: 'artificial-intelligence', sourceType: 'demo' });
      updateUniversalOutputs(starter);
    }
  }

  function openUniversalVisualFromItem(item = {}) {
    initUniversalVisualLanguagePortal();
    const title = item.title || '';
    const summary = item.summary || item.description || '';
    const subject = item.subjectId || detectSubjectFromText(`${title} ${summary}`).subjectId;
    const input = document.getElementById('universalInputText');
    const subjectSelect = document.getElementById('universalSubjectSelect');
    const modeSelect = document.getElementById('universalModeSelect');
    if (input) input.value = unique([title, summary].filter(Boolean)).join('\n');
    if (subjectSelect) {
      subjectSelect.value = subjectPackById[subject] ? subject : 'auto';
      subjectSelect.dispatchEvent(new Event('change'));
    }
    if (modeSelect) modeSelect.value = 'local-rule';
    const plan = generateUniversalVisualPlan({ title, summary, sourceType: 'live-news' }, { subject, sourceType: 'live-news' });
    updateUniversalOutputs(plan);
  }

  function createDemoNewsItems() {
    const now = Date.now();
    const demoSubjects = subjectPacks.filter((pack) => !['biology', 'physics'].includes(pack.id));
    return demoSubjects.flatMap((pack, subjectIndex) => {
      const spec = specById[pack.id] || {};
      return (pack.conceptExamples || []).slice(0, 2).map((example, exampleIndex) => {
        const id = `universal-demo-${pack.id}-${exampleIndex + 1}`;
        return {
          id,
          title: `${example.title}: ${pack.title} visual discovery demo`,
          summary: `${example.simpleSentence} SciLoop demo item for ${pack.title}: ${pack.newsLogic}.`,
          date: new Date(now - (subjectIndex * 2 + exampleIndex) * 33 * 60 * 1000),
          publishedAt: new Date(now - (subjectIndex * 2 + exampleIndex) * 33 * 60 * 1000).toISOString(),
          source: 'SciLoop Demo Feed',
          link: `#${id}`,
          url: `#${id}`,
          field: pack.title,
          subjectId: pack.id,
          subjectIcon: pack.icon,
          subjectGroup: 'Universal Visual Language Demo',
          subjectDescription: `${pack.title} demo sample`,
          realityRole: pack.newsLogic,
          breakthroughType: 'Visual language seed',
          hotScore: Math.max(20, 90 - subjectIndex - exampleIndex),
          sourceId: 'sciloop-demo-feed',
          sourceKind: 'demo',
          sourceTier: 'local-demo',
          sourceCredibility: 'symbolic',
          subjects: [pack.title],
          sourceSubjects: [pack.id],
          keywords: spec.keywords || pack.newsKeywords
        };
      });
    });
  }

  window.sciloopSubjectRegistry = sciloopSubjectRegistry;
  window.sciloopUniversalVisualLanguageEngine = {
    version: '0.1',
    subjectPacks,
    schema: 'universal-visual-plan-v0',
    generateUniversalVisualPlan,
    renderUniversalVisualScene
  };
  window.sciloopNewsSourceRegistry = window.sciloopNewsSourceRegistry || sciloopNewsSourceRegistry;
  window.sciloopRenderConfig = window.sciloopRenderConfig || sciloopRenderConfig;
  window.sciloopUniversalDemoNewsItems = createDemoNewsItems();
  window.detectSubjectFromText = detectSubjectFromText;
  window.getSubjectPack = getSubjectPack;
  window.findClosestSubjectExamples = findClosestSubjectExamples;
  window.chooseSubjectTemplate = chooseSubjectTemplate;
  window.buildUniversalScenePlan = buildUniversalScenePlan;
  window.generateUniversalVisualPlan = generateUniversalVisualPlan;
  window.normalizeUniversalVisualPlan = normalizeUniversalVisualPlan;
  window.validateUniversalVisualPlan = validateUniversalVisualPlan;
  window.renderUniversalVisualScene = renderUniversalVisualScene;
  window.routeUniversalVisualRequest = routeUniversalVisualRequest;
  window.buildUniversalVisualPrompt = buildUniversalVisualPrompt;
  window.getCompactSubjectExampleContext = getCompactSubjectExampleContext;
  window.fallbackToLocalRenderer = fallbackToLocalRenderer;
  window.initUniversalVisualLanguagePortal = initUniversalVisualLanguagePortal;
  window.openUniversalVisualFromItem = openUniversalVisualFromItem;
})();
