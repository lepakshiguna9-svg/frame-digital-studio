(() => {
  const projects = window.FRAME_PROJECTS || [];
  const grid = document.querySelector('#project-grid');
  const count = document.querySelector('#work-count');
  const dialog = document.querySelector('#project-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  const closeDialog = document.querySelector('#dialog-close');
  let previousFocus = null;
  let filterTimer = 0;
  let dialogCloseTimer = 0;

  function renderProjects(filter = 'all') {
    const visible = projects.filter(project => filter === 'all' || project.category === filter);
    grid.innerHTML = visible.map(project => `
      <button class="project-card reveal" type="button" data-project="${project.id}" aria-label="View ${project.title}, ${project.label.toLowerCase()}">
        <span class="project-card__image"><span class="project-card__number">${project.id} / 06</span><img src="${project.image}" alt="${project.alt}" loading="lazy" decoding="async"></span>
        <span class="project-card__meta"><span>${project.label}</span><span>${project.year}</span></span>
        <span class="project-card__title"><span>${project.title}</span><span aria-hidden="true">↗</span></span>
        <span class="project-card__desc">${project.description}</span>
      </button>`).join('');
    count.textContent = `${String(visible.length).padStart(2, '0')} PROJECT${visible.length === 1 ? '' : 'S'}`;
    observeReveals(grid);
  }

  function openProject(id) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    previousFocus = document.activeElement;
    dialogContent.innerHTML = `<p class="dialog-content__meta"><span>${project.id} / 06</span><span>${project.label}</span><span>${project.year}</span></p><h2 id="dialog-title">${project.title}</h2><p class="dialog-content__intro">${project.description}</p><img class="dialog-content__image" src="${project.image}" alt="${project.alt}" decoding="async"><div class="dialog-content__copy"><div><span class="dialog-content__label">A NOTE ON THE WORK</span><p>${project.detail}</p></div><div class="dialog-content__credits"><span class="dialog-content__label">ROLE</span><p>${project.role}</p><span class="dialog-content__label">CREDITS</span><p>${project.credits}</p></div></div>`;
    window.clearTimeout(dialogCloseTimer);
    dialog.classList.remove('is-closing');
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('dialog-open');
    requestAnimationFrame(() => dialog.classList.add('is-open'));
    window.setTimeout(() => closeDialog.focus(), 0);
  }

  function dismissDialog() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.remove('is-open');
    dialog.classList.add('is-closing');
    dialogCloseTimer = window.setTimeout(() => dialog.close(), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
  }

  document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
    document.querySelector('.filter.is-active')?.classList.remove('is-active');
    document.querySelector('.filter[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
    button.classList.add('is-active');
    button.setAttribute('aria-pressed', 'true');
    grid.classList.add('is-filtering');
    window.clearTimeout(filterTimer);
    filterTimer = window.setTimeout(() => {
      renderProjects(button.dataset.filter);
      requestAnimationFrame(() => grid.classList.remove('is-filtering'));
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160);
  }));
  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-project]');
    if (card) openProject(card.dataset.project);
  });
  closeDialog.addEventListener('click', dismissDialog);
  dialog.addEventListener('click', event => { if (event.target === dialog) dismissDialog(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); dismissDialog(); });
  dialog.addEventListener('transitionend', event => {
    if (event.target === dialog && event.propertyName === 'opacity' && dialog.classList.contains('is-closing')) {
      window.clearTimeout(dialogCloseTimer);
      dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    previousFocus?.focus();
  });

  const toggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#site-nav');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    nav.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    toggle.querySelector('.menu-toggle__label').textContent = open ? 'CLOSE' : 'MENU';
    if (open) nav.querySelector('a').focus(); else toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('[data-nav-link]').forEach(link => link.addEventListener('click', () => setMenu(false)));
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('[data-nav-link]').forEach(link => {
          const isCurrent = link.hash === `#${entry.target.id}`;
          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-100px 0px -180px 0px', threshold: 0 });
    document.querySelectorAll('#work, #experiments, #about, #contact').forEach(section => sectionObserver.observe(section));
  }
  document.addEventListener('keydown', event => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { setMenu(false); return; }
    if (event.key === 'Tab') {
      const focusable = [...nav.querySelectorAll('a[href]'), toggle];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  let revealObserver;
  window.observeReveals = root => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
      return;
    }
    if (!('IntersectionObserver' in window)) {
      root.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
      return;
    }
    revealObserver ||= new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
    root.querySelectorAll('.reveal:not(.is-visible)').forEach(element => revealObserver.observe(element));
  };
  renderProjects();
  window.observeReveals(document);

  const intro = document.querySelector('#intro');
  const finishIntro = () => { intro.classList.add('is-done'); window.setTimeout(() => intro.remove(), 1000); };
  document.querySelector('#skip-intro').addEventListener('click', finishIntro);
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('frame-intro-seen') === 'true'; } catch { /* Storage can be unavailable for local files. */ }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || introSeen) {
    finishIntro();
  } else {
    window.setTimeout(finishIntro, 1150);
    try { sessionStorage.setItem('frame-intro-seen', 'true'); } catch { /* The intro still finishes without session storage. */ }
  }
})();
