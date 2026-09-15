(function () {
  if (window.__SCILOOP_EXPERIENCE__) return;
  window.__SCILOOP_EXPERIENCE__ = true;

  const STORAGE_KEYS = {
    introComplete: 'sciloop_experience_intro_complete_v1',
    theme: 'sciloop_experience_theme_v1',
    accent: 'sciloop_experience_accent_v1',
    portalSeen: 'sciloop_experience_portal_seen_v1'
  };

  const locale = ((document.documentElement.lang || 'en').split('-')[0] || 'en').toLowerCase();

  const COPY = {
    en: {
      dock: {
        title: 'SciLoop Command Dock',
        subtitle: 'Theme, path, replay',
        trigger: 'Controls',
        replayLaunch: 'Replay Launch',
        choosePath: 'Choose Path',
        replayPortal: 'Portal Intro',
        theme: 'Theme',
        accent: 'Accent',
        dark: 'Dark',
        light: 'Light',
        standard: 'Default',
        cosmic: 'Cosmic'
      },
      intro: {
        brand: 'Launch Sequence',
        brandLine: 'First visit experience',
        continue: 'Continue',
        skip: 'Skip',
        replay: 'Replay',
        mute: 'Mute',
        unmute: 'Unmute',
        subtitlesOn: 'Subtitles On',
        subtitlesOff: 'Subtitles Off',
        sceneLabel: 'Scene',
        visualLabel: 'SciLoop signal',
        scenes: [
          {
            id: 'welcome',
            eyebrow: 'SciLoop',
            title: 'Explore science, reality, and the future.',
            lead: 'One connected platform for discovery, understanding, simulation, and contribution.',
            subtitle: 'Discover. Understand. Simulate. Contribute.',
            chips: ['Live science', 'Big questions', 'Future worlds'],
            metrics: [
              { label: 'What is it?', text: 'A scientific universe made simple to enter.' },
              { label: 'Core move', text: 'Choose a path, then learn by seeing and doing.' },
              { label: 'Signal', text: 'Short text. Strong visuals. Clear direction.' },
              { label: 'Start point', text: 'Begin with orientation before deep exploration.' }
            ],
            narration: 'Welcome to SciLoop. Explore science, reality, and the future.'
          },
          {
            id: 'purpose',
            eyebrow: 'Why It Exists',
            title: 'Science can inspire. It can also overwhelm.',
            lead: 'SciLoop connects fragmented portals into one guided journey, so curiosity turns into clarity faster.',
            subtitle: 'Less overload. More orientation.',
            chips: ['Clear map', 'Fewer dead ends', 'Shared mission'],
            metrics: [
              { label: 'Problem', text: 'Too many science spaces feel disconnected.' },
              { label: 'Answer', text: 'A guided structure that shows how everything fits.' },
              { label: 'Why care?', text: 'You move from reading to understanding with less friction.' },
              { label: 'Design rule', text: 'Motion, icons, and short language do the heavy lifting.' }
            ],
            narration: 'SciLoop exists to reduce overload and connect science into one clear path.'
          },
          {
            id: 'moves',
            eyebrow: 'What You Can Do',
            title: 'See discoveries. Test limits. Run worlds. Help build.',
            lead: 'Move from live research to timeless questions, alternate realities, experiments, and real-world impact.',
            subtitle: 'Curiosity becomes capability here.',
            chips: ['Discover', 'Compare', 'Simulate', 'Act'],
            metrics: [
              { label: 'Discover', text: 'Scan live discoveries and the thinkers behind them.' },
              { label: 'Understand', text: 'Use guided labs and visual explanations.' },
              { label: 'Simulate', text: 'Change assumptions and watch outcomes respond.' },
              { label: 'Contribute', text: 'Solve challenges, submit ideas, and improve SciLoop.' }
            ],
            narration: 'You can discover, understand, simulate, and contribute inside one platform.'
          },
          {
            id: 'start',
            eyebrow: 'Where To Begin',
            title: 'Start with the map. Then choose your zone.',
            lead: 'Open Start first, then follow the journey that matches your goal: deep science, future limits, experiments, or action.',
            subtitle: 'Home and Guide first. Then choose your path.',
            chips: ['Start first', 'Five zones', 'Your pace'],
            metrics: [
              { label: 'Best first move', text: 'Use SciLoop Nexus and Platform Guide together.' },
              { label: 'Next step', text: 'Pick one zone instead of scanning everything at once.' },
              { label: 'Good path', text: 'Start -> Learn -> Explore -> Contribute.' },
              { label: 'Ready', text: 'The journey map opens next.' }
            ],
            narration: 'Begin with Start, learn the structure, then choose the zone that matches your goal.'
          }
        ]
      },
      journey: {
        brand: 'Journey Map',
        brandLine: 'Five zones. One scientific universe.',
        title: 'Choose your path.',
        body: 'SciLoop works best when you start with orientation, then follow one clear journey. You do not need to open every portal at once.',
        recommendation: 'Recommended first move: SciLoop Nexus -> Platform Guide -> your next zone.',
        openStart: 'Open Guide',
        close: 'Close Map',
        replayLaunch: 'Replay Launch'
      },
      portalIntro: {
        zoneLabel: 'Portal intro',
        continue: 'Enter Portal',
        close: 'Close'
      }
    }
  };

  const TEXT = COPY[locale] || COPY.en;

  const PORTAL_REGISTRY = [
    { mode: 'nexus', portalId: 'nexusPortal', buttonId: 'nexusTab', icon: 'launch', accentRgb: '96, 226, 255', accentHex: '#60e2ff', zone: 'start' },
    { mode: 'guide', portalId: 'guidePortal', buttonId: 'guideTab', icon: 'guide', accentRgb: '133, 192, 255', accentHex: '#85c0ff', zone: 'start' },
    { mode: 'timeless', portalId: 'timelessPortal', buttonId: 'timelessTab', icon: 'time', accentRgb: '255, 196, 116', accentHex: '#ffc474', zone: 'deep-science' },
    { mode: 'potential', portalId: 'potentialPortal', buttonId: 'potentialTab', icon: 'limits', accentRgb: '129, 238, 188', accentHex: '#81eebc', zone: 'future-limits' },
    { mode: 'reality', portalId: 'realityPortal', buttonId: 'realityTab', icon: 'universe', accentRgb: '255, 152, 125', accentHex: '#ff987d', zone: 'future-limits' },
    { mode: 'news', portalId: 'newsPortal', buttonId: 'newsTab', icon: 'news', accentRgb: '141, 214, 255', accentHex: '#8dd6ff', zone: 'deep-science' },
    { mode: 'scientists', portalId: 'scientistPortal', buttonId: 'scientistTab', icon: 'builders', accentRgb: '200, 225, 255', accentHex: '#c8e1ff', zone: 'deep-science' },
    { mode: 'lab', portalId: 'labPortal', buttonId: 'labTab', icon: 'experiment', accentRgb: '104, 255, 220', accentHex: '#68ffdc', zone: 'experiment' },
    { mode: 'impact', portalId: 'impactPortal', buttonId: 'impactTab', icon: 'impact', accentRgb: '255, 194, 133', accentHex: '#ffc285', zone: 'action' },
    { mode: 'local', portalId: 'localPortal', buttonId: 'localTab', icon: 'local', accentRgb: '123, 229, 255', accentHex: '#7be5ff', zone: 'action' },
    { mode: 'feedback', portalId: 'feedbackPortal', buttonId: 'feedbackTab', icon: 'feedback', accentRgb: '255, 171, 150', accentHex: '#ffab96', zone: 'action' }
  ].map((entry) => ({
    ...entry,
    portal: document.getElementById(entry.portalId),
    button: document.getElementById(entry.buttonId)
  }));

  const PORTAL_META = {
    nexus: { name: 'SciLoop Nexus', short: 'Your home base for profile, platform pulse, and entry.', what: 'Shows the platform pulse, your profile, and the main entry points.', why: 'It gives you one stable starting surface before deeper exploration.', try: 'Check the pulse, create a profile, then head to the Guide.', zone: 'start' },
    guide: { name: 'Platform Guide', short: 'See how every portal fits before you dive in.', what: 'Maps every portal, its purpose, and how the full platform connects.', why: 'It reduces overload and helps you choose with confidence.', try: 'Scan the roles, then enter the portal that matches your goal.', zone: 'start' },
    timeless: { name: 'Timeless Problems Lab', short: 'Study open questions that shape civilization.', what: 'Explores deep scientific and philosophical problems across time.', why: 'Big questions organize long-term thinking and research direction.', try: 'Browse the major problems, then add an idea or structured note.', zone: 'deep-science' },
    potential: { name: 'Potential Explorer', short: 'Compare systems from current ability to hard limit.', what: 'Shows how AI, compute, energy, robotics, and biology can scale.', why: 'Limits become easier to understand when they are visual and comparative.', try: 'Move the scale controls and compare where progress may still go.', zone: 'future-limits' },
    reality: { name: 'Reality Sandbox', short: 'Change core rules and see what breaks.', what: 'Lets you bend physical and biological assumptions on purpose.', why: 'Understanding limits gets easier when you can test impossible worlds.', try: 'Change a few laws, then inspect the outcome warnings and summaries.', zone: 'future-limits' },
    news: { name: 'News Portal', short: 'Scan live discoveries across major fields.', what: 'Pulls in current scientific news and research signals in one place.', why: 'Fresh discoveries keep the platform connected to real-world progress.', try: 'Filter by field, open a source, then connect it to a deeper portal.', zone: 'deep-science' },
    scientists: { name: 'Hall of Builders', short: 'Meet the minds that changed civilization.', what: 'Profiles legendary and modern builders who reshaped science and technology.', why: 'Stories of builders help users see how ideas become civilization-scale change.', try: 'Open a profile, follow the timeline, and compare impact paths.', zone: 'deep-science' },
    lab: { name: 'Mini Experiment Lab', short: 'Run fast physics, chemistry, and math experiments.', what: 'Offers quick in-browser experiments with interactive controls.', why: 'Small experiments make scientific ideas concrete and memorable.', try: 'Pick a domain, tweak variables, and watch the live result update.', zone: 'experiment' },
    impact: { name: 'Impact Hub', short: 'Solve global challenges and track your score.', what: 'Collects global problems, submissions, leaderboards, and personal progress.', why: 'SciLoop should lead toward contribution, not only observation.', try: 'Create a profile, pick a challenge, then submit a structured solution.', zone: 'action' },
    local: { name: 'Local Problem Solver', short: 'Map local problems and crowdsource workable solutions.', what: 'Connects regional issues with community-backed solution ideas.', why: 'Science matters more when it can help real places and real people.', try: 'Add a local problem or support a practical solution already posted.', zone: 'action' },
    feedback: { name: 'Feedback Portal', short: 'Tell SciLoop what to improve next.', what: 'Collects ratings, confusion points, and improvement suggestions.', why: 'The platform should learn from its users the same way science learns from evidence.', try: 'Leave clear feedback about what helped, what felt unclear, and what should come next.', zone: 'action' }
  };

  const PORTAL_DECKS = {
    nexus: {
      mode: 'Platform pulse | Entry grid',
      note: 'This deck compresses identity, launch options, and platform momentum into one 3D read so users know where to start fast.',
      layers: [
        { title: 'Entry Grid', text: 'Home routes, launch cards, first move.' },
        { title: 'Profile State', text: 'Identity, rank, contribution memory.' },
        { title: 'Momentum Loop', text: 'Profiles, actions, and platform pulse.' }
      ],
      metrics: [
        { label: 'Orientation', value: 94, text: 'Start, sign in, choose path.' },
        { label: 'Readiness', value: 87, text: 'Profile and launch context stay visible.' },
        { label: 'Navigation fit', value: 90, text: 'Users can move deeper with less friction.' }
      ]
    },
    guide: {
      mode: 'Portal map | Journey system',
      note: 'This deck explains how SciLoop connects, so the platform feels like one scientific universe instead of separate pages.',
      layers: [
        { title: 'Portals', text: 'Each portal has a clear role.' },
        { title: 'Connections', text: 'Ideas flow across labs and actions.' },
        { title: 'Journey', text: 'Start, understand, simulate, contribute.' }
      ],
      metrics: [
        { label: 'Structure', value: 96, text: 'Portal roles are readable at a glance.' },
        { label: 'Decision speed', value: 86, text: 'Users choose with more confidence.' },
        { label: 'Confusion drop', value: 89, text: 'The bigger platform story stays visible.' }
      ]
    },
    timeless: {
      mode: 'Theory deck | Research depth',
      note: 'This deck turns deep questions into a layered research view so users can see origin, concept structure, and active bench work together.',
      layers: [
        { title: 'Origins', text: 'Where the question begins in history.' },
        { title: 'Concept Graph', text: 'How the core ideas connect.' },
        { title: 'Bench Activity', text: 'What users can add, test, or refine.' }
      ],
      metrics: [
        { label: 'Depth', value: 95, text: 'Complex questions stay structured.' },
        { label: 'Legibility', value: 84, text: 'Hard ideas become easier to scan.' },
        { label: 'Collaboration', value: 81, text: 'Theory and notes stay actionable.' }
      ]
    },
    reality: {
      mode: 'Law stack | Outcome field',
      note: 'This deck helps users see which rules were changed, how stable the universe remains, and where the biggest rupture appears.',
      layers: [
        { title: 'Base Laws', text: 'Gravity, light, biology, energy.' },
        { title: 'Rupture Map', text: 'Where the simulation starts to break.' },
        { title: 'Outcome Field', text: 'Civilization, technology, and life response.' }
      ],
      metrics: [
        { label: 'Instability scan', value: 88, text: 'Dominant rupture becomes visible quickly.' },
        { label: 'Learning value', value: 93, text: 'Changed laws teach by consequence.' },
        { label: 'What to tune next', value: 79, text: 'Users know which sliders matter most.' }
      ]
    },
    news: {
      mode: 'Discovery stream | Signal board',
      note: 'This deck translates fast-moving research into a field-and-source pulse so users can scan what matters before opening articles.',
      layers: [
        { title: 'Sources', text: 'Trusted streams feeding the portal.' },
        { title: 'Fields', text: 'Major domains moving right now.' },
        { title: 'Heat Signal', text: 'Freshness, volume, and relevance.' }
      ],
      metrics: [
        { label: 'Freshness', value: 92, text: 'Recent discoveries stay front and center.' },
        { label: 'Coverage', value: 87, text: 'Multiple fields stay visible together.' },
        { label: 'Scan speed', value: 90, text: 'Users can triage the feed quickly.' }
      ]
    },
    scientists: {
      mode: 'Legacy network | Builder impact',
      note: 'This deck layers eras, breakthroughs, and influence so the Hall reads like a living scientific lineage instead of a flat list.',
      layers: [
        { title: 'Eras', text: 'History and modern frontier in one frame.' },
        { title: 'Breakthroughs', text: 'The discoveries that changed direction.' },
        { title: 'Influence', text: 'How one mind reshapes the next.' }
      ],
      metrics: [
        { label: 'History depth', value: 91, text: 'Major builders feel contextualized.' },
        { label: 'Impact visibility', value: 94, text: 'Influence becomes easier to compare.' },
        { label: 'Inspiration', value: 88, text: 'Users can see their own trajectory path.' }
      ]
    },
    lab: {
      mode: 'Experiment deck | Live response',
      note: 'This deck frames the lab as a quick scientific cycle: set inputs, watch the simulation respond, then iterate again.',
      layers: [
        { title: 'Inputs', text: 'Variables and domain choices.' },
        { title: 'Simulation', text: 'The in-browser experiment engine.' },
        { title: 'Result', text: 'Immediate output and interpretation.' }
      ],
      metrics: [
        { label: 'Interactivity', value: 95, text: 'The portal responds immediately.' },
        { label: 'Comprehension', value: 86, text: 'Users learn by changing variables.' },
        { label: 'Iteration speed', value: 92, text: 'Fast repeat experiments stay easy.' }
      ]
    },
    impact: {
      mode: 'Challenge deck | Score engine',
      note: 'This deck shows how mission selection, modeling, and scoring stack into one contribution system that rewards thoughtful solutions.',
      layers: [
        { title: 'Mission', text: 'The challenge and its context.' },
        { title: 'Model', text: 'Efficiency, cost, risk, resources.' },
        { title: 'Score', text: 'Novelty, feasibility, and impact.' }
      ],
      metrics: [
        { label: 'Problem focus', value: 92, text: 'Users know what they are solving.' },
        { label: 'Decision quality', value: 85, text: 'Tradeoffs stay visible while writing.' },
        { label: 'Contribution lift', value: 89, text: 'Good solutions connect to progression.' }
      ]
    },
    local: {
      mode: 'Ground deck | Response stack',
      note: 'This deck helps users see local problems as a structured cycle from detection to mapping to reusable solution signals.',
      layers: [
        { title: 'Problem Map', text: 'Where the issue lives and spreads.' },
        { title: 'Solution Set', text: 'Practical ideas with constraints.' },
        { title: 'Community Vote', text: 'Which responses gain traction.' }
      ],
      metrics: [
        { label: 'Context', value: 90, text: 'Place and severity stay visible.' },
        { label: 'Practicality', value: 84, text: 'Solutions stay grounded in reality.' },
        { label: 'Reuse potential', value: 87, text: 'Strong ideas can travel to new regions.' }
      ]
    },
    feedback: {
      mode: 'Signal deck | Product learning',
      note: 'This deck turns raw feedback into a layered product-learning model so friction patterns and next improvements become easier to prioritize.',
      layers: [
        { title: 'Friction', text: 'What feels unclear or weak.' },
        { title: 'Patterns', text: 'What repeats across users.' },
        { title: 'Roadmap', text: 'What should improve next.' }
      ],
      metrics: [
        { label: 'Signal quality', value: 85, text: 'Clear feedback is easier to interpret.' },
        { label: 'Priority clarity', value: 89, text: 'The strongest themes stand out.' },
        { label: 'Iteration speed', value: 83, text: 'Good feedback turns into action faster.' }
      ]
    }
  };

  const ZONES = [
    { key: 'start', name: 'Start', label: 'Start here', short: 'Orient. Sign in. Choose with confidence.', icon: 'start-zone', rgb: '96, 226, 255', portals: ['nexus', 'guide'] },
    { key: 'deep-science', name: 'Deep Science', label: 'Research and understanding', short: 'See discoveries, hard questions, and the builders behind them.', icon: 'deep-zone', rgb: '255, 196, 116', portals: ['timeless', 'news', 'scientists'] },
    { key: 'future-limits', name: 'Future and Limits', label: 'Compare and stretch', short: 'Explore ceilings, bend assumptions, and test tomorrow.', icon: 'future-zone', rgb: '129, 238, 188', portals: ['potential', 'reality'] },
    { key: 'experiment', name: 'Experiment', label: 'Hands-on practice', short: 'Use quick simulations to make scientific ideas tangible.', icon: 'experiment-zone', rgb: '104, 255, 220', portals: ['lab'] },
    { key: 'action', name: 'Action', label: 'Apply and improve', short: 'Turn science into solutions, local impact, and product feedback.', icon: 'action-zone', rgb: '255, 194, 133', portals: ['impact', 'local', 'feedback'] }
  ];

  const body = document.body;
  const header = document.querySelector('header');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsSpeech = 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function';

  function safeRead(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value == null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      return null;
    }
    return value;
  }

  function safeReadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function safeWriteJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return null;
    }
    return value;
  }

  function createElement(tag, className, html) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (html != null) element.innerHTML = html;
    return element;
  }

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((element) => !element.disabled && !element.hidden && element.offsetParent !== null);
  }

  function getPortalMeta(mode) {
    return PORTAL_META[mode] || PORTAL_META.nexus;
  }

  function getPortalEntry(mode) {
    return PORTAL_REGISTRY.find((entry) => entry.mode === mode) || PORTAL_REGISTRY[0];
  }

  function getActiveMode() {
    const active = PORTAL_REGISTRY.find((entry) => entry.portal && entry.portal.classList.contains('active'));
    return active ? active.mode : 'nexus';
  }

  function enterPortal(mode) {
    const entry = getPortalEntry(mode);
    if (entry && entry.button) {
      entry.button.click();
      entry.button.focus();
    }
  }

  const OverlayManager = (function () {
    let activeRoot = null;
    let escapeHandler = null;
    let previousFocus = null;

    function handleKeydown(event) {
      if (!activeRoot) return;
      if (event.key === 'Tab') {
        const focusable = getFocusable(activeRoot);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      if (event.key === 'Escape' && typeof escapeHandler === 'function') {
        event.preventDefault();
        escapeHandler();
      }
    }

    document.addEventListener('keydown', handleKeydown);

    return {
      open(root, onEscape) {
        if (activeRoot === root) return;
        if (activeRoot && activeRoot !== root) return;
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        activeRoot = root;
        escapeHandler = onEscape;
        body.classList.add('experience-lock', 'has-overlay');
        const focusable = getFocusable(root);
        if (focusable.length) {
          window.setTimeout(() => focusable[0].focus(), 10);
        }
      },
      close(root) {
        if (activeRoot !== root) return;
        activeRoot = null;
        escapeHandler = null;
        body.classList.remove('experience-lock', 'has-overlay');
        if (previousFocus && typeof previousFocus.focus === 'function' && document.contains(previousFocus)) {
          previousFocus.focus();
        }
        previousFocus = null;
      },
      isBusy() {
        return Boolean(activeRoot);
      },
      isActive(root) {
        return activeRoot === root;
      }
    };
  })();

  function iconMarkup(icon) {
    const shared = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    const icons = {
      launch: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M12 3l2.4 5.1L20 10l-5.6 2L12 17l-2.4-5L4 10l5.6-1.9L12 3z"/><path ${shared} d="M5 19h14"/></svg>`,
      guide: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M5 5h12a2 2 0 0 1 2 2v11H7a2 2 0 0 0-2 2V5z"/><path ${shared} d="M7 5v15"/><path ${shared} d="M10 9h6"/><path ${shared} d="M10 13h5"/></svg>`,
      time: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M12 5a7 7 0 1 0 7 7"/><path ${shared} d="M12 8v4l3 2"/><path ${shared} d="M12 3v2"/><path ${shared} d="M19 5l1.5-1.5"/></svg>`,
      limits: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M4 18h16"/><path ${shared} d="M7 18V9"/><path ${shared} d="M12 18V5"/><path ${shared} d="M17 18v-7"/><path ${shared} d="M5 7l3-3 2 2 3-4 4 4 2-2"/></svg>`,
      universe: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle ${shared} cx="12" cy="12" r="2.4"/><ellipse ${shared} cx="12" cy="12" rx="8" ry="3.5"/><ellipse ${shared} cx="12" cy="12" rx="3.5" ry="8" transform="rotate(45 12 12)"/><path ${shared} d="M20 4l1 1"/></svg>`,
      news: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M5 6h11a2 2 0 0 1 2 2v10H7a2 2 0 0 1-2-2V6z"/><path ${shared} d="M9 10h6"/><path ${shared} d="M9 13h6"/><path ${shared} d="M5 18a2 2 0 0 0 2 2h10"/></svg>`,
      builders: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M7 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path ${shared} d="M17 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/><path ${shared} d="M3.5 20a4.5 4.5 0 0 1 7 0"/><path ${shared} d="M13.5 19a4 4 0 0 1 6 0"/></svg>`,
      experiment: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M9 3h6"/><path ${shared} d="M10 3v6l-5 8a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-8V3"/><path ${shared} d="M8.5 14h7"/></svg>`,
      impact: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M12 4v16"/><path ${shared} d="M4 12h16"/><circle ${shared} cx="12" cy="12" r="7"/></svg>`,
      local: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"/><circle ${shared} cx="12" cy="11" r="2.4"/></svg>`,
      feedback: `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M5 6h14v9H9l-4 4V6z"/><path ${shared} d="M9 10h6"/><path ${shared} d="M9 13h3"/></svg>`,
      'start-zone': `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M12 4l7 7-7 7-7-7 7-7z"/><path ${shared} d="M12 11h7"/></svg>`,
      'deep-zone': `<svg viewBox="0 0 24 24" aria-hidden="true"><circle ${shared} cx="12" cy="12" r="2.2"/><path ${shared} d="M12 3v4"/><path ${shared} d="M12 17v4"/><path ${shared} d="M3 12h4"/><path ${shared} d="M17 12h4"/><path ${shared} d="M5.6 5.6l2.9 2.9"/><path ${shared} d="M15.5 15.5l2.9 2.9"/><path ${shared} d="M18.4 5.6l-2.9 2.9"/><path ${shared} d="M8.5 15.5l-2.9 2.9"/></svg>`,
      'future-zone': `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M5 16l4-4 3 3 7-7"/><path ${shared} d="M14 8h5v5"/><path ${shared} d="M4 20h16"/></svg>`,
      'experiment-zone': `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M9 3h6"/><path ${shared} d="M10 3v5l-4 7a2 2 0 0 0 1.7 3h8.6a2 2 0 0 0 1.7-3l-4-7V3"/><path ${shared} d="M8 14c2.2 1.2 5.8 1.2 8 0"/></svg>`,
      'action-zone': `<svg viewBox="0 0 24 24" aria-hidden="true"><path ${shared} d="M12 4l2.5 5.2L20 10l-4 4.1.9 5.9L12 17.6 7.1 20l.9-5.9L4 10l5.5-.8L12 4z"/></svg>`
    };
    return `<span class="sc-icon">${icons[icon] || icons.launch}</span>`;
  }

  const ThemeProvider = (function () {
    const state = {
      theme: safeRead(STORAGE_KEYS.theme, 'dark') === 'light' ? 'light' : 'dark',
      accent: safeRead(STORAGE_KEYS.accent, 'default') === 'cosmic' ? 'cosmic' : 'default'
    };

    let dock;
    let panel;
    let triggerButton;
    let focusText;
    let themeButtons = [];
    let accentButtons = [];

    function apply() {
      body.dataset.theme = state.theme;
      body.dataset.accent = state.accent === 'cosmic' ? 'cosmic' : 'standard';
      safeWrite(STORAGE_KEYS.theme, state.theme);
      safeWrite(STORAGE_KEYS.accent, state.accent);
      themeButtons.forEach((button) => {
        const active = button.dataset.value === state.theme;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      accentButtons.forEach((button) => {
        const active = button.dataset.value === state.accent;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }

    function setPortalTone(mode) {
      const entry = getPortalEntry(mode);
      if (!entry) return;
      body.dataset.activePortal = mode;
      body.style.setProperty('--portal-signal-rgb', entry.accentRgb);
      body.style.setProperty('--portal-signal', entry.accentHex);
      if (focusText) {
        focusText.textContent = `${getPortalMeta(mode).name} | ${ZONES.find((zone) => zone.key === entry.zone)?.name || 'Start'}`;
      }
    }

    function buildDockButton(label, onClick) {
      const button = createElement('button', '', label);
      button.type = 'button';
      button.addEventListener('click', onClick);
      return button;
    }

    function buildSegmented(options, onClick) {
      const wrap = createElement('div', 'sc-segmented');
      const buttons = options.map((option) => {
        const button = buildDockButton(option.label, () => onClick(option.value));
        button.dataset.value = option.value;
        wrap.appendChild(button);
        return button;
      });
      return { wrap, buttons };
    }

    function setOpen(nextOpen) {
      if (!dock) return;
      dock.classList.toggle('is-open', nextOpen);
      if (triggerButton) {
        triggerButton.setAttribute('aria-expanded', String(nextOpen));
      }
    }

    function mount() {
      if (dock) return;
      dock = createElement('aside', 'sc-command-dock');
      dock.setAttribute('aria-label', TEXT.dock.title);
      dock.innerHTML = `
        <button type="button" class="sc-command-dock__trigger" id="scDockTrigger" aria-expanded="false" aria-haspopup="dialog">
          <span>${TEXT.dock.trigger}</span>
          <strong>${TEXT.dock.title}</strong>
        </button>
        <div class="sc-command-dock__panel" id="scDockPanel">
          <div class="sc-command-dock__header">
            <div>
              <span>${TEXT.dock.subtitle}</span>
              <strong>${TEXT.dock.title}</strong>
            </div>
            <div class="sc-command-dock__header-focus" id="scDockFocusText"></div>
          </div>
          <div class="sc-command-dock__actions" id="scDockActions"></div>
          <div class="sc-command-dock__group">
            <div class="sc-command-dock__label">${TEXT.dock.theme}</div>
            <div id="scThemeGroup"></div>
          </div>
          <div class="sc-command-dock__group">
            <div class="sc-command-dock__label">${TEXT.dock.accent}</div>
            <div id="scAccentGroup"></div>
          </div>
        </div>
      `;
      body.appendChild(dock);

      triggerButton = dock.querySelector('#scDockTrigger');
      panel = dock.querySelector('#scDockPanel');
      focusText = dock.querySelector('#scDockFocusText');
      const actions = dock.querySelector('#scDockActions');
      actions.appendChild(buildDockButton(TEXT.dock.replayLaunch, () => {
        setOpen(false);
        LaunchIntro.open(true);
      }));
      actions.appendChild(buildDockButton(TEXT.dock.choosePath, () => {
        setOpen(false);
        JourneyMap.open(getPortalEntry(getActiveMode()).zone);
      }));
      actions.appendChild(buildDockButton(TEXT.dock.replayPortal, () => {
        setOpen(false);
        PortalIntro.open(getActiveMode(), true);
      }));

      const themeGroup = buildSegmented([
        { label: TEXT.dock.dark, value: 'dark' },
        { label: TEXT.dock.light, value: 'light' }
      ], (value) => {
        state.theme = value;
        apply();
      });
      dock.querySelector('#scThemeGroup').appendChild(themeGroup.wrap);
      themeButtons = themeGroup.buttons;

      const accentGroup = buildSegmented([
        { label: TEXT.dock.standard, value: 'default' },
        { label: TEXT.dock.cosmic, value: 'cosmic' }
      ], (value) => {
        state.accent = value;
        apply();
      });
      dock.querySelector('#scAccentGroup').appendChild(accentGroup.wrap);
      accentButtons = accentGroup.buttons;

      triggerButton.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(!dock.classList.contains('is-open'));
      });

      panel.addEventListener('click', (event) => {
        event.stopPropagation();
      });

      document.addEventListener('click', (event) => {
        if (!dock.classList.contains('is-open')) return;
        if (!dock.contains(event.target)) {
          setOpen(false);
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dock.classList.contains('is-open')) {
          setOpen(false);
        }
      });

      apply();
    }

    return {
      mount,
      setPortalTone
    };
  })();

  const PortalIntro = (function () {
    const seen = new Set(safeReadJSON(STORAGE_KEYS.portalSeen, []));
    let root;
    let card;
    let titleEl;
    let introEl;
    let factsEl;
    let chipsEl;
    let iconEl;

    function persist() {
      safeWriteJSON(STORAGE_KEYS.portalSeen, Array.from(seen));
    }

    function mount() {
      if (root) return;
      root = createElement('div', 'sc-portal-intro');
      root.setAttribute('role', 'presentation');
      root.innerHTML = `
        <div class="sc-portal-intro__backdrop"></div>
        <div class="sc-portal-intro__card" role="dialog" aria-modal="true" aria-labelledby="scPortalIntroTitle">
          <div class="sc-portal-intro__head">
            <div class="sc-portal-intro__icon" id="scPortalIntroIcon"></div>
            <div class="sc-portal-intro__title">
              <div class="sc-portal-intro__eyebrow">${TEXT.portalIntro.zoneLabel}</div>
              <h3 id="scPortalIntroTitle"></h3>
              <p id="scPortalIntroSummary"></p>
            </div>
          </div>
          <div class="sc-portal-intro__chips" id="scPortalIntroChips"></div>
          <div class="sc-portal-intro__facts" id="scPortalIntroFacts"></div>
          <div class="sc-portal-intro__controls">
            <button type="button" id="scPortalIntroContinue">${TEXT.portalIntro.continue}</button>
            <button type="button" id="scPortalIntroClose">${TEXT.portalIntro.close}</button>
          </div>
        </div>
      `;
      body.appendChild(root);
      card = root.querySelector('.sc-portal-intro__card');
      titleEl = root.querySelector('#scPortalIntroTitle');
      introEl = root.querySelector('#scPortalIntroSummary');
      factsEl = root.querySelector('#scPortalIntroFacts');
      chipsEl = root.querySelector('#scPortalIntroChips');
      iconEl = root.querySelector('#scPortalIntroIcon');

      root.querySelector('#scPortalIntroContinue').addEventListener('click', close);
      root.querySelector('#scPortalIntroClose').addEventListener('click', close);
      root.querySelector('.sc-portal-intro__backdrop').addEventListener('click', close);
    }

    function close() {
      if (!root || !root.classList.contains('is-open')) return;
      root.classList.remove('is-open');
      OverlayManager.close(root);
    }

    function open(mode, force) {
      mount();
      if (!force && safeRead(STORAGE_KEYS.introComplete, '0') !== '1') return;
      if (OverlayManager.isBusy() && !OverlayManager.isActive(root)) return;
      const entry = getPortalEntry(mode);
      const meta = getPortalMeta(mode);
      if (!meta || (!force && seen.has(mode))) return;

      iconEl.innerHTML = iconMarkup(entry.icon);
      titleEl.textContent = meta.name;
      introEl.textContent = meta.short;
      chipsEl.innerHTML = [
        `<span class="sc-chip">${ZONES.find((zone) => zone.key === meta.zone)?.name || 'Start'}</span>`,
        '<span class="sc-chip">First visit</span>'
      ].join('');
      factsEl.innerHTML = [
        { label: 'Does', text: meta.what },
        { label: 'Why', text: meta.why },
        { label: 'Try', text: meta.try }
      ].map((fact) => `
        <div class="sc-portal-intro__fact">
          <strong>${fact.label}</strong>
          <p>${fact.text}</p>
        </div>
      `).join('');
      card.style.setProperty('--portal-rgb', entry.accentRgb);
      root.classList.add('is-open');
      OverlayManager.open(root, close);

      if (!force) {
        seen.add(mode);
        persist();
      }
    }

    function maybeOpen(mode, options) {
      if (safeRead(STORAGE_KEYS.introComplete, '0') !== '1') return;
      if (options && options.silent) return;
      open(mode, false);
    }

    return {
      mount,
      open,
      maybeOpen,
      close
    };
  })();

  const JourneyMap = (function () {
    let root;
    let focusZoneKey = 'start';
    let zoneStripButtons = [];

    function mountHeaderStrip() {
      if (!header || header.querySelector('.sc-zone-strip')) return;
      const strip = createElement('div', 'sc-zone-strip');
      strip.setAttribute('aria-label', 'SciLoop journey zones');
      ZONES.forEach((zone) => {
        const button = createElement('button', `sc-zone-chip${zone.key === 'start' ? ' is-recommended' : ''}`);
        button.type = 'button';
        button.style.setProperty('--zone-rgb', zone.rgb);
        button.dataset.zoneKey = zone.key;
        button.innerHTML = `
          <div class="sc-zone-chip__icon">${iconMarkup(zone.icon)}</div>
          <div class="sc-zone-chip__copy">
            <strong>${zone.name}</strong>
            <span>${zone.short}</span>
          </div>
        `;
        button.addEventListener('click', () => open(zone.key));
        zoneStripButtons.push(button);
        strip.appendChild(button);
      });

      const portalTabs = header.querySelector('.portal-tabs');
      if (portalTabs) {
        header.insertBefore(strip, portalTabs);
      } else {
        header.appendChild(strip);
      }
    }

    function renderZones() {
      const zonesWrap = root.querySelector('#scJourneyZones');
      const pathWrap = root.querySelector('#scJourneyPath');

      pathWrap.innerHTML = ZONES.map((zone) => `
        <div class="sc-journey__node${zone.key === focusZoneKey ? ' is-focus' : ''}" style="--zone-rgb:${zone.rgb};">
          <strong>${zone.name}</strong>
          <span>${zone.label}</span>
        </div>
      `).join('');

      zonesWrap.innerHTML = ZONES.map((zone) => `
        <section class="sc-zone-card${zone.key === focusZoneKey ? ' is-focus' : ''}" style="--zone-rgb:${zone.rgb};" data-zone-card="${zone.key}">
          <div class="sc-zone-card__head">
            <div class="sc-zone-card__icon">${iconMarkup(zone.icon)}</div>
            <div class="sc-zone-card__eyebrow">${zone.label}</div>
            <div class="sc-zone-card__title">
              <strong>${zone.name}</strong>
              ${zone.key === 'start' ? '<span>Recommended</span>' : ''}
            </div>
            <p class="sc-zone-card__copy">${zone.short}</p>
          </div>
          <div class="sc-zone-card__portals">
            ${zone.portals.map((mode) => {
              const portal = getPortalEntry(mode);
              const meta = getPortalMeta(mode);
              return `
                <article class="sc-portal-card" style="--portal-rgb:${portal.accentRgb};">
                  <div class="sc-portal-card__head">
                    <div class="sc-portal-card__icon">${iconMarkup(portal.icon)}</div>
                    <div class="sc-portal-card__copy">
                      <strong>${meta.name}</strong>
                      <p>${meta.short}</p>
                    </div>
                  </div>
                  <button type="button" data-enter-portal="${mode}">Enter</button>
                </article>
              `;
            }).join('')}
          </div>
        </section>
      `).join('');

      Array.from(zonesWrap.querySelectorAll('[data-enter-portal]')).forEach((button) => {
        button.addEventListener('click', () => {
          close(true, button.dataset.enterPortal);
        });
      });
    }

    function mount() {
      mountHeaderStrip();
      if (root) return;
      root = createElement('div', 'sc-journey');
      root.innerHTML = `
        <div class="sc-journey__backdrop"></div>
        <div class="sc-journey__shell" role="dialog" aria-modal="true" aria-labelledby="scJourneyTitle">
          <div class="sc-journey__topbar">
            <div class="sc-journey__brand">
              <span>${TEXT.journey.brand}</span>
              <strong>${TEXT.journey.brandLine}</strong>
            </div>
            <div class="sc-journey__controls">
              <button type="button" id="scJourneyReplayLaunch">${TEXT.journey.replayLaunch}</button>
              <button type="button" id="scJourneyCloseTop">${TEXT.journey.close}</button>
            </div>
          </div>
          <div class="sc-journey__hero">
            <h2 id="scJourneyTitle">${TEXT.journey.title}</h2>
            <p>${TEXT.journey.body}</p>
            <div class="sc-chip">${TEXT.journey.recommendation}</div>
          </div>
          <div class="sc-journey__path" id="scJourneyPath"></div>
          <div class="sc-journey__zones" id="scJourneyZones"></div>
          <div class="sc-journey__controls">
            <button type="button" id="scJourneyOpenGuide">${TEXT.journey.openStart}</button>
            <button type="button" id="scJourneyClose">${TEXT.journey.close}</button>
            <div class="sc-journey__footer-note">${TEXT.journey.recommendation}</div>
          </div>
        </div>
      `;
      body.appendChild(root);

      root.querySelector('#scJourneyReplayLaunch').addEventListener('click', () => {
        close(false);
        window.setTimeout(() => LaunchIntro.open(true), 80);
      });
      root.querySelector('#scJourneyCloseTop').addEventListener('click', () => close(false));
      root.querySelector('#scJourneyClose').addEventListener('click', () => close(false));
      root.querySelector('#scJourneyOpenGuide').addEventListener('click', () => close(true, 'guide'));
      root.querySelector('.sc-journey__backdrop').addEventListener('click', () => close(false));
      renderZones();
    }

    function open(zoneKey) {
      mount();
      if (OverlayManager.isBusy() && !OverlayManager.isActive(root)) return;
      focusZoneKey = zoneKey || 'start';
      renderZones();
      root.classList.add('is-open');
      OverlayManager.open(root, () => close(false));
      const target = root.querySelector(`[data-zone-card="${focusZoneKey}"]`);
      if (target) {
        target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }

    function close(enter, mode) {
      if (!root || !root.classList.contains('is-open')) return;
      root.classList.remove('is-open');
      OverlayManager.close(root);
      if (enter && mode) {
        window.setTimeout(() => enterPortal(mode), 80);
        return;
      }
      window.setTimeout(() => PortalIntro.maybeOpen(getActiveMode()), 140);
    }

    function syncActive(zoneKey) {
      zoneStripButtons.forEach((button) => {
        button.classList.toggle('is-recommended', button.dataset.zoneKey === 'start');
        button.setAttribute('aria-current', button.dataset.zoneKey === zoneKey ? 'true' : 'false');
      });
    }

    return {
      mount,
      open,
      close,
      syncActive
    };
  })();

  const LaunchIntro = (function () {
    let root;
    let progressBar;
    let eyebrowEl;
    let titleEl;
    let leadEl;
    let chipsEl;
    let metricEl;
    let subtitleEl;
    let sceneCountEl;
    let continueButton;
    let muteButton;
    let subtitlesButton;
    let activeIndex = 0;
    let timerId = null;
    let muted = false;
    let subtitlesVisible = true;

    function clearTimer() {
      if (timerId) {
        window.clearTimeout(timerId);
        timerId = null;
      }
    }

    function cancelSpeech() {
      if (!supportsSpeech) return;
      window.speechSynthesis.cancel();
    }

    function speakScene(scene) {
      cancelSpeech();
      if (!supportsSpeech || muted || prefersReducedMotion.matches) return;
      const utterance = new SpeechSynthesisUtterance(scene.narration);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.65;
      window.setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          return null;
        }
        return utterance;
      }, 120);
    }

    function scheduleNext() {
      clearTimer();
      timerId = window.setTimeout(() => {
        if (activeIndex >= TEXT.intro.scenes.length - 1) {
          completeAndOpenMap();
        } else {
          renderScene(activeIndex + 1);
        }
      }, prefersReducedMotion.matches ? 5200 : 6400);
    }

    function updateToggles() {
      muteButton.textContent = muted ? TEXT.intro.unmute : TEXT.intro.mute;
      muteButton.setAttribute('aria-pressed', String(!muted));
      subtitlesButton.textContent = subtitlesVisible ? TEXT.intro.subtitlesOn : TEXT.intro.subtitlesOff;
      subtitlesButton.setAttribute('aria-pressed', String(subtitlesVisible));
    }

    function renderScene(index) {
      const scene = TEXT.intro.scenes[index];
      activeIndex = index;
      if (!scene) return;
      root.dataset.scene = scene.id;
      progressBar.style.width = `${((index + 1) / TEXT.intro.scenes.length) * 100}%`;
      eyebrowEl.textContent = scene.eyebrow;
      titleEl.textContent = scene.title;
      leadEl.textContent = scene.lead;
      chipsEl.innerHTML = scene.chips.map((chip) => `<span class="sc-chip">${chip}</span>`).join('');
      metricEl.innerHTML = scene.metrics.map((metric) => `
        <article class="sc-launch__metric">
          <strong>${metric.label}</strong>
          <p>${metric.text}</p>
        </article>
      `).join('');
      subtitleEl.textContent = scene.subtitle;
      subtitleEl.hidden = !subtitlesVisible;
      sceneCountEl.textContent = `${TEXT.intro.sceneLabel} ${index + 1}/${TEXT.intro.scenes.length}`;
      continueButton.textContent = index === TEXT.intro.scenes.length - 1 ? 'Open Map' : TEXT.intro.continue;
      speakScene(scene);
      scheduleNext();
    }

    function mount() {
      if (root) return;
      root = createElement('div', 'sc-launch');
      root.innerHTML = `
        <div class="sc-launch__backdrop"></div>
        <div class="sc-launch__shell" role="dialog" aria-modal="true" aria-labelledby="scLaunchTitle">
          <div class="sc-launch__topbar">
            <div class="sc-launch__brand">
              <span>${TEXT.intro.brand}</span>
              <strong>${TEXT.intro.brandLine}</strong>
            </div>
            <div class="sc-progress" aria-hidden="true"><span id="scLaunchProgress"></span></div>
          </div>
          <div class="sc-launch__stage">
            <div class="sc-launch__copy">
              <div class="sc-launch__eyebrow" id="scLaunchEyebrow"></div>
              <h2 class="sc-launch__title" id="scLaunchTitle"></h2>
              <p class="sc-launch__lead" id="scLaunchLead"></p>
              <div class="sc-launch__chips" id="scLaunchChips"></div>
            </div>
            <div class="sc-launch__visual">
              <div class="sc-launch__visual-grid">
                <div class="sc-launch__visual-header">
                  <strong>${TEXT.intro.visualLabel}</strong>
                  <span id="scLaunchSceneCount"></span>
                </div>
                <div class="sc-launch__signal">
                  <div class="sc-launch__constellation"></div>
                  <div class="sc-launch__metrics" id="scLaunchMetrics"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="sc-launch__subtitle">
            <div class="sc-launch__subtitle-line" id="scLaunchSubtitle"></div>
            <div class="sc-launch__controls-main">
              <button type="button" id="scLaunchContinue">${TEXT.intro.continue}</button>
            </div>
          </div>
          <div class="sc-launch__controls">
            <div class="sc-launch__controls-side">
              <button type="button" id="scLaunchSkip">${TEXT.intro.skip}</button>
              <button type="button" id="scLaunchReplay">${TEXT.intro.replay}</button>
              <button type="button" id="scLaunchMute">${TEXT.intro.mute}</button>
              <button type="button" id="scLaunchSubtitles">${TEXT.intro.subtitlesOn}</button>
            </div>
          </div>
        </div>
      `;
      body.appendChild(root);

      progressBar = root.querySelector('#scLaunchProgress');
      eyebrowEl = root.querySelector('#scLaunchEyebrow');
      titleEl = root.querySelector('#scLaunchTitle');
      leadEl = root.querySelector('#scLaunchLead');
      chipsEl = root.querySelector('#scLaunchChips');
      metricEl = root.querySelector('#scLaunchMetrics');
      subtitleEl = root.querySelector('#scLaunchSubtitle');
      sceneCountEl = root.querySelector('#scLaunchSceneCount');
      continueButton = root.querySelector('#scLaunchContinue');
      muteButton = root.querySelector('#scLaunchMute');
      subtitlesButton = root.querySelector('#scLaunchSubtitles');

      root.querySelector('#scLaunchSkip').addEventListener('click', completeAndOpenMap);
      root.querySelector('#scLaunchReplay').addEventListener('click', () => renderScene(0));
      continueButton.addEventListener('click', () => {
        if (activeIndex >= TEXT.intro.scenes.length - 1) {
          completeAndOpenMap();
        } else {
          renderScene(activeIndex + 1);
        }
      });
      muteButton.addEventListener('click', () => {
        muted = !muted;
        updateToggles();
        if (muted) {
          cancelSpeech();
        } else {
          speakScene(TEXT.intro.scenes[activeIndex]);
        }
      });
      subtitlesButton.addEventListener('click', () => {
        subtitlesVisible = !subtitlesVisible;
        subtitleEl.hidden = !subtitlesVisible;
        updateToggles();
      });
      root.querySelector('.sc-launch__backdrop').addEventListener('click', completeAndOpenMap);
      updateToggles();
    }

    function close() {
      if (!root || !root.classList.contains('is-open')) return;
      clearTimer();
      cancelSpeech();
      root.classList.remove('is-open');
      OverlayManager.close(root);
    }

    function completeAndOpenMap() {
      safeWrite(STORAGE_KEYS.introComplete, '1');
      close();
      window.setTimeout(() => JourneyMap.open('start'), 90);
    }

    function open(force) {
      mount();
      if (!force && safeRead(STORAGE_KEYS.introComplete, '0') === '1') return;
      if (OverlayManager.isBusy() && !OverlayManager.isActive(root)) return;
      root.classList.add('is-open');
      OverlayManager.open(root, completeAndOpenMap);
      renderScene(0);
    }

    return {
      open
    };
  })();

  const PortalDecks = (function () {
    function buildDeckCard(mode, deck) {
      const entry = getPortalEntry(mode);
      const meta = getPortalMeta(mode);
      const card = createElement('article', 'portal-visual-card sc-portal-deck ui-reveal hover-surface');
      card.dataset.scPortalDeck = mode;
      card.style.setProperty('--deck-rgb', entry.accentRgb);
      card.innerHTML = `
        <div class="sc-portal-deck__head">
          <div class="sc-portal-deck__title">
            <div class="sc-portal-deck__icon">${iconMarkup(entry.icon)}</div>
            <div>
              <strong>3D Visualization Deck</strong>
              <span>${meta.name}</span>
            </div>
          </div>
          <span class="tag">${deck.mode}</span>
        </div>
        <div class="sc-portal-deck__scene" aria-hidden="true">
          <div class="sc-portal-deck__beam"></div>
          <div class="sc-portal-deck__stack">
            <div class="sc-portal-deck__plane sc-portal-deck__plane--back">
              <strong>${deck.layers[0].title}</strong>
              <span>${deck.layers[0].text}</span>
            </div>
            <div class="sc-portal-deck__plane sc-portal-deck__plane--mid">
              <strong>${deck.layers[1].title}</strong>
              <span>${deck.layers[1].text}</span>
            </div>
            <div class="sc-portal-deck__plane sc-portal-deck__plane--front">
              <strong>${deck.layers[2].title}</strong>
              <span>${deck.layers[2].text}</span>
            </div>
          </div>
          <div class="sc-portal-deck__pulse sc-portal-deck__pulse--one"></div>
          <div class="sc-portal-deck__pulse sc-portal-deck__pulse--two"></div>
          <div class="sc-portal-deck__pulse sc-portal-deck__pulse--three"></div>
        </div>
        <div class="sc-portal-deck__note">${deck.note}</div>
        <div class="sc-portal-deck__metrics">
          ${deck.metrics.map((metric) => `
            <div class="sc-portal-deck__metric">
              <div class="sc-portal-deck__metric-head">
                <span>${metric.label}</span>
                <strong>${metric.value}%</strong>
              </div>
              <div class="sc-portal-deck__metric-track"><i style="width:${metric.value}%;"></i></div>
              <p>${metric.text}</p>
            </div>
          `).join('')}
        </div>
      `;
      return card;
    }

    function getInsertionBand(portal) {
      return portal.querySelector('.portal-visual-band');
    }

    function mount() {
      Object.entries(PORTAL_DECKS).forEach(([mode, deck]) => {
        const entry = getPortalEntry(mode);
        const portal = entry.portal;
        if (!portal || portal.querySelector(`[data-sc-portal-deck="${mode}"]`)) return;
        const band = getInsertionBand(portal);
        const card = buildDeckCard(mode, deck);

        if (band) {
          band.appendChild(card);
        } else {
          const wrap = createElement('div', 'portal-visual-band');
          wrap.appendChild(card);
          const anchor = portal.querySelector('.hub-header, .landing-grid, .lab-shell, .hub-wrap');
          if (anchor && anchor.parentNode === portal) {
            anchor.insertAdjacentElement('afterend', wrap);
          } else {
            portal.appendChild(wrap);
          }
        }

        if (typeof window.refreshFuturisticUi === 'function') {
          window.refreshFuturisticUi(portal);
        }
      });
    }

    return {
      mount
    };
  })();

  function decoratePortalButtons() {
    PORTAL_REGISTRY.forEach((entry) => {
      if (!entry.button) return;
      entry.button.style.setProperty('--portal-accent-rgb', entry.accentRgb);
      entry.button.dataset.zoneKey = entry.zone;
    });
  }

  function monitorPortalChanges() {
    let currentMode = getActiveMode();
    let initialSynced = false;
    let rafId = 0;

    function sync(options) {
      const nextMode = getActiveMode();
      const zoneKey = getPortalEntry(nextMode).zone;
      ThemeProvider.setPortalTone(nextMode);
      JourneyMap.syncActive(zoneKey);
      if (!initialSynced || nextMode !== currentMode) {
        currentMode = nextMode;
        window.setTimeout(() => PortalIntro.maybeOpen(nextMode, options), options && options.initial ? 360 : 120);
      }
      initialSynced = true;
    }

    const observer = new MutationObserver(() => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        sync();
      });
    });

    PORTAL_REGISTRY.forEach((entry) => {
      if (entry.portal) {
        observer.observe(entry.portal, { attributes: true, attributeFilter: ['class'] });
      }
    });

    sync({ initial: true });
  }

  ThemeProvider.mount();
  decoratePortalButtons();
  JourneyMap.mount();
  PortalIntro.mount();
  PortalDecks.mount();
  monitorPortalChanges();

  window.setTimeout(() => {
    if (safeRead(STORAGE_KEYS.introComplete, '0') !== '1') {
      LaunchIntro.open(false);
    }
  }, 240);
})();
