import { readFile } from "node:fs/promises";
import path from "node:path";

const PORTAL_FILE = path.join(process.cwd(), "public", "portal", "index.html");

const SMART_NAV_STYLE = String.raw`
<style id="sciloop-smart-navigation-styles">
  .portal-tabs.sciloop-smart-nav {
    position: fixed;
    z-index: 1200;
    left: 18px;
    top: 50%;
    width: 72px;
    max-height: min(78vh, 720px);
    margin: 0;
    padding: 12px 10px;
    overflow: hidden auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 8px;
    border-radius: 22px;
    transform: translateY(-50%);
    transition: width 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms ease, background 220ms ease;
    scrollbar-width: thin;
  }

  .portal-tabs.sciloop-smart-nav:hover,
  .portal-tabs.sciloop-smart-nav:focus-within,
  .portal-tabs.sciloop-smart-nav[data-expanded="true"] {
    width: 264px;
    background:
      linear-gradient(180deg, rgba(7, 22, 38, 0.96), rgba(4, 12, 22, 0.94)),
      radial-gradient(circle at top, rgba(123, 228, 255, 0.1), transparent 56%);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42), 0 0 0 1px rgba(123, 228, 255, 0.14);
  }

  @media (min-width: 901px) {
    body:has(.portal-tabs.sciloop-smart-nav) {
      padding-left: 96px;
    }
  }

  .portal-tabs.sciloop-smart-nav .portal-btn,
  .portal-tabs.sciloop-smart-nav .sciloop-nav-toggle {
    flex: 0 0 auto;
    min-height: 42px;
    width: 100%;
    margin: 0;
    border-radius: 14px;
    white-space: nowrap;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .portal-tabs.sciloop-smart-nav .portal-btn {
    font-size: 0;
    padding: 10px 12px;
  }

  .portal-tabs.sciloop-smart-nav .portal-btn::before {
    content: attr(data-short-label);
    display: block;
    color: currentColor;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-align: center;
  }

  .portal-tabs.sciloop-smart-nav:hover .portal-btn,
  .portal-tabs.sciloop-smart-nav:focus-within .portal-btn,
  .portal-tabs.sciloop-smart-nav[data-expanded="true"] .portal-btn {
    font-size: 0.7rem;
    letter-spacing: 0.06em;
  }

  .portal-tabs.sciloop-smart-nav:hover .portal-btn::before,
  .portal-tabs.sciloop-smart-nav:focus-within .portal-btn::before,
  .portal-tabs.sciloop-smart-nav[data-expanded="true"] .portal-btn::before {
    display: none;
  }

  .portal-tabs.sciloop-smart-nav .sciloop-nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 12px;
    border: 1px solid rgba(123, 228, 255, 0.22);
    background: rgba(123, 228, 255, 0.08);
    color: #e6faff;
    cursor: pointer;
    font: inherit;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .portal-tabs.sciloop-smart-nav .sciloop-nav-toggle::before {
    content: "☰";
    font-size: 1rem;
    line-height: 1;
  }

  .portal-tabs.sciloop-smart-nav:hover .sciloop-nav-toggle::before,
  .portal-tabs.sciloop-smart-nav:focus-within .sciloop-nav-toggle::before,
  .portal-tabs.sciloop-smart-nav[data-expanded="true"] .sciloop-nav-toggle::before {
    content: "×";
    margin-right: 8px;
    font-size: 1.25rem;
  }

  .portal-tabs.sciloop-smart-nav .sciloop-nav-toggle-label {
    display: none;
  }

  .portal-tabs.sciloop-smart-nav:hover .sciloop-nav-toggle-label,
  .portal-tabs.sciloop-smart-nav:focus-within .sciloop-nav-toggle-label,
  .portal-tabs.sciloop-smart-nav[data-expanded="true"] .sciloop-nav-toggle-label {
    display: inline;
  }

  @media (max-width: 900px) {
    .portal-tabs.sciloop-smart-nav {
      left: 10px;
      right: 10px;
      bottom: 10px;
      top: auto;
      width: auto;
      max-height: min(58vh, 480px);
      padding: 8px;
      flex-direction: row;
      align-items: center;
      transform: none;
      border-radius: 18px;
    }

    .portal-tabs.sciloop-smart-nav[data-expanded="true"] {
      align-items: stretch;
      flex-wrap: wrap;
    }

    .portal-tabs.sciloop-smart-nav .portal-btn,
    .portal-tabs.sciloop-smart-nav .sciloop-nav-toggle {
      width: auto;
      min-width: 44px;
      min-height: 42px;
      flex: 1 1 44px;
      text-align: center;
    }

    .portal-tabs.sciloop-smart-nav[data-expanded="true"] .portal-btn,
    .portal-tabs.sciloop-smart-nav[data-expanded="true"] .sciloop-nav-toggle {
      flex-basis: 132px;
    }

    .portal-tabs.sciloop-smart-nav .portal-btn {
      padding-inline: 8px;
    }

    .portal-tabs.sciloop-smart-nav:hover .portal-btn,
    .portal-tabs.sciloop-smart-nav:focus-within .portal-btn {
      font-size: 0;
    }

    .portal-tabs.sciloop-smart-nav:hover .portal-btn::before,
    .portal-tabs.sciloop-smart-nav:focus-within .portal-btn::before {
      display: block;
    }

    .portal-tabs.sciloop-smart-nav[data-expanded="true"] .portal-btn {
      font-size: 0.66rem;
    }

    .portal-tabs.sciloop-smart-nav[data-expanded="true"] .portal-btn::before {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .portal-tabs.sciloop-smart-nav,
    .portal-tabs.sciloop-smart-nav .portal-btn,
    .portal-tabs.sciloop-smart-nav .sciloop-nav-toggle {
      transition: none;
    }
  }
</style>`;

const SMART_NAV_SCRIPT = String.raw`<script id="sciloop-smart-navigation">
(() => {
  const initSmartNavigation = () => {
    const nav = document.querySelector('.portal-tabs');
    if (!nav || nav.dataset.smartNavigationReady === 'true') return;

    nav.classList.add('sciloop-smart-nav');
    nav.dataset.smartNavigationReady = 'true';
    nav.dataset.expanded = 'false';
    nav.setAttribute('aria-label', 'SciLoop portal navigation');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'sciloop-nav-toggle';
    toggle.setAttribute('aria-controls', 'sciloop-portal-navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Expand SciLoop navigation');
    const toggleLabel = document.createElement('span');
    toggleLabel.className = 'sciloop-nav-toggle-label';
    toggleLabel.textContent = 'Navigation';
    toggle.append(toggleLabel);
    nav.id = 'sciloop-portal-navigation';
    nav.prepend(toggle);

    const shortLabels = {
      nexusTab: 'Home',
      frontierTab: 'Frontier',
      newsTab: 'Live',
      universalVisualTab: 'Visuals',
      labTab: 'Lab',
      localTab: 'Solve',
      feedbackTab: 'Feedback',
    };

    nav.querySelectorAll('.portal-btn').forEach((button) => {
      const label = button.textContent.trim();
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.dataset.shortLabel = shortLabels[button.id] || label.slice(0, 8);
    });

    let collapseTimer;
    const setExpanded = (expanded) => {
      window.clearTimeout(collapseTimer);
      nav.dataset.expanded = String(expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-label', expanded ? 'Collapse SciLoop navigation' : 'Expand SciLoop navigation');
    };
    const collapseSoon = () => {
      window.clearTimeout(collapseTimer);
      collapseTimer = window.setTimeout(() => {
        if (!nav.matches(':hover') && !nav.matches(':focus-within')) setExpanded(false);
      }, 150);
    };

    toggle.addEventListener('click', () => setExpanded(nav.dataset.expanded !== 'true'));
    nav.addEventListener('pointerenter', () => setExpanded(true));
    nav.addEventListener('pointerleave', collapseSoon);
    nav.addEventListener('focusin', () => setExpanded(true));
    nav.addEventListener('focusout', collapseSoon);
    nav.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setExpanded(false);
        toggle.focus();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartNavigation, { once: true });
  } else {
    initSmartNavigation();
  }
})();
</script>`;

function normalizeBase(pathname: string) {
  const base = pathname === "/" ? "/sciloop-live/" : `${pathname.replace(/\/+$/, "")}/`;
  return base.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

export async function getPublicPortalHtml(pathname = "/sciloop-live", requestUrl?: string) {
  const source = await readPortalSource(requestUrl);
  const base = normalizeBase(pathname);

  return source
    .replaceAll("__SCILOOP_PORTAL_BASE__", base)
    .replace(/<\/head>/i, `${SMART_NAV_STYLE}</head>`)
    .replace(
      /<body\b([^>]*)>/i,
      `<body data-sciloop-surface="public-portal"$1><script>window.SCILOOP_PUBLIC_PORTAL = true;</script>${SMART_NAV_SCRIPT}`,
    );
}

async function readPortalSource(requestUrl?: string) {
  // Read the preserved public asset through Vercel's static asset path so a
  // large legacy file is available even when the function tracer omits it.
  try {
    const response = await fetch(new URL("/portal/index.html", requestUrl ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost")), {
      cache: "no-store",
    });
    if (response.ok) return response.text();
  } catch {
    // Local development falls back to the repository filesystem below.
  }

  return readFile(PORTAL_FILE, "utf8");
}
