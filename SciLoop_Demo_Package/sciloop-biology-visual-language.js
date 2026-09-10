(function () {
  const symbol = (id, name, emoji, meaning, shape, animation, scale, category) => ({
    id,
    name,
    emoji,
    meaning,
    shape,
    animation,
    scale,
    category
  });

  const template = (id, name, bestFor, visualLayout, animationSteps, interactionControls, exampleConcepts) => ({
    id,
    name,
    bestFor,
    visualLayout,
    animationSteps,
    interactionControls,
    exampleConcepts
  });

  const visualAlphabet = [
    symbol('dna_helix', 'DNA Helix', '🧬', 'Genetic information storage', 'twisted ladder / double spiral', 'unzip, copy, twist, glow', 'molecular', 'Molecular'),
    symbol('rna_strand', 'RNA Strand', 'RNA', 'Temporary genetic message', 'single ribbon with bases', 'transcribe, drift, dock', 'molecular', 'Molecular'),
    symbol('protein_chain', 'Protein Chain', 'PRT', 'Amino acid chain that folds into a working molecule', 'linked bead chain', 'fold, rotate, activate', 'molecular', 'Molecular'),
    symbol('enzyme', 'Enzyme', 'ENZ', 'Biological catalyst that speeds reactions', 'lock-and-key pocket', 'approach, bind, release', 'molecular', 'Molecular'),
    symbol('substrate', 'Substrate', 'SUB', 'Reactant that an enzyme acts on', 'small keyed molecule', 'dock, split, transform', 'molecular', 'Molecular'),
    symbol('molecule', 'Molecule', 'MOL', 'Chemical unit inside life processes', 'small connected circles', 'float, collide, combine', 'molecular', 'Molecular'),
    symbol('atp_packet', 'ATP Energy Packet', 'ATP', 'Usable cellular energy packet', 'gold charged capsule', 'pulse, charge, discharge', 'molecular', 'Molecular'),
    symbol('signal_molecule', 'Signal Molecule', 'SIG', 'Message molecule between cells or inside cells', 'glowing messenger dot', 'travel, bind, trigger', 'molecular', 'Molecular'),
    symbol('ion', 'Ion', 'ION', 'Charged particle crossing channels or gradients', 'tiny charged bead', 'flow, gate, accumulate', 'molecular', 'Molecular'),

    symbol('cell_membrane', 'Cell Membrane', 'CELL', 'Boundary that controls cell exchange', 'soft circular border', 'flex, gate, ripple', 'cellular', 'Cellular'),
    symbol('nucleus', 'Nucleus', 'NUC', 'DNA command center', 'inner glowing circle', 'protect, signal, divide', 'cellular', 'Cellular'),
    symbol('mitochondria', 'Mitochondrion', 'MITO', 'ATP production organelle', 'bean with inner folds', 'intake, glow, output ATP', 'cellular', 'Cellular'),
    symbol('ribosome', 'Ribosome', 'RIB', 'Protein assembly machine', 'two-part reader', 'read RNA, link amino acids', 'cellular', 'Cellular'),
    symbol('chloroplast', 'Chloroplast', 'CHL', 'Photosynthesis organelle', 'green oval stacks', 'absorb light, produce sugar', 'cellular', 'Cellular'),
    symbol('cytoplasm', 'Cytoplasm', 'CYT', 'Cell fluid where reactions move', 'soft interior field', 'diffuse, swirl, transport', 'cellular', 'Cellular'),
    symbol('receptor', 'Receptor', 'REC', 'Signal detector on membrane', 'antenna socket', 'bind, glow, relay', 'cellular', 'Cellular'),
    symbol('membrane_channel', 'Membrane Channel', 'CHAN', 'Gate for ions and molecules', 'tube through membrane', 'open, close, flow', 'cellular', 'Cellular'),
    symbol('vesicle', 'Vesicle', 'VES', 'Transport bubble for cargo', 'small membrane bubble', 'bud, move, fuse', 'cellular', 'Cellular'),

    symbol('neuron', 'Neuron', 'NEUR', 'Cell that sends electrical signals', 'branching wire cell', 'fire, pulse, reset', 'system', 'System'),
    symbol('synapse', 'Synapse', 'SYN', 'Gap where neurons communicate', 'two terminals with gap', 'release, cross, activate', 'system', 'System'),
    symbol('blood_vessel', 'Blood Vessel', 'VESSEL', 'Tube carrying cells and molecules', 'red flow channel', 'flow, pulse, deliver', 'system', 'System'),
    symbol('immune_cell', 'Immune Cell', 'IMM', 'Defender that detects threats', 'active patrol cell', 'detect, chase, attack', 'system', 'System'),
    symbol('pathogen', 'Pathogen', 'PATH', 'Disease-causing virus or bacterium', 'spiked invader', 'enter, multiply, evade', 'system', 'System'),
    symbol('tissue_layer', 'Tissue Layer', 'TISS', 'Organized sheet of cells', 'stacked cell tiles', 'grow, repair, remodel', 'system', 'System'),
    symbol('organ_module', 'Organ Module', 'ORG', 'Body system component', 'labeled functional block', 'coordinate, output, respond', 'system', 'System'),
    symbol('hormone_signal', 'Hormone Signal', 'HORM', 'Long-range chemical instruction', 'traveling signal bead', 'circulate, bind, regulate', 'system', 'System'),

    symbol('species_node', 'Species Node', 'SP', 'Population or species in evolution/ecology', 'cluster node', 'branch, expand, shrink', 'population', 'Evolution and Ecology'),
    symbol('mutation_spark', 'Mutation Spark', 'MUT', 'Heritable genetic change', 'bright spark on code', 'flash, alter, inherit', 'molecular/population', 'Evolution and Ecology'),
    symbol('selection_pressure', 'Selection Pressure', 'SEL', 'Environment filter changing survival', 'filter wall / force field', 'filter, remove, favor', 'population', 'Evolution and Ecology'),
    symbol('fitness_meter', 'Fitness Meter', 'FIT', 'Relative survival or reproduction success', 'adaptive meter', 'rise, fall, compare', 'population', 'Evolution and Ecology'),
    symbol('population_cluster', 'Population Cluster', 'POP', 'Many organisms with variation', 'many varied dots', 'vary, reproduce, shift', 'population', 'Evolution and Ecology'),
    symbol('food_web_link', 'Food Web Link', 'WEB', 'Energy relationship between organisms', 'directed connection line', 'flow, compete, rebalance', 'ecosystem', 'Evolution and Ecology'),
    symbol('ecosystem_node', 'Ecosystem Node', 'ECO', 'Habitat with interacting life', 'land/water system node', 'cycle, stress, recover', 'ecosystem', 'Evolution and Ecology'),

    symbol('action_copy', 'Copy', 'COPY', 'Duplicate information or structure', 'split echo', 'copy outward', 'any', 'Visual Actions'),
    symbol('action_split', 'Split', 'SPLIT', 'One structure becomes parts', 'forked line', 'separate, diverge', 'any', 'Visual Actions'),
    symbol('action_merge', 'Merge', 'MERGE', 'Parts combine into one unit', 'converging arrows', 'combine, stabilize', 'any', 'Visual Actions'),
    symbol('action_bind', 'Bind', 'BIND', 'Specific fit between two entities', 'lock contact', 'snap, glow', 'any', 'Visual Actions'),
    symbol('action_fold', 'Fold', 'Chain becomes 3D function', 'curling ribbon', 'fold, settle', 'molecular', 'Visual Actions'),
    symbol('action_transport', 'Transport', 'Move material across a space or boundary', 'moving arrow', 'carry, pass, deliver', 'any', 'Visual Actions'),
    symbol('action_signal', 'Signal', 'Information triggers a response', 'pulse line', 'emit, travel, activate', 'any', 'Visual Actions'),
    symbol('action_consume_energy', 'Consume Energy', 'USE', 'Spend ATP to drive work', 'draining packet', 'dim, transfer', 'molecular/cellular', 'Visual Actions'),
    symbol('action_release_energy', 'Release Energy', 'REL', 'Make energy available', 'gold burst', 'charge, glow, distribute', 'molecular/cellular', 'Visual Actions'),
    symbol('action_mutate', 'Mutate', 'Change inherited code', 'spark on strand', 'flash, alter', 'molecular/population', 'Visual Actions'),
    symbol('action_reproduce', 'Reproduce', 'Make more organisms or cells', 'expanding copies', 'duplicate, spread', 'cellular/population', 'Visual Actions'),
    symbol('action_compete', 'Compete', 'Entities affect each other by limited resources', 'opposing arrows', 'push, shrink, expand', 'population/ecosystem', 'Visual Actions'),
    symbol('action_regulate', 'Regulate', 'Keep variable near a useful range', 'feedback dial', 'sense, correct, stabilize', 'system', 'Visual Actions'),
    symbol('action_attack', 'Attack', 'Defender damages target', 'impact burst', 'detect, strike, clear', 'system', 'Visual Actions'),
    symbol('action_repair', 'Repair', 'Restore damaged structure', 'patch glow', 'find, mend, stabilize', 'molecular/cellular', 'Visual Actions'),
    symbol('action_adapt', 'Adapt', 'Trait distribution shifts over generations', 'rising trait wave', 'select, expand, inherit', 'population', 'Visual Actions')
  ];

  const templates = [
    template('sequence', 'Sequence Template', 'Step-by-step biological processes', 'left-to-right stages with highlighted current step', ['start state appears', 'active entity moves through steps', 'outcome locks into place'], ['Play stages', 'Inspect step', 'Replay'], ['DNA Replication', 'Protein Synthesis', 'Mitosis']),
    template('flow', 'Flow Template', 'Matter or energy movement', 'source nodes feed into transformation core and output nodes', ['inputs enter', 'core glows', 'outputs leave'], ['Trace input', 'Energy meter', 'Slow flow'], ['Photosynthesis', 'Cellular Respiration', 'Blood Oxygen Transport']),
    template('feedback_loop', 'Feedback Loop Template', 'Regulation and homeostasis', 'circular sensor-control-response loop', ['variable changes', 'sensor activates', 'response corrects', 'balance returns'], ['Set variable', 'Show loop', 'Reset balance'], ['Homeostasis', 'Glucose Control', 'Hormone Regulation']),
    template('network', 'Network Template', 'Interacting systems', 'nodes connected by pulsing links', ['node activates', 'signal travels', 'neighbor responds'], ['Follow signal', 'Highlight node', 'Pause network'], ['Neuron Networks', 'Food Webs', 'Immune Signaling']),
    template('hierarchy', 'Hierarchy Template', 'Scale and nested biology organization', 'stacked scale ladder from molecule to ecosystem', ['zoom from small scale', 'nest into larger levels', 'show relationships'], ['Zoom scale', 'Open level', 'Compare levels'], ['Molecule to Cell', 'Cell to Tissue', 'Organism to Ecosystem']),
    template('comparison', 'Comparison Template', 'Before/after or healthy/diseased states', 'split panel with shared measurement axis', ['baseline appears', 'change applies', 'difference is highlighted'], ['Before/after', 'Toggle labels', 'Compare signals'], ['Cancer Cell Growth', 'Antibiotic Effect', 'Healthy vs Diseased Tissue']),
    template('evolution', 'Evolution Template', 'Mutation, selection, adaptation', 'population variation dots passing through pressure filter', ['variants appear', 'pressure filters population', 'survivors reproduce'], ['Change pressure', 'Show trait frequency', 'Run generations'], ['Natural Selection', 'Antibiotic Resistance', 'Darwinian Selection']),
    template('defense', 'Battle/Defense Template', 'Immune defense and pathogen response', 'threat entry, detection, attack, memory layer', ['pathogen enters', 'immune cell detects', 'attack clears threat', 'memory remains'], ['Replay attack', 'Show antibodies', 'Compare first/second exposure'], ['Immune Response', 'Vaccination', 'Virus vs Immune System'])
  ];

  const grammarRules = [
    { id: 'entity_process_outcome', name: 'Entity + Process + Outcome', pattern: 'entity performs process to create outcome', example: 'Enzyme breaks substrate', visual: 'enzyme approaches substrate -> binding pocket locks -> substrate splits -> products exit' },
    { id: 'input_transformation_output', name: 'Input -> Transformation -> Output', pattern: 'inputs enter biological transformer and outputs leave', example: 'Photosynthesis converts light into chemical energy', visual: 'sunlight enters chloroplast -> water and CO2 flow in -> glucose and oxygen flow out' },
    { id: 'signal_receptor_response', name: 'Signal -> Receptor -> Response', pattern: 'signal binds detector and triggers internal change', example: 'Hormone binds receptor and changes cell behavior', visual: 'signal travels -> receptor glows -> cascade activates -> cell output changes' },
    { id: 'code_copy_expression', name: 'Code -> Copy -> Expression', pattern: 'stored code becomes working molecule', example: 'DNA stores instructions for proteins', visual: 'DNA segment highlights -> RNA copy emerges -> ribosome reads -> protein folds' },
    { id: 'variation_selection_adaptation', name: 'Variation -> Selection -> Adaptation', pattern: 'population variation changes under pressure', example: 'Natural selection increases useful traits', visual: 'variants appear -> environment filter applies -> better-fit variant expands' },
    { id: 'homeostasis_feedback', name: 'Homeostasis Feedback Loop', pattern: 'variable change triggers correction', example: 'Body temperature is regulated by feedback', visual: 'temperature rises -> sensor detects -> control center responds -> cooling lowers temperature' },
    { id: 'defense_system', name: 'Defense System', pattern: 'threat detection leads to clearance and memory', example: 'Immune cells attack pathogens', visual: 'pathogen enters -> immune cell detects -> bind/attack -> pathogen cleared -> memory cell remains' },
    { id: 'network_interaction', name: 'Network Interaction', pattern: 'nodes communicate through links', example: 'Neurons communicate through synapses', visual: 'neuron fires -> signal travels along axon -> synapse releases molecules -> next neuron activates' }
  ];

  const example = (id, title, sentence, meaning, scale, entities, process, templateId, steps, controls, explanation, warning, innovation, sceneMode) => ({
    id,
    title,
    simpleSentence: sentence,
    scientificMeaning: meaning,
    scale,
    entities,
    process,
    template: templateId,
    animationSteps: steps,
    userControls: controls,
    simpleExplanation: explanation,
    misconceptionWarning: warning,
    innovationConnection: innovation,
    sceneMode: sceneMode || templateId
  });

  const conceptExamples = [
    example('dna_replication', 'DNA Replication', 'DNA replicates before cell division', 'Cells copy DNA by separating strands and building complementary strands.', 'molecular/cellular', ['DNA', 'enzyme', 'nucleotide', 'cell'], 'replication', 'sequence', ['DNA helix opens', 'enzymes stabilize open strands', 'new bases pair with each strand', 'two DNA molecules form'], ['step slider', 'enzyme labels', 'replay unzip'], 'The cell copies its instruction code before dividing.', 'Replication is not random copying; base-pairing rules guide the new strands.', 'Better DNA-copy visuals support genetics education, diagnostics, cancer biology, and synthetic biology.', 'dna'),
    example('protein_synthesis', 'Protein Synthesis', 'DNA makes RNA then protein', 'Gene information is transcribed into RNA and translated by ribosomes into protein.', 'molecular/cellular', ['DNA', 'RNA', 'ribosome', 'amino acid', 'protein'], 'gene expression', 'sequence', ['DNA gene highlights', 'RNA copy exits nucleus', 'ribosome reads RNA codons', 'protein chain folds'], ['show codons', 'pause ribosome', 'fold protein'], 'A gene becomes a working protein through an RNA message.', 'One gene does not always mean one simple trait; regulation and environment matter.', 'This mapping is core for biotechnology, medicine, gene therapy, and protein design.', 'dna'),
    example('photosynthesis', 'Photosynthesis', 'Plants convert sunlight, water, and CO2 into sugar and oxygen', 'Chloroplasts use light energy to build glucose from carbon dioxide and water.', 'cellular/ecosystem', ['sunlight', 'chloroplast', 'water', 'CO2', 'glucose', 'oxygen'], 'energy conversion', 'flow', ['sunlight particles enter chloroplast', 'water and CO2 flow in', 'energy core builds glucose', 'oxygen exits'], ['trace carbon', 'energy meter', 'show outputs'], 'Plants turn light into chemical energy stored in sugar.', 'Plants do not get most of their mass from soil; carbon dioxide supplies much of the carbon.', 'Photosynthesis visuals connect climate, agriculture, biofuel, and carbon capture research.', 'photosynthesis'),
    example('cellular_respiration', 'Cellular Respiration', 'Mitochondria produce ATP from glucose', 'Cells convert glucose and oxygen into ATP, carbon dioxide, and water.', 'cellular/molecular', ['mitochondria', 'glucose', 'oxygen', 'ATP', 'CO2'], 'energy release', 'flow', ['glucose enters mitochondrion', 'oxygen enters', 'conversion core glows', 'ATP packets exit'], ['ATP meter', 'trace glucose', 'show oxygen'], 'Mitochondria convert food energy into usable cellular energy.', 'Respiration is not the same as breathing; breathing supplies oxygen for cellular respiration.', 'Understanding energy conversion helps medicine, aging research, sports science, and bioenergy.', 'flow'),
    example('mitosis', 'Mitosis', 'A cell divides into two identical body cells', 'Chromosomes separate so one parent cell forms two genetically matching daughter cells.', 'cellular', ['cell', 'chromosome', 'spindle', 'nucleus'], 'cell division', 'sequence', ['chromosomes condense', 'line up in the middle', 'copies separate', 'two cells form'], ['stage selector', 'chromosome count', 'replay split'], 'One body cell makes two matching cells for growth and repair.', 'Mitosis does not make sperm or eggs; meiosis does that.', 'Mitosis visuals support cancer biology, tissue repair, and developmental science.', 'sequence'),
    example('meiosis', 'Meiosis', 'Meiosis makes sex cells with half the chromosomes', 'Two divisions create genetically varied gametes with one set of chromosomes.', 'cellular', ['cell', 'chromosome', 'gamete', 'spindle'], 'reduction division', 'sequence', ['homologous chromosomes pair', 'crossing-over swaps segments', 'two divisions occur', 'four varied gametes form'], ['compare mitosis', 'show crossing-over', 'chromosome tracker'], 'Meiosis creates variety and halves chromosome number for reproduction.', 'Meiosis is not just mitosis twice; crossing-over and chromosome reduction are key.', 'This visual layer helps inheritance, fertility, and evolution education.', 'sequence'),
    example('enzyme_catalysis', 'Enzyme Catalysis', 'An enzyme binds a substrate and makes a reaction faster', 'Enzymes lower activation energy by holding substrates in reaction-friendly positions.', 'molecular', ['enzyme', 'substrate', 'product'], 'catalysis', 'sequence', ['substrate approaches enzyme pocket', 'binding changes shape', 'reaction occurs', 'products release'], ['lock/key view', 'energy barrier meter', 'replay binding'], 'An enzyme is a tiny helper machine that speeds a specific reaction.', 'Enzymes are not used up by the reaction; they can work again.', 'Enzyme design drives medicines, green chemistry, food science, and industrial biology.', 'sequence'),
    example('osmosis', 'Osmosis', 'Water moves across a membrane toward higher solute concentration', 'Water diffuses through a semipermeable membrane to reduce concentration differences.', 'cellular', ['water', 'cell membrane', 'solute', 'channel'], 'diffusion', 'flow', ['two sides show different solute levels', 'water particles cross membrane', 'cell volume changes', 'balance approaches'], ['solute slider', 'cell swelling view', 'pause water'], 'Water moves to balance concentration across a membrane.', 'Osmosis is water movement, not solute movement.', 'Osmosis visuals support medicine, plant biology, kidney science, and biotech.', 'flow'),
    example('active_transport', 'Active Transport', 'Cells use ATP to move molecules against a gradient', 'Membrane pumps spend energy to move substances from low to high concentration.', 'cellular/molecular', ['ATP', 'membrane channel', 'ion', 'cell membrane'], 'active transport', 'flow', ['ATP packet docks on pump', 'pump changes shape', 'ion moves uphill', 'gradient increases'], ['ATP toggle', 'gradient meter', 'pump labels'], 'Cells can spend energy to move molecules the hard way.', 'Active transport is not passive diffusion; it needs energy.', 'Transport visuals connect neuroscience, kidney function, drug delivery, and cell engineering.', 'flow'),
    example('neuron_firing', 'Neuron Firing', 'A neuron fires an electrical signal along its axon', 'Ion flow changes membrane voltage and sends an action potential down the neuron.', 'cellular/system', ['neuron', 'ion', 'membrane channel', 'axon'], 'action potential', 'network', ['resting voltage appears', 'ion channels open', 'electrical pulse travels', 'neuron resets'], ['voltage meter', 'slow pulse', 'channel view'], 'A neuron sends a fast electrical pulse by opening ion gates.', 'A neuron firing is an electrochemical wave, not electricity moving like a wire only.', 'This foundation connects learning, brain interfaces, neuromedicine, and AI inspiration.', 'neuron'),
    example('synaptic_transmission', 'Synaptic Transmission', 'A neuron releases chemicals across a synapse', 'Neurotransmitters cross the synaptic gap and activate receptors on the next neuron.', 'cellular/system', ['neuron', 'synapse', 'neurotransmitter', 'receptor'], 'chemical signaling', 'network', ['electrical pulse reaches terminal', 'vesicles release molecules', 'signals cross gap', 'next neuron activates'], ['show receptors', 'signal speed', 'reuptake toggle'], 'Neurons talk across tiny gaps using chemical messages.', 'The neurons usually do not touch directly; the synapse is a gap with chemical signaling.', 'Synapse visuals support mental health, memory research, drugs, and neural engineering.', 'neuron'),
    example('immune_response', 'Immune Response', 'Immune cells detect and attack a virus', 'Innate and adaptive immune cells identify threats, attack pathogens, and coordinate cleanup.', 'cellular/system', ['immune cell', 'pathogen', 'antibody', 'signal molecule'], 'defense', 'defense', ['pathogen enters', 'immune cell detects markers', 'attack and cleanup begin', 'memory signal remains'], ['pathogen count', 'show antibodies', 'replay defense'], 'Immune cells patrol, recognize invaders, and help clear them.', 'The immune system is coordinated; it is not one single cell doing everything.', 'Immune visuals support vaccines, diagnostics, cancer immunotherapy, and outbreak education.', 'immune'),
    example('vaccination_memory', 'Vaccination / Immune Memory', 'Vaccination trains immune memory before infection', 'Vaccines expose the immune system to a safe target so memory cells respond faster later.', 'system', ['vaccine antigen', 'immune cell', 'antibody', 'memory cell'], 'immune memory', 'defense', ['safe antigen appears', 'immune cells learn marker', 'memory cells remain', 'later pathogen is cleared faster'], ['first vs second exposure', 'memory toggle', 'antibody meter'], 'A vaccine gives the immune system a practice target.', 'Vaccines do not need to cause the full disease to train immune memory.', 'This visual grammar helps public health, vaccine design, and trust-building education.', 'immune'),
    example('natural_selection', 'Evolution by Natural Selection', 'Natural selection increases useful traits over generations', 'Heritable variation plus environmental pressure changes trait frequencies in populations.', 'population/ecosystem', ['population', 'mutation', 'selection pressure', 'fitness meter'], 'natural selection', 'evolution', ['variants appear', 'environment filter applies', 'survivors reproduce', 'trait frequency shifts'], ['pressure slider', 'generation run', 'trait meter'], 'Traits that help survival or reproduction can become more common over generations.', 'Individuals do not evolve during their lifetime; populations evolve across generations.', 'Evolution visuals support medicine, agriculture, conservation, and origin-of-innovation thinking.', 'evolution'),
    example('antibiotic_resistance', 'Antibiotic Resistance', 'Mutation helps bacteria survive antibiotics', 'Some bacteria carry resistance traits and reproduce after antibiotic pressure removes others.', 'population/molecular', ['bacteria', 'mutation', 'antibiotic', 'population'], 'selection', 'evolution', ['mixed bacteria population appears', 'antibiotic pressure arrives', 'susceptible bacteria shrink', 'resistant bacteria expand'], ['antibiotic level', 'generation replay', 'resistance meter'], 'Antibiotics can select for bacteria that already resist them.', 'Antibiotics do not intentionally teach bacteria; selection favors resistant variants.', 'This visual is vital for medicine, stewardship, hospital safety, and drug discovery.', 'evolution'),
    example('cancer_growth', 'Cancer Cell Growth', 'Cancer cells divide when growth controls fail', 'Mutations can disrupt cell-cycle regulation, allowing uncontrolled cell division.', 'cellular/tissue', ['cell', 'mutation', 'growth signal', 'tissue'], 'uncontrolled growth', 'comparison', ['normal cell waits for signals', 'mutation disables control', 'extra divisions appear', 'tissue structure is disrupted'], ['normal/cancer toggle', 'division rate meter', 'repair marker'], 'Cancer growth begins when control systems that limit division fail.', 'Cancer is not one disease; many mutation paths can produce uncontrolled growth.', 'This supports oncology education, early detection, therapy planning, and prevention literacy.', 'comparison'),
    example('crispr_gene_editing', 'CRISPR Gene Editing', 'CRISPR can cut DNA at a chosen sequence', 'Guide RNA directs Cas protein to a DNA target so the sequence can be cut and repaired.', 'molecular/cellular', ['DNA', 'guide RNA', 'Cas enzyme', 'repair system'], 'gene editing', 'sequence', ['guide RNA matches DNA target', 'Cas enzyme docks', 'DNA is cut', 'repair changes sequence'], ['target selector', 'cut site view', 'repair outcome toggle'], 'CRISPR is a programmable DNA targeting and editing system.', 'CRISPR is powerful but not magically perfect; delivery and off-target risk matter.', 'Gene editing visuals support medicine, agriculture, ethics, and synthetic biology.', 'dna'),
    example('homeostasis', 'Homeostasis', 'The body uses feedback to keep conditions balanced', 'Sensors and responses regulate variables such as temperature, glucose, and water balance.', 'system', ['sensor', 'control center', 'hormone signal', 'organ module'], 'regulation', 'feedback_loop', ['variable moves away from set point', 'sensor detects change', 'response activates', 'variable returns toward balance'], ['set point slider', 'disturbance button', 'loop labels'], 'Homeostasis is the body correcting changes to stay in a useful range.', 'Homeostasis is dynamic adjustment, not a frozen constant.', 'Feedback visuals connect medicine, wearable health, robotics, and systems design.', 'feedback'),
    example('hormone_signaling', 'Hormone Signaling', 'A hormone binds a receptor and changes cell behavior', 'Hormones travel to target cells and activate receptor-controlled responses.', 'cellular/system', ['hormone signal', 'receptor', 'cell membrane', 'gene'], 'signaling', 'network', ['hormone travels through fluid', 'receptor binds signal', 'internal cascade activates', 'cell changes output'], ['receptor match', 'cascade view', 'response meter'], 'Hormones are long-range messages that cells read through receptors.', 'A hormone affects only cells with matching receptors.', 'This supports endocrinology, metabolism, fertility, stress science, and drug design.', 'neuron'),
    example('microbiome_interaction', 'Microbiome Interaction', 'Gut microbes interact with the immune system and metabolism', 'Microbial communities produce molecules that influence digestion, immunity, and health.', 'ecosystem/system', ['microbe', 'immune cell', 'metabolite', 'tissue layer'], 'ecosystem interaction', 'network', ['microbe clusters appear', 'metabolites flow to tissue', 'immune cell receives signals', 'system balance shifts'], ['microbe mix', 'signal filter', 'balance meter'], 'The microbiome is a living community that exchanges signals with the body.', 'Not all microbes are harmful; many are neutral or helpful depending on context.', 'Microbiome visuals support nutrition, medicine, mental health, and ecological thinking inside the body.', 'network')
  ];

  const trainingSeedInputs = [
    ['Mitochondria produce ATP from glucose', 'Cellular Respiration', 'cellular', ['mitochondria', 'glucose', 'oxygen', 'ATP'], 'energy conversion', 'flow', ['glucose enters mitochondrion', 'oxygen enters', 'energy conversion core glows', 'ATP packets exit']],
    ['DNA replicates before cell division', 'DNA Replication', 'molecular/cellular', ['DNA', 'enzyme', 'nucleotide'], 'replication', 'sequence', ['helix opens', 'bases pair', 'two DNA copies form']],
    ['DNA makes RNA then protein', 'Protein Synthesis', 'molecular/cellular', ['DNA', 'RNA', 'ribosome', 'protein'], 'gene expression', 'sequence', ['gene highlights', 'RNA copy emerges', 'ribosome builds protein']],
    ['Sunlight enters chloroplasts to make glucose', 'Photosynthesis', 'cellular', ['sunlight', 'chloroplast', 'CO2', 'water', 'glucose'], 'photosynthesis', 'flow', ['light enters', 'inputs combine', 'glucose and oxygen exit']],
    ['Cells split chromosomes during mitosis', 'Mitosis', 'cellular', ['cell', 'chromosome', 'spindle'], 'cell division', 'sequence', ['chromosomes line up', 'copies separate', 'two cells form']],
    ['Meiosis creates varied gametes', 'Meiosis', 'cellular', ['chromosome', 'gamete', 'cell'], 'reduction division', 'sequence', ['chromosomes pair', 'segments swap', 'four gametes form']],
    ['An enzyme breaks a substrate into products', 'Enzyme Catalysis', 'molecular', ['enzyme', 'substrate', 'product'], 'catalysis', 'sequence', ['enzyme binds', 'substrate changes', 'products release']],
    ['Water moves into a salty cell by osmosis', 'Osmosis', 'cellular', ['water', 'membrane', 'solute'], 'osmosis', 'flow', ['water gradient appears', 'water crosses membrane', 'cell volume shifts']],
    ['ATP powers a membrane pump', 'Active Transport', 'cellular/molecular', ['ATP', 'membrane channel', 'ion'], 'active transport', 'flow', ['ATP docks', 'pump changes shape', 'ion moves against gradient']],
    ['A neuron fires a signal', 'Neuron Firing', 'cellular/system', ['neuron', 'ion', 'axon'], 'action potential', 'network', ['ion channels open', 'pulse travels', 'neuron resets']],
    ['Neurons communicate through synapses', 'Synaptic Transmission', 'cellular/system', ['neuron', 'synapse', 'neurotransmitter'], 'chemical signaling', 'network', ['pulse arrives', 'molecules release', 'next neuron activates']],
    ['Immune cells attack virus particles', 'Immune Response', 'system', ['immune cell', 'virus', 'antibody'], 'defense', 'defense', ['pathogen enters', 'immune cell detects', 'pathogen cleared']],
    ['Vaccines create immune memory', 'Vaccination / Immune Memory', 'system', ['vaccine antigen', 'memory cell', 'antibody'], 'immune memory', 'defense', ['safe target appears', 'memory forms', 'later response is faster']],
    ['Natural selection favors useful traits', 'Evolution by Natural Selection', 'population', ['population', 'variation', 'selection pressure'], 'selection', 'evolution', ['variants appear', 'pressure filters', 'survivors reproduce']],
    ['Bacteria become resistant to antibiotics', 'Antibiotic Resistance', 'population/molecular', ['bacteria', 'mutation', 'antibiotic'], 'selection', 'evolution', ['mixed bacteria appear', 'antibiotic pressure applies', 'resistant cells expand']],
    ['Cancer cells divide without normal controls', 'Cancer Cell Growth', 'cellular/tissue', ['cell', 'mutation', 'tissue'], 'uncontrolled growth', 'comparison', ['normal control shown', 'mutation appears', 'extra divisions expand']],
    ['CRISPR cuts a target DNA sequence', 'CRISPR Gene Editing', 'molecular', ['DNA', 'guide RNA', 'Cas enzyme'], 'gene editing', 'sequence', ['guide matches', 'Cas docks', 'DNA cut repairs']],
    ['Body temperature is regulated by feedback', 'Homeostasis', 'system', ['sensor', 'control center', 'organ'], 'homeostasis', 'feedback_loop', ['temperature rises', 'sensor detects', 'cooling response lowers value']],
    ['Hormone binds receptor and changes behavior', 'Hormone Signaling', 'cellular/system', ['hormone', 'receptor', 'cell'], 'signaling', 'network', ['hormone travels', 'receptor binds', 'response activates']],
    ['Gut microbes signal to immune cells', 'Microbiome Interaction', 'ecosystem/system', ['microbe', 'immune cell', 'metabolite'], 'interaction', 'network', ['microbes release molecules', 'signals reach tissue', 'immune response shifts']],
    ['Ribosomes link amino acids into proteins', 'Protein Synthesis', 'molecular', ['ribosome', 'amino acid', 'RNA'], 'translation', 'sequence', ['ribosome reads RNA', 'amino acids join', 'protein folds']],
    ['Chloroplasts release oxygen during photosynthesis', 'Photosynthesis', 'cellular', ['chloroplast', 'oxygen', 'sunlight'], 'photosynthesis', 'flow', ['light arrives', 'water splits', 'oxygen exits']],
    ['Ion channels open during nerve signals', 'Neuron Firing', 'cellular/system', ['ion', 'membrane channel', 'neuron'], 'ion flow', 'network', ['channel opens', 'ions flow', 'voltage wave moves']],
    ['Antibodies bind pathogens', 'Immune Response', 'system', ['antibody', 'pathogen', 'immune cell'], 'binding defense', 'defense', ['antibody recognizes marker', 'pathogen is tagged', 'immune cleanup starts']],
    ['A feedback loop controls blood glucose', 'Homeostasis', 'system', ['glucose', 'hormone signal', 'organ module'], 'regulation', 'feedback_loop', ['glucose rises', 'hormone signal changes', 'cells take up glucose']],
    ['Mutation creates a new trait in a population', 'Evolution by Natural Selection', 'population/molecular', ['mutation', 'population', 'trait'], 'variation', 'evolution', ['mutation spark appears', 'trait dot changes', 'generations shift']],
    ['Cells repair damaged DNA', 'DNA Repair', 'molecular/cellular', ['DNA', 'enzyme', 'repair system'], 'repair', 'sequence', ['damage marker appears', 'repair enzyme docks', 'DNA strand stabilizes']],
    ['Vesicles transport proteins through the cell', 'Cell Transport', 'cellular', ['vesicle', 'protein', 'cytoplasm'], 'transport', 'flow', ['protein enters vesicle', 'vesicle moves', 'cargo is delivered']],
    ['Receptors detect signals outside the cell', 'Hormone Signaling', 'cellular', ['signal molecule', 'receptor', 'cell membrane'], 'signal detection', 'network', ['signal approaches', 'receptor glows', 'inside response begins']],
    ['Food webs move energy through ecosystems', 'Food Web Energy Flow', 'ecosystem', ['ecosystem node', 'food web link', 'species node'], 'energy flow', 'network', ['producer node glows', 'energy link pulses', 'consumer nodes activate']],
    ['Species adapt when environments change', 'Evolution by Natural Selection', 'population/ecosystem', ['species node', 'selection pressure', 'fitness meter'], 'adaptation', 'evolution', ['environment shifts', 'fitness changes', 'adapted variants expand']],
    ['Pathogens evolve under immune pressure', 'Pathogen Evolution', 'population/system', ['pathogen', 'immune cell', 'mutation'], 'evolutionary escape', 'evolution', ['immune pressure appears', 'variants differ', 'surviving variant spreads']]
  ];

  const biologyTrainingSeeds = trainingSeedInputs.map(([input, concept, scale, entities, process, templateId, visualPlan]) => ({
    input,
    subject: 'Biology',
    concept,
    scale,
    entities,
    process,
    template: getTemplateName(templateId),
    visualGrammar: 'Text -> entities -> process -> scale -> template -> scene plan -> animation -> explanation',
    scenePlan: visualPlan,
    animationPlan: visualPlan,
    explanation: makeSeedExplanation(concept, process),
    innovationConnection: 'This symbolic mapping helps future SciLoop AI convert biology news into reusable visual explanations.'
  }));

  const keywordRules = [
    { id: 'dna_replication', terms: ['dna replicate', 'replication', 'copy dna', 'dna copies'] },
    { id: 'protein_synthesis', terms: ['protein synthesis', 'rna then protein', 'ribosome', 'amino acid', 'translation', 'transcription'] },
    { id: 'photosynthesis', terms: ['photosynthesis', 'chloroplast', 'sunlight', 'co2', 'carbon dioxide', 'glucose and oxygen'] },
    { id: 'cellular_respiration', terms: ['mitochondria', 'mitochondrion', 'atp', 'glucose', 'cellular respiration'] },
    { id: 'mitosis', terms: ['mitosis', 'body cell', 'cell divides', 'two identical'] },
    { id: 'meiosis', terms: ['meiosis', 'gamete', 'sex cell', 'half chromosomes'] },
    { id: 'enzyme_catalysis', terms: ['enzyme', 'substrate', 'catalyst', 'catalysis'] },
    { id: 'osmosis', terms: ['osmosis', 'water moves', 'solute', 'semipermeable'] },
    { id: 'active_transport', terms: ['active transport', 'membrane pump', 'against gradient', 'uses atp'] },
    { id: 'neuron_firing', terms: ['neuron fires', 'action potential', 'axon', 'ion channel'] },
    { id: 'antibiotic_resistance', terms: ['antibiotic resistance', 'survive antibiotics', 'resistant bacteria', 'antibiotic', 'antibiotics'] },
    { id: 'synaptic_transmission', terms: ['synapse', 'neurotransmitter', 'neurons communicate'] },
    { id: 'immune_response', terms: ['immune', 'virus', 'bacteria', 'pathogen', 'antibody', 'attack virus'] },
    { id: 'vaccination_memory', terms: ['vaccine', 'vaccination', 'immune memory', 'memory cell'] },
    { id: 'natural_selection', terms: ['natural selection', 'selection', 'adaptation', 'evolution', 'fitness'] },
    { id: 'cancer_growth', terms: ['cancer', 'tumor', 'uncontrolled growth'] },
    { id: 'crispr_gene_editing', terms: ['crispr', 'gene editing', 'cas enzyme'] },
    { id: 'homeostasis', terms: ['homeostasis', 'temperature', 'glucose control', 'balance', 'feedback'] },
    { id: 'hormone_signaling', terms: ['hormone', 'receptor', 'cell behavior'] },
    { id: 'microbiome_interaction', terms: ['microbiome', 'gut microbe', 'microbes'] }
  ];

  function getTemplateName(templateId) {
    const extensionNames = {
      intervention: 'Intervention / Edit Template',
      discovery_spotlight: 'Discovery Spotlight Template'
    };
    return templates.find((item) => item.id === templateId)?.name || extensionNames[templateId] || templateId;
  }

  function makeSeedExplanation(concept, process) {
    return `${concept} uses ${process} to create a visible biological change that SciLoop can map into symbols, steps, and an explanation.`;
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function findExampleById(id) {
    return conceptExamples.find((item) => item.id === id) || conceptExamples[0];
  }

  function detectExample(inputText) {
    const text = String(inputText || '').toLowerCase();
    const scored = keywordRules.map((rule) => ({
      id: rule.id,
      score: rule.terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0)
    })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);
    return scored.length ? findExampleById(scored[0].id) : null;
  }

  function generateBiologyVisualPlan(inputText) {
    const raw = String(inputText || '').trim();
    const detected = detectExample(raw);
    if (detected) {
      return {
        input: raw,
        subject: 'Biology',
        version: '0.1',
        concept: detected.title,
        scale: detected.scale,
        entities: detected.entities,
        process: detected.process,
        template: getTemplateName(detected.template),
        templateId: detected.template,
        animationSteps: detected.animationSteps,
        scenePlan: detected.animationSteps,
        userControls: detected.userControls,
        simpleExplanation: detected.simpleExplanation,
        misconceptionWarning: detected.misconceptionWarning,
        innovationConnection: detected.innovationConnection,
        sceneMode: detected.sceneMode,
        confidence: 'rule match'
      };
    }

    const text = raw.toLowerCase();
    const entities = [];
    if (/(dna|gene|chromosome)/.test(text)) entities.push('DNA', 'genetic code');
    if (/(protein|ribosome|amino acid)/.test(text)) entities.push('ribosome', 'protein');
    if (/(mitochondria|mitochondrion|atp|glucose|oxygen)/.test(text)) entities.push('mitochondria', 'ATP', 'glucose');
    if (/(chloroplast|sunlight|co2|carbon dioxide)/.test(text)) entities.push('chloroplast', 'sunlight', 'CO2');
    if (/(neuron|synapse|signal)/.test(text)) entities.push('neuron', 'signal');
    if (/(immune|virus|bacteria|antibody|pathogen)/.test(text)) entities.push('immune cell', 'pathogen');
    if (/(mutation|selection|adaptation|evolution)/.test(text)) entities.push('population', 'mutation');
    if (/(hormone|receptor)/.test(text)) entities.push('hormone signal', 'receptor');

    const hasEvolution = /(mutation|selection|adaptation|evolution)/.test(text);
    const hasDefense = /(immune|virus|bacteria|pathogen|antibody)/.test(text);
    const hasFeedback = /(temperature|glucose|balance|feedback|homeostasis)/.test(text);
    const hasNetwork = /(neuron|synapse|signal|hormone|receptor)/.test(text);
    const hasFlow = /(mitochondria|atp|chloroplast|sunlight|glucose|oxygen|water|co2)/.test(text);
    const templateId = hasEvolution ? 'evolution' : hasDefense ? 'defense' : hasFeedback ? 'feedback_loop' : hasNetwork ? 'network' : hasFlow ? 'flow' : 'hierarchy';

    return {
      input: raw,
      subject: 'Biology',
      version: '0.1',
      concept: raw || 'Generic Biological System',
      scale: hasEvolution ? 'population/ecosystem' : hasNetwork || hasFeedback ? 'cellular/system' : hasFlow ? 'molecular/cellular' : 'multi-scale',
      entities: unique(entities.length ? entities : ['biological system', 'cell', 'signal', 'environment']),
      process: hasEvolution ? 'variation and selection' : hasDefense ? 'defense response' : hasFeedback ? 'regulation' : hasNetwork ? 'signaling' : hasFlow ? 'matter/energy flow' : 'biological organization',
      template: getTemplateName(templateId),
      templateId,
      animationSteps: hasEvolution
        ? ['show varied population', 'apply environmental pressure', 'surviving variants reproduce', 'trait frequency changes']
        : hasDefense
          ? ['threat enters', 'defender detects marker', 'attack/clearance starts', 'memory or recovery remains']
          : hasFeedback
            ? ['variable changes', 'sensor detects', 'response activates', 'balance returns']
            : hasNetwork
              ? ['signal source activates', 'message travels', 'target receptor/node responds', 'system output changes']
              : ['inputs appear', 'biological transformer activates', 'outputs move outward', 'simple explanation attaches'],
      scenePlan: ['detect text concept', 'map biology symbols', 'choose reusable template', 'render symbolic scene'],
      userControls: ['generate visual plan', 'choose example', 'inspect output'],
      simpleExplanation: raw
        ? 'SciLoop detected a basic biology idea and mapped it into reusable visual grammar.'
        : 'SciLoop could not fully detect the concept yet, but here is a basic biological system visual plan.',
      misconceptionWarning: 'This is a symbolic v0 plan, not a full scientific simulation yet.',
      innovationConnection: 'Future SciLoop AI can use this structured seed to turn biology news into visual explanations.',
      sceneMode: templateId,
      confidence: entities.length ? 'partial keyword match' : 'generic fallback'
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function renderList(element, values) {
    if (!element) return;
    element.innerHTML = values.map((value) => `<span>${escapeHtml(value)}</span>`).join('');
  }

  function createSceneSvg(plan) {
    const mode = plan.sceneMode || plan.templateId || 'flow';
    if (mode === 'dna') {
      return `
        <svg class="biology-scene-svg biology-scene-dna" viewBox="0 0 720 360" role="img" aria-label="DNA replication scene">
          <defs><linearGradient id="bioDnaGlow" x1="0" x2="1"><stop stop-color="#53e7ff"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>
          <path class="bio-flow-line" d="M120 178C220 82 302 82 360 178C418 274 500 274 600 178" />
          <path class="bio-flow-line alt" d="M120 182C220 278 302 278 360 182C418 86 500 86 600 182" />
          ${Array.from({ length: 9 }, (_, index) => {
            const x = 140 + index * 55;
            return `<line class="bio-dna-rung" x1="${x}" y1="${index % 2 ? 130 : 220}" x2="${x}" y2="${index % 2 ? 230 : 140}"></line>`;
          }).join('')}
          <circle class="bio-enzyme-particle" cx="350" cy="180" r="24"></circle>
          <path class="bio-copy-strand left" d="M352 180C294 120 230 94 150 104" />
          <path class="bio-copy-strand right" d="M368 180C426 240 492 266 570 254" />
          <text x="44" y="48">helix opens</text><text x="512" y="326">two copies form</text>
        </svg>`;
    }
    if (mode === 'photosynthesis') {
      return `
        <svg class="biology-scene-svg biology-scene-photo" viewBox="0 0 720 360" role="img" aria-label="Photosynthesis scene">
          <circle class="bio-sun" cx="112" cy="74" r="34"></circle>
          <ellipse class="bio-organelle" cx="360" cy="184" rx="132" ry="78"></ellipse>
          <path class="bio-flow-line" d="M134 92C196 124 244 150 306 170" />
          <path class="bio-flow-line alt" d="M130 278C214 238 254 220 306 206" />
          <path class="bio-flow-line out" d="M492 166C562 136 606 102 660 74" />
          <path class="bio-flow-line out alt" d="M492 210C566 238 610 270 664 300" />
          <text x="58" y="132">light</text><text x="62" y="292">H2O + CO2</text><text x="552" y="64">O2</text><text x="548" y="320">glucose</text>
          <rect class="bio-energy-meter" x="282" y="300" width="156" height="18" rx="9"></rect>
          <rect class="bio-energy-fill" x="282" y="300" width="112" height="18" rx="9"></rect>
        </svg>`;
    }
    if (mode === 'immune') {
      return `
        <svg class="biology-scene-svg biology-scene-immune" viewBox="0 0 720 360" role="img" aria-label="Immune response scene">
          <circle class="bio-immune-cell" cx="228" cy="184" r="62"></circle>
          <circle class="bio-pathogen" cx="506" cy="166" r="34"></circle>
          <circle class="bio-pathogen small" cx="590" cy="236" r="24"></circle>
          <path class="bio-flow-line attack" d="M286 180C350 154 406 150 474 164" />
          <path class="bio-flow-line attack alt" d="M292 206C386 232 470 248 568 238" />
          <circle class="bio-memory-cell" cx="328" cy="290" r="22"></circle>
          <text x="126" y="102">detect</text><text x="416" y="118">attack</text><text x="286" y="330">memory remains</text>
        </svg>`;
    }
    if (mode === 'evolution') {
      return `
        <svg class="biology-scene-svg biology-scene-evolution" viewBox="0 0 720 360" role="img" aria-label="Evolution scene">
          ${Array.from({ length: 18 }, (_, index) => {
            const x = 88 + (index % 6) * 42;
            const y = 104 + Math.floor(index / 6) * 56;
            const cls = index % 5 === 0 ? 'variant-fit' : index % 3 === 0 ? 'variant-mid' : 'variant-low';
            return `<circle class="bio-pop-dot ${cls}" cx="${x}" cy="${y}" r="${index % 5 === 0 ? 11 : 8}"></circle>`;
          }).join('')}
          <path class="bio-selection-filter" d="M342 66L382 66L336 294L296 294Z"></path>
          <path class="bio-flow-line" d="M272 184C314 184 330 184 368 184" />
          ${Array.from({ length: 10 }, (_, index) => {
            const x = 462 + (index % 5) * 42;
            const y = 124 + Math.floor(index / 5) * 64;
            return `<circle class="bio-pop-dot variant-fit survivor" cx="${x}" cy="${y}" r="12"></circle>`;
          }).join('')}
          <text x="78" y="54">variation</text><text x="270" y="328">selection pressure</text><text x="468" y="76">adapted population</text>
        </svg>`;
    }
    if (mode === 'neuron' || plan.templateId === 'network') {
      return `
        <svg class="biology-scene-svg biology-scene-neuron" viewBox="0 0 720 360" role="img" aria-label="Neural signaling scene">
          <circle class="bio-neuron-core" cx="160" cy="178" r="42"></circle>
          <path class="bio-neuron-axon" d="M198 178C286 154 352 156 438 178C506 196 548 198 628 172" />
          <circle class="bio-synapse-node" cx="646" cy="170" r="26"></circle>
          <path class="bio-flow-line pulse" d="M204 178C300 158 398 166 494 186" />
          <circle class="bio-signal-particle" cx="518" cy="188" r="10"></circle>
          <text x="92" y="112">fire</text><text x="304" y="126">signal travels</text><text x="580" y="230">next cell</text>
        </svg>`;
    }
    return `
      <svg class="biology-scene-svg biology-scene-generic" viewBox="0 0 720 360" role="img" aria-label="Biology visual grammar scene">
        <circle class="bio-generic-cell" cx="210" cy="180" r="74"></circle>
        <rect class="bio-generic-core" x="322" y="118" width="120" height="120" rx="28"></rect>
        <circle class="bio-generic-output" cx="560" cy="180" r="54"></circle>
        <path class="bio-flow-line" d="M262 180C302 180 316 180 342 180" />
        <path class="bio-flow-line out" d="M442 180C488 180 506 180 536 180" />
        <text x="150" y="284">${escapeHtml(plan.entities[0] || 'entity')}</text>
        <text x="326" y="96">${escapeHtml(plan.process || 'process')}</text>
        <text x="514" y="284">${escapeHtml(plan.template || 'template')}</text>
      </svg>`;
  }

  function getBiologySceneLabels(plan = {}) {
    const mode = plan.sceneMode || plan.templateId || 'flow';
    const entityLabels = Array.isArray(plan.entities) ? plan.entities : [];
    const defaults = {
      dna: ['DNA strand', 'Base pairs', 'Enzyme', 'Replication fork', 'New strand'],
      photosynthesis: ['Sunlight', 'Chloroplast', 'Water + CO2', 'Glucose + O2', 'Energy meter'],
      immune: ['Immune Cell', 'Pathogen', 'Attack signal', 'Memory Cell'],
      evolution: ['Population variants', 'Selection pressure', 'Survivors', 'Reproduction outcome'],
      neuron: ['Dendrite input', 'Axon', 'Electric pulse', 'Synapse'],
      network: ['Signal source', 'Message path', 'Receptor', 'System output'],
      flow: ['Input', 'Biological mechanism', 'Transformation', 'Output']
    };
    return unique([...(defaults[mode] || defaults.flow), ...entityLabels]).slice(0, 8);
  }

  function enhanceBiologyScene(mountNode, plan = {}) {
    if (!window.SciLoopVisualSceneEnhancer?.enhanceScene || !mountNode) return;
    const mode = plan.sceneMode || plan.templateId || 'flow';
    window.SciLoopVisualSceneEnhancer.enhanceScene(mountNode, {
      subject: 'Biology',
      title: plan.concept || plan.title || 'Biology Scene Visualization',
      template: mode,
      templateName: plan.template || getTemplateName(plan.templateId || mode),
      sceneMode: mode,
      labels: getBiologySceneLabels(plan),
      entities: plan.entities || [],
      stages: plan.animationSteps || plan.animationPlan || [],
      explanation: plan.simpleExplanation || plan.explanation?.simple || 'Biology is being shown as objects, actions, and outcomes so the idea becomes visible.',
      keyPoint: plan.innovationConnection || ''
    });
  }

  function renderBiologyPlan(plan) {
    const title = document.getElementById('biologySceneTitle');
    const scene = document.getElementById('biologyScenePreview');
    const process = document.getElementById('biologyProcessOut');
    const scale = document.getElementById('biologyScaleOut');
    const templateOut = document.getElementById('biologyTemplateOut');
    const explanation = document.getElementById('biologyExplanationOut');
    const innovation = document.getElementById('biologyInnovationOut');
    const warning = document.getElementById('biologyMisconceptionOut');

    if (title) title.textContent = plan.concept || 'Biology Scene Visualization';
    renderList(document.getElementById('biologyEntitiesOut'), plan.entities || []);
    renderList(document.getElementById('biologyAnimationOut'), plan.animationSteps || []);
    if (process) process.textContent = plan.process || 'biological process';
    if (scale) scale.textContent = plan.scale || 'multi-scale';
    if (templateOut) templateOut.textContent = plan.template || getTemplateName(plan.templateId);
    if (explanation) explanation.textContent = plan.simpleExplanation || '';
    if (innovation) innovation.textContent = plan.innovationConnection || '';
    if (warning) warning.textContent = plan.misconceptionWarning || '';
    if (scene) {
      scene.innerHTML = createSceneSvg(plan);
      enhanceBiologyScene(scene, plan);
    }
  }

  function renderBiologyAlphabet() {
    const grid = document.getElementById('biologyAlphabetGrid');
    if (!grid) return;
    const featuredIds = ['dna_helix', 'cell_membrane', 'enzyme', 'neuron', 'immune_cell', 'pathogen', 'mutation_spark', 'ecosystem_node', 'atp_packet', 'receptor', 'ribosome', 'mitochondria', 'chloroplast', 'membrane_channel', 'species_node', 'action_signal'];
    const featured = featuredIds.map((id) => visualAlphabet.find((item) => item.id === id)).filter(Boolean);
    grid.innerHTML = featured.map((item) => `
      <article class="biology-symbol-card hover-surface">
        <span>${escapeHtml(item.emoji)}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.meaning)}</p>
        <small>${escapeHtml(item.scale)} | ${escapeHtml(item.animation)}</small>
      </article>
    `).join('');
  }

  const biologyNewsVisualEngine = {
    version: '0.1',
    supportedSubject: 'Biology',
    conceptLexicon: {
      genetic: ['dna', 'rna', 'gene', 'genome', 'chromosome', 'crispr', 'cas', 'editing', 'mutation', 'sequence'],
      cellular: ['cell', 'membrane', 'nucleus', 'organelle', 'mitochondria', 'ribosome', 'stem cell', 'tissue'],
      neural: ['neuron', 'synapse', 'brain', 'memory', 'neural', 'signal', 'axon', 'neurotransmitter'],
      immune: ['immune', 'immunotherapy', 'antibody', 'vaccine', 'virus', 'bacteria', 'pathogen', 'tumor', 'cancer'],
      metabolic: ['atp', 'energy', 'glucose', 'oxygen', 'mitochondria', 'respiration', 'metabolism', 'chloroplast'],
      ecological: ['ecosystem', 'microbiome', 'microbe', 'species', 'population', 'environment', 'food web'],
      evolutionary: ['evolution', 'selection', 'adaptation', 'resistance', 'antibiotic', 'mutation', 'survival'],
      medicalIntervention: ['therapy', 'treatment', 'drug', 'engineered', 'improved', 'new method', 'precision', 'diagnostic']
    },
    processLexicon: {
      replication: ['replicate', 'replication', 'copy', 'duplicate'],
      transcription: ['transcription', 'transcribe', 'rna copy'],
      translation: ['translation', 'translate', 'ribosome', 'amino acid', 'protein synthesis'],
      signaling: ['signal', 'signals', 'signaling', 'communicate', 'influence', 'receptor', 'hormone', 'synapse', 'cascade'],
      mutation: ['mutation', 'mutate', 'variant', 'genetic change'],
      selection: ['selection', 'evolving', 'evolve', 'adapt', 'resistance', 'survive'],
      infection: ['infect', 'infection', 'pathogen', 'virus', 'bacteria'],
      immunity: ['immune', 'immunity', 'antibody', 'vaccine', 'immunotherapy', 'attack'],
      transport: ['transport', 'move', 'channel', 'pump', 'cross membrane'],
      catalysis: ['enzyme', 'catalysis', 'catalyst', 'substrate'],
      energyConversion: ['energy', 'atp', 'glucose', 'mitochondria', 'respiration', 'photosynthesis'],
      cellDivision: ['mitosis', 'meiosis', 'divide', 'cell division'],
      geneEditing: ['crispr', 'gene editing', 'edit gene', 'cas enzyme', 'precision editing'],
      growth: ['growth', 'grow', 'proliferation', 'tumor'],
      repair: ['repair', 'restore', 'fix', 'damage'],
      regulation: ['regulate', 'balance', 'homeostasis', 'control', 'feedback'],
      adaptation: ['adaptation', 'adapt', 'fitness', 'survival']
    },
    templateRules: {
      sequence: ['replication', 'transcription', 'translation', 'cellDivision', 'geneEditing', 'repair'],
      flow: ['energyConversion', 'transport', 'metabolism'],
      feedback_loop: ['regulation'],
      network: ['signaling'],
      defense: ['infection', 'immunity'],
      evolution: ['mutation', 'selection', 'adaptation', 'resistance'],
      comparison: ['growth', 'cancer', 'disease'],
      intervention: ['geneEditing', 'therapy', 'engineered', 'improved', 'precision'],
      hierarchy: ['organ', 'tissue', 'organism', 'ecosystem']
    },
    fallbackRules: [
      'Use closest Biology example as visual memory.',
      'If confidence is low, render input -> mechanism -> outcome.',
      'Keep local-rule mode working without API keys.',
      'Convert AI output back into the same visual plan schema.'
    ],
    aiProviderConfig: {
      supported: ['gemini', 'groq', 'deepseek', 'cohere', 'huggingface', 'puter', 'stability'],
      defaultMode: 'local-rule',
      structuredPlanProviders: ['gemini', 'groq', 'deepseek', 'cohere', 'huggingface', 'puter'],
      imageOnlyProviders: ['stability']
    }
  };

  const sciloopAIVisualRouter = {
    version: '0.1',
    supportedSubject: 'Biology',
    providers: {
      gemini: { role: 'main planned provider', structuredPlan: true },
      groq: { role: 'fast fallback', structuredPlan: true },
      deepseek: { role: 'reasoning verifier', structuredPlan: true },
      cohere: { role: 'classification helper', structuredPlan: true },
      huggingface: { role: 'bio/NLP helper', structuredPlan: true },
      puter: { role: 'browser fallback if available', structuredPlan: true },
      stability: { role: 'future image mode only', structuredPlan: false, imageOnly: true }
    },
    timeoutMs: 6500,
    backendBaseUrl: 'http://localhost:5050',
    endpointPath: '/api/sciloop-ai/biology-visual-plan'
  };

  function cleanBiologyNewsText(text) {
    return String(text || '')
      .replace(/https?:\/\/\S+/gi, ' ')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^\w\s.+-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function tokenizeBiologyText(text) {
    const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'how', 'new', 'study', 'scientists', 'researchers', 'research', 'found', 'find', 'discover', 'discovering', 'biology', 'biological', 'system', 'systems', 'life', 'process', 'changes', 'newly', 'described']);
    return cleanBiologyNewsText(text).split(/\s+/).filter((token) => token.length > 2 && !stop.has(token));
  }

  function matchesTerm(text, term) {
    const cleanedTerm = String(term || '').toLowerCase().trim();
    if (!cleanedTerm) return false;
    const escaped = cleanedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  }

  function detectByLexicon(text, lexicon) {
    const cleaned = cleanBiologyNewsText(text);
    return Object.entries(lexicon).reduce((acc, [key, terms]) => {
      const hits = terms.filter((term) => matchesTerm(cleaned, term));
      if (hits.length) acc.push({ id: key, hits });
      return acc;
    }, []);
  }

  function detectBiologyEntities(text) {
    const entityMap = {
      DNA: ['dna', 'gene', 'genome', 'chromosome'],
      RNA: ['rna', 'transcript'],
      CRISPR: ['crispr', 'cas9', 'cas enzyme'],
      protein: ['protein', 'amino acid'],
      enzyme: ['enzyme', 'catalyst'],
      receptor: ['receptor', 'ligand'],
      cell: ['cell', 'cells'],
      membrane: ['membrane', 'channel', 'pump'],
      nucleus: ['nucleus'],
      mitochondria: ['mitochondria', 'mitochondrion'],
      ribosome: ['ribosome'],
      neuron: ['neuron', 'neurons', 'brain', 'axon'],
      synapse: ['synapse', 'synapses', 'synaptic', 'neurotransmitter'],
      hormone: ['hormone'],
      'immune cell': ['immune cell', 'immune cells', 't cell', 'car t', 'macrophage'],
      bacteria: ['bacteria', 'bacterial'],
      virus: ['virus', 'viral'],
      pathogen: ['pathogen', 'infection'],
      antibody: ['antibody', 'antibodies'],
      mutation: ['mutation', 'mutant', 'variant'],
      antibiotic: ['antibiotic', 'antibiotics'],
      microbiome: ['microbiome', 'microbe', 'microbial', 'gut'],
      tissue: ['tissue'],
      organ: ['organ'],
      'blood vessel': ['blood vessel', 'vascular'],
      vaccine: ['vaccine', 'vaccination'],
      cancer: ['cancer', 'tumor', 'tumour'],
      'stem cell': ['stem cell', 'stem cells'],
      ATP: ['atp', 'energy'],
      glucose: ['glucose']
    };
    const cleaned = cleanBiologyNewsText(text);
    return unique(Object.entries(entityMap).flatMap(([entity, terms]) => (
      terms.some((term) => matchesTerm(cleaned, term)) ? [entity] : []
    )));
  }

  function detectBiologyProcesses(text) {
    const hits = detectByLexicon(text, biologyNewsVisualEngine.processLexicon);
    return hits.map((hit) => hit.id);
  }

  function detectScale(text) {
    const cleaned = cleanBiologyNewsText(text);
    const scaleScores = {
      molecular: ['dna', 'rna', 'gene', 'protein', 'enzyme', 'receptor', 'crispr', 'atp', 'molecule'].filter((term) => matchesTerm(cleaned, term)).length,
      cellular: ['cell', 'mitochondria', 'ribosome', 'membrane', 'nucleus', 'organelle'].filter((term) => matchesTerm(cleaned, term)).length,
      tissue: ['tissue', 'tumor', 'cancer', 'stem cell'].filter((term) => matchesTerm(cleaned, term)).length,
      organ: ['organ', 'brain', 'heart', 'liver', 'kidney', 'blood vessel'].filter((term) => matchesTerm(cleaned, term)).length,
      organism: ['patient', 'animal', 'plant', 'body', 'human'].filter((term) => matchesTerm(cleaned, term)).length,
      population: ['population', 'species', 'bacteria', 'evolution', 'resistance', 'selection'].filter((term) => matchesTerm(cleaned, term)).length,
      ecosystem: ['ecosystem', 'microbiome', 'environment', 'food web'].filter((term) => matchesTerm(cleaned, term)).length
    };
    const ranked = Object.entries(scaleScores).filter(([, score]) => score > 0).sort((a, b) => b[1] - a[1]);
    if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return 'mixed';
    return ranked[0]?.[0] || 'mixed';
  }

  function detectBiologyOutcomes(text) {
    const outcomeMap = {
      duplication: ['duplicate', 'copy', 'replicate'],
      activation: ['activate', 'boost', 'increase', 'improve'],
      suppression: ['suppress', 'block', 'reduce', 'inhibit'],
      resistance: ['resistance', 'resistant', 'survive antibiotics'],
      repair: ['repair', 'restore', 'fix'],
      growth: ['growth', 'grow', 'proliferation'],
      attack: ['attack', 'target', 'kill', 'clear'],
      protection: ['protect', 'vaccine', 'immunity'],
      adaptation: ['adapt', 'evolve', 'selection'],
      survival: ['survive', 'fitness'],
      precision: ['precision', 'accuracy', 'accurate']
    };
    const cleaned = cleanBiologyNewsText(text);
    return unique(Object.entries(outcomeMap).flatMap(([outcome, terms]) => (
      terms.some((term) => matchesTerm(cleaned, term)) ? [outcome] : []
    )));
  }

  function detectBiologySystems(text) {
    return detectByLexicon(text, biologyNewsVisualEngine.conceptLexicon).map((hit) => hit.id);
  }

  function detectBiologySignals(text) {
    const cleaned = cleanBiologyNewsText(text);
    return ['signal', 'receptor', 'hormone', 'synapse', 'brain', 'memory', 'communication']
      .filter((term) => matchesTerm(cleaned, term));
  }

  function detectBiologyEnergy(text) {
    const cleaned = cleanBiologyNewsText(text);
    return ['atp', 'energy', 'glucose', 'oxygen', 'mitochondria', 'metabolism', 'respiration', 'photosynthesis']
      .filter((term) => matchesTerm(cleaned, term));
  }

  function buildBiologyExampleIndex() {
    return conceptExamples.map((item) => {
      const source = [
        item.title,
        item.simpleSentence,
        item.scientificMeaning,
        item.process,
        item.template,
        ...(item.entities || []),
        ...(item.animationSteps || [])
      ].join(' ');
      return {
        id: item.id,
        title: item.title,
        template: item.template,
        process: item.process,
        entities: item.entities,
        tokens: tokenizeBiologyText(source),
        source: item
      };
    });
  }

  biologyNewsVisualEngine.exampleIndex = buildBiologyExampleIndex();

  function findClosestBiologyExamples(newsText) {
    const cleaned = cleanBiologyNewsText(newsText);
    const tokens = new Set(tokenizeBiologyText(cleaned));
    const detectedEntities = detectBiologyEntities(cleaned).map((item) => item.toLowerCase());
    const detectedProcesses = detectBiologyProcesses(cleaned);
    return biologyNewsVisualEngine.exampleIndex
      .map((entry) => {
        const tokenScore = entry.tokens.reduce((sum, token) => sum + (tokens.has(token) ? 1 : 0), 0);
        const entityScore = (entry.entities || []).reduce((sum, entity) => (
          detectedEntities.some((detected) => detected.includes(String(entity).toLowerCase()) || String(entity).toLowerCase().includes(detected)) ? sum + 3 : sum
        ), 0);
        const processScore = detectedProcesses.some((process) => String(entry.process).toLowerCase().includes(process.toLowerCase())) ? 5 : 0;
        const titleScore = cleaned.includes(entry.title.toLowerCase().split(' ')[0]) ? 2 : 0;
        const score = tokenScore + entityScore + processScore + titleScore;
        return {
          id: entry.id,
          title: entry.title,
          template: entry.template,
          process: entry.process,
          score,
          example: entry.source
        };
      })
      .filter((entry) => entry.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((entry) => ({
        id: entry.id,
        title: entry.title,
        template: getTemplateName(entry.template),
        process: entry.process,
        score: entry.score
      }));
  }

  function chooseBiologyTemplate(analysis) {
    const processSet = new Set(analysis.processes || []);
    const systems = new Set(analysis.systems || []);
    const outcomes = new Set(analysis.outcomes || []);
    const keywords = new Set(analysis.keywords || []);
    if (processSet.has('selection') || processSet.has('mutation') || processSet.has('adaptation') || outcomes.has('resistance')) return 'evolution';
    if (processSet.has('geneEditing') || outcomes.has('precision')) return 'intervention';
    if (processSet.has('immunity') || processSet.has('infection') || systems.has('immune') || outcomes.has('attack')) return 'defense';
    if (processSet.has('signaling') || systems.has('neural') || analysis.signals?.length) return 'network';
    if (processSet.has('regulation')) return 'feedback_loop';
    if (processSet.has('energyConversion') || processSet.has('transport') || analysis.energy?.length) return 'flow';
    if (processSet.has('replication') || processSet.has('translation') || processSet.has('transcription') || processSet.has('cellDivision') || processSet.has('repair')) return 'sequence';
    if (keywords.has('engineered')) return 'intervention';
    if (processSet.has('growth') || outcomes.has('suppression')) return 'comparison';
    return analysis.matchedExamples?.[0]?.example?.template || analysis.matchedExamples?.[0]?.templateId || 'flow';
  }

  function getSceneModeForNews(templateId, entities, processes) {
    const entityText = (entities || []).join(' ').toLowerCase();
    const processText = (processes || []).join(' ').toLowerCase();
    if (entityText.includes('crispr') || entityText.includes('dna') || processText.includes('geneediting')) return 'dna';
    if (templateId === 'defense' || entityText.includes('immune') || entityText.includes('virus') || entityText.includes('cancer')) return 'immune';
    if (templateId === 'evolution' || entityText.includes('bacteria') || entityText.includes('antibiotic')) return 'evolution';
    if (entityText.includes('neuron') || entityText.includes('brain') || entityText.includes('synapse')) return 'neuron';
    if (entityText.includes('chloroplast')) return 'photosynthesis';
    if (entityText.includes('mitochondria') || entityText.includes('atp')) return 'flow';
    return templateId;
  }

  function buildBiologyNewsScene(analysis, templateId, matchedExamples) {
    const primary = analysis.entities[0] || matchedExamples[0]?.title || 'Biology system';
    const support = analysis.entities.slice(1, 5);
    const outcome = analysis.outcomes[0] || analysis.processes[0] || 'biological change';
    const stages = buildNewsStages(analysis, templateId, matchedExamples);
    return {
      sceneType: getSceneModeForNews(templateId, analysis.entities, analysis.processes),
      nodes: unique([primary, ...support, outcome]).map((label, index) => ({
        id: `node_${index + 1}`,
        label,
        role: index === 0 ? 'primary' : index === support.length + 1 ? 'outcome' : 'support'
      })),
      connections: support.map((label, index) => ({
        from: 'node_1',
        to: `node_${index + 2}`,
        label: analysis.processes[0] || 'interaction'
      })),
      flows: stages.map((stage, index) => ({ id: `flow_${index + 1}`, label: stage })),
      stages,
      annotations: [
        `Template: ${getTemplateName(templateId)}`,
        `Scale: ${analysis.scale}`,
        matchedExamples.length ? `Visual memory: ${matchedExamples[0].title}` : 'Generic SciLoop biology grammar'
      ]
    };
  }

  function buildNewsStages(analysis, templateId, matchedExamples) {
    const example = findExampleById(matchedExamples[0]?.id || '');
    const entities = analysis.entities;
    const outcome = analysis.outcomes[0] || 'outcome appears';
    if (templateId === 'intervention') {
      return [
        `${entities[0] || 'method'} targets ${entities[1] || 'biological code'}`,
        'precision step changes the system',
        `${outcome} is measured`,
        'visual plan flags intervention result'
      ];
    }
    if (templateId === 'defense') {
      return [
        `${entities[1] || 'threat'} appears`,
        `${entities[0] || 'immune system'} detects target`,
        'attack or targeting response activates',
        `${outcome} becomes the outcome node`
      ];
    }
    if (templateId === 'evolution') {
      return [
        'variation appears in the population',
        'selection pressure changes survival',
        `${entities[0] || 'survivors'} reproduce or expand`,
        `${outcome} shifts trait frequency`
      ];
    }
    if (templateId === 'network') {
      return [
        `${entities[0] || 'source node'} activates`,
        'signal travels through biological links',
        `${entities[1] || 'target node'} responds`,
        `${outcome} changes the system`
      ];
    }
    return example?.animationSteps?.length ? example.animationSteps : [
      `${entities[0] || 'input'} appears`,
      `${analysis.processes[0] || 'mechanism'} activates`,
      `${entities[1] || 'biological system'} changes`,
      `${outcome} is explained`
    ];
  }

  function buildNewsToVisualTransfer(newsAnalysis, matchedExamples) {
    const templateId = chooseBiologyTemplate({ ...newsAnalysis, matchedExamples });
    const visualScene = buildBiologyNewsScene(newsAnalysis, templateId, matchedExamples);
    const baseExample = matchedExamples[0] ? findExampleById(matchedExamples[0].id) : null;
    return {
      templateId,
      templateName: getTemplateName(templateId),
      visualScene,
      animationPlan: visualScene.stages,
      simpleExplanation: buildBiologyNewsSimpleExplanation(newsAnalysis, baseExample),
      scientificExplanation: buildBiologyNewsScientificExplanation(newsAnalysis, baseExample),
      innovationConnection: buildBiologyNewsInnovationConnection(newsAnalysis, baseExample)
    };
  }

  function buildBiologyNewsSimpleExplanation(analysis, baseExample) {
    const entity = analysis.entities[0] || 'a biological system';
    const process = analysis.processes[0] || baseExample?.process || 'a biological process';
    const outcome = analysis.outcomes[0] || 'a visible change';
    return `This news is mapped as ${entity} undergoing ${process}, leading to ${outcome}.`;
  }

  function buildBiologyNewsScientificExplanation(analysis, baseExample) {
    const scale = analysis.scale || baseExample?.scale || 'mixed';
    const template = getTemplateName(analysis.templateId || baseExample?.template || 'flow');
    return `SciLoop treats this as a ${scale} biology event and uses the ${template} to show entities, mechanism, and outcome.`;
  }

  function buildBiologyNewsInnovationConnection(analysis, baseExample) {
    if (analysis.systems.includes('medicalIntervention')) {
      return 'This connects to biotechnology translation: better tools, treatments, diagnostics, or engineered biological systems.';
    }
    return baseExample?.innovationConnection || 'This visual plan helps turn live biology news into reusable learning, research, and innovation structure.';
  }

  function calculateBiologyNewsConfidence(analysis, matchedExamples) {
    const detectionScore = Math.min(45, (analysis.entities.length * 7) + (analysis.processes.length * 8) + (analysis.outcomes.length * 4));
    const matchScore = Math.min(40, matchedExamples.reduce((sum, item, index) => sum + Math.max(0, item.score - index * 2), 0));
    const scaleScore = analysis.scale && analysis.scale !== 'mixed' ? 10 : 5;
    return Math.max(8, Math.min(100, detectionScore + matchScore + scaleScore));
  }

  function generateBiologyNewsVisualPlan(input, options = {}) {
    const title = typeof input === 'string' ? '' : String(input?.title || '');
    const summary = typeof input === 'string' ? input : String(input?.summary || input?.text || '');
    const rawText = [title, summary].filter(Boolean).join('. ');
    const cleanedText = cleanBiologyNewsText(rawText);
    const keywords = tokenizeBiologyText(cleanedText).slice(0, 24);
    const matchedExamples = findClosestBiologyExamples(cleanedText);
    const analysis = {
      entities: detectBiologyEntities(cleanedText),
      processes: detectBiologyProcesses(cleanedText),
      systems: detectBiologySystems(cleanedText),
      scale: detectScale(cleanedText),
      outcomes: detectBiologyOutcomes(cleanedText),
      signals: detectBiologySignals(cleanedText),
      energy: detectBiologyEnergy(cleanedText),
      keywords
    };
    const transfer = buildNewsToVisualTransfer(analysis, matchedExamples);
    const confidence = calculateBiologyNewsConfidence(analysis, matchedExamples);
    const fallbackWarnings = [];
    if (confidence < 45) fallbackWarnings.push('Low confidence: new concept approximated using SciLoop biology grammar.');
    if (options.mode && options.mode !== 'local-rule') fallbackWarnings.push('AI provider adapter is config-ready; this v0 render used local-rule fallback.');
    if (!matchedExamples.length) fallbackWarnings.push('No close example found; generic biological scene selected.');

    return {
      id: `bio_news_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      sourceType: options.sourceType || (title ? 'live-news' : 'manual-input'),
      subject: 'Biology',
      title: title || String(rawText).slice(0, 72) || 'Untitled biology input',
      rawText,
      cleanedText,
      confidence,
      matchedExamples,
      detected: {
        ...analysis,
        templateId: transfer.templateId
      },
      chosenTemplate: transfer.templateName,
      visualScene: transfer.visualScene,
      animationPlan: transfer.animationPlan,
      explanation: {
        simple: transfer.simpleExplanation,
        scientific: transfer.scientificExplanation,
        innovationConnection: transfer.innovationConnection,
        warnings: fallbackWarnings
      },
      providerMeta: {
        mode: options.mode || 'local-rule',
        provider: options.provider || 'local-rule-engine',
        verifiedBy: 'SciLoop Biology News Visual Engine v0'
      }
    };
  }

  function getCompactBiologyExampleContext(maxExamples = 6, matchedExamples = []) {
    const ordered = [
      ...matchedExamples.map((match) => findExampleById(match.id)).filter(Boolean),
      ...conceptExamples
    ];
    const seen = new Set();
    return ordered
      .filter((item) => {
        if (!item || seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, maxExamples)
      .map((item) => ({
        title: item.title,
        entities: item.entities,
        process: item.process,
        template: getTemplateName(item.template),
        animation: (item.animationSteps || []).join(' -> ')
      }));
  }

  function buildBiologyVisualPrompt(newsText, localPlan, compactExamples = getCompactBiologyExampleContext(6, localPlan?.matchedExamples || [])) {
    return [
      'You are SciLoop Biology Visual Planner.',
      'Convert biology news into a valid JSON visual plan using SciLoop Biology Visual Language.',
      'Return ONLY JSON. No markdown. No explanation outside JSON.',
      'Required JSON keys: subject, title, confidence, detected, chosenTemplate, visualScene, animationPlan, explanation, providerMeta.',
      'Template rules:',
      '- DNA/gene/CRISPR -> intervention or sequence',
      '- mitochondria/ATP/metabolism -> flow',
      '- immune/pathogen/tumor -> defense',
      '- neuron/synapse/brain signal -> network',
      '- mutation/evolution/resistance -> evolution',
      '- hormone/receptor/signal -> signaling/network',
      '- homeostasis/regulation/balance -> feedback',
      '- unknown biology -> input -> mechanism -> outcome',
      `Compact examples: ${JSON.stringify(compactExamples)}`,
      `Local plan: ${JSON.stringify(localPlan)}`,
      `News text: ${JSON.stringify(newsText)}`
    ].join('\n');
  }

  function buildBiologyVisualPlanPrompt(payload) {
    const text = [payload?.title, payload?.summary, payload?.fullText].filter(Boolean).join('. ');
    return buildBiologyVisualPrompt(text, payload?.existingLocalPlan || payload?.localPlan || null, payload?.compactExamples);
  }

  function clamp01(value, fallback = 0) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(0, Math.min(1, number));
  }

  function normalizeConfidenceToPercent(value, fallback = 50) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    if (number <= 1) return Math.round(clamp01(number) * 100);
    return Math.max(0, Math.min(100, Math.round(number)));
  }

  function sanitizePlanString(value) {
    return String(value ?? '').replace(/[<>]/g, '').trim();
  }

  function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value.map((item) => sanitizePlanString(item)).filter(Boolean);
  }

  function validateBiologyVisualPlan(plan) {
    const errors = [];
    if (!plan || typeof plan !== 'object') errors.push('plan is not an object');
    if (plan && plan.subject !== 'Biology') errors.push('subject must be Biology');
    if (!plan?.chosenTemplate) errors.push('chosenTemplate missing');
    if (!Array.isArray(plan?.detected?.entities)) errors.push('detected.entities must be array');
    if (!Array.isArray(plan?.detected?.processes)) errors.push('detected.processes must be array');
    if (!Array.isArray(plan?.animationPlan)) errors.push('animationPlan must be array');
    if (!plan?.explanation?.simple) errors.push('explanation.simple missing');
    if (!plan?.visualScene || typeof plan.visualScene !== 'object') errors.push('visualScene missing');
    return {
      ok: errors.length === 0,
      errors
    };
  }

  function normalizeAIVisualPlan(aiPlan, localPlan) {
    const source = aiPlan && typeof aiPlan === 'object' ? aiPlan : {};
    const normalizedConfidence01 = clamp01(
      Number(source.confidence) > 1 ? Number(source.confidence) / 100 : source.confidence,
      (Number(localPlan?.confidence) || 50) / 100
    );
    const detected = {
      entities: normalizeStringArray(source.detected?.entities).length ? normalizeStringArray(source.detected.entities) : (localPlan?.detected?.entities || []),
      processes: normalizeStringArray(source.detected?.processes).length ? normalizeStringArray(source.detected.processes) : (localPlan?.detected?.processes || []),
      systems: normalizeStringArray(source.detected?.systems).length ? normalizeStringArray(source.detected.systems) : (localPlan?.detected?.systems || []),
      scale: sanitizePlanString(source.detected?.scale || localPlan?.detected?.scale || 'mixed'),
      outcomes: normalizeStringArray(source.detected?.outcomes).length ? normalizeStringArray(source.detected.outcomes) : (localPlan?.detected?.outcomes || []),
      signals: normalizeStringArray(source.detected?.signals).length ? normalizeStringArray(source.detected.signals) : (localPlan?.detected?.signals || []),
      energy: normalizeStringArray(source.detected?.energy).length ? normalizeStringArray(source.detected.energy) : (localPlan?.detected?.energy || []),
      keywords: normalizeStringArray(source.detected?.keywords).length ? normalizeStringArray(source.detected.keywords) : (localPlan?.detected?.keywords || []),
      templateId: sanitizePlanString(source.detected?.templateId || localPlan?.detected?.templateId || 'flow')
    };
    const visualScene = source.visualScene && typeof source.visualScene === 'object'
      ? {
          sceneType: sanitizePlanString(source.visualScene.sceneType || localPlan?.visualScene?.sceneType || detected.templateId || 'flow'),
          nodes: Array.isArray(source.visualScene.nodes) ? source.visualScene.nodes : (localPlan?.visualScene?.nodes || []),
          connections: Array.isArray(source.visualScene.connections) ? source.visualScene.connections : (localPlan?.visualScene?.connections || []),
          flows: Array.isArray(source.visualScene.flows) ? source.visualScene.flows : (localPlan?.visualScene?.flows || []),
          stages: Array.isArray(source.visualScene.stages) ? source.visualScene.stages : (localPlan?.visualScene?.stages || []),
          annotations: Array.isArray(source.visualScene.annotations) ? source.visualScene.annotations : (localPlan?.visualScene?.annotations || [])
        }
      : localPlan?.visualScene;

    return {
      ...(localPlan || {}),
      subject: 'Biology',
      title: sanitizePlanString(source.title || localPlan?.title || 'Biology Visual Plan'),
      confidence: normalizeConfidenceToPercent(normalizedConfidence01, localPlan?.confidence || 50),
      matchedExamples: Array.isArray(source.matchedExamples) ? source.matchedExamples : (localPlan?.matchedExamples || []),
      detected,
      chosenTemplate: sanitizePlanString(source.chosenTemplate || localPlan?.chosenTemplate || getTemplateName(detected.templateId)),
      visualScene,
      animationPlan: normalizeStringArray(source.animationPlan).length ? normalizeStringArray(source.animationPlan) : (localPlan?.animationPlan || []),
      explanation: {
        simple: sanitizePlanString(source.explanation?.simple || localPlan?.explanation?.simple || 'SciLoop generated a biology visual plan.'),
        scientific: sanitizePlanString(source.explanation?.scientific || localPlan?.explanation?.scientific || ''),
        innovationConnection: sanitizePlanString(source.explanation?.innovationConnection || localPlan?.explanation?.innovationConnection || ''),
        warnings: normalizeStringArray(source.explanation?.warnings).length ? normalizeStringArray(source.explanation.warnings) : (localPlan?.explanation?.warnings || [])
      },
      providerMeta: {
        ...(localPlan?.providerMeta || {}),
        ...(source.providerMeta || {}),
        aiConfidence01: normalizedConfidence01
      }
    };
  }

  function tryParseProviderJson(value) {
    if (!value) return null;
    if (typeof value === 'object') return value.visualPlan || value.plan || value.data || value;
    const text = String(value).trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  async function fetchProviderEndpoint(provider, payload, timeoutMs = sciloopAIVisualRouter.timeoutMs) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${sciloopAIVisualRouter.backendBaseUrl}${sciloopAIVisualRouter.endpointPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ provider, ...payload })
      });
      if (!response.ok) {
        return { ok: false, provider, reason: `Provider endpoint not configured yet. HTTP ${response.status}` };
      }
      const data = await response.json();
      return { ok: true, provider, data, rawProviderResponse: data };
    } catch (error) {
      return {
        ok: false,
        provider,
        reason: error?.name === 'AbortError' ? 'Provider request timed out.' : 'Provider endpoint not configured yet.'
      };
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function callGeminiForBiologyVisualPlan(payload) {
    try {
      return await fetchProviderEndpoint('gemini', payload);
    } catch (error) {
      return { ok: false, provider: 'gemini', reason: error?.message || 'Gemini adapter failed safely.' };
    }
  }

  async function callGroqForBiologyVisualPlan(payload) {
    try {
      return await fetchProviderEndpoint('groq', payload);
    } catch (error) {
      return { ok: false, provider: 'groq', reason: error?.message || 'Groq adapter failed safely.' };
    }
  }

  async function callDeepSeekForBiologyVerification(payload) {
    try {
      return await fetchProviderEndpoint('deepseek', { ...payload, task: 'verify-biology-visual-plan' });
    } catch (error) {
      return { ok: false, provider: 'deepseek', reason: error?.message || 'DeepSeek verifier failed safely.' };
    }
  }

  async function callCohereForBiologyClassification(payload) {
    try {
      return await fetchProviderEndpoint('cohere', { ...payload, task: 'classify-biology-news' });
    } catch (error) {
      return { ok: false, provider: 'cohere', reason: error?.message || 'Cohere classifier failed safely.' };
    }
  }

  async function callHuggingFaceForBiologyExtraction(payload) {
    try {
      return await fetchProviderEndpoint('huggingface', { ...payload, task: 'extract-biology-entities' });
    } catch (error) {
      return { ok: false, provider: 'huggingface', reason: error?.message || 'Hugging Face extractor failed safely.' };
    }
  }

  async function callPuterForBiologyVisualPlan(payload) {
    try {
      if (!window.puter?.ai?.chat) {
        return { ok: false, provider: 'puter', reason: 'Puter.js is not available in this page.' };
      }
      const message = payload.prompt || buildBiologyVisualPlanPrompt(payload);
      const response = await Promise.race([
        window.puter.ai.chat(message),
        new Promise((resolve) => window.setTimeout(() => resolve({ ok: false, reason: 'Puter request timed out.' }), sciloopAIVisualRouter.timeoutMs))
      ]);
      return { ok: true, provider: 'puter', data: response, rawProviderResponse: response };
    } catch (error) {
      return { ok: false, provider: 'puter', reason: error?.message || 'Puter adapter failed safely.' };
    }
  }

  async function callStabilityForBiologyImageConcept() {
    return {
      ok: false,
      provider: 'stability',
      reason: 'Stability AI is reserved for future image generation mode and is not used for structured visual plans in v0.'
    };
  }

  async function requestBiologyVisualPlanFromAI(providerName, payload) {
    const provider = providerName === 'auto' ? 'gemini' : providerName;
    const adapters = {
      gemini: callGeminiForBiologyVisualPlan,
      groq: callGroqForBiologyVisualPlan,
      deepseek: callDeepSeekForBiologyVerification,
      cohere: callCohereForBiologyClassification,
      huggingface: callHuggingFaceForBiologyExtraction,
      puter: callPuterForBiologyVisualPlan,
      stability: callStabilityForBiologyImageConcept
    };
    const adapter = adapters[provider] || adapters.gemini;
    return adapter(payload);
  }

  function buildRouterPayload(inputPayload, localPlan) {
    const newsText = [
      inputPayload?.title,
      inputPayload?.summary,
      inputPayload?.fullText
    ].filter(Boolean).join('. ');
    const compactExamples = getCompactBiologyExampleContext(6, localPlan?.matchedExamples || []);
    return {
      title: inputPayload?.title || localPlan?.title || '',
      summary: inputPayload?.summary || '',
      fullText: inputPayload?.fullText || '',
      newsText,
      localPlan,
      existingLocalPlan: localPlan,
      compactExamples,
      prompt: buildBiologyVisualPrompt(newsText, localPlan, compactExamples)
    };
  }

  function providerResponseToPlan(response, localPlan, provider) {
    const parsed = tryParseProviderJson(response?.data || response?.rawProviderResponse);
    if (!parsed) {
      return {
        ok: false,
        reason: response?.reason || 'Provider did not return valid JSON.'
      };
    }
    const normalized = normalizeAIVisualPlan(parsed, localPlan);
    normalized.providerMeta = {
      ...(normalized.providerMeta || {}),
      mode: 'ai-assisted',
      provider,
      verifiedBy: 'SciLoop AI Visual Router v0'
    };
    const validation = validateBiologyVisualPlan(normalized);
    return validation.ok
      ? { ok: true, visualPlan: normalized, rawProviderResponse: response?.rawProviderResponse || response?.data }
      : { ok: false, reason: validation.errors.join('; ') };
  }

  async function routeBiologyVisualRequest(inputPayload = {}, options = {}) {
    const mode = inputPayload.mode || options.mode || 'local-rule';
    const preferredProvider = inputPayload.preferredProvider || options.preferredProvider || 'auto';
    const localPlan = inputPayload.existingLocalPlan || generateBiologyNewsVisualPlan(inputPayload, {
      sourceType: inputPayload.sourceType || 'manual-input',
      mode: 'local-rule'
    });
    const warnings = [];

    if (mode === 'local-rule') {
      return {
        ok: true,
        mode,
        providerUsed: 'local-rule-engine',
        fallbackUsed: false,
        visualPlan: normalizeAIVisualPlan(localPlan, localPlan),
        warnings,
        rawProviderResponse: null
      };
    }

    const payload = buildRouterPayload(inputPayload, localPlan);
    const providerQueue = mode === 'hybrid'
      ? [preferredProvider === 'auto' ? 'gemini' : preferredProvider, 'groq']
      : [preferredProvider === 'auto' ? 'gemini' : preferredProvider];

    for (const provider of unique(providerQueue).filter((item) => item !== 'stability')) {
      const response = await requestBiologyVisualPlanFromAI(provider, payload);
      if (!response.ok) {
        warnings.push(`${provider}: ${response.reason || 'provider unavailable'}`);
        continue;
      }
      const converted = providerResponseToPlan(response, localPlan, provider);
      if (!converted.ok) {
        warnings.push(`${provider}: ${converted.reason}`);
        continue;
      }

      let finalPlan = converted.visualPlan;
      let verifiedBy = provider;
      if (mode === 'hybrid') {
        const verification = await callDeepSeekForBiologyVerification({
          ...payload,
          visualPlan: finalPlan
        });
        if (verification.ok) {
          const verified = providerResponseToPlan(verification, finalPlan, 'deepseek');
          if (verified.ok) {
            finalPlan = normalizeAIVisualPlan(verified.visualPlan, finalPlan);
            verifiedBy = 'deepseek';
          } else {
            warnings.push(`deepseek: ${verified.reason}`);
          }
        } else {
          warnings.push(`deepseek: ${verification.reason || 'verification unavailable'}`);
        }
      }
      finalPlan.providerMeta = {
        ...(finalPlan.providerMeta || {}),
        mode,
        provider,
        verifiedBy
      };
      finalPlan.explanation.warnings = unique([...(finalPlan.explanation.warnings || []), ...warnings]);
      return {
        ok: true,
        mode,
        providerUsed: provider,
        fallbackUsed: false,
        visualPlan: finalPlan,
        warnings,
        rawProviderResponse: converted.rawProviderResponse
      };
    }

    warnings.push(mode === 'hybrid'
      ? 'Hybrid mode fell back to local-rule because configured providers were unavailable.'
      : 'AI-assisted mode fell back to local-rule because the provider was unavailable.');
    const fallbackPlan = normalizeAIVisualPlan(localPlan, localPlan);
    fallbackPlan.providerMeta = {
      ...(fallbackPlan.providerMeta || {}),
      mode,
      provider: 'local-rule-engine',
      verifiedBy: 'local fallback'
    };
    fallbackPlan.explanation.warnings = unique([...(fallbackPlan.explanation.warnings || []), ...warnings]);
    return {
      ok: true,
      mode,
      providerUsed: 'local-rule-engine',
      fallbackUsed: true,
      visualPlan: fallbackPlan,
      warnings,
      rawProviderResponse: null
    };
  }

  function renderBiologyNewsScene(visualPlan, mountNode) {
    if (!mountNode || !visualPlan) return;
    const scenePlan = {
      concept: visualPlan.title,
      templateId: visualPlan.detected?.templateId || visualPlan.visualScene?.sceneType || 'flow',
      template: visualPlan.chosenTemplate,
      sceneMode: visualPlan.visualScene?.sceneType || 'flow',
      entities: visualPlan.detected?.entities || [],
      process: visualPlan.detected?.processes?.[0] || 'biology news mechanism',
      animationSteps: visualPlan.animationPlan || [],
      simpleExplanation: visualPlan.explanation?.simple || '',
      innovationConnection: visualPlan.explanation?.innovationConnection || ''
    };
    mountNode.innerHTML = createSceneSvg(scenePlan);
    enhanceBiologyScene(mountNode, scenePlan);
  }

  function renderBiologyProviderStatus(plan, routerResult = {}) {
    const providerMeta = plan?.providerMeta || {};
    const warnings = unique([...(plan?.explanation?.warnings || []), ...(routerResult.warnings || [])]);
    const status = {
      mode: routerResult.mode || providerMeta.mode || 'local-rule',
      provider: routerResult.providerUsed || providerMeta.provider || 'local-rule-engine',
      fallback: routerResult.fallbackUsed ? 'Yes' : 'No',
      warnings: warnings.length ? warnings.join(' | ') : 'None'
    };
    const modeOut = document.getElementById('biologyProviderModeOut');
    const providerOut = document.getElementById('biologyProviderUsedOut');
    const fallbackOut = document.getElementById('biologyProviderFallbackOut');
    const warningsOut = document.getElementById('biologyProviderWarningsOut');
    if (modeOut) modeOut.textContent = status.mode;
    if (providerOut) providerOut.textContent = status.provider;
    if (fallbackOut) fallbackOut.textContent = status.fallback;
    if (warningsOut) warningsOut.textContent = status.warnings;
  }

  function renderBiologyNewsVisualPlan(plan, routerResult = {}) {
    renderBiologyNewsScene(plan, document.getElementById('biologyScenePreview'));
    const title = document.getElementById('biologySceneTitle');
    if (title) title.textContent = plan.title || 'Biology News Visual Plan';
    renderList(document.getElementById('biologyNewsEntitiesOut'), plan.detected.entities);
    renderList(document.getElementById('biologyNewsProcessesOut'), plan.detected.processes);
    renderList(document.getElementById('biologyNewsMatchesOut'), plan.matchedExamples.map((item) => `${item.title} (${item.score})`));
    const scaleTemplate = document.getElementById('biologyNewsScaleTemplateOut');
    if (scaleTemplate) scaleTemplate.textContent = `${plan.detected.scale} | ${plan.chosenTemplate}`;
    const confidenceOut = document.getElementById('biologyNewsConfidenceOut');
    if (confidenceOut) confidenceOut.textContent = `${Math.round(plan.confidence)}% confidence | ${plan.providerMeta.mode}`;
    const confidenceBar = document.getElementById('biologyNewsConfidenceBar');
    if (confidenceBar) confidenceBar.style.width = `${Math.max(0, Math.min(100, plan.confidence))}%`;
    const explanationOut = document.getElementById('biologyNewsExplanationOut');
    if (explanationOut) explanationOut.textContent = plan.explanation.simple;
    const fallbackOut = document.getElementById('biologyNewsFallbackOut');
    if (fallbackOut) fallbackOut.textContent = plan.explanation.warnings.length ? plan.explanation.warnings.join(' ') : 'Visual plan generated with local SciLoop biology rules.';
    const jsonOut = document.getElementById('biologyNewsJsonOut');
    if (jsonOut) jsonOut.textContent = JSON.stringify(plan, null, 2);
    const modeTag = document.getElementById('biologyNewsEngineModeTag');
    if (modeTag) {
      const providerMode = routerResult.mode || plan.providerMeta.mode || 'local-rule';
      modeTag.textContent = routerResult.fallbackUsed ? `${providerMode} fallback` : `${providerMode} mode`;
    }
    renderBiologyProviderStatus(plan, routerResult);
  }

  function getLatestVisibleBiologyNewsItem() {
    const items = Array.isArray(window.latestVisibleNewsItems) ? window.latestVisibleNewsItems : [];
    return items.find((item) => item?.subjectId === 'biology' || /biology|cell|dna|gene|protein|immune|bacteria|virus|cancer|microbiome/i.test(`${item?.title || ''} ${item?.summary || ''}`));
  }

  function openBiologyNewsVisualFromItem(item) {
    if (!item) return;
    const headline = document.getElementById('biologyNewsHeadlineInput');
    const summary = document.getElementById('biologyNewsSummaryInput');
    if (headline) headline.value = item.title || '';
    if (summary) summary.value = item.summary || '';
    const mode = document.getElementById('biologyNewsModeSelect')?.value || 'local-rule';
    const preferredProvider = document.getElementById('biologyNewsProviderSelect')?.value || 'auto';
    const plan = generateBiologyNewsVisualPlan({ title: item.title, summary: item.summary }, { sourceType: 'live-news', mode: 'local-rule' });
    renderBiologyNewsVisualPlan(plan, { mode: 'local-rule', providerUsed: 'local-rule-engine', fallbackUsed: false, warnings: [] });
    if (mode !== 'local-rule') {
      const fallbackOut = document.getElementById('biologyNewsFallbackOut');
      if (fallbackOut) fallbackOut.textContent = 'AI refining visual plan...';
      routeBiologyVisualRequest({
        title: item.title,
        summary: item.summary,
        mode,
        preferredProvider,
        sourceType: 'live-news',
        existingLocalPlan: plan
      }).then((result) => {
        renderBiologyNewsVisualPlan(result.visualPlan, result);
      });
    }
  }

  function initBiologyNewsVisualEnginePortal() {
    const headline = document.getElementById('biologyNewsHeadlineInput');
    const summary = document.getElementById('biologyNewsSummaryInput');
    const mode = document.getElementById('biologyNewsModeSelect');
    const provider = document.getElementById('biologyNewsProviderSelect');
    const generateBtn = document.getElementById('biologyGenerateNewsVisualBtn');
    const latestBtn = document.getElementById('biologyUseVisibleNewsBtn');
    if (!headline || !summary || !generateBtn) return;

    const generate = async () => {
      const selectedMode = mode?.value || 'local-rule';
      const selectedProvider = provider?.value || 'auto';
      const plan = generateBiologyNewsVisualPlan({ title: headline.value, summary: summary.value }, {
        sourceType: headline.value || summary.value ? 'manual-input' : 'demo',
        mode: 'local-rule'
      });
      renderBiologyNewsVisualPlan(plan, { mode: 'local-rule', providerUsed: 'local-rule-engine', fallbackUsed: false, warnings: [] });
      if (selectedMode === 'local-rule') return;

      const fallbackOut = document.getElementById('biologyNewsFallbackOut');
      if (fallbackOut) fallbackOut.textContent = 'AI refining visual plan...';
      const routerResult = await routeBiologyVisualRequest({
        title: headline.value,
        summary: summary.value,
        mode: selectedMode,
        preferredProvider: selectedProvider,
        existingLocalPlan: plan
      });
      renderBiologyNewsVisualPlan(routerResult.visualPlan, routerResult);
    };

    if (!generateBtn.dataset.bound) {
      generateBtn.dataset.bound = '1';
      generateBtn.addEventListener('click', generate);
      headline.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        generate();
      });
      mode?.addEventListener('change', generate);
      provider?.addEventListener('change', generate);
      latestBtn?.addEventListener('click', () => {
        const item = getLatestVisibleBiologyNewsItem();
        if (item) {
          openBiologyNewsVisualFromItem(item);
          return;
        }
        headline.value = 'Researchers discover bacteria evolving resistance to antibiotics';
        summary.value = 'A live biology article was not selected, so SciLoop loaded a demo headline for the local rule engine.';
        generate();
      });
    }

    if (!headline.value && !summary.value) {
      headline.value = 'Scientists improve CRISPR gene editing accuracy';
      summary.value = 'A new method improves precision when editing genes in living cells, reducing unwanted DNA changes.';
    }
    generate();
  }

  function initBiologyVisualLanguagePortal() {
    const select = document.getElementById('biologyConceptSelect');
    const input = document.getElementById('biologySentenceInput');
    const button = document.getElementById('biologyGeneratePlanBtn');
    if (!select || !input || !button) return;

    if (!select.dataset.bound) {
      select.innerHTML = conceptExamples.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`).join('');
      select.dataset.bound = '1';
      select.addEventListener('change', () => {
        const selected = findExampleById(select.value);
        input.value = selected.simpleSentence;
        renderBiologyPlan(generateBiologyVisualPlan(selected.simpleSentence));
      });
      button.addEventListener('click', () => {
        renderBiologyPlan(generateBiologyVisualPlan(input.value));
      });
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        renderBiologyPlan(generateBiologyVisualPlan(input.value));
      });
    }

    renderBiologyAlphabet();
    if (!input.value) input.value = findExampleById(select.value).simpleSentence;
    renderBiologyPlan(generateBiologyVisualPlan(input.value));
    initBiologyNewsVisualEnginePortal();
  }

  window.biologyVisualLanguage = {
    subject: 'Biology',
    version: '0.1',
    visualAlphabet,
    grammarRules,
    templates,
    conceptExamples
  };
  window.biologyTrainingSeeds = biologyTrainingSeeds;
  window.biologyNewsVisualEngine = biologyNewsVisualEngine;
  window.sciloopAIVisualRouter = sciloopAIVisualRouter;
  window.generateBiologyVisualPlan = generateBiologyVisualPlan;
  window.cleanBiologyNewsText = cleanBiologyNewsText;
  window.findClosestBiologyExamples = findClosestBiologyExamples;
  window.generateBiologyNewsVisualPlan = generateBiologyNewsVisualPlan;
  window.buildNewsToVisualTransfer = buildNewsToVisualTransfer;
  window.getCompactBiologyExampleContext = getCompactBiologyExampleContext;
  window.buildBiologyVisualPrompt = buildBiologyVisualPrompt;
  window.buildBiologyVisualPlanPrompt = buildBiologyVisualPlanPrompt;
  window.validateBiologyVisualPlan = validateBiologyVisualPlan;
  window.normalizeAIVisualPlan = normalizeAIVisualPlan;
  window.routeBiologyVisualRequest = routeBiologyVisualRequest;
  window.callGeminiForBiologyVisualPlan = callGeminiForBiologyVisualPlan;
  window.callGroqForBiologyVisualPlan = callGroqForBiologyVisualPlan;
  window.callDeepSeekForBiologyVerification = callDeepSeekForBiologyVerification;
  window.callCohereForBiologyClassification = callCohereForBiologyClassification;
  window.callHuggingFaceForBiologyExtraction = callHuggingFaceForBiologyExtraction;
  window.callPuterForBiologyVisualPlan = callPuterForBiologyVisualPlan;
  window.callStabilityForBiologyImageConcept = callStabilityForBiologyImageConcept;
  window.requestBiologyVisualPlanFromAI = requestBiologyVisualPlanFromAI;
  window.renderBiologyNewsScene = renderBiologyNewsScene;
  window.openBiologyNewsVisualFromItem = openBiologyNewsVisualFromItem;
  window.initBiologyVisualLanguagePortal = initBiologyVisualLanguagePortal;
})();
