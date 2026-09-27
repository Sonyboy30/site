(() => {
  const data = window.PORTFOLIO;
  const $ = (selector) => document.querySelector(selector);
  const panel = $('#detailPanel');
  const backdrop = $('#backdrop');
  const panelContent = $('#panelContent');
  const orb = $('#orb');
  const zone = $('.orb-zone');
  const portals = [...document.querySelectorAll('.portal')];
  let lastFocus = null;
  let dragging = false;
  let pointerStart = null;
  let currentTarget = null;
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeUrl = (value) => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };

  document.querySelectorAll('[data-bind]').forEach((el) => { const key = el.dataset.bind; el.textContent = key === 'footerName' ? `${data.shortName} © ${new Date().getFullYear()}` : data[key] || ''; });
  document.title = `${data.shortName} — Interactive Portfolio`;
  const clock = $('#clock');
  const tick = () => { clock.textContent = new Intl.DateTimeFormat('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }).format(new Date()); };
  tick(); setInterval(tick, 1000);

  const content = {
    about: () => `<span class="panel-kicker">ABOUT ARAV</span><h2>Curious by<br><em>default.</em></h2><div class="panel-copy">${data.about.map(p => `<p>${escape(p)}</p>`).join('')}</div><div class="fact-row"><span>BASED IN</span><strong>${escape(data.location)}</strong></div><div class="fact-row"><span>AT SCHOOL</span><strong>Greenhill School · Class of 2028</strong></div><div class="fact-row"><span>FOCUS</span><strong>Finance · technology · service</strong></div>`,
    work: () => `<span class="panel-kicker">PROJECTS AND EXPERIENCE</span><h2>From idea<br><em>to action.</em></h2><h3 class="list-heading">Initiatives</h3><div class="project-list">${data.initiatives.map(p => { const url=safeUrl(p.url); return `<article class="project"><div class="project-top"><span>${escape(p.number)} / ${escape(p.category)}</span>${url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escape(p.title)}">↗</a>` : `<span>✳</span>`}</div><h3>${escape(p.title)}</h3><p>${escape(p.description)}</p></article>`; }).join('')}</div><h3 class="list-heading">Internships & experience</h3><div class="experience-list">${data.experience.map(e => `<article class="experience"><span>${escape(e.period)}</span><h3>${escape(e.title)}</h3><strong>${escape(e.role)}</strong><p>${escape(e.description)}</p></article>`).join('')}</div>`,
    honors: () => `<span class="panel-kicker">AWARDS AND CERTIFICATES</span><h2>Proof of<br><em>the work.</em></h2><p class="panel-copy">A few milestones from the work I’ve put into finance and business.</p><h3 class="list-heading">Awards</h3><div class="honors-list">${data.awards.map(a => { const url=safeUrl(a.url); return `<article class="award"><span class="award-symbol" aria-hidden="true">✦</span><div><span class="award-date">${escape(a.date)} · ${escape(a.issuer)}</span><h3>${escape(a.title)}</h3><p>${escape(a.description)}</p>${url ? `<a class="read-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">VIEW AWARD ↗</a>` : ''}</div></article>`; }).join('')}</div><h3 class="list-heading">Certificates</h3><div class="certificate-list">${data.certificates.map(c => { const url=safeUrl(c.url); return `<article class="certificate"><div><span>${escape(c.date)} · ${escape(c.issuer)}</span><h3>${escape(c.title)}</h3></div>${url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escape(c.title)} on LinkedIn">↗</a>` : ''}</article>`; }).join('')}</div>`,
    notes: () => `<span class="panel-kicker">WRITING AND IDEAS</span><h2>In my<br><em>own words.</em></h2><p class="panel-copy">I write about learning finance by doing, the people I meet, and the ideas that stick with me.</p><div class="note-list">${data.writing.map(n => { const url=safeUrl(n.url); return `<article class="note"><span>${escape(n.date)}</span><h3>${escape(n.title)}</h3><p>${escape(n.body)}</p>${url ? `<a class="read-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">READ THE PIECE ↗</a>` : ''}</article>`; }).join('')}</div><a class="newsletter-link" href="https://soniboy30.substack.com/" target="_blank" rel="noopener noreferrer">VISIT THE NEWSLETTER ↗</a>`,
    contact: () => `<span class="panel-kicker">LET'S CONNECT</span><h2>Say<br><em>hello.</em></h2><p class="panel-copy">Want to talk about education, business, a project, or a partnership? Reach out.</p><a class="email-link" href="mailto:${encodeURIComponent(data.email)}">${escape(data.email)} <span aria-hidden="true">↗</span></a><div class="social-list">${data.socials.map(s => { const url=safeUrl(s.url); return url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(s.label)} <span aria-hidden="true">↗</span></a>` : ''; }).join('')}</div>`
  };
  const indices = { about:'01', work:'02', honors:'03', notes:'04', contact:'05' };
  function openPanel(name) {
    if (!content[name]) return;
    lastFocus = document.activeElement;
    panelContent.innerHTML = content[name]();
    $('#panel-index').textContent = `${indices[name]} / 05`;
    backdrop.hidden = false;
    requestAnimationFrame(() => { backdrop.classList.add('is-visible'); panel.classList.add('is-open'); });
    panel.removeAttribute('inert'); panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('panel-open');
    history.replaceState(null, '', `#${name}`);
    $('#closePanel').focus();
  }
  function closePanel() {
    backdrop.classList.remove('is-visible'); panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true'); panel.setAttribute('inert', '');
    document.body.classList.remove('panel-open');
    if (location.hash !== '#home') history.replaceState(null, '', '#home');
    setTimeout(() => { if (!panel.classList.contains('is-open')) backdrop.hidden = true; }, 350);
    lastFocus?.focus?.();
  }
  document.querySelectorAll('[data-panel]').forEach(el => el.addEventListener('click', () => { if (!dragging) openPanel(el.dataset.panel); }));
  $('#closePanel').addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    if (event.key === 'Tab' && panel.classList.contains('is-open')) {
      const focusable = [...panel.querySelectorAll('a[href],button:not([disabled])')];
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('hashchange', () => { const name = location.hash.slice(1); if (content[name]) openPanel(name); else if (panel.classList.contains('is-open')) closePanel(); });
  if (content[location.hash.slice(1)]) openPanel(location.hash.slice(1));

  // The orb can be dropped on any destination. Taps and keyboards also work.
  orb.addEventListener('click', () => { if (!dragging) openPanel('about'); });
  orb.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    pointerStart = { x:event.clientX, y:event.clientY };
    dragging = false;
    orb.setPointerCapture(event.pointerId);
  });
  orb.addEventListener('pointermove', (event) => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
    if (Math.hypot(dx,dy) < 8 && !dragging) return;
    dragging = true; orb.classList.add('dragging');
    const bounds = zone.getBoundingClientRect();
    const cx = bounds.left + bounds.width/2, cy = bounds.top + bounds.height/2;
    const maxX = bounds.width/2 - 35, maxY = bounds.height/2 - 35;
    orb.style.setProperty('--drag-x', `${Math.max(-maxX,Math.min(maxX,event.clientX-cx))}px`);
    orb.style.setProperty('--drag-y', `${Math.max(-maxY,Math.min(maxY,event.clientY-cy))}px`);
    currentTarget = portals.find(p => { const r=p.getBoundingClientRect(); const x=r.left+r.width/2, y=r.top+r.height/2; return Math.hypot(event.clientX-x,event.clientY-y) < Math.max(r.width,r.height)*.7; }) || null;
    portals.forEach(p => p.classList.toggle('is-target', p === currentTarget));
  });
  const endDrag = () => {
    if (!pointerStart) return;
    pointerStart = null;
    const target = currentTarget; currentTarget = null;
    orb.classList.remove('dragging'); orb.style.setProperty('--drag-x','0px'); orb.style.setProperty('--drag-y','0px');
    portals.forEach(p => p.classList.remove('is-target'));
    if (dragging) { if (target) openPanel(target.dataset.panel); setTimeout(() => { dragging = false; }, 0); }
  };
  orb.addEventListener('pointerup', endDrag);
  orb.addEventListener('pointercancel', endDrag);
})();
