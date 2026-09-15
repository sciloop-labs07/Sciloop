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

  const template = (id, name, bestFor, visualLayout, animationSteps, userControls, exampleConcepts) => ({
    id,
    name,
    bestFor,
    visualLayout,
    animationSteps,
    userControls,
    exampleConcepts
  });

  const visualAlphabet = [
    symbol('particle', 'Particle', '•', 'Tiny piece of matter or energy carrier', 'small glowing dot', 'drift, collide, accelerate', 'quantum/classical', 'Matter'),
    symbol('atom', 'Atom', '⚛️', 'Basic unit of matter', 'nucleus with orbit shells', 'orbit shimmer, level jump', 'atomic', 'Matter'),
    symbol('mass_object', 'Mass Object', '⬛', 'Object with inertia and gravity', 'solid block or sphere', 'resist motion, attract fields', 'classical', 'Matter'),
    symbol('rigid_body', 'Rigid Body', '▣', 'Object that rotates and translates as one body', 'block with axes', 'slide, rotate, collide', 'classical', 'Matter'),
    symbol('planet', 'Planet', '🪐', 'Large orbiting body shaped by gravity', 'lit sphere', 'orbit, fall around star', 'astronomical', 'Matter'),
    symbol('star', 'Star', '☀️', 'Hot plasma sphere powered by fusion', 'glowing plasma sphere', 'radiate, pulse, evolve', 'astronomical', 'Matter'),
    symbol('black_hole', 'Black Hole', '◉', 'Extreme curved spacetime region with event horizon', 'dark disk with lens ring', 'bend light, pull paths', 'relativistic', 'Matter'),
    symbol('fluid_packet', 'Fluid Packet', '💧', 'Small moving part of liquid or gas', 'soft droplet cell', 'flow, swirl, compress', 'classical/thermal', 'Matter'),
    symbol('gas_molecule', 'Gas Molecule', '○', 'Fast particle in a gas', 'small bouncing sphere', 'bounce, spread, heat up', 'thermal', 'Matter'),

    symbol('gravity_force', 'Gravity Force', '🌀', 'Attraction caused by mass, modeled classically as force', 'downward/radial arrow', 'accelerate inward', 'classical/astronomical', 'Forces'),
    symbol('electromagnetic_force', 'Electromagnetic Force', '⚡', 'Interaction between charged particles and fields', 'charge arrows and field loops', 'push, pull, radiate', 'atomic/classical', 'Forces'),
    symbol('normal_force', 'Normal Force', '⊥', 'Surface support force perpendicular to contact', 'upward support arrow', 'balance weight', 'classical', 'Forces'),
    symbol('friction', 'Friction', '↔', 'Contact force resisting sliding motion', 'rough opposing arrow', 'slow, heat, dissipate', 'classical/thermal', 'Forces'),
    symbol('tension', 'Tension', '—', 'Pull through rope, cable, or string', 'stretched line with arrows', 'pull, transmit force', 'classical', 'Forces'),
    symbol('spring_force', 'Spring Force', '〰', 'Restoring force from stretch or compression', 'coil and restoring arrow', 'oscillate, snap back', 'classical', 'Forces'),
    symbol('thrust', 'Thrust', '⇧', 'Propulsive force from expelled mass or engine push', 'engine plume arrow', 'accelerate forward', 'classical/aerospace', 'Forces'),
    symbol('drag', 'Drag', '≈', 'Fluid resistance against motion', 'wake and opposing arrow', 'slow, trail, dissipate', 'classical/fluid', 'Forces'),

    symbol('kinetic_energy', 'Kinetic Energy', 'KE', 'Energy of motion', 'blue speed meter', 'increase with speed', 'classical', 'Energy'),
    symbol('potential_energy', 'Potential Energy', 'PE', 'Stored energy from position or configuration', 'height meter', 'fall into kinetic', 'classical', 'Energy'),
    symbol('thermal_energy', 'Thermal Energy', 'HEAT', 'Random particle motion energy', 'red particle cloud', 'spread, equalize', 'thermal', 'Energy'),
    symbol('chemical_energy', 'Chemical Energy', 'CHEM', 'Energy stored in bonds', 'locked packet', 'release, transform', 'molecular', 'Energy'),
    symbol('electrical_energy', 'ELEC', 'Energy carried by charges and fields', 'circuit pulse', 'flow through circuit', 'classical/electrical', 'Energy'),
    symbol('radiation_energy', 'RAD', 'Energy carried by electromagnetic waves or photons', 'light packet', 'emit, absorb', 'quantum/wave', 'Energy'),
    symbol('energy_transfer_arrow', 'Energy Transfer Arrow', '→', 'Energy moving from one store to another', 'glowing arrow', 'pulse from source to receiver', 'any', 'Energy'),
    symbol('dissipation', 'Dissipation', 'LOSS', 'Useful energy spreading as heat or sound', 'fading heat cloud', 'scatter, fade', 'thermal', 'Energy'),

    symbol('gravitational_field', 'Gravity Field', '🌀', 'Influence around mass that guides motion', 'radial lines or curved grid', 'objects accelerate inward, grid bends', 'classical/astronomical', 'Fields'),
    symbol('electric_field', 'Electric Field', 'E', 'Field showing force direction on positive charge', 'radial field arrows', 'test charge moves', 'electrical', 'Fields'),
    symbol('magnetic_field', 'Magnetic Field', 'B', 'Field around magnets and currents', 'looped field lines', 'compass aligns, coil induces', 'electromagnetic', 'Fields'),
    symbol('spacetime_grid', 'Spacetime Grid', '▦', 'Geometry that mass-energy curves in relativity', 'bending mesh grid', 'curve, lens, orbit', 'relativistic', 'Fields'),
    symbol('pressure_field', 'Pressure Field', 'P', 'Spatial pressure differences in fluids or sound', 'compression bands', 'wave outward', 'fluid/wave', 'Fields'),
    symbol('temperature_field', 'Temperature Field', 'T', 'Map of hot and cold regions', 'red-blue gradient', 'diffuse toward balance', 'thermal', 'Fields'),

    symbol('velocity_vector', 'Velocity Vector', 'v', 'Direction and speed of motion', 'blue arrow', 'length changes with speed', 'classical', 'Motion'),
    symbol('acceleration_vector', 'Acceleration Vector', 'a', 'Rate of velocity change', 'gold arrow', 'grow under net force', 'classical', 'Motion'),
    symbol('circular_motion', 'Circular Motion', '⟳', 'Motion around a center', 'ring path', 'orbit, rotate', 'classical/astronomical', 'Motion'),
    symbol('oscillation', 'Oscillation', '↕', 'Repeated motion about equilibrium', 'sine path or spring', 'back and forth', 'classical/wave', 'Motion'),
    symbol('trajectory', 'Trajectory', '⌁', 'Path followed by moving object', 'curved dotted path', 'draw trail', 'classical', 'Motion'),
    symbol('collision', 'Collision', '✦', 'Objects interact strongly over short time', 'impact burst', 'exchange momentum', 'classical', 'Motion'),
    symbol('rotation', 'Rotation', '↻', 'Turning around an axis', 'axis with arc arrow', 'spin, precess', 'classical', 'Motion'),
    symbol('orbit', 'Orbit', '◎', 'Continuous fall around a massive body', 'elliptical path', 'loop, precess', 'astronomical', 'Motion'),

    symbol('mechanical_wave', 'Mechanical Wave', '~', 'Disturbance through matter', 'sine wave in medium', 'propagate, reflect', 'wave', 'Waves'),
    symbol('sound_wave', 'Sound Wave', '♪', 'Pressure wave through matter', 'compression bands', 'expand outward', 'wave/fluid', 'Waves'),
    symbol('light_wave', 'Light Wave', '☄', 'Electromagnetic radiation visible to eyes', 'transverse wave/ray', 'reflect, refract, lens', 'wave/quantum', 'Waves'),
    symbol('electromagnetic_wave', 'EM', 'Coupled electric and magnetic wave', 'crossed sine waves', 'propagate at light speed', 'electromagnetic', 'Waves'),
    symbol('frequency', 'f', 'How often a wave repeats', 'dense wave ticks', 'increase/decrease spacing', 'wave', 'Waves'),
    symbol('wavelength', 'λ', 'Distance between wave peaks', 'peak-to-peak bracket', 'stretch/compress', 'wave', 'Waves'),
    symbol('amplitude', 'A', 'Wave height or strength', 'vertical bracket', 'grow/shrink', 'wave', 'Waves'),
    symbol('interference', '∑', 'Waves combine to strengthen or cancel', 'overlapping waves', 'merge, brighten, cancel', 'wave', 'Waves'),
    symbol('diffraction', '⟂', 'Wave spreads after passing through opening', 'slit and curved fronts', 'spread around edge', 'wave', 'Waves'),

    symbol('photon', 'γ', 'Quantum packet of light', 'glowing light bead', 'travel, absorb, emit', 'quantum', 'Quantum'),
    symbol('electron', 'e-', 'Charged quantum particle', 'small negative bead', 'jump levels, cloud', 'quantum/atomic', 'Quantum'),
    symbol('wavefunction_cloud', 'ψ', 'Probability pattern for quantum state', 'soft density cloud', 'pulse until measured', 'quantum', 'Quantum'),
    symbol('probability_distribution', 'P(x)', 'Map of likely measurement outcomes', 'glow density map', 'shift, collapse', 'quantum/statistical', 'Quantum'),
    symbol('energy_level', 'n', 'Allowed quantum energy state', 'stacked horizontal lines', 'jump up/down', 'atomic/quantum', 'Quantum'),
    symbol('superposition_marker', '+', 'Combination of possible states before measurement', 'overlapping ghost states', 'blend, split', 'quantum', 'Quantum'),
    symbol('measurement_event', 'OBS', 'Interaction producing one observed result', 'flash dot', 'collapse to outcome', 'quantum', 'Quantum')
  ];

  const templates = [
    template('force_motion', 'Force-Motion Template', 'Newton laws, acceleration, friction, tension', 'block, contact surface, force arrows, acceleration vector, motion trail', ['object starts at rest or steady motion', 'net force arrow appears', 'acceleration vector grows', 'motion trail stretches'], ['mass slider', 'force slider', 'friction toggle'], ['Newton laws', 'Free fall', 'Friction']),
    template('energy_transfer', 'Energy-Transfer Template', 'Kinetic, potential, thermal, electrical, work', 'energy stores plus glowing transfer arrows and meters', ['stored energy meter appears', 'system changes state', 'energy packet transfers', 'new store rises while old store falls'], ['height slider', 'speed slider', 'loss toggle'], ['Work and energy', 'Conservation of energy', 'Heat loss']),
    template('field_line', 'Field-Line Template', 'Gravity, electric, and magnetic fields', 'central source, field lines, test particle, vector arrows', ['source appears', 'field lines expand', 'test particle enters', 'path responds to field'], ['source strength', 'test charge/mass', 'distance'], ['Electric field', 'Magnetic field', 'Gravity']),
    template('wave', 'Wave Template', 'Sound, light, water waves, interference', 'oscillating source, sine wave, moving wavefronts, labels', ['source vibrates', 'wavefront moves outward', 'amplitude and wavelength labels appear', 'reflection or interference pattern forms'], ['frequency', 'amplitude', 'medium'], ['Sound waves', 'Interference', 'Light reflection']),
    template('collision', 'Collision Template', 'Momentum, impulse, conservation', 'two bodies, velocity arrows before/after, conservation meter', ['objects approach', 'impact pulse appears', 'velocity arrows change', 'total momentum meter remains stable'], ['mass ratio', 'elasticity', 'initial velocity'], ['Momentum conservation', 'Elastic collision', 'Impulse']),
    template('oscillation', 'Oscillation Template', 'SHM, pendulum, spring, resonance', 'spring or pendulum plus equilibrium line and sine graph', ['object displaced', 'restoring force appears', 'motion repeats', 'sine graph traces time'], ['amplitude', 'spring stiffness', 'damping'], ['Spring mass', 'Pendulum', 'Resonance']),
    template('relativity_spacetime', 'Relativity-Spacetime Template', 'Curved spacetime, light bending, time dilation', 'warped grid, massive object, curved light path, clock comparison', ['flat grid appears', 'mass curves grid', 'light path bends', 'clock/orbit marker reveals worldview shift'], ['mass strength', 'distance', 'light path toggle'], ['General relativity', 'Time dilation', 'Black hole gravity']),
    template('quantum_probability', 'Quantum-Probability Template', 'Wavefunction, photon, electron, measurement', 'probability cloud, energy levels, measurement flash', ['cloud spreads', 'probability density pulses', 'measurement event flashes', 'single dot or energy jump appears'], ['measurement toggle', 'energy input', 'probability width'], ['Quantum superposition', 'Photoelectric effect', 'Atomic levels']),
    template('thermodynamic_flow', 'Thermodynamic-Flow Template', 'Heat, entropy, gases, pressure', 'hot/cold zones, particles, arrows, entropy spread meter', ['hot particles move fast', 'heat arrows flow to cold side', 'particles spread', 'temperature difference shrinks'], ['temperature difference', 'volume', 'particle count'], ['Heat transfer', 'Entropy', 'Ideal gas behavior'])
  ];

  const grammarRules = [
    { id: 'object_force_acceleration', name: 'Object + Force -> Acceleration', pattern: 'object receives net force and velocity changes', example: 'Force accelerates a block', visual: 'block + force arrow -> acceleration arrow -> motion trail' },
    { id: 'energy_transformation', name: 'Energy Transformation', pattern: 'one energy store decreases while another increases', example: 'Potential energy becomes kinetic energy', visual: 'height meter down -> speed meter up -> energy conserved/lost marker' },
    { id: 'field_interaction', name: 'Field Interaction', pattern: 'source creates field and test object responds', example: 'Electric charge creates an electric field', visual: 'charge node -> radial field lines -> test charge moves' },
    { id: 'wave_propagation', name: 'Wave Propagation', pattern: 'source disturbance travels through space or medium', example: 'Sound travels as pressure waves', visual: 'source vibrates -> compression bands move outward' },
    { id: 'conservation_law', name: 'Conservation Law', pattern: 'quantity redistributed but total stays stable', example: 'Momentum is conserved in collisions', visual: 'objects collide -> arrows change -> total meter stable' },
    { id: 'oscillation_rule', name: 'Oscillation', pattern: 'restoring force repeats motion around equilibrium', example: 'Spring mass oscillates', visual: 'spring stretches -> force reverses -> sine graph traces' },
    { id: 'relativity_rule', name: 'Relativity', pattern: 'mass-energy curves spacetime and paths follow geometry', example: 'Mass bends spacetime', visual: 'grid curves near mass -> light/object path bends' },
    { id: 'quantum_probability_rule', name: 'Quantum Probability', pattern: 'state represented by probabilities until measurement', example: 'Electron position is probabilistic', visual: 'electron cloud -> density glow -> measurement dot' },
    { id: 'thermodynamics_rule', name: 'Thermodynamics', pattern: 'thermal energy spreads from hotter to colder regions', example: 'Heat flows from hot to cold', visual: 'fast hot particles -> heat arrows -> colder particles speed up' }
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
    example('newton_first_law', "Newton's First Law", 'An object keeps moving unless a net force acts on it', 'Motion stays unchanged when net force is zero.', 'classical', ['mass object', 'velocity vector', 'net force marker'], 'inertia', 'force_motion', ['show object moving steadily', 'display zero net force', 'add external force', 'motion changes only after force'], ['force toggle', 'friction toggle'], 'Objects do not need a force to keep moving; they need no net force.', 'Constant motion does not require a continuous push in ideal conditions.', 'Inertia guides vehicle safety, spacecraft navigation, and robotics.', 'force_motion'),
    example('newton_second_law', "Newton's Second Law", 'A force accelerates a block', 'Net force equals mass times acceleration.', 'classical', ['block', 'force arrow', 'acceleration vector'], 'force causes acceleration', 'force_motion', ['block starts still', 'force arrow grows', 'acceleration vector appears', 'motion trail lengthens'], ['mass slider', 'force slider'], 'More force gives more acceleration; more mass resists acceleration.', 'Force and velocity are not the same thing.', 'This law powers machines, vehicles, rockets, and structural engineering.', 'force_motion'),
    example('newton_third_law', "Newton's Third Law", 'For every action force there is an equal opposite reaction force', 'Forces come in pairs between interacting bodies.', 'classical', ['two bodies', 'opposite force arrows'], 'action reaction force pair', 'force_motion', ['object A pushes B', 'opposite arrow appears on A', 'both responses show', 'pair labels lock'], ['show pair', 'mass ratio'], 'When one object pushes another, the other pushes back equally.', 'The forces act on different objects, so they do not simply cancel each other.', 'Rocket propulsion, walking, swimming, and collisions depend on this.', 'force_motion'),
    example('gravity_free_fall', 'Gravity and Free Fall', 'Gravity pulls objects toward Earth', 'Near Earth, gravity accelerates objects downward at nearly constant acceleration.', 'classical/planetary', ['Earth', 'mass object', 'gravity force'], 'free fall', 'field_line', ['Earth field lines appear', 'object is released', 'downward acceleration grows', 'motion trail points to Earth'], ['height', 'air drag'], 'Gravity changes the velocity of falling objects toward Earth.', 'Heavier objects do not fall faster in vacuum just because they are heavier.', 'Free fall explains elevators, sports, aerospace, and orbital motion.', 'field_line'),
    example('projectile_motion', 'Projectile Motion', 'A thrown ball follows a curved path', 'Horizontal velocity and vertical acceleration combine to make a parabola.', 'classical', ['ball', 'velocity vector', 'gravity force', 'trajectory'], 'projectile motion', 'force_motion', ['launch velocity splits into components', 'gravity pulls down', 'curved path draws', 'landing point glows'], ['angle', 'speed', 'gravity'], 'A projectile moves forward while gravity bends its path downward.', 'Gravity acts even while the object moves sideways.', 'Projectile models help sports, ballistics, drones, and rescue trajectories.', 'force_motion'),
    example('circular_motion', 'Circular Motion', 'A force pulls an object into circular motion', 'Centripetal acceleration points toward the center of the path.', 'classical', ['orbiting object', 'center mass', 'velocity vector', 'inward acceleration'], 'centripetal acceleration', 'field_line', ['object moves tangent', 'inward vector appears', 'path curves into circle', 'speed and radius labels appear'], ['radius', 'speed'], 'Circular motion needs inward acceleration, not an outward force.', 'Centrifugal force is often a frame effect, not a new outward interaction.', 'This supports satellites, turbines, centrifuges, and roller coasters.', 'field_line'),
    example('friction', 'Friction', 'Friction resists sliding and turns motion into heat', 'Microscopic surface interactions oppose relative motion and dissipate energy.', 'classical/thermal', ['block', 'rough surface', 'friction arrow', 'thermal energy'], 'frictional dissipation', 'force_motion', ['block slides', 'opposing friction arrow appears', 'speed trail shrinks', 'heat glow appears at contact'], ['roughness', 'normal force'], 'Friction slows sliding and spreads useful motion energy as heat.', 'Friction is not always bad; walking and braking need it.', 'Friction design matters for tires, brakes, shoes, engines, and materials.', 'force_motion'),
    example('work_energy', 'Work and Energy', 'A force doing work transfers energy', 'Work is energy transferred when force acts through distance.', 'classical', ['force arrow', 'moving object', 'energy packet'], 'work transfer', 'energy_transfer', ['force arrow pushes object', 'distance marker extends', 'energy packet moves', 'kinetic meter rises'], ['force', 'distance'], 'Work is how a force transfers energy to or from an object.', 'Work needs displacement in the force direction.', 'Energy transfer thinking powers motors, machines, lifts, and sports analysis.', 'energy_transfer'),
    example('conservation_energy', 'Conservation of Energy', 'Potential energy converts into kinetic energy', 'Energy changes form but total energy stays constant in a closed system.', 'classical', ['height meter', 'speed meter', 'energy transfer arrow'], 'energy conservation', 'energy_transfer', ['object starts high', 'potential meter is full', 'object falls and speeds up', 'kinetic meter rises while potential falls'], ['height', 'loss toggle'], 'Energy can change form without disappearing.', 'Energy is not used up; it transfers or spreads into less useful forms.', 'Conservation powers engineering, batteries, power grids, and climate models.', 'energy_transfer'),
    example('momentum_conservation', 'Momentum Conservation', 'Two carts collide and conserve momentum', 'Total momentum remains constant when external forces are negligible.', 'classical', ['cart A', 'cart B', 'velocity arrows', 'momentum meter'], 'momentum conservation', 'collision', ['carts approach', 'impact pulse appears', 'velocity arrows change', 'total momentum meter remains stable'], ['mass ratio', 'elasticity'], 'In a closed collision, motion is redistributed but total momentum stays the same.', 'Each object can change momentum; the total system momentum is conserved.', 'Momentum models protect vehicles, sports gear, and spacecraft docking.', 'collision'),
    example('elastic_collision', 'Elastic Collision', 'Elastic collision exchanges motion without losing kinetic energy', 'Momentum and kinetic energy are both conserved in ideal elastic collisions.', 'classical', ['two spheres', 'velocity arrows', 'energy meter'], 'elastic collision', 'collision', ['spheres approach', 'contact flash', 'velocity exchange', 'energy meter stays level'], ['mass ratio', 'initial speed'], 'Ideal elastic collisions bounce without losing total kinetic energy.', 'Real collisions often lose some kinetic energy to heat and sound.', 'Elastic models help particle physics, gas theory, and precision sensors.', 'collision'),
    example('simple_harmonic_motion', 'Simple Harmonic Motion', 'A spring mass oscillates around equilibrium', 'Restoring force proportional to displacement creates sinusoidal motion.', 'classical', ['spring', 'mass', 'restoring force', 'sine graph'], 'oscillation', 'oscillation', ['mass is pulled', 'spring force points back', 'mass crosses equilibrium', 'sine graph traces'], ['amplitude', 'spring stiffness'], 'The farther the mass is displaced, the stronger the restoring pull.', 'Speed is greatest at equilibrium, not at the farthest points.', 'SHM appears in clocks, sensors, suspension, acoustics, and quantum analogies.', 'oscillation'),
    example('pendulum_motion', 'Pendulum Motion', 'A pendulum swings under gravity', 'Gravity provides a restoring component toward the lowest point.', 'classical', ['pendulum bob', 'string tension', 'gravity force'], 'pendulum oscillation', 'oscillation', ['bob starts displaced', 'gravity component points down arc', 'bob swings through center', 'period label appears'], ['length', 'angle'], 'A pendulum repeats because gravity pulls it back toward the center.', 'For small angles, period depends mainly on length, not mass.', 'Pendulums shaped timekeeping, seismology, and stability sensors.', 'oscillation'),
    example('wave_propagation', 'Wave Propagation', 'A wave carries energy through a medium', 'A disturbance transfers energy without transporting the whole medium forward.', 'wave', ['source', 'wavefront', 'amplitude marker'], 'wave propagation', 'wave', ['source vibrates', 'crest moves outward', 'wavelength label appears', 'energy arrow follows wave'], ['frequency', 'amplitude'], 'A wave moves a pattern and energy through space or matter.', 'The medium particles usually oscillate; they do not travel with the wave across the full distance.', 'Wave physics enables communication, imaging, music, and earthquake science.', 'wave'),
    example('sound_waves', 'Sound Waves', 'Sound travels as pressure waves', 'Sound is moving compression and rarefaction in a medium.', 'wave/fluid', ['vibrating source', 'pressure field', 'air molecules'], 'pressure wave', 'wave', ['speaker vibrates', 'compressed bands form', 'bands travel outward', 'listener marker receives signal'], ['frequency', 'volume'], 'Sound is pressure variation traveling through matter.', 'Sound cannot travel through perfect vacuum because it needs a medium.', 'Sound physics drives audio, ultrasound, sonar, and medical imaging.', 'wave'),
    example('light_reflection', 'Light Reflection', 'Light reflects from a mirror at equal angles', 'The angle of incidence equals the angle of reflection.', 'optical', ['light ray', 'mirror', 'normal line'], 'reflection', 'wave', ['incoming ray approaches mirror', 'normal line appears', 'reflected ray leaves', 'equal angle arcs glow'], ['angle', 'surface'], 'A smooth mirror redirects light predictably.', 'The normal line is an imaginary reference, not a physical object.', 'Reflection enables mirrors, telescopes, cameras, and optical instruments.', 'wave'),
    example('light_refraction', 'Light Refraction', 'Light bends when it enters another medium', 'Light changes speed in different materials, so its direction changes.', 'optical', ['light ray', 'medium boundary', 'normal line'], 'refraction', 'wave', ['ray enters glass', 'speed marker changes', 'path bends at boundary', 'angle labels appear'], ['refractive index', 'angle'], 'Light bends because its speed changes in a new material.', 'Refraction is not the same as reflection; some light can do both.', 'Refraction powers lenses, glasses, microscopes, and fiber optics.', 'wave'),
    example('interference', 'Interference', 'Two waves overlap and create bright and dark regions', 'Wave amplitudes add, producing constructive and destructive interference.', 'wave', ['two sources', 'wavefronts', 'interference pattern'], 'wave interference', 'wave', ['two waves expand', 'crests overlap bright', 'crest and trough cancel dim', 'pattern freezes into bands'], ['source spacing', 'wavelength'], 'Waves can add together or cancel depending on phase.', 'Destructive interference cancels displacement locally, not the existence of energy everywhere.', 'Interference enables noise cancellation, optics, quantum experiments, and sensors.', 'wave'),
    example('electric_field', 'Electric Field', 'A charge creates an electric field', 'Electric field maps the force that a positive test charge would feel.', 'electrical', ['charge', 'electric field lines', 'test charge'], 'electric field interaction', 'field_line', ['central charge appears', 'radial field lines grow', 'test charge enters', 'force arrow follows field'], ['charge sign', 'field strength'], 'A charge changes the space around it so other charges feel force.', 'Field lines are a map, not physical strings.', 'Electric fields power electronics, sensors, accelerators, and medical devices.', 'field_line'),
    example('magnetic_field', 'Magnetic Field', 'A magnet creates looping magnetic field lines', 'Magnetic fields exert forces on moving charges and magnetic materials.', 'electromagnetic', ['magnet', 'magnetic field loops', 'compass needle'], 'magnetic field interaction', 'field_line', ['magnet appears', 'looped field lines draw', 'compass aligns', 'moving charge bends'], ['field strength', 'charge speed'], 'Magnetic fields guide moving charges and align magnets.', 'Magnetic field lines form loops; they do not begin or end like electric field lines from isolated charges.', 'Magnetism enables motors, MRI, generators, speakers, and data storage.', 'field_line'),
    example('electromagnetic_induction', 'Electromagnetic Induction', 'A changing magnetic field creates current', 'Changing magnetic flux induces electric field and current in a circuit.', 'electromagnetic', ['coil', 'magnetic field', 'current arrow'], 'electromagnetic induction', 'field_line', ['magnet moves near coil', 'magnetic flux changes', 'current arrow appears', 'lamp or meter glows'], ['magnet speed', 'coil turns'], 'Changing magnetism can create electricity.', 'A steady magnetic field alone does not induce current in a still coil; change matters.', 'Induction is the core of generators, transformers, wireless charging, and power grids.', 'field_line'),
    example('heat_transfer', 'Heat Transfer', 'Heat flows from hot to cold', 'Thermal energy transfers from higher temperature regions to lower temperature regions.', 'thermal', ['hot region', 'cold region', 'thermal energy arrows'], 'heat flow', 'thermodynamic_flow', ['hot particles move fast', 'cold particles move slow', 'heat arrows cross boundary', 'temperature colors become closer'], ['temperature difference', 'insulation'], 'Heat naturally spreads from hotter matter to colder matter.', 'Cold does not flow as a substance; thermal energy transfers away from hotter regions.', 'Heat transfer shapes engines, climate, cooking, electronics cooling, and medicine.', 'thermodynamic_flow'),
    example('entropy_increase', 'Entropy Increase', 'Entropy tends to increase in isolated systems', 'Energy and matter tend to spread into more probable arrangements.', 'thermal/statistical', ['particles', 'container', 'entropy meter'], 'entropy increase', 'thermodynamic_flow', ['particles start clustered', 'barrier opens', 'particles spread', 'entropy meter rises'], ['volume', 'particle count'], 'Systems naturally move toward more spread-out possibilities.', 'Entropy is not just disorder; it measures how many microscopic arrangements fit the same macrostate.', 'Entropy matters for engines, computing, chemistry, cosmology, and life systems.', 'thermodynamic_flow'),
    example('ideal_gas', 'Ideal Gas Behavior', 'Gas pressure rises when particles hit walls more often or harder', 'Ideal gas behavior links pressure, volume, temperature, and particle number.', 'thermal', ['gas molecules', 'container wall', 'pressure meter'], 'gas pressure', 'thermodynamic_flow', ['particles bounce in box', 'wall impacts flash', 'temperature increases speed', 'pressure meter changes'], ['temperature', 'volume', 'molecule count'], 'Gas pressure comes from many tiny particle collisions with walls.', 'Gas particles are not pushing like a solid block; pressure is statistical impact.', 'Gas laws support engines, weather, aerosols, diving, and space systems.', 'thermodynamic_flow'),
    example('special_relativity_time_dilation', 'Special Relativity / Time Dilation', 'A fast moving clock ticks slower compared with a resting observer', 'Time intervals depend on relative motion when speeds approach light speed.', 'relativistic', ['clock', 'observer', 'speed of light marker'], 'time dilation', 'relativity_spacetime', ['two clocks appear', 'one ship accelerates', 'moving clock ticks slower', 'comparison label explains relative time'], ['speed fraction', 'clock compare'], 'At very high speed, different observers can measure time differently.', 'Time dilation is not an illusion; it is measured and built into GPS corrections.', 'Relativity supports GPS, particle accelerators, cosmology, and precision physics.', 'relativity_spacetime'),
    example('general_relativity_curvature', 'General Relativity / Spacetime Curvature', 'Mass bends spacetime and curves light', 'Mass-energy changes spacetime geometry, and objects follow curved paths through it.', 'relativistic/astronomical', ['massive object', 'spacetime grid', 'light ray'], 'spacetime curvature', 'relativity_spacetime', ['flat grid appears', 'mass dents grid', 'light ray bends near mass', 'orbit path follows curvature'], ['mass', 'distance'], 'Gravity is deeply modeled as geometry, not only as a pulling force.', 'The rubber-sheet image is only an analogy; real spacetime curvature is four-dimensional.', 'This explains lensing, black holes, gravitational waves, and modern cosmology.', 'relativity_spacetime'),
    example('quantum_superposition', 'Quantum Superposition', 'An electron exists as a probability cloud before measurement', 'A quantum state can combine possible outcomes until interaction produces a result.', 'quantum', ['electron', 'wavefunction cloud', 'measurement event'], 'superposition and measurement', 'quantum_probability', ['probability cloud appears', 'density pulses', 'measurement flash occurs', 'single dot is selected'], ['measurement toggle', 'cloud width'], 'Before measurement, quantum physics predicts probabilities, not a tiny planet path.', 'Superposition is not simply not knowing a hidden classical position.', 'Quantum ideas power semiconductors, lasers, quantum computing, and sensors.', 'quantum_probability'),
    example('photoelectric_effect', 'Photoelectric Effect', 'Light ejects electrons only when each photon has enough energy', 'Photon energy depends on frequency, and above threshold it can release electrons from metal.', 'quantum/atomic', ['photon', 'electron', 'metal surface', 'energy level'], 'photoelectric emission', 'quantum_probability', ['photons hit metal', 'low frequency fails', 'high frequency ejects electron', 'current meter lights'], ['frequency', 'intensity'], 'A photon must carry enough energy to free an electron.', 'Brighter low-frequency light may still fail if photon energy is below threshold.', 'The effect helped launch quantum physics and supports solar cells and light sensors.', 'quantum_probability'),
    example('atomic_energy_levels', 'Atomic Energy Levels', 'Electrons jump between allowed energy levels', 'Atoms absorb or emit photons when electrons transition between quantized levels.', 'atomic/quantum', ['electron', 'energy level', 'photon'], 'quantized transition', 'quantum_probability', ['energy levels appear', 'electron absorbs photon', 'electron jumps up', 'emitted photon appears on drop'], ['photon energy', 'level gap'], 'Atoms can only absorb or emit certain energy packets.', 'Electrons do not orbit like tiny planets in simple classical paths.', 'Energy levels explain LEDs, lasers, spectroscopy, and quantum technologies.', 'quantum_probability'),
    example('black_hole_gravity', 'Black Hole Gravity', 'Black hole gravity bends light near an event horizon', 'Extreme spacetime curvature can trap paths inside the event horizon and lens light outside it.', 'relativistic/astronomical', ['black hole', 'event horizon', 'spacetime grid', 'photon'], 'extreme curvature', 'relativity_spacetime', ['event horizon appears', 'grid steepens', 'photon path bends strongly', 'lensing ring glows'], ['mass', 'closest approach'], 'A black hole is a region where spacetime curvature becomes so extreme that escape from inside the horizon is impossible.', 'A black hole is not a cosmic vacuum cleaner; far away it gravitates like any object with the same mass.', 'Black hole physics drives gravitational-wave astronomy, high-energy astrophysics, and quantum gravity questions.', 'relativity_spacetime')
  ];

  const trainingSeedInputs = [
    ['A force makes a mass accelerate', ['mass', 'force arrow', 'acceleration vector'], 'force causes acceleration', 'force_motion', ['show block at rest', 'apply force arrow', 'block speeds up', 'acceleration vector appears'], 'A net force changes an object motion by producing acceleration.'],
    ['A block slides and friction slows it down', ['block', 'friction arrow', 'rough surface'], 'frictional dissipation', 'force_motion', ['block slides', 'friction arrow opposes motion', 'trail shortens', 'heat glow appears'], 'Friction opposes sliding and turns organized motion into thermal energy.'],
    ['Gravity pulls objects toward Earth', ['Earth', 'mass object', 'gravity field'], 'free fall', 'field_line', ['Earth appears', 'field lines draw', 'object accelerates inward'], 'Earth gravity changes object velocity downward.'],
    ['A thrown ball follows a projectile path', ['ball', 'velocity vector', 'gravity arrow'], 'projectile motion', 'force_motion', ['launch vector splits', 'gravity acts downward', 'parabola draws'], 'Horizontal motion and vertical acceleration combine into a curved path.'],
    ['A satellite orbits Earth', ['planet', 'satellite', 'orbit path'], 'orbit', 'field_line', ['satellite moves tangent', 'gravity bends path', 'orbit loop closes'], 'Orbit is continuous falling around a massive body.'],
    ['Potential energy converts into kinetic energy', ['height meter', 'speed meter', 'energy arrow'], 'energy conversion', 'energy_transfer', ['object starts high', 'PE meter drops', 'KE meter rises'], 'Stored gravitational energy becomes motion energy.'],
    ['A force doing work transfers energy', ['force arrow', 'distance marker', 'energy packet'], 'work transfer', 'energy_transfer', ['force pushes through distance', 'packet moves', 'KE rises'], 'Work is energy transfer by force through displacement.'],
    ['Energy is conserved in a falling object', ['potential energy', 'kinetic energy', 'total meter'], 'energy conservation', 'energy_transfer', ['PE decreases', 'KE increases', 'total line stays stable'], 'Energy changes form while total remains stable in a closed system.'],
    ['Two carts collide and conserve momentum', ['cart A', 'cart B', 'momentum meter'], 'momentum conservation', 'collision', ['carts approach', 'impact flash', 'velocity arrows change', 'total momentum steady'], 'Momentum redistributes between objects in a closed collision.'],
    ['Elastic balls exchange velocity', ['two spheres', 'velocity arrows', 'energy meter'], 'elastic collision', 'collision', ['spheres meet', 'bounce apart', 'energy meter stays level'], 'Ideal elastic collisions conserve kinetic energy and momentum.'],
    ['A spring mass oscillates', ['spring', 'mass', 'restoring force'], 'oscillation', 'oscillation', ['mass displaced', 'force points back', 'sine graph traces'], 'A restoring force creates repeated motion.'],
    ['A pendulum swings under gravity', ['pendulum', 'gravity', 'arc path'], 'pendulum oscillation', 'oscillation', ['bob displaced', 'gravity component appears', 'arc repeats'], 'Gravity pulls the pendulum back toward the lowest point.'],
    ['A wave carries energy', ['source', 'wavefront', 'energy arrow'], 'wave propagation', 'wave', ['source vibrates', 'crest travels', 'energy arrow follows'], 'Waves transfer energy through a pattern.'],
    ['Sound travels as pressure waves', ['speaker', 'pressure bands', 'air molecules'], 'pressure wave', 'wave', ['speaker vibrates', 'compression bands move', 'listener receives'], 'Sound is moving compression and rarefaction in a medium.'],
    ['Light reflects from a mirror', ['light ray', 'mirror', 'normal line'], 'reflection', 'wave', ['ray approaches', 'angle label appears', 'ray leaves symmetrically'], 'Reflection redirects light with equal incident and reflected angles.'],
    ['Light refracts in glass', ['light ray', 'glass boundary', 'normal line'], 'refraction', 'wave', ['ray enters glass', 'speed changes', 'path bends'], 'Light bends when its speed changes in a new medium.'],
    ['Two waves interfere', ['two waves', 'overlap region', 'bright dark bands'], 'interference', 'wave', ['waves expand', 'peaks add', 'peak and trough cancel'], 'Overlapping waves combine their amplitudes.'],
    ['A charge creates an electric field', ['charge', 'electric field lines', 'test charge'], 'electric field', 'field_line', ['charge appears', 'field arrows expand', 'test charge moves'], 'A charge changes space around it so other charges feel force.'],
    ['A magnet creates magnetic loops', ['magnet', 'field loops', 'compass'], 'magnetic field', 'field_line', ['magnet appears', 'loops draw', 'compass aligns'], 'Magnetic field lines loop around magnets and currents.'],
    ['A changing magnetic field creates current', ['coil', 'moving magnet', 'current arrow'], 'electromagnetic induction', 'field_line', ['magnet moves', 'flux changes', 'current arrow appears'], 'Changing magnetic flux can induce electric current.'],
    ['Heat flows from hot to cold', ['hot particles', 'cold particles', 'heat arrows'], 'heat flow', 'thermodynamic_flow', ['hot side vibrates fast', 'arrows move to cold side', 'colors balance'], 'Thermal energy transfers from hotter regions to colder regions.'],
    ['Entropy increases when gas spreads', ['gas molecules', 'container', 'entropy meter'], 'entropy increase', 'thermodynamic_flow', ['clustered gas appears', 'barrier opens', 'particles spread'], 'More spread-out arrangements are usually more probable.'],
    ['Gas pressure comes from particle collisions', ['gas molecules', 'wall', 'pressure meter'], 'gas pressure', 'thermodynamic_flow', ['particles bounce', 'wall hits flash', 'pressure meter responds'], 'Gas pressure is many microscopic impacts on container walls.'],
    ['A fast clock ticks slower', ['moving clock', 'rest clock', 'speed marker'], 'time dilation', 'relativity_spacetime', ['two clocks appear', 'ship speeds up', 'moving clock drifts'], 'At high relative speed, observers measure different elapsed times.'],
    ['Mass bends spacetime and curves light', ['massive object', 'spacetime grid', 'light ray'], 'spacetime curvature', 'relativity_spacetime', ['grid bends', 'light path curves', 'lensing label appears'], 'Mass-energy curves spacetime, so light follows curved geometry.'],
    ['Black hole gravity bends photon paths', ['black hole', 'photon', 'event horizon'], 'extreme curvature', 'relativity_spacetime', ['horizon appears', 'photon path bends', 'lensing ring glows'], 'Near black holes, spacetime curvature is extreme.'],
    ['An electron exists as a probability cloud', ['electron', 'wavefunction cloud', 'measurement dot'], 'quantum probability', 'quantum_probability', ['cloud pulses', 'measurement flashes', 'one dot appears'], 'Quantum states predict probabilities before measurement.'],
    ['A photon ejects an electron from metal', ['photon', 'metal surface', 'electron'], 'photoelectric effect', 'quantum_probability', ['photon hits', 'threshold label appears', 'electron exits'], 'A photon must have enough energy to release an electron.'],
    ['Atoms emit photons when electrons drop levels', ['energy levels', 'electron', 'photon'], 'quantized transition', 'quantum_probability', ['electron drops', 'photon leaves', 'color label appears'], 'Atoms emit specific photon energies during level changes.'],
    ['A battery creates voltage in a circuit', ['battery', 'electric field', 'current'], 'electric energy transfer', 'field_line', ['battery appears', 'field pushes charges', 'current loop glows'], 'Voltage helps drive charge motion around a circuit.'],
    ['Drag slows a moving car', ['car', 'air flow', 'drag arrow'], 'drag force', 'force_motion', ['car moves', 'air wake appears', 'opposing drag grows'], 'Drag is fluid resistance against motion.'],
    ['A rocket accelerates by thrust', ['rocket', 'thrust arrow', 'exhaust'], 'thrust acceleration', 'force_motion', ['exhaust leaves back', 'thrust arrow points forward', 'rocket speeds up'], 'Expelling mass backward creates forward thrust.'],
    ['A rotating body has angular momentum', ['rigid body', 'rotation arrow', 'axis'], 'rotation', 'collision', ['axis appears', 'body spins', 'angular momentum label glows'], 'Rotating systems carry angular momentum.'],
    ['A fluid speeds up in a narrow pipe', ['fluid packet', 'pipe', 'velocity arrows'], 'flow continuity', 'field_line', ['wide pipe flows slow', 'narrow section appears', 'arrows lengthen'], 'For steady incompressible flow, narrower regions can move faster.'],
    ['Pressure waves move through air', ['pressure field', 'air molecules', 'wavefront'], 'pressure wave', 'wave', ['compression forms', 'rarefaction follows', 'front travels'], 'Sound-like pressure changes propagate through matter.'],
    ['Diffraction spreads light through a slit', ['slit', 'light wave', 'curved fronts'], 'diffraction', 'wave', ['plane wave hits slit', 'curved fronts emerge', 'spread label appears'], 'Waves spread after passing openings or edges.'],
    ['A transformer changes voltage using induction', ['coil', 'magnetic field', 'second coil'], 'induction', 'field_line', ['first coil pulses', 'magnetic field changes', 'second coil voltage appears'], 'Changing current in one coil can induce voltage in another.'],
    ['Thermal particles move faster when heated', ['gas molecules', 'temperature field', 'speed trails'], 'thermal energy increase', 'thermodynamic_flow', ['temperature rises', 'particles speed up', 'collision flashes increase'], 'Higher temperature means greater average particle kinetic energy.'],
    ['A wave has wavelength and amplitude', ['sine wave', 'wavelength marker', 'amplitude marker'], 'wave measurement', 'wave', ['wave draws', 'lambda bracket appears', 'amplitude bracket appears'], 'Wavelength measures spacing; amplitude measures strength.'],
    ['Measurement collapses a quantum probability cloud', ['wavefunction cloud', 'measurement event', 'dot'], 'measurement', 'quantum_probability', ['cloud spreads', 'observer flash appears', 'single outcome dot remains'], 'Measurement produces one observed outcome from a probability pattern.'],
    ['Light bends near a massive galaxy', ['galaxy mass', 'light ray', 'lensed image'], 'gravitational lensing', 'relativity_spacetime', ['galaxy curves grid', 'background light bends', 'arc image appears'], 'Massive objects can lens light by curving spacetime.'],
    ['Friction converts kinetic energy into heat', ['sliding block', 'friction', 'thermal glow'], 'dissipation', 'energy_transfer', ['block slides', 'friction acts', 'KE meter drops', 'heat meter rises'], 'Friction transfers organized motion energy into thermal energy.']
  ];

  function getTemplateName(templateId) {
    return templates.find((item) => item.id === templateId)?.name || 'Generic Physics Template';
  }

  const physicsTrainingSeeds = trainingSeedInputs.map(([input, entities, process, templateId, visualPlan, explanation]) => ({
    input,
    subject: 'Physics',
    scale: detectScale(input.toLowerCase()),
    entities,
    process,
    template: getTemplateName(templateId),
    visualPlan,
    animationSteps: visualPlan,
    explanation,
    innovationConnection: 'This mapping helps SciLoop convert physics news or concepts into reusable visual scenes.'
  }));

  const keywordRules = [
    { id: 'general_relativity_curvature', terms: ['spacetime', 'curves light', 'bends light', 'light bending', 'mass bends', 'relativity'] },
    { id: 'black_hole_gravity', terms: ['black hole', 'event horizon'] },
    { id: 'special_relativity_time_dilation', terms: ['time dilation', 'speed of light', 'fast clock'] },
    { id: 'quantum_superposition', terms: ['probability cloud', 'wavefunction', 'superposition', 'measurement'] },
    { id: 'photoelectric_effect', terms: ['photoelectric', 'ejects electron', 'photon eject'] },
    { id: 'atomic_energy_levels', terms: ['energy level', 'atomic levels', 'electron jump'] },
    { id: 'electromagnetic_induction', terms: ['changing magnetic field', 'induction', 'coil', 'creates current'] },
    { id: 'electric_field', terms: ['electric field', 'charge creates', 'voltage'] },
    { id: 'magnetic_field', terms: ['magnetic field', 'magnet'] },
    { id: 'sound_waves', terms: ['sound', 'pressure wave'] },
    { id: 'heat_transfer', terms: ['heat flows', 'hot to cold', 'thermal'] },
    { id: 'entropy_increase', terms: ['entropy'] },
    { id: 'ideal_gas', terms: ['ideal gas', 'gas pressure'] },
    { id: 'interference', terms: ['interference', 'overlap'] },
    { id: 'light_refraction', terms: ['refraction', 'refract', 'bends in glass'] },
    { id: 'light_reflection', terms: ['reflection', 'reflects', 'mirror'] },
    { id: 'wave_propagation', terms: ['wave', 'frequency', 'wavelength', 'amplitude'] },
    { id: 'momentum_conservation', terms: ['momentum', 'conserve momentum', 'carts collide'] },
    { id: 'elastic_collision', terms: ['elastic collision'] },
    { id: 'simple_harmonic_motion', terms: ['spring', 'oscillates', 'simple harmonic'] },
    { id: 'pendulum_motion', terms: ['pendulum'] },
    { id: 'conservation_energy', terms: ['potential energy', 'kinetic energy', 'energy converts', 'conservation of energy'] },
    { id: 'work_energy', terms: ['work', 'power'] },
    { id: 'gravity_free_fall', terms: ['gravity', 'fall', 'earth', 'pulls objects'] },
    { id: 'projectile_motion', terms: ['projectile', 'trajectory', 'thrown'] },
    { id: 'circular_motion', terms: ['circular', 'orbit'] },
    { id: 'friction', terms: ['friction'] },
    { id: 'newton_third_law', terms: ['third law', 'equal opposite', 'reaction'] },
    { id: 'newton_first_law', terms: ['first law', 'inertia'] },
    { id: 'newton_second_law', terms: ['force accelerates', 'second law', 'net force', 'accelerates'] }
  ];

  const keywordGroups = {
    entities: {
      'mass object': ['mass', 'block', 'object', 'body'],
      planet: ['earth', 'planet'],
      star: ['star'],
      'black hole': ['black hole'],
      photon: ['photon', 'light'],
      electron: ['electron'],
      charge: ['charge', 'voltage', 'current'],
      magnet: ['magnet', 'magnetic'],
      wave: ['wave', 'sound', 'frequency', 'wavelength', 'amplitude'],
      gas: ['gas', 'pressure', 'temperature'],
      clock: ['clock', 'time dilation']
    },
    forces: {
      gravity: ['gravity', 'fall', 'orbit', 'spacetime'],
      friction: ['friction', 'rough', 'sliding'],
      electromagnetic: ['electric', 'charge', 'magnetic', 'current', 'voltage'],
      spring: ['spring', 'oscillate'],
      thrust: ['thrust', 'rocket'],
      drag: ['drag', 'air resistance']
    },
    energy: {
      kinetic: ['kinetic', 'speed', 'motion energy'],
      potential: ['potential', 'height', 'stored energy'],
      thermal: ['heat', 'thermal', 'temperature'],
      electrical: ['electrical', 'voltage', 'current'],
      radiation: ['light', 'photon', 'radiation']
    },
    fields: {
      gravitational: ['gravity field', 'gravitational', 'spacetime'],
      electric: ['electric field', 'charge'],
      magnetic: ['magnetic field', 'magnet', 'coil'],
      pressure: ['pressure', 'sound'],
      temperature: ['temperature', 'heat']
    }
  };

  function detectWords(text, group) {
    return Object.entries(group)
      .filter(([, terms]) => terms.some((term) => text.includes(term)))
      .map(([name]) => name);
  }

  function findExample(text) {
    const exact = keywordRules.find((rule) => rule.terms.some((term) => text.includes(term)));
    if (exact) return conceptExamples.find((item) => item.id === exact.id);

    let best = null;
    let score = 0;
    conceptExamples.forEach((item) => {
      const words = `${item.title} ${item.simpleSentence} ${item.process} ${item.entities.join(' ')}`.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
      const currentScore = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
      if (currentScore > score) {
        best = item;
        score = currentScore;
      }
    });
    return score >= 2 ? best : null;
  }

  function detectScale(text) {
    if (/(spacetime|relativity|black hole|speed of light|time dilation)/.test(text)) return 'relativistic';
    if (/(planet|star|orbit|galaxy|gravity)/.test(text)) return 'astronomical/classical';
    if (/(electron|photon|wavefunction|quantum|atom|energy level)/.test(text)) return 'quantum/atomic';
    if (/(heat|temperature|gas|entropy|pressure)/.test(text)) return 'thermal/statistical';
    if (/(charge|electric|magnetic|current|voltage|coil)/.test(text)) return 'electromagnetic';
    if (/(sound|wave|frequency|wavelength|amplitude|interference)/.test(text)) return 'wave';
    return 'classical';
  }

  function chooseTemplate(text, exampleMatch) {
    if (exampleMatch) return exampleMatch.template;
    if (/(spacetime|relativity|time dilation|black hole|light bending|curves light|mass bends)/.test(text)) return 'relativity_spacetime';
    if (/(electron|photon|wavefunction|superposition|measurement|atom|energy level|photoelectric)/.test(text)) return 'quantum_probability';
    if (/(heat|thermal|entropy|temperature|gas|pressure|expansion)/.test(text)) return 'thermodynamic_flow';
    if (/(wave|sound|light|frequency|wavelength|amplitude|interference|diffraction|reflection|refraction)/.test(text)) return 'wave';
    if (/(collide|collision|momentum|impulse)/.test(text)) return 'collision';
    if (/(spring|pendulum|oscillat|resonance)/.test(text)) return 'oscillation';
    if (/(field|charge|magnet|gravity|orbit|induction|coil)/.test(text)) return 'field_line';
    if (/(energy|kinetic|potential|work|power)/.test(text)) return 'energy_transfer';
    return 'force_motion';
  }

  function makeGenericPlan(inputText, text) {
    const templateId = chooseTemplate(text);
    const templateInfo = templates.find((item) => item.id === templateId) || templates[0];
    const entities = detectWords(text, keywordGroups.entities);
    return {
      id: 'generic_physics_visual_plan',
      title: 'Generic Physics Visual Plan',
      inputText,
      subject: 'Physics',
      scale: detectScale(text),
      entities: entities.length ? entities : ['object', 'interaction', 'motion or energy outcome'],
      forces: detectWords(text, keywordGroups.forces),
      fields: detectWords(text, keywordGroups.fields),
      energyTypes: detectWords(text, keywordGroups.energy),
      process: 'object -> interaction -> motion or energy outcome',
      template: templateId,
      templateName: templateInfo.name,
      chosenTemplate: templateInfo.name,
      sceneMode: templateId,
      animationSteps: ['show object or source', 'show interaction arrow or field', 'animate motion/energy change', 'label the observable outcome'],
      userControls: templateInfo.userControls,
      simpleExplanation: 'This sentence maps to a general physics scene: an object interacts with forces, fields, waves, or energy, then a measurable outcome appears.',
      misconceptionWarning: 'The exact law is uncertain from this sentence, so SciLoop uses a safe generic physics template.',
      innovationConnection: 'This generic structure can later connect live physics news to visual scenes without needing a full simulation first.'
    };
  }

  function generatePhysicsVisualPlan(inputText) {
    const original = String(inputText || '').trim();
    const text = original.toLowerCase();
    const match = findExample(text);
    if (!text) return makeGenericPlan('A force accelerates a block', 'a force accelerates a block');

    if (!match) return makeGenericPlan(original, text);

    const templateInfo = templates.find((item) => item.id === match.template) || templates[0];
    return {
      id: match.id,
      title: match.title,
      inputText: original,
      subject: 'Physics',
      scale: match.scale || detectScale(text),
      entities: match.entities,
      forces: detectWords(text, keywordGroups.forces),
      fields: detectWords(text, keywordGroups.fields),
      energyTypes: detectWords(text, keywordGroups.energy),
      process: match.process,
      template: match.template,
      templateName: templateInfo.name,
      chosenTemplate: templateInfo.name,
      sceneMode: match.sceneMode || match.template,
      scientificMeaning: match.scientificMeaning,
      animationSteps: match.animationSteps,
      userControls: match.userControls || templateInfo.userControls,
      simpleExplanation: match.simpleExplanation,
      misconceptionWarning: match.misconceptionWarning,
      innovationConnection: match.innovationConnection
    };
  }

  const physicsNewsVisualEngine = {
    version: '0.1',
    subject: 'Physics',
    conceptLexicon: {
      classicalMotion: ['force', 'motion', 'speed', 'velocity', 'acceleration', 'friction', 'projectile', 'trajectory'],
      astronomy: ['planet', 'star', 'galaxy', 'black hole', 'neutron star', 'orbit', 'telescope', 'cosmic', 'astronomers'],
      relativity: ['spacetime', 'relativity', 'time dilation', 'light bending', 'gravitational wave', 'gravitational waves', 'event horizon'],
      quantum: ['quantum', 'electron', 'photon', 'atom', 'wavefunction', 'superposition', 'measurement', 'tunneling', 'probability'],
      electromagnetic: ['charge', 'magnet', 'magnetic field', 'electric field', 'current', 'voltage', 'coil', 'circuit', 'induction'],
      waves: ['wave', 'waves', 'sound', 'light', 'frequency', 'wavelength', 'amplitude', 'interference', 'diffraction', 'ripple'],
      thermodynamics: ['heat', 'thermal', 'temperature', 'entropy', 'gas', 'pressure', 'plasma', 'superconducting', 'superconductivity'],
      instruments: ['detector', 'telescope', 'accelerator', 'sensor', 'quantum computer', 'simulation', 'observatory']
    },
    processLexicon: {
      acceleration: ['accelerate', 'acceleration', 'speed up', 'force'],
      collision: ['collide', 'collision', 'merge', 'merging', 'impact', 'particle collider'],
      orbit: ['orbit', 'spiral', 'inspiral', 'circular motion'],
      wavePropagation: ['wave', 'waves', 'ripple', 'propagate', 'travels', 'frequency', 'wavelength', 'gravitational wave'],
      fieldInteraction: ['field', 'charge', 'magnet', 'gravity', 'lens', 'lensing', 'magnetic field', 'electric field'],
      energyTransfer: ['energy', 'work', 'power', 'efficiency', 'solar cell', 'convert', 'conversion', 'transfers'],
      heatFlow: ['heat', 'thermal', 'temperature', 'hot', 'cold'],
      entropyIncrease: ['entropy', 'spread', 'disorder'],
      currentInduction: ['induction', 'current', 'coil', 'changing magnetic field'],
      quantumTransition: ['energy level', 'transition', 'emit', 'absorb', 'photon'],
      measurement: ['measurement', 'detect', 'observe', 'detector', 'evidence'],
      superposition: ['superposition', 'probability wave', 'probability cloud'],
      tunneling: ['tunneling', 'tunnel'],
      lightBending: ['light bending', 'lensing', 'bending around', 'curves light'],
      timeDilation: ['time dilation', 'clock ticks slower'],
      spacetimeCurvature: ['spacetime curvature', 'bends spacetime', 'curved spacetime']
    },
    templateRules: {
      force_motion: ['acceleration', 'classicalMotion'],
      energy_transfer: ['energyTransfer', 'solar cell', 'efficiency'],
      field_line: ['fieldInteraction', 'currentInduction', 'electromagnetic'],
      wave: ['wavePropagation', 'waves'],
      collision: ['collision', 'momentum'],
      oscillation: ['oscillation', 'resonance', 'vibration'],
      relativity_spacetime: ['relativity', 'spacetimeCurvature', 'lightBending', 'black hole'],
      quantum_probability: ['quantum', 'superposition', 'measurement', 'quantumTransition', 'tunneling'],
      thermodynamic_flow: ['heatFlow', 'entropyIncrease', 'thermodynamics']
    },
    exampleIndex: [],
    fallbackRules: [
      'Prefer local-rule mode before any AI call.',
      'Use closest Physics examples as visual memory.',
      'If confidence is low, render input node -> physical mechanism -> outcome node.',
      'Keep the schema stable even when AI or backend is unavailable.'
    ],
    providerConfig: {
      supported: ['gemini', 'groq', 'deepseek', 'puter'],
      defaultMode: 'local-rule',
      backendBaseUrl: 'http://localhost:5050',
      endpointPath: '/api/sciloop-ai/physics-visual-plan'
    }
  };

  const physicsAIVisualRouter = {
    version: '0.1',
    supportedSubject: 'Physics',
    timeoutMs: 6500,
    backendBaseUrl: 'http://localhost:5050',
    endpointPath: '/api/sciloop-ai/physics-visual-plan',
    providers: {
      gemini: { role: 'planned main provider', structuredPlan: true },
      groq: { role: 'planned fast fallback', structuredPlan: true },
      deepseek: { role: 'planned verifier', structuredPlan: true },
      puter: { role: 'browser fallback if available', structuredPlan: true }
    }
  };

  function unique(values) {
    return [...new Set((values || []).filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
  }

  function cleanPhysicsNewsText(text) {
    return String(text || '')
      .replace(/https?:\/\/\S+/gi, ' ')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^\w\s.+/-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function collectPhysicsNewsText(input = {}) {
    if (typeof input === 'string') return input;
    return [input.title, input.summary, input.fullText, input.text, input.newsText].filter(Boolean).join('. ');
  }

  function tokenizePhysicsText(text) {
    const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'new', 'study', 'scientists', 'researchers', 'research', 'observe', 'observed', 'show', 'shows', 'using', 'physics']);
    return cleanPhysicsNewsText(text).split(/\s+/).filter((token) => token.length > 2 && !stop.has(token));
  }

  function matchesPhysicsTerm(text, term) {
    const cleanedTerm = String(term || '').toLowerCase().trim();
    if (!cleanedTerm) return false;
    const escaped = cleanedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  }

  function detectByPhysicsLexicon(text, lexicon) {
    const cleaned = cleanPhysicsNewsText(text);
    return Object.entries(lexicon).reduce((acc, [key, terms]) => {
      const hits = terms.filter((term) => matchesPhysicsTerm(cleaned, term));
      if (hits.length) acc.push({ id: key, hits });
      return acc;
    }, []);
  }

  function detectPhysicsEntities(text) {
    const entityMap = {
      'black holes': ['black hole', 'black holes'],
      'neutron stars': ['neutron star', 'neutron stars'],
      spacetime: ['spacetime', 'space time'],
      'gravitational waves': ['gravitational wave', 'gravitational waves'],
      galaxy: ['galaxy', 'galaxies'],
      planet: ['planet', 'earth'],
      star: ['star', 'stellar'],
      photon: ['photon', 'photons', 'light'],
      electron: ['electron', 'electrons'],
      atom: ['atom', 'atomic'],
      molecule: ['molecule', 'molecular'],
      particle: ['particle', 'particles'],
      mass: ['mass', 'massive object'],
      charge: ['charge', 'charged'],
      magnet: ['magnet', 'magnetic'],
      coil: ['coil', 'coils', 'superconducting coil'],
      circuit: ['circuit', 'current', 'voltage'],
      fluid: ['fluid', 'liquid'],
      gas: ['gas', 'pressure'],
      plasma: ['plasma', 'tokamak'],
      wave: ['wave', 'waves', 'ripple'],
      sound: ['sound'],
      'magnetic field': ['magnetic field'],
      'electric field': ['electric field'],
      'quantum computer': ['quantum computer', 'qubit'],
      detector: ['detector', 'observatory', 'sensor'],
      telescope: ['telescope'],
      accelerator: ['accelerator', 'collider'],
      material: ['material', 'superconductor', 'semiconductor'],
      vibration: ['vibration', 'vibrations', 'resonance']
    };
    const cleaned = cleanPhysicsNewsText(text);
    return unique(Object.entries(entityMap).flatMap(([entity, terms]) => (
      terms.some((term) => matchesPhysicsTerm(cleaned, term)) ? [entity] : []
    )));
  }

  function detectPhysicsProcesses(text) {
    return detectByPhysicsLexicon(text, physicsNewsVisualEngine.processLexicon).map((hit) => hit.id);
  }

  function detectPhysicsScale(text) {
    const cleaned = cleanPhysicsNewsText(text);
    const scaleScores = {
      cosmological: ['cosmic', 'universe', 'cosmology', 'dark energy', 'expansion'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      astronomical: ['black hole', 'galaxy', 'star', 'planet', 'neutron star', 'telescope', 'gravitational wave'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      relativistic: ['spacetime', 'relativity', 'time dilation', 'light bending', 'event horizon', 'gravitational wave'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      quantum: ['quantum', 'electron', 'photon', 'wavefunction', 'superposition', 'measurement', 'tunneling'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      atomic: ['atom', 'atomic', 'molecule', 'energy level'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      electromagnetic: ['charge', 'electric', 'magnetic', 'current', 'voltage', 'coil', 'circuit'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      thermodynamic: ['heat', 'thermal', 'temperature', 'entropy', 'gas', 'pressure'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      microscopic: ['particle', 'material', 'nanoscopic', 'microscopic'].filter((term) => matchesPhysicsTerm(cleaned, term)).length,
      classical: ['force', 'motion', 'velocity', 'acceleration', 'block', 'friction'].filter((term) => matchesPhysicsTerm(cleaned, term)).length
    };
    const ranked = Object.entries(scaleScores).filter(([, score]) => score > 0).sort((a, b) => b[1] - a[1]);
    if (!ranked.length) return 'mixed';
    if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return 'mixed';
    return ranked[0][0];
  }

  function detectPhysicsLaws(text) {
    const lawMap = {
      "Newton's laws": ['force', 'acceleration', 'motion', 'friction', 'projectile'],
      'conservation of energy': ['energy', 'work', 'power', 'efficiency', 'convert'],
      'conservation of momentum': ['momentum', 'collision', 'collide', 'impact'],
      'Maxwell / electromagnetism': ['electric', 'magnetic', 'charge', 'current', 'voltage', 'coil', 'induction'],
      thermodynamics: ['heat', 'temperature', 'thermal', 'gas', 'pressure'],
      entropy: ['entropy', 'spread'],
      relativity: ['relativity', 'spacetime', 'black hole', 'light bending', 'gravitational wave', 'time dilation'],
      'quantum mechanics': ['quantum', 'electron', 'photon', 'wavefunction', 'superposition', 'measurement', 'tunneling'],
      'wave mechanics': ['wave', 'sound', 'frequency', 'wavelength', 'amplitude', 'interference'],
      'fluid dynamics': ['fluid', 'plasma', 'flow', 'turbulence']
    };
    const cleaned = cleanPhysicsNewsText(text);
    return unique(Object.entries(lawMap).flatMap(([law, terms]) => (
      terms.some((term) => matchesPhysicsTerm(cleaned, term)) ? [law] : []
    )));
  }

  function detectPhysicsForces(text) {
    return detectWords(cleanPhysicsNewsText(text), keywordGroups.forces);
  }

  function detectPhysicsFields(text) {
    return detectWords(cleanPhysicsNewsText(text), keywordGroups.fields);
  }

  function detectPhysicsEnergyTypes(text) {
    return detectWords(cleanPhysicsNewsText(text), keywordGroups.energy);
  }

  function detectPhysicsWaves(text) {
    const waveMap = {
      'gravitational waves': ['gravitational wave', 'gravitational waves'],
      'light waves': ['light', 'photon', 'optical'],
      'sound waves': ['sound'],
      'pressure waves': ['pressure wave', 'pressure waves'],
      'matter/probability waves': ['probability wave', 'wavefunction', 'electron wave'],
      interference: ['interference'],
      diffraction: ['diffraction'],
      resonance: ['resonance', 'vibration']
    };
    const cleaned = cleanPhysicsNewsText(text);
    return unique(Object.entries(waveMap).flatMap(([waveName, terms]) => (
      terms.some((term) => matchesPhysicsTerm(cleaned, term)) ? [waveName] : []
    )));
  }

  function detectPhysicsOutcomes(text) {
    const outcomeMap = {
      detection: ['detect', 'observe', 'evidence', 'measurement'],
      efficiency: ['efficiency', 'improve', 'stronger', 'faster', 'higher'],
      conversion: ['convert', 'conversion', 'transfers'],
      emission: ['emit', 'radiation', 'photon'],
      curvature: ['bend', 'bending', 'curves', 'lensing'],
      current: ['current', 'electricity'],
      coolingHeating: ['heat', 'temperature', 'thermal'],
      merger: ['merge', 'merging', 'collision'],
      simulation: ['simulate', 'simulation']
    };
    const cleaned = cleanPhysicsNewsText(text);
    return unique(Object.entries(outcomeMap).flatMap(([outcome, terms]) => (
      terms.some((term) => matchesPhysicsTerm(cleaned, term)) ? [outcome] : []
    )));
  }

  function choosePhysicsNewsTemplate(analysis) {
    const text = [
      ...(analysis.processes || []),
      ...(analysis.entities || []),
      ...(analysis.laws || []),
      ...(analysis.waves || []),
      ...(analysis.keywords || [])
    ].join(' ').toLowerCase();
    if (/(black holes?|spacetime|relativity|time dilation|light bending|lensing|gravitational waves?)/.test(text)) return 'relativity_spacetime';
    if (/(collision|collide|colliding|momentum|impact|merger)/.test(text)) return 'collision';
    if (/(oscillation|vibration|vibrations|pendulum|spring|resonance)/.test(text)) return 'oscillation';
    if (/(solar cell|efficiency|captur|convert|conversion|energy transfer)/.test(text)) return 'energy_transfer';
    if (/(electron|photon|atom|quantum|wavefunction|superposition|measurement|tunneling|probability)/.test(text)) return 'quantum_probability';
    if (/(heat|thermal|temperature|entropy|gas|pressure)/.test(text)) return 'thermodynamic_flow';
    if (/(wave|frequency|wavelength|amplitude|interference|diffraction|resonance)/.test(text)) return 'wave';
    if (/(field|charge|magnet|coil|current|induction|gravity)/.test(text)) return 'field_line';
    if (/(energy|work|power|efficiency|solar cell|convert|conversion)/.test(text)) return 'energy_transfer';
    if (/(force|acceleration|motion|friction|trajectory)/.test(text)) return 'force_motion';
    return analysis.matchedExamples?.[0]?.example?.template || 'force_motion';
  }

  function buildPhysicsExampleIndex() {
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
        laws: detectPhysicsLaws(source),
        tokens: tokenizePhysicsText(source),
        source: item
      };
    });
  }

  physicsNewsVisualEngine.exampleIndex = buildPhysicsExampleIndex();

  function findClosestPhysicsExamples(newsText) {
    const cleaned = cleanPhysicsNewsText(newsText);
    const tokens = new Set(tokenizePhysicsText(cleaned));
    const detectedEntities = detectPhysicsEntities(cleaned).map((item) => item.toLowerCase());
    const detectedProcesses = detectPhysicsProcesses(cleaned);
    const detectedLaws = detectPhysicsLaws(cleaned);
    const baseTemplate = choosePhysicsNewsTemplate({
      entities: detectedEntities,
      processes: detectedProcesses,
      laws: detectedLaws,
      waves: detectPhysicsWaves(cleaned),
      keywords: [...tokens]
    });
    return physicsNewsVisualEngine.exampleIndex
      .map((entry) => {
        const tokenScore = entry.tokens.reduce((sum, token) => sum + (tokens.has(token) ? 1 : 0), 0);
        const entityScore = (entry.entities || []).reduce((sum, entity) => (
          detectedEntities.some((detected) => detected.includes(String(entity).toLowerCase()) || String(entity).toLowerCase().includes(detected)) ? sum + 4 : sum
        ), 0);
        const processScore = detectedProcesses.some((process) => String(entry.process).toLowerCase().includes(process.toLowerCase())) ? 5 : 0;
        const lawScore = detectedLaws.some((law) => entry.laws.includes(law)) ? 4 : 0;
        const templateScore = entry.template === baseTemplate ? 3 : 0;
        const score = tokenScore + entityScore + processScore + lawScore + templateScore;
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
        templateId: entry.template,
        process: entry.process,
        score: entry.score
      }));
  }

  function buildPhysicsStages(analysis, templateId) {
    const entity = analysis.entities[0] || 'physical system';
    const mechanism = analysis.processes[0] || analysis.laws[0] || 'interaction';
    const outcome = analysis.outcomes[0] || 'observable result';
    if (templateId === 'relativity_spacetime' && analysis.entities.join(' ').toLowerCase().includes('black holes')) {
      return [
        { label: 'Compact masses', description: 'Two dense objects curve spacetime around them.' },
        { label: 'Spiral inward', description: 'Energy leaves the system as spacetime ripples.' },
        { label: 'Merge / disturb', description: 'The strongest change happens near the merger.' },
        { label: 'Ripples travel', description: 'Gravitational waves move outward at light speed.' },
        { label: 'Detector pulse', description: 'A detector records a tiny stretching signal.' }
      ];
    }
    const stageMap = {
      force_motion: ['Object starts', 'Force appears', 'Acceleration changes motion', 'Measured outcome'],
      energy_transfer: ['Energy source', 'Transfer path', 'Conversion mechanism', 'Useful output'],
      field_line: ['Source creates field', 'Field lines appear', 'Test object responds', 'Signal is measured'],
      wave: ['Source vibrates', 'Wavefront forms', 'Wave travels outward', 'Detector receives pattern'],
      collision: ['Objects approach', 'Impact or interaction', 'Momentum redistributes', 'After-state is measured'],
      oscillation: ['System displaced', 'Restoring force appears', 'Repeated motion builds', 'Energy is harvested or measured'],
      relativity_spacetime: ['Mass-energy appears', 'Spacetime geometry changes', 'Path or wave bends', 'Observer detects effect'],
      quantum_probability: ['Quantum state prepared', 'Probability pattern spreads', 'Interaction/measurement occurs', 'One outcome appears'],
      thermodynamic_flow: ['Hot/ordered state', 'Energy or particles spread', 'Gradient changes', 'New balance emerges']
    };
    return (stageMap[templateId] || ['Input', 'Mechanism', 'Outcome']).map((label, index) => ({
      label,
      description: index === 0 ? `Start with ${entity}.` : index === 1 ? `Mechanism: ${mechanism}.` : `Outcome: ${outcome}.`
    }));
  }

  function buildPhysicsNewsScene(analysis, templateId, matchedExamples) {
    const primary = analysis.entities[0] || matchedExamples[0]?.title || 'Physics system';
    const support = analysis.entities.slice(1, 5);
    const outcome = analysis.outcomes[0] || analysis.processes[0] || 'physical outcome';
    return {
      sceneType: templateId,
      nodes: unique([primary, ...support, outcome]).map((label, index) => ({
        id: `node_${index + 1}`,
        label,
        role: index === 0 ? 'source' : index === support.length + 1 ? 'outcome' : 'support'
      })),
      connections: support.map((label, index) => ({
        from: 'node_1',
        to: `node_${index + 2}`,
        label: analysis.processes[index] || analysis.laws[0] || 'interaction'
      })),
      flows: [
        {
          from: 'node_1',
          to: `node_${Math.max(2, support.length + 2)}`,
          particle: analysis.waves[0] || analysis.energyTypes[0] || analysis.fields[0] || 'physics signal'
        }
      ],
      stages: buildPhysicsStages(analysis, templateId),
      annotations: [
        analysis.laws.length ? `Law/concept: ${analysis.laws.join(', ')}` : 'Law/concept inferred from local physics grammar.',
        analysis.scale ? `Scale: ${analysis.scale}` : 'Scale: mixed'
      ]
    };
  }

  function buildPhysicsNewsAnimation(analysis, templateId, matchedExamples) {
    const stages = buildPhysicsStages(analysis, templateId);
    if (matchedExamples[0]?.example?.animationSteps?.length) {
      return matchedExamples[0].example.animationSteps.slice(0, 4).map((step, index) => `${stages[index]?.label || `Stage ${index + 1}`}: ${step}`);
    }
    return stages.map((stage) => `${stage.label}: ${stage.description}`);
  }

  function buildPhysicsNewsToVisualTransfer(analysis, matchedExamples) {
    const templateId = choosePhysicsNewsTemplate({ ...analysis, matchedExamples });
    const templateName = getTemplateName(templateId);
    const scene = buildPhysicsNewsScene(analysis, templateId, matchedExamples);
    const entity = analysis.entities[0] || 'the physical system';
    const process = analysis.processes[0] || analysis.laws[0] || 'the interaction';
    const outcome = analysis.outcomes[0] || 'a measurable effect';
    const comboTemplate = templateId === 'relativity_spacetime' && analysis.waves.includes('gravitational waves')
      ? 'Wave Template + Relativity-Spacetime Template'
      : templateName;
    return {
      templateId,
      templateName: comboTemplate,
      visualScene: scene,
      animationPlan: buildPhysicsNewsAnimation(analysis, templateId, matchedExamples),
      simpleExplanation: `${entity} is shown through ${process}, producing ${outcome}.`,
      scientificExplanation: `SciLoop detected ${analysis.laws[0] || 'a physics principle'} at ${analysis.scale || 'mixed'} scale and mapped it to ${comboTemplate}.`,
      innovationConnection: `This visual plan can help students and researchers see how ${process} connects evidence, mechanism, and future technology.`
    };
  }

  function calculatePhysicsNewsConfidence(analysis, matchedExamples) {
    const score = 28
      + Math.min(22, analysis.entities.length * 4)
      + Math.min(18, analysis.processes.length * 5)
      + Math.min(12, analysis.laws.length * 4)
      + Math.min(10, analysis.waves.length * 4)
      + Math.min(12, matchedExamples.length * 4);
    return Math.max(18, Math.min(96, score));
  }

  function generatePhysicsNewsVisualPlan(input = {}, options = {}) {
    const title = typeof input === 'string' ? String(options.title || '') : String(input?.title || options.title || '');
    const summary = typeof input === 'string' ? input : String(input?.summary || input?.text || '');
    const fullText = typeof input === 'string' ? '' : String(input?.fullText || input?.newsText || '');
    const rawText = [title, summary, fullText].filter(Boolean).join('. ');
    const cleanedText = cleanPhysicsNewsText(rawText);
    const keywords = tokenizePhysicsText(cleanedText).slice(0, 28);
    const matchedExamples = findClosestPhysicsExamples(cleanedText);
    const analysis = {
      entities: detectPhysicsEntities(cleanedText),
      processes: detectPhysicsProcesses(cleanedText),
      forces: detectPhysicsForces(cleanedText),
      fields: detectPhysicsFields(cleanedText),
      energyTypes: detectPhysicsEnergyTypes(cleanedText),
      waves: detectPhysicsWaves(cleanedText),
      scale: detectPhysicsScale(cleanedText),
      laws: detectPhysicsLaws(cleanedText),
      outcomes: detectPhysicsOutcomes(cleanedText),
      keywords
    };
    const transfer = buildPhysicsNewsToVisualTransfer(analysis, matchedExamples);
    const confidence = calculatePhysicsNewsConfidence(analysis, matchedExamples);
    const warnings = [];
    if (!cleanedText) warnings.push('Empty input: rendered a safe generic physics visual plan.');
    if (confidence < 45) warnings.push('Low confidence: headline approximated using generic physics grammar.');
    if (!matchedExamples.length) warnings.push('No close Physics example found; generic object -> interaction -> outcome fallback used.');
    if (options.mode && options.mode !== 'local-rule') warnings.push('AI provider path is router-ready; local-rule remains the safe fallback.');

    return {
      id: `physics_news_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      sourceType: options.sourceType || (title ? 'live-news' : cleanedText ? 'manual-input' : 'demo'),
      subject: 'Physics',
      title: title || String(summary || fullText).slice(0, 84) || 'Untitled physics input',
      rawText,
      cleanedText,
      confidence,
      matchedExamples,
      detected: {
        ...analysis,
        templateId: transfer.visualScene.sceneType
      },
      chosenTemplate: transfer.templateName,
      visualScene: transfer.visualScene,
      animationPlan: transfer.animationPlan,
      explanation: {
        simple: transfer.simpleExplanation,
        scientific: transfer.scientificExplanation,
        innovationConnection: transfer.innovationConnection,
        warnings
      },
      providerMeta: {
        mode: options.mode || 'local-rule',
        provider: options.provider || 'physics-local-rule-engine',
        verifiedBy: 'SciLoop Physics News Visual Engine v0'
      }
    };
  }

  function getCompactPhysicsExampleContext(maxExamples = 6, matchedExamples = []) {
    const ordered = [
      ...matchedExamples.map((match) => conceptExamples.find((item) => item.id === match.id)).filter(Boolean),
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

  function buildPhysicsVisualPrompt(newsText, localPlan, compactExamples = getCompactPhysicsExampleContext(6, localPlan?.matchedExamples || [])) {
    return [
      'You are SciLoop Physics Visual Planner.',
      'Convert physics news into a valid JSON visual plan using SciLoop Physics Visual Language.',
      'Return ONLY JSON. No markdown. No explanation outside JSON.',
      'Required JSON keys: id, sourceType, subject, title, rawText, cleanedText, confidence, matchedExamples, detected, chosenTemplate, visualScene, animationPlan, explanation, providerMeta.',
      'Template rules:',
      '- force/motion -> Force-Motion Template',
      '- energy/work/solar/efficiency -> Energy-Transfer Template',
      '- heat/temperature/entropy/gas -> Thermodynamic-Flow Template',
      '- charge/magnet/gravity field -> Field-Line Template',
      '- wave/frequency/gravitational wave -> Wave Template',
      '- collision/momentum -> Collision Template',
      '- spacetime/black hole/light bending/time dilation -> Relativity-Spacetime Template',
      '- electron/photon/atom/superposition -> Quantum-Probability Template',
      '- unknown physics -> object -> interaction -> outcome',
      `Compact examples: ${JSON.stringify(compactExamples)}`,
      `Local plan: ${JSON.stringify(localPlan)}`,
      `News text: ${JSON.stringify(newsText)}`
    ].join('\n');
  }

  function renderList(element, values) {
    if (!element) return;
    const safeValues = Array.isArray(values) && values.length ? values : ['none detected yet'];
    element.innerHTML = safeValues.map((value) => `<span>${escapeHtml(value)}</span>`).join('');
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

  function validatePhysicsVisualPlan(plan) {
    const errors = [];
    if (!plan || typeof plan !== 'object') errors.push('plan is not an object');
    if (plan && plan.subject !== 'Physics') errors.push('subject must be Physics');
    if (!plan?.chosenTemplate) errors.push('chosenTemplate missing');
    if (!Array.isArray(plan?.detected?.entities)) errors.push('detected.entities must be array');
    if (!Array.isArray(plan?.animationPlan)) errors.push('animationPlan must be array');
    if (!plan?.visualScene || typeof plan.visualScene !== 'object') errors.push('visualScene missing');
    if (!plan?.explanation?.simple) errors.push('explanation.simple missing');
    return { ok: errors.length === 0, errors };
  }

  function normalizeAIPhysicsVisualPlan(aiPlan, localPlan) {
    const source = aiPlan && typeof aiPlan === 'object' ? aiPlan : {};
    const detected = {
      entities: normalizeStringArray(source.detected?.entities).length ? normalizeStringArray(source.detected.entities) : (localPlan?.detected?.entities || []),
      processes: normalizeStringArray(source.detected?.processes).length ? normalizeStringArray(source.detected.processes) : (localPlan?.detected?.processes || []),
      forces: normalizeStringArray(source.detected?.forces).length ? normalizeStringArray(source.detected.forces) : (localPlan?.detected?.forces || []),
      fields: normalizeStringArray(source.detected?.fields).length ? normalizeStringArray(source.detected.fields) : (localPlan?.detected?.fields || []),
      energyTypes: normalizeStringArray(source.detected?.energyTypes).length ? normalizeStringArray(source.detected.energyTypes) : (localPlan?.detected?.energyTypes || []),
      waves: normalizeStringArray(source.detected?.waves).length ? normalizeStringArray(source.detected.waves) : (localPlan?.detected?.waves || []),
      scale: sanitizePlanString(source.detected?.scale || localPlan?.detected?.scale || 'mixed'),
      laws: normalizeStringArray(source.detected?.laws).length ? normalizeStringArray(source.detected.laws) : (localPlan?.detected?.laws || []),
      outcomes: normalizeStringArray(source.detected?.outcomes).length ? normalizeStringArray(source.detected.outcomes) : (localPlan?.detected?.outcomes || []),
      keywords: normalizeStringArray(source.detected?.keywords).length ? normalizeStringArray(source.detected.keywords) : (localPlan?.detected?.keywords || []),
      templateId: sanitizePlanString(source.detected?.templateId || localPlan?.detected?.templateId || localPlan?.visualScene?.sceneType || 'force_motion')
    };
    const visualScene = source.visualScene && typeof source.visualScene === 'object'
      ? {
        sceneType: sanitizePlanString(source.visualScene.sceneType || localPlan?.visualScene?.sceneType || detected.templateId),
        nodes: Array.isArray(source.visualScene.nodes) ? source.visualScene.nodes : (localPlan?.visualScene?.nodes || []),
        connections: Array.isArray(source.visualScene.connections) ? source.visualScene.connections : (localPlan?.visualScene?.connections || []),
        flows: Array.isArray(source.visualScene.flows) ? source.visualScene.flows : (localPlan?.visualScene?.flows || []),
        stages: Array.isArray(source.visualScene.stages) ? source.visualScene.stages : (localPlan?.visualScene?.stages || []),
        annotations: Array.isArray(source.visualScene.annotations) ? source.visualScene.annotations : (localPlan?.visualScene?.annotations || [])
      }
      : (localPlan?.visualScene || { sceneType: detected.templateId, nodes: [], connections: [], flows: [], stages: [], annotations: [] });

    return {
      ...(localPlan || {}),
      subject: 'Physics',
      title: sanitizePlanString(source.title || localPlan?.title || 'Physics Visual Plan'),
      rawText: sanitizePlanString(source.rawText || localPlan?.rawText || ''),
      cleanedText: sanitizePlanString(source.cleanedText || localPlan?.cleanedText || ''),
      confidence: normalizeConfidenceToPercent(source.confidence ?? localPlan?.confidence, localPlan?.confidence || 50),
      matchedExamples: Array.isArray(source.matchedExamples) ? source.matchedExamples : (localPlan?.matchedExamples || []),
      detected,
      chosenTemplate: sanitizePlanString(source.chosenTemplate || localPlan?.chosenTemplate || getTemplateName(detected.templateId)),
      visualScene,
      animationPlan: normalizeStringArray(source.animationPlan).length ? normalizeStringArray(source.animationPlan) : (localPlan?.animationPlan || []),
      explanation: {
        simple: sanitizePlanString(source.explanation?.simple || localPlan?.explanation?.simple || 'SciLoop generated a physics visual plan.'),
        scientific: sanitizePlanString(source.explanation?.scientific || localPlan?.explanation?.scientific || ''),
        innovationConnection: sanitizePlanString(source.explanation?.innovationConnection || localPlan?.explanation?.innovationConnection || ''),
        warnings: normalizeStringArray(source.explanation?.warnings).length ? normalizeStringArray(source.explanation.warnings) : (localPlan?.explanation?.warnings || [])
      },
      providerMeta: {
        ...(localPlan?.providerMeta || {}),
        ...(source.providerMeta || {})
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

  async function fetchPhysicsProviderEndpoint(provider, payload) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), physicsAIVisualRouter.timeoutMs);
    try {
      const response = await fetch(`${physicsAIVisualRouter.backendBaseUrl}${physicsAIVisualRouter.endpointPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ provider, ...payload })
      });
      if (!response.ok) return { ok: false, reason: `backend ${response.status}` };
      const data = await response.json();
      return { ok: true, provider, data, rawProviderResponse: data };
    } catch (error) {
      return { ok: false, reason: error?.name === 'AbortError' ? 'request timed out' : (error?.message || 'provider request failed') };
    } finally {
      window.clearTimeout(timer);
    }
  }

  async function requestPhysicsVisualPlanFromAI(providerName, payload) {
    const provider = providerName === 'auto' ? 'gemini' : providerName;
    if (provider === 'puter') {
      if (!window.puter?.ai?.chat) return { ok: false, reason: 'Puter AI is not available in this browser' };
      try {
        const text = await Promise.race([
          window.puter.ai.chat(payload.prompt || buildPhysicsVisualPrompt(payload.newsText, payload.localPlan, payload.compactExamples)),
          new Promise((resolve) => window.setTimeout(() => resolve(null), physicsAIVisualRouter.timeoutMs))
        ]);
        if (!text) return { ok: false, reason: 'Puter request timed out' };
        return { ok: true, provider: 'puter', data: text, rawProviderResponse: text };
      } catch (error) {
        return { ok: false, reason: error?.message || 'Puter request failed' };
      }
    }
    return fetchPhysicsProviderEndpoint(provider, payload);
  }

  function providerResponseToPhysicsPlan(response, localPlan, provider) {
    const parsed = tryParseProviderJson(response?.data || response?.rawProviderResponse);
    if (!parsed) return { ok: false, reason: 'provider did not return valid JSON' };
    const normalized = normalizeAIPhysicsVisualPlan(parsed, localPlan);
    const validation = validatePhysicsVisualPlan(normalized);
    if (!validation.ok) return { ok: false, reason: validation.errors.join(', ') };
    normalized.providerMeta = {
      ...(normalized.providerMeta || {}),
      provider
    };
    return { ok: true, visualPlan: normalized, rawProviderResponse: response?.rawProviderResponse || response?.data };
  }

  function buildPhysicsRouterPayload(inputPayload, localPlan) {
    const newsText = [inputPayload.title, inputPayload.summary, inputPayload.fullText].filter(Boolean).join('. ');
    const compactExamples = getCompactPhysicsExampleContext(6, localPlan?.matchedExamples || []);
    return {
      title: inputPayload.title || localPlan?.title,
      summary: inputPayload.summary || '',
      fullText: inputPayload.fullText || '',
      newsText,
      mode: inputPayload.mode || 'local-rule',
      localPlan,
      existingLocalPlan: localPlan,
      compactExamples,
      prompt: buildPhysicsVisualPrompt(newsText, localPlan, compactExamples)
    };
  }

  async function routePhysicsVisualRequest(inputPayload = {}, options = {}) {
    const mode = inputPayload.mode || options.mode || 'local-rule';
    const preferredProvider = inputPayload.preferredProvider || options.preferredProvider || 'auto';
    const localPlan = inputPayload.existingLocalPlan || generatePhysicsNewsVisualPlan(inputPayload, {
      sourceType: inputPayload.sourceType || 'manual-input',
      mode: 'local-rule'
    });
    const warnings = [];

    if (mode === 'local-rule') {
      return {
        ok: true,
        mode,
        providerUsed: 'physics-local-rule-engine',
        fallbackUsed: false,
        visualPlan: normalizeAIPhysicsVisualPlan(localPlan, localPlan),
        warnings,
        rawProviderResponse: null
      };
    }

    const payload = buildPhysicsRouterPayload(inputPayload, localPlan);
    const providerQueue = mode === 'hybrid'
      ? [preferredProvider === 'auto' ? 'gemini' : preferredProvider, 'deepseek', 'groq', 'puter']
      : [preferredProvider === 'auto' ? 'gemini' : preferredProvider, 'groq', 'puter'];

    for (const provider of unique(providerQueue)) {
      const response = await requestPhysicsVisualPlanFromAI(provider, payload);
      if (!response.ok) {
        warnings.push(`${provider}: ${response.reason || 'provider unavailable'}`);
        continue;
      }
      const converted = providerResponseToPhysicsPlan(response, localPlan, provider);
      if (!converted.ok) {
        warnings.push(`${provider}: ${converted.reason}`);
        continue;
      }
      const finalPlan = normalizeAIPhysicsVisualPlan(converted.visualPlan, localPlan);
      finalPlan.providerMeta = {
        ...(finalPlan.providerMeta || {}),
        mode,
        provider,
        verifiedBy: mode === 'hybrid' ? 'SciLoop Physics hybrid route' : provider
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
      ? 'Hybrid mode fell back to local-rule because configured Physics visual providers were unavailable.'
      : 'AI-assisted mode fell back to local-rule because the Physics visual backend is unavailable.');
    const fallbackPlan = normalizeAIPhysicsVisualPlan(localPlan, localPlan);
    fallbackPlan.providerMeta = {
      ...(fallbackPlan.providerMeta || {}),
      mode,
      provider: 'physics-local-rule-engine',
      verifiedBy: 'local fallback'
    };
    fallbackPlan.explanation.warnings = unique([...(fallbackPlan.explanation.warnings || []), ...warnings]);
    return {
      ok: true,
      mode,
      providerUsed: 'physics-local-rule-engine',
      fallbackUsed: true,
      visualPlan: fallbackPlan,
      warnings,
      rawProviderResponse: null
    };
  }

  function renderPhysicsAlphabet() {
    const grid = document.getElementById('physicsAlphabetGrid');
    if (!grid || grid.dataset.rendered === '1') return;
    grid.innerHTML = visualAlphabet.map((item) => `
      <article class="biology-symbol-card physics-symbol-card">
        <span>${escapeHtml(item.emoji)}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <p>${escapeHtml(item.meaning)}</p>
        <small>${escapeHtml(item.category)} | ${escapeHtml(item.scale)}</small>
      </article>
    `).join('');
    grid.dataset.rendered = '1';
  }

  function svgShell(content, defs = '') {
    return `
      <svg class="biology-scene-svg physics-scene-svg" viewBox="0 0 900 440" role="img" aria-label="Physics symbolic scene preview">
        <defs>
          <marker id="physicsArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#ffd166"></path>
          </marker>
          <radialGradient id="physicsGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#7df9ff" stop-opacity="0.95"></stop>
            <stop offset="100%" stop-color="#7df9ff" stop-opacity="0"></stop>
          </radialGradient>
          <linearGradient id="physicsHeat" x1="0%" x2="100%">
            <stop offset="0%" stop-color="#ff6b6b"></stop>
            <stop offset="100%" stop-color="#53e7ff"></stop>
          </linearGradient>
          ${defs}
        </defs>
        <rect width="900" height="440" rx="18" fill="rgba(2, 11, 20, 0.28)"></rect>
        ${content}
      </svg>
    `;
  }

  function renderForceMotionScene(plan) {
    return svgShell(`
      <line x1="90" y1="330" x2="810" y2="330" class="physics-ground"></line>
      <g class="physics-motion-trail">
        <circle cx="180" cy="300" r="5"></circle><circle cx="145" cy="300" r="4"></circle><circle cx="115" cy="300" r="3"></circle>
      </g>
      <rect x="210" y="250" width="145" height="80" rx="12" class="physics-block"></rect>
      <text x="235" y="296">mass</text>
      <line x1="360" y1="272" x2="570" y2="272" class="physics-force-arrow"></line>
      <text x="428" y="252">force</text>
      <line x1="360" y1="315" x2="515" y2="315" class="physics-accel-arrow"></line>
      <text x="410" y="352">acceleration</text>
      <text x="80" y="72">${escapeHtml(plan.title)}</text>
      <text x="80" y="105" class="physics-muted">${escapeHtml(plan.process)}</text>
    `);
  }

  function renderEnergyScene(plan) {
    return svgShell(`
      <line x1="120" y1="340" x2="790" y2="340" class="physics-ground"></line>
      <path d="M160 330 C260 160 350 150 455 330" class="physics-ramp"></path>
      <circle cx="232" cy="214" r="28" class="physics-energy-body"></circle>
      <path d="M310 220 C390 225 455 266 520 320" class="physics-energy-packets"></path>
      <rect x="650" y="115" width="34" height="210" rx="16" class="physics-meter-shell"></rect>
      <rect x="654" y="212" width="26" height="110" rx="13" class="physics-pe-fill"></rect>
      <text x="700" y="186">PE down</text>
      <rect x="760" y="115" width="34" height="210" rx="16" class="physics-meter-shell"></rect>
      <rect x="764" y="155" width="26" height="167" rx="13" class="physics-ke-fill"></rect>
      <text x="805" y="186">KE up</text>
      <text x="70" y="72">${escapeHtml(plan.title)}</text>
      <text x="70" y="105" class="physics-muted">${escapeHtml(plan.process)}</text>
    `);
  }

  function renderFieldScene(plan) {
    const isMagnetic = plan.template === 'field_line' && /magnetic|induction|coil/i.test(`${plan.title} ${plan.process}`);
    return svgShell(`
      <circle cx="450" cy="220" r="48" class="physics-source"></circle>
      <text x="420" y="226">${isMagnetic ? 'B' : plan.fields?.includes('electric') ? 'Q' : 'M'}</text>
      ${[90, 140, 190, 250, 310, 360].map((r) => `<ellipse cx="450" cy="220" rx="${r}" ry="${Math.round(r * 0.52)}" class="physics-field-line"></ellipse>`).join('')}
      <circle cx="675" cy="190" r="14" class="physics-test-particle"></circle>
      <path d="M675 190 C640 208 608 218 570 220" class="physics-force-arrow"></path>
      <text x="84" y="72">${escapeHtml(plan.title)}</text>
      <text x="84" y="105" class="physics-muted">${escapeHtml(plan.process)}</text>
    `);
  }

  function renderWaveScene(plan) {
    return svgShell(`
      <circle cx="130" cy="220" r="42" class="physics-source"></circle>
      <text x="111" y="226">src</text>
      <path d="M210 220 C250 145 290 295 330 220 S410 145 450 220 S530 295 570 220 S650 145 690 220 S770 295 810 220" class="physics-wave-line"></path>
      <line x1="330" y1="300" x2="450" y2="300" class="physics-label-line"></line>
      <text x="356" y="326">wavelength</text>
      <line x1="450" y1="220" x2="450" y2="145" class="physics-label-line"></line>
      <text x="468" y="184">amplitude</text>
      <text x="70" y="72">${escapeHtml(plan.title)}</text>
      <text x="70" y="105" class="physics-muted">${escapeHtml(plan.process)}</text>
    `);
  }

  function renderCollisionScene(plan) {
    return svgShell(`
      <line x1="90" y1="320" x2="810" y2="320" class="physics-ground"></line>
      <circle cx="270" cy="280" r="40" class="physics-collider-a"></circle>
      <circle cx="610" cy="280" r="52" class="physics-collider-b"></circle>
      <line x1="165" y1="280" x2="230" y2="280" class="physics-force-arrow"></line>
      <line x1="735" y1="280" x2="670" y2="280" class="physics-accel-arrow"></line>
      <path d="M430 250 L450 220 L470 250 L508 242 L486 274 L510 304 L470 296 L450 335 L430 296 L390 304 L414 274 L392 242 Z" class="physics-impact"></path>
      <rect x="260" y="80" width="370" height="30" rx="15" class="physics-meter-shell"></rect>
      <rect x="266" y="86" width="358" height="18" rx="9" class="physics-momentum-fill"></rect>
      <text x="336" y="136">total momentum meter stable</text>
      <text x="70" y="72">${escapeHtml(plan.title)}</text>
    `);
  }

  function renderOscillationScene(plan) {
    return svgShell(`
      <line x1="130" y1="130" x2="130" y2="310" class="physics-wall"></line>
      <path d="M130 220 C155 185 180 255 205 220 S255 185 280 220 S330 255 355 220" class="physics-spring"></path>
      <rect x="355" y="180" width="92" height="80" rx="12" class="physics-block"></rect>
      <line x1="490" y1="220" x2="665" y2="220" class="physics-equilibrium"></line>
      <path d="M510 330 C550 270 590 390 630 330 S710 270 750 330" class="physics-wave-line"></path>
      <text x="70" y="72">${escapeHtml(plan.title)}</text>
      <text x="70" y="105" class="physics-muted">${escapeHtml(plan.process)}</text>
    `);
  }

  function renderRelativityScene(plan) {
    const grid = [];
    for (let x = 120; x <= 780; x += 55) {
      grid.push(`<path d="M${x} 95 C${x - 25} 190 ${x + 25} 255 ${x} 350" class="physics-spacetime-grid"></path>`);
    }
    for (let y = 105; y <= 345; y += 40) {
      grid.push(`<path d="M115 ${y} C270 ${y - 12} 365 ${y + 48} 450 ${y + 62} C535 ${y + 48} 630 ${y - 12} 785 ${y}" class="physics-spacetime-grid"></path>`);
    }
    return svgShell(`
      ${grid.join('')}
      <circle cx="450" cy="225" r="56" class="physics-black-hole"></circle>
      <circle cx="450" cy="225" r="92" class="physics-lens-ring"></circle>
      <path d="M110 160 C265 115 335 140 412 190 C498 248 580 258 790 162" class="physics-light-ray"></path>
      <text x="70" y="60">${escapeHtml(plan.title)}</text>
      <text x="70" y="92" class="physics-muted">gravity as spacetime geometry</text>
    `);
  }

  function renderQuantumScene(plan) {
    return svgShell(`
      <ellipse cx="360" cy="220" rx="185" ry="95" fill="url(#physicsGlow)" class="physics-cloud"></ellipse>
      <circle cx="356" cy="221" r="8" class="physics-measure-dot"></circle>
      <line x1="620" y1="140" x2="800" y2="140" class="physics-energy-level"></line>
      <line x1="620" y1="220" x2="800" y2="220" class="physics-energy-level"></line>
      <line x1="620" y1="300" x2="800" y2="300" class="physics-energy-level"></line>
      <path d="M708 285 L708 160" class="physics-photon-jump"></path>
      <text x="646" y="125">energy levels</text>
      <text x="70" y="72">${escapeHtml(plan.title)}</text>
      <text x="70" y="105" class="physics-muted">${escapeHtml(plan.process)}</text>
    `);
  }

  function renderThermoScene(plan) {
    const hot = Array.from({ length: 18 }, (_, index) => `<circle cx="${120 + (index % 6) * 42}" cy="${155 + Math.floor(index / 6) * 55}" r="9" class="physics-hot-particle"></circle>`).join('');
    const cold = Array.from({ length: 18 }, (_, index) => `<circle cx="${610 + (index % 6) * 42}" cy="${155 + Math.floor(index / 6) * 55}" r="9" class="physics-cold-particle"></circle>`).join('');
    return svgShell(`
      <rect x="80" y="115" width="295" height="190" rx="20" class="physics-hot-zone"></rect>
      <rect x="525" y="115" width="295" height="190" rx="20" class="physics-cold-zone"></rect>
      ${hot}${cold}
      <path d="M390 210 C440 185 475 185 510 210" class="physics-heat-flow"></path>
      <path d="M390 250 C440 275 475 275 510 250" class="physics-heat-flow alt"></path>
      <text x="163" y="340">hot: fast particles</text>
      <text x="585" y="340">cold: slower particles</text>
      <text x="70" y="72">${escapeHtml(plan.title)}</text>
    `);
  }

  function getPhysicsSceneLabels(plan = {}) {
    const mode = plan.sceneMode || plan.template || 'force_motion';
    const detectedLabels = unique([
      ...(plan.entities || []),
      ...(plan.forces || []),
      ...(plan.fields || []),
      ...(plan.energyTypes || []),
      ...(plan.waves || [])
    ]);
    const defaults = {
      force_motion: ['Mass', 'Force arrow', 'Acceleration', 'Velocity trail', 'Ground plane'],
      energy_transfer: ['Potential Energy', 'Kinetic Energy', 'Energy packets', 'Energy meter'],
      field_line: ['Source mass/charge', 'Field lines', 'Test particle', 'Force direction'],
      wave: ['Wave source', 'Wavefront', 'Wavelength', 'Amplitude', 'Frequency'],
      collision: ['Body A', 'Body B', 'Impact flash', 'Momentum conserved'],
      oscillation: ['Spring', 'Restoring force', 'Equilibrium', 'Sine graph'],
      relativity_spacetime: ['Mass', 'Spacetime curvature', 'Light ray', 'Geodesic path'],
      quantum_probability: ['Probability cloud', 'Electron', 'Measurement event', 'Energy levels'],
      thermodynamic_flow: ['Hot zone', 'Cold zone', 'Heat flow', 'Entropy spread']
    };
    return unique([...(defaults[mode] || defaults.force_motion), ...detectedLabels]).slice(0, 8);
  }

  function enhancePhysicsScene(mountNode, plan = {}) {
    if (!window.SciLoopVisualSceneEnhancer?.enhanceScene || !mountNode) return;
    const mode = plan.sceneMode || plan.template || 'force_motion';
    window.SciLoopVisualSceneEnhancer.enhanceScene(mountNode, {
      subject: 'Physics',
      title: plan.title || 'Physics Scene Visualization',
      template: mode,
      templateName: plan.chosenTemplate || plan.templateName || getTemplateName(mode),
      sceneMode: mode,
      labels: getPhysicsSceneLabels(plan),
      entities: plan.entities || [],
      forces: plan.forces || [],
      fields: plan.fields || [],
      energyTypes: plan.energyTypes || [],
      waves: plan.waves || [],
      stages: plan.animationSteps || plan.animationPlan || [],
      explanation: plan.simpleExplanation || plan.explanation?.simple || 'Physics is being shown as objects, forces, fields, energy, and outcomes.',
      keyPoint: plan.innovationConnection || ''
    });
  }

  function renderPhysicsScene(plan, mountNode = null) {
    const mount = mountNode || document.getElementById('physicsScenePreview');
    if (!mount) return;
    const mode = plan.sceneMode || plan.template;
    const renderer = {
      force_motion: renderForceMotionScene,
      energy_transfer: renderEnergyScene,
      field_line: renderFieldScene,
      wave: renderWaveScene,
      collision: renderCollisionScene,
      oscillation: renderOscillationScene,
      relativity_spacetime: renderRelativityScene,
      quantum_probability: renderQuantumScene,
      thermodynamic_flow: renderThermoScene
    }[mode] || renderForceMotionScene;

    mount.innerHTML = renderer(plan);
    enhancePhysicsScene(mount, plan);
  }

  function renderPhysicsNewsScene(visualPlan, mountNode) {
    if (!mountNode || !visualPlan) return;
    const scenePlan = {
      title: visualPlan.title,
      template: visualPlan.detected?.templateId || visualPlan.visualScene?.sceneType || 'force_motion',
      sceneMode: visualPlan.visualScene?.sceneType || visualPlan.detected?.templateId || 'force_motion',
      entities: visualPlan.detected?.entities || [],
      forces: visualPlan.detected?.forces || [],
      fields: visualPlan.detected?.fields || [],
      energyTypes: visualPlan.detected?.energyTypes || [],
      waves: visualPlan.detected?.waves || [],
      process: visualPlan.detected?.processes?.[0] || visualPlan.detected?.laws?.[0] || 'physics mechanism',
      animationSteps: visualPlan.animationPlan || [],
      simpleExplanation: visualPlan.explanation?.simple || '',
      innovationConnection: visualPlan.explanation?.innovationConnection || ''
    };
    renderPhysicsScene(scenePlan, mountNode);
  }

  function renderPhysicsProviderStatus(plan, routerResult = {}) {
    const providerMeta = plan?.providerMeta || {};
    const warnings = unique([...(plan?.explanation?.warnings || []), ...(routerResult.warnings || [])]);
    const status = {
      mode: routerResult.mode || providerMeta.mode || 'local-rule',
      provider: routerResult.providerUsed || providerMeta.provider || 'physics-local-rule-engine',
      fallback: routerResult.fallbackUsed ? 'Yes' : 'No',
      warnings: warnings.length ? warnings.join(' | ') : 'None'
    };
    const modeOut = document.getElementById('physicsProviderModeOut');
    const providerOut = document.getElementById('physicsProviderUsedOut');
    const fallbackOut = document.getElementById('physicsProviderFallbackOut');
    const warningsOut = document.getElementById('physicsProviderWarningsOut');
    if (modeOut) modeOut.textContent = status.mode;
    if (providerOut) providerOut.textContent = status.provider;
    if (fallbackOut) fallbackOut.textContent = status.fallback;
    if (warningsOut) warningsOut.textContent = status.warnings;
  }

  function renderPhysicsNewsVisualPlan(plan, routerResult = {}) {
    if (!plan) return;
    renderPhysicsNewsScene(plan, document.getElementById('physicsNewsScenePreview') || document.getElementById('physicsScenePreview'));
    const title = document.getElementById('physicsNewsSceneTitle');
    if (title) title.textContent = plan.title || 'Physics News Visual Plan';
    renderList(document.getElementById('physicsNewsEntitiesOut'), plan.detected.entities);
    renderList(document.getElementById('physicsNewsForcesOut'), [...(plan.detected.forces || []), ...(plan.detected.fields || []), ...(plan.detected.energyTypes || []), ...(plan.detected.waves || [])]);
    renderList(document.getElementById('physicsNewsLawsOut'), plan.detected.laws);
    renderList(document.getElementById('physicsNewsMatchesOut'), plan.matchedExamples.map((item) => `${item.title} (${item.score})`));
    renderList(document.getElementById('physicsNewsStagesOut'), (plan.visualScene?.stages || []).map((stage) => `${stage.label}: ${stage.description}`));
    renderList(document.getElementById('physicsNewsAnimationOut'), plan.animationPlan);
    const scaleTemplate = document.getElementById('physicsNewsScaleTemplateOut');
    if (scaleTemplate) scaleTemplate.textContent = `${plan.detected.scale} | ${plan.chosenTemplate}`;
    const confidenceOut = document.getElementById('physicsNewsConfidenceOut');
    if (confidenceOut) confidenceOut.textContent = `${Math.round(plan.confidence)}% confidence | ${plan.providerMeta.mode}`;
    const confidenceBar = document.getElementById('physicsNewsConfidenceBar');
    if (confidenceBar) confidenceBar.style.width = `${Math.max(0, Math.min(100, plan.confidence))}%`;
    const simpleOut = document.getElementById('physicsNewsSimpleOut');
    if (simpleOut) simpleOut.textContent = plan.explanation.simple;
    const scientificOut = document.getElementById('physicsNewsScientificOut');
    if (scientificOut) scientificOut.textContent = plan.explanation.scientific;
    const innovationOut = document.getElementById('physicsNewsInnovationOut');
    if (innovationOut) innovationOut.textContent = plan.explanation.innovationConnection;
    const fallbackOut = document.getElementById('physicsNewsFallbackOut');
    if (fallbackOut) fallbackOut.textContent = plan.explanation.warnings.length ? plan.explanation.warnings.join(' ') : 'Visual plan generated with local SciLoop physics rules.';
    const jsonOut = document.getElementById('physicsNewsJsonOut');
    if (jsonOut) jsonOut.textContent = JSON.stringify(plan, null, 2);
    const modeTag = document.getElementById('physicsNewsEngineModeTag');
    if (modeTag) {
      const providerMode = routerResult.mode || plan.providerMeta.mode || 'local-rule';
      modeTag.textContent = routerResult.fallbackUsed ? `${providerMode} fallback` : `${providerMode} mode`;
    }
    renderPhysicsProviderStatus(plan, routerResult);
  }

  function renderPhysicsPlan(plan) {
    if (!plan) return;
    const title = document.getElementById('physicsSceneTitle');
    if (title) title.textContent = plan.title || 'Physics Scene Visualization';
    renderList(document.getElementById('physicsEntitiesOut'), plan.entities);
    renderList(document.getElementById('physicsForcesOut'), [...(plan.forces || []), ...(plan.fields || []), ...(plan.energyTypes || [])]);
    renderList(document.getElementById('physicsAnimationOut'), plan.animationSteps);
    const process = document.getElementById('physicsProcessOut');
    const scale = document.getElementById('physicsScaleOut');
    const templateOut = document.getElementById('physicsTemplateOut');
    const explanation = document.getElementById('physicsExplanationOut');
    const innovation = document.getElementById('physicsInnovationOut');
    const misconception = document.getElementById('physicsMisconceptionOut');
    const json = document.getElementById('physicsPlanJsonOut');
    if (process) process.textContent = plan.process || '';
    if (scale) scale.textContent = `Scale: ${plan.scale || 'classical'}`;
    if (templateOut) templateOut.textContent = plan.chosenTemplate || plan.templateName || plan.template || '';
    if (explanation) explanation.textContent = plan.simpleExplanation || '';
    if (innovation) innovation.textContent = plan.innovationConnection || '';
    if (misconception) misconception.textContent = plan.misconceptionWarning || '';
    if (json) json.textContent = JSON.stringify(generatePhysicsNewsVisualPlan(plan.inputText || plan.simpleSentence || plan.title, { title: plan.title }), null, 2);
    renderPhysicsScene(plan);
  }

  function getLatestVisiblePhysicsNewsItem() {
    const items = Array.isArray(window.latestVisibleNewsItems) ? window.latestVisibleNewsItems : [];
    return items.find((item) => item?.subjectId === 'physics' || /physics|quantum|gravity|spacetime|black hole|electron|photon|magnetic|wave|heat|particle|plasma|energy/i.test(`${item?.title || ''} ${item?.summary || ''}`));
  }

  function openPhysicsNewsVisualFromItem(item) {
    if (!item) return;
    const headline = document.getElementById('physicsNewsHeadlineInput');
    const summary = document.getElementById('physicsNewsSummaryInput');
    const fullText = document.getElementById('physicsNewsFullTextInput');
    if (headline) headline.value = item.title || '';
    if (summary) summary.value = item.summary || '';
    if (fullText) fullText.value = '';
    const mode = document.getElementById('physicsNewsModeSelect')?.value || 'local-rule';
    const preferredProvider = document.getElementById('physicsNewsProviderSelect')?.value || 'auto';
    const plan = generatePhysicsNewsVisualPlan({ title: item.title, summary: item.summary }, { sourceType: 'live-news', mode: 'local-rule' });
    renderPhysicsNewsVisualPlan(plan, { mode: 'local-rule', providerUsed: 'physics-local-rule-engine', fallbackUsed: false, warnings: [] });
    if (mode !== 'local-rule') {
      const fallbackOut = document.getElementById('physicsNewsFallbackOut');
      if (fallbackOut) fallbackOut.textContent = 'AI refining Physics visual plan...';
      routePhysicsVisualRequest({
        title: item.title,
        summary: item.summary,
        mode,
        preferredProvider,
        sourceType: 'live-news',
        existingLocalPlan: plan
      }).then((result) => renderPhysicsNewsVisualPlan(result.visualPlan, result));
    }
  }

  function initPhysicsNewsVisualEnginePortal() {
    const headline = document.getElementById('physicsNewsHeadlineInput');
    const summary = document.getElementById('physicsNewsSummaryInput');
    const fullText = document.getElementById('physicsNewsFullTextInput');
    const mode = document.getElementById('physicsNewsModeSelect');
    const provider = document.getElementById('physicsNewsProviderSelect');
    const generateBtn = document.getElementById('physicsGenerateNewsVisualBtn');
    const latestBtn = document.getElementById('physicsUseVisibleNewsBtn');
    if (!headline || !summary || !generateBtn) return;

    const generate = async () => {
      const selectedMode = mode?.value || 'local-rule';
      const selectedProvider = provider?.value || 'auto';
      const plan = generatePhysicsNewsVisualPlan({ title: headline.value, summary: summary.value, fullText: fullText?.value || '' }, {
        sourceType: headline.value || summary.value || fullText?.value ? 'manual-input' : 'demo',
        mode: 'local-rule'
      });
      renderPhysicsNewsVisualPlan(plan, { mode: 'local-rule', providerUsed: 'physics-local-rule-engine', fallbackUsed: false, warnings: [] });
      if (selectedMode === 'local-rule') return;

      const fallbackOut = document.getElementById('physicsNewsFallbackOut');
      if (fallbackOut) fallbackOut.textContent = 'AI refining Physics visual plan...';
      const routerResult = await routePhysicsVisualRequest({
        title: headline.value,
        summary: summary.value,
        fullText: fullText?.value || '',
        mode: selectedMode,
        preferredProvider: selectedProvider,
        existingLocalPlan: plan
      });
      renderPhysicsNewsVisualPlan(routerResult.visualPlan, routerResult);
    };

    if (!generateBtn.dataset.bound) {
      generateBtn.dataset.bound = '1';
      generateBtn.addEventListener('click', generate);
      headline.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        generate();
      });
      latestBtn?.addEventListener('click', () => {
        const item = getLatestVisiblePhysicsNewsItem();
        if (item) {
          openPhysicsNewsVisualFromItem(item);
          return;
        }
        headline.value = 'Researchers detect gravitational waves from merging black holes';
        summary.value = 'A detector records spacetime ripples created as two black holes spiral together and merge.';
        if (fullText) fullText.value = '';
        generate();
      });
    }

    if (!headline.value) {
      headline.value = 'Researchers detect gravitational waves from merging black holes';
      summary.value = 'A detector records spacetime ripples created as two black holes spiral together and merge.';
    }
    if (!document.getElementById('physicsNewsJsonOut')?.textContent?.trim() || document.getElementById('physicsNewsJsonOut')?.textContent === '{}') {
      const plan = generatePhysicsNewsVisualPlan({ title: headline.value, summary: summary.value }, { sourceType: 'demo', mode: 'local-rule' });
      renderPhysicsNewsVisualPlan(plan, { mode: 'local-rule', providerUsed: 'physics-local-rule-engine', fallbackUsed: false, warnings: [] });
    }
  }

  function initPhysicsVisualLanguagePortal() {
    const select = document.getElementById('physicsConceptSelect');
    const input = document.getElementById('physicsSentenceInput');
    const button = document.getElementById('physicsGeneratePlanBtn');
    if (!select || !input || !button) return;

    if (select.dataset.bound !== '1') {
      select.innerHTML = conceptExamples.map((item) => `<option value="${item.id}">${escapeHtml(item.title)}</option>`).join('');
      select.addEventListener('change', () => {
        const selected = conceptExamples.find((item) => item.id === select.value) || conceptExamples[0];
        input.value = selected.simpleSentence;
        renderPhysicsPlan(generatePhysicsVisualPlan(selected.simpleSentence));
      });
      button.addEventListener('click', () => renderPhysicsPlan(generatePhysicsVisualPlan(input.value)));
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') renderPhysicsPlan(generatePhysicsVisualPlan(input.value));
      });
      select.dataset.bound = '1';
    }

    renderPhysicsAlphabet();
    if (!input.value) input.value = 'Mass bends spacetime and curves light';
    renderPhysicsPlan(generatePhysicsVisualPlan(input.value));
    initPhysicsNewsVisualEnginePortal();
  }

  window.physicsVisualLanguage = {
    subject: 'Physics',
    version: '0.1',
    visualAlphabet,
    grammarRules,
    templates,
    conceptExamples,
    trainingSeeds: physicsTrainingSeeds
  };
  window.physicsTrainingSeeds = physicsTrainingSeeds;
  window.generatePhysicsVisualPlan = generatePhysicsVisualPlan;
  window.generatePhysicsNewsVisualPlan = generatePhysicsNewsVisualPlan;
  window.physicsNewsVisualEngine = physicsNewsVisualEngine;
  window.cleanPhysicsNewsText = cleanPhysicsNewsText;
  window.findClosestPhysicsExamples = findClosestPhysicsExamples;
  window.buildPhysicsNewsToVisualTransfer = buildPhysicsNewsToVisualTransfer;
  window.getCompactPhysicsExampleContext = getCompactPhysicsExampleContext;
  window.buildPhysicsVisualPrompt = buildPhysicsVisualPrompt;
  window.validatePhysicsVisualPlan = validatePhysicsVisualPlan;
  window.normalizeAIPhysicsVisualPlan = normalizeAIPhysicsVisualPlan;
  window.routePhysicsVisualRequest = routePhysicsVisualRequest;
  window.renderPhysicsNewsScene = renderPhysicsNewsScene;
  window.renderPhysicsNewsVisualPlan = renderPhysicsNewsVisualPlan;
  window.openPhysicsNewsVisualFromItem = openPhysicsNewsVisualFromItem;
  window.renderPhysicsVisualPlan = renderPhysicsPlan;
  window.initPhysicsVisualLanguagePortal = initPhysicsVisualLanguagePortal;
})();
