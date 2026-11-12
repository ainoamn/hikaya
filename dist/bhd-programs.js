(() => {
  const CATALOG_URL = 'https://id.bhd-om.com/api/bhd/catalog';
  const ROOT_ID = 'bhd-programs-root';
  const STYLE_ID = 'bhd-programs-style';

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID}{display:block;margin:0;padding:0}
.bhd-programs{border-top:1px solid rgba(33,91,76,.14);background:linear-gradient(180deg,rgba(33,91,76,.06),transparent);padding:22px 0 8px}
.bhd-programs-inner{max-width:1280px;margin:0 auto;padding:0 52px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 12px}
.bhd-programs-label{font-size:13px;font-weight:700;color:#215b4c;margin-inline-end:4px}
.bhd-program{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;border:1px solid rgba(33,91,76,.18);background:#fff;color:#153f38;font-size:13px;font-weight:600;text-decoration:none;transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease}
.bhd-program:hover{border-color:#215b4c;transform:translateY(-1px);box-shadow:0 6px 16px rgba(33,91,76,.12)}
.bhd-program img{width:20px;height:20px;border-radius:999px;object-fit:cover;display:block}
.bhd-program-mark{width:20px;height:20px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex:0 0 auto}
@media(max-width:800px){.bhd-programs-inner{padding:0 20px;justify-content:flex-start}}
`;
    document.head.appendChild(style);
  }

  function ensureRoot() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;
    root = document.createElement('div');
    root.id = ROOT_ID;
    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(root, footer);
    } else {
      document.body.appendChild(root);
    }
    return root;
  }

  function launchHref(app) {
    if (app.mode === 'identity') {
      return `${(app.origin || 'https://id.bhd-om.com').replace(/\/$/, '')}${app.workspacePath || '/account'}`;
    }
    if (app.startUrl) return app.startUrl;
    return app.homeUrl || app.origin || '#';
  }

  function render(apps) {
    ensureStyles();
    const root = ensureRoot();
    const enabled = (apps || []).filter((app) => app && app.enabled !== false);
    if (!enabled.length) {
      root.innerHTML = '';
      return;
    }

    const chips = enabled
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((app) => {
        const name = app.nameAr || app.nameEn || app.id || 'BHD';
        const accent = app.accent || '#215b4c';
        const mark = (app.mark || name).toString().slice(0, 2);
        const media = app.logoUrl
          ? `<img src="${escapeAttr(app.logoUrl)}" alt="" loading="lazy" width="20" height="20">`
          : `<span class="bhd-program-mark" style="background:${escapeAttr(accent)}">${escapeHtml(mark)}</span>`;
        return `<a class="bhd-program" href="${escapeAttr(launchHref(app))}" style="border-color:${escapeAttr(accent)}33">${media}<span>${escapeHtml(name)}</span></a>`;
      })
      .join('');

    root.innerHTML = `<section class="bhd-programs" aria-label="برامج BHD" dir="rtl"><div class="bhd-programs-inner"><span class="bhd-programs-label">برامج BHD</span>${chips}</div></section>`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  async function loadCatalog() {
    try {
      const response = await fetch(CATALOG_URL, { cache: 'no-store' });
      if (!response.ok) return;
      const body = await response.json();
      render(Array.isArray(body?.apps) ? body.apps : []);
    } catch {
      /* catalog optional on offline pages */
    }
  }

  function boot() {
    ensureStyles();
    ensureRoot();
    void loadCatalog();
    window.addEventListener('bhd-catalog', () => {
      void loadCatalog();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
