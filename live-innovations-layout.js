(() => {
  'use strict';
  const portal = document.getElementById('newsPortal');
  const feed = portal?.querySelector('#feed');
  const topics = portal?.querySelector('#topics');
  const sidebar = portal?.querySelector('.sidebar');
  const main = portal?.querySelector('.main');
  if (!portal || !feed || !topics || !sidebar || !main) return;

  const controls = document.createElement('div');
  controls.className = 'sciloop-feed-controls';
  controls.setAttribute('role', 'search');
  const subjectButton = document.createElement('button');
  subjectButton.type = 'button';
  subjectButton.textContent = '☰ Subjects';
  subjectButton.setAttribute('aria-expanded', 'false');
  subjectButton.setAttribute('aria-controls', 'topics');
  const activeSubject = document.createElement('span');
  activeSubject.className = 'sciloop-active-subject';
  const search = document.createElement('input');
  search.className = 'sciloop-search';
  search.type = 'search';
  search.placeholder = 'Search live innovations';
  search.setAttribute('aria-label', 'Search visible innovation stories');
  const count = document.createElement('span');
  count.className = 'sciloop-result-count';
  count.setAttribute('aria-live', 'polite');
  const toolsButton = document.createElement('button');
  toolsButton.type = 'button';
  toolsButton.textContent = 'Tools';
  toolsButton.setAttribute('aria-expanded', 'false');
  controls.append(subjectButton, activeSubject, search, count, toolsButton);
  main.insertBefore(controls, main.firstChild);
  const empty = document.createElement('p');
  empty.className = 'sciloop-feed-empty';
  empty.textContent = 'No stories match. Clear search or choose another subject.';
  empty.hidden = true;
  feed.insertAdjacentElement('afterend', empty);

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'sciloop-subject-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('aria-label', 'Close subjects');
  document.body.append(backdrop);
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'sciloop-subject-close';
  closeButton.textContent = 'Close ×';
  sidebar.insertBefore(closeButton, sidebar.firstChild);
  sidebar.classList.add('sciloop-subject-drawer');
  document.body.append(sidebar);
  const edge = document.createElement('button');
  edge.type = 'button';
  edge.className = 'sciloop-subject-edge';
  edge.textContent = 'Subjects';
  edge.setAttribute('aria-label', 'Reveal subjects');
  portal.append(edge);

  let focusBeforeDrawer = null;
  function setSubjects(open) {
    if (open) focusBeforeDrawer = document.activeElement;
    portal.classList.toggle('subjects-open', open);
    sidebar.classList.toggle('is-open', open);
    backdrop.hidden = !open;
    subjectButton.setAttribute('aria-expanded', String(open));
    sidebar.setAttribute('aria-hidden', String(!open));
    if (open) closeButton.focus();
    else if (focusBeforeDrawer?.isConnected) focusBeforeDrawer.focus();
  }
  subjectButton.addEventListener('click', () => setSubjects(!portal.classList.contains('subjects-open')));
  edge.addEventListener('click', () => setSubjects(true));
  edge.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) setSubjects(true); });
  closeButton.addEventListener('click', () => setSubjects(false));
  backdrop.addEventListener('click', () => setSubjects(false));
  portal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && portal.classList.contains('subjects-open')) setSubjects(false);
    if (event.key !== 'Tab' || !portal.classList.contains('subjects-open')) return;
    const choices = [...sidebar.querySelectorAll('button:not([disabled])')];
    const first = choices[0], last = choices[choices.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  let currentSubject = null;
  topics.addEventListener('click', (event) => {
    const chosen = event.target.closest('.topic-btn');
    if (!chosen) return;
    topics.querySelectorAll('.topic-btn.active').forEach((button) => button.classList.remove('active'));
    chosen.classList.add('active');
    currentSubject = chosen.dataset.topicId === 'all-reality'
      ? null
      : chosen.textContent.replace(/\s*\(\d+\)$/, '').replace(/^[A-Z0-9]+\s+/, '').trim();
    queueMicrotask(() => { syncCards(); setSubjects(false); });
  });
  function updateSubject() {
    const chosen = topics.querySelector('.topic-btn.active');
    activeSubject.textContent = chosen?.textContent?.replace(/\s*\(\d+\)$/, '').replace(/^[A-Z0-9]+\s+/, '') || 'All Reality';
  }
  toolsButton.addEventListener('click', () => {
    const open = portal.classList.toggle('tools-open');
    toolsButton.setAttribute('aria-expanded', String(open));
    toolsButton.textContent = open ? 'Hide tools' : 'Tools';
  });

  function syncCards() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    feed.querySelectorAll('article.card').forEach((card) => {
      if (!card.querySelector('.story-toggle')) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'story-toggle';
        toggle.textContent = 'Open story';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', () => {
          const open = card.classList.toggle('story-open');
          toggle.textContent = open ? 'Close story' : 'Open story';
          toggle.setAttribute('aria-expanded', String(open));
        });
        card.append(toggle);
      }
      const subjectMatches = !currentSubject || card.querySelector('.subject-badge')?.textContent?.trim() === currentSubject;
      const matches = subjectMatches && (!query || card.textContent.toLocaleLowerCase().includes(query));
      card.hidden = !matches;
      if (matches) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? 'story' : 'stories'}`;
    empty.hidden = visible !== 0 || !feed.querySelector('article.card');
    updateSubject();
  }
  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => { queued = false; syncCards(); });
  });
  observer.observe(feed, { childList: true });
  observer.observe(topics, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  new MutationObserver(() => {
    if (!portal.classList.contains('active') && portal.classList.contains('subjects-open')) setSubjects(false);
  }).observe(portal, { attributes: true, attributeFilter: ['class'] });
  search.addEventListener('input', syncCards);
  sidebar.setAttribute('aria-hidden', 'true');
  syncCards();
})();
