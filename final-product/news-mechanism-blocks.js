/* Keep Live Innovations' inline diagrams present in both static and refreshed cards. */
(() => {
  const feed = document.querySelector('#newsPortal #feed');
  if (!feed) return;

  const legacyVisualSelector = '.universal-news-visual-btn, .physics-news-visual-btn, .bio-news-visual-btn';
  const recipes = [
    { pattern: /crispr|gene|dna|rna|cell|protein|biology/i, label: 'Biology mechanism', caption: 'A guide finds a target, then a precise molecular change is made.', stages: ['Guide RNA', 'Target DNA', 'Edit'], colors: ['#9ff0d0', '#9fdcff', '#ffd166'] },
    { pattern: /quantum|qubit|superposition|error correction/i, label: 'Quantum state', caption: 'Noise is filtered into a stable logical state.', stages: ['Noisy qubits', 'Error correction', 'Logical qubit'], colors: ['#9fdcff', '#d6b3ff', '#9ff0d0'] },
    { pattern: /relativity|spacetime|gravity|orbit|black hole|curvature/i, label: 'Relativity', caption: 'Mass changes geometry; geometry redirects motion.', stages: ['Mass / energy', 'Curved spacetime', 'Changed trajectory'], colors: ['#ffd166', '#ff9fba', '#9fdcff'] },
    { pattern: /statistical mechanics|many-body|emergent|many particles/i, label: 'Statistical mechanics', caption: 'Many small interactions produce a measurable pattern.', stages: ['Many particles', 'Local interactions', 'Emergent pattern'], colors: ['#9fdcff', '#c5b7ff', '#9ff0d0'] },
    { pattern: /information theory|encoding|compression/i, label: 'Information mechanism', caption: 'A signal is encoded, moved, or compressed into something usable.', stages: ['Signal', 'Encoding', 'Meaning'], colors: ['#9fdcff', '#ffd166', '#9ff0d0'] },
    { pattern: /thermodynamic|heat|temperature|energy transfer/i, label: 'Thermodynamics', caption: 'Energy spreads from a concentrated state toward balance.', stages: ['Hot region', 'Energy transfer', 'Equilibrium'], colors: ['#ffad7a', '#ffd166', '#9ff0d0'] },
    { pattern: /material|battery|semiconductor|superconductor|crystal|ion movement/i, label: 'Materials physics', caption: 'Structure guides charge, motion, and useful behavior.', stages: ['Material structure', 'Charge / motion', 'Useful behavior'], colors: ['#9fdcff', '#d6b3ff', '#ffd166'] },
    { pattern: /chemistry|chemical|reaction|molecule|covalent/i, label: 'Chemistry mechanism', caption: 'Atoms rearrange, bonds change, and a new material appears.', stages: ['Reactants', 'Bond change', 'New material'], colors: ['#ffd166', '#ff9fba', '#9ff0d0'] },
    { pattern: /artificial intelligence|machine learning/i, label: 'AI systems', caption: 'Input data moves through a model to produce an output.', stages: ['Input data', 'Model', 'Output'], colors: ['#9fdcff', '#d6b3ff', '#9ff0d0'] },
    { pattern: /algorithm|computation|software|code|computer science/i, label: 'Computer science', caption: 'A rule transforms information into a useful result.', stages: ['Input data', 'Algorithm', 'Result'], colors: ['#9fdcff', '#d6b3ff', '#9ff0d0'] },
    { pattern: /equation|derivative|theorem|mathematics|mathematical/i, label: 'Mathematics mechanism', caption: 'A relationship turns structure into a prediction.', stages: ['Structure', 'Relationship', 'Prediction'], colors: ['#d6b3ff', '#9fdcff', '#ffd166'] },
    { pattern: /physics|magnetic|electric|photon|electron|particle|plasma|wave/i, label: 'Physics mechanism', caption: 'A measurable interaction turns an input into a new state.', stages: ['Input / field', 'Interaction', 'Measured outcome'], colors: ['#9fdcff', '#d6b3ff', '#9ff0d0'] }
  ];
  const fallback = { label: 'Scientific mechanism', caption: 'See the input, change, and outcome before opening the full story.', stages: ['Input', 'Change', 'Outcome'], colors: ['#9fdcff', '#d6b3ff', '#9ff0d0'] };

  function recipeFor(card) {
    const badge = card.querySelector('.subject-badge')?.textContent || '';
    const title = card.querySelector('h2')?.textContent || '';
    const summary = card.querySelector('h2 + p')?.textContent || '';
    const subject = recipes.find((recipe) => recipe.pattern.test(badge));
    return subject || recipes.find((recipe) => recipe.pattern.test(`${title} ${summary}`)) || fallback;
  }

  function makeBlock(card) {
    const recipe = recipeFor(card);
    const section = document.createElement('section');
    section.className = 'sciloop-mechanism-block';
    section.setAttribute('aria-label', `${recipe.label} topic preview`);

    const head = document.createElement('div');
    head.className = 'mechanism-head';
    const kicker = document.createElement('span');
    kicker.className = 'mechanism-kicker';
    kicker.textContent = 'Subject mechanism preview';
    const status = document.createElement('span');
    status.className = 'mechanism-status';
    status.textContent = 'Template';
    head.append(kicker, status);

    const graphic = document.createElement('div');
    graphic.className = 'mechanism-preview-graphic';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 380 122');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', `${recipe.label}: ${recipe.stages.join(' to ')}`);
    const description = document.createElementNS(svgNS, 'desc');
    description.textContent = recipe.caption;
    svg.append(description);

    [82, 190].forEach((x, index) => {
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('class', 'mechanism-flow');
      path.setAttribute('d', `M${x + 30} 59 C${x + 52} 35, ${[190, 298][index] - 52} 83, ${[190, 298][index] - 30} 59`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', recipe.colors[index + 1]);
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-linecap', 'round');
      svg.append(path);
    });

    [82, 190, 298].forEach((x, index) => {
      const color = recipe.colors[index];
      const ring = document.createElementNS(svgNS, 'circle');
      ring.setAttribute('cx', x);
      ring.setAttribute('cy', '59');
      ring.setAttribute('r', '27');
      ring.setAttribute('fill', color);
      ring.setAttribute('fill-opacity', '0.13');
      ring.setAttribute('stroke', color);
      ring.setAttribute('stroke-width', '2');
      const center = document.createElementNS(svgNS, 'circle');
      center.setAttribute('cx', x);
      center.setAttribute('cy', '59');
      center.setAttribute('r', '6');
      center.setAttribute('fill', color);
      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', '103');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#eaf7ff');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', '700');
      text.textContent = recipe.stages[index];
      svg.append(ring, center, text);
    });
    graphic.append(svg);

    const footer = document.createElement('div');
    footer.className = 'mechanism-footer';
    const caption = document.createElement('p');
    caption.className = 'mechanism-caption';
    caption.textContent = recipe.caption;
    footer.append(caption);
    const run = document.createElement('button');
    run.className = 'mechanism-run';
    run.type = 'button';
    run.textContent = 'Explore this mechanism';
    run.addEventListener('click', () => {
      section.classList.toggle('is-active');
      const active = section.classList.contains('is-active');
      status.textContent = active ? 'Animated template' : 'Template';
      run.setAttribute('aria-pressed', String(active));
    });
    section.append(head, graphic, footer, run);
    return section;
  }

  function syncCards() {
    feed.querySelectorAll('article.card').forEach((card) => {
      card.querySelectorAll(legacyVisualSelector).forEach((button) => button.remove());
      if (!card.querySelector('.sciloop-mechanism-block')) {
        const topline = card.querySelector('.topline');
        if (topline) topline.insertAdjacentElement('afterend', makeBlock(card));
      }
    });
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; syncCards(); });
  });
  observer.observe(feed, { childList: true, subtree: true });
  syncCards();
})();
