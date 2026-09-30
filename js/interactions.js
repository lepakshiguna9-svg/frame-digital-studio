(() => {
  const cursor = document.querySelector('.cursor');
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer) {
    let cursorFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    window.addEventListener('pointermove', event => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (cursorFrame) return;
      cursorFrame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
        cursor.classList.add('is-visible');
        cursorFrame = 0;
      });
    }, { passive: true });
    const updateCursorState = targetNode => {
      const target = targetNode instanceof Element ? targetNode.closest('.project-card') : null;
      const navItem = targetNode instanceof Element ? targetNode.closest('.menu-toggle, .nav-overlay a, .filter') : null;
      cursor.classList.toggle('is-large', Boolean(target));
      cursor.classList.toggle('is-nav', Boolean(navItem));
      cursor.querySelector('span').textContent = 'VIEW';
    };
    document.addEventListener('pointerover', event => {
      const from = event.target instanceof Element ? event.target.closest('.project-card, .menu-toggle, .nav-overlay a, .filter') : null;
      const to = event.relatedTarget instanceof Element ? event.relatedTarget.closest('.project-card, .menu-toggle, .nav-overlay a, .filter') : null;
      if (from === to) return;
      updateCursorState(event.target);
    });
    document.addEventListener('pointerout', event => {
      const from = event.target instanceof Element ? event.target.closest('.project-card, .menu-toggle, .nav-overlay a, .filter') : null;
      const to = event.relatedTarget instanceof Element ? event.relatedTarget.closest('.project-card, .menu-toggle, .nav-overlay a, .filter') : null;
      if (from === to) return;
      updateCursorState(event.relatedTarget);
    });
  }

  const field = document.querySelector('#experiment-field');
  const coord = document.querySelector('#field-coord');
  const orb = field.querySelector('.field-orb--one');
  let frame = 0;
  field.addEventListener('pointermove', event => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = field.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
      const y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100));
      orb.style.left = `${x}%`;
      orb.style.top = `${y}%`;
      coord.textContent = `X ${String(Math.round(x)).padStart(2, '0')}   Y ${String(Math.round(y)).padStart(2, '0')}`;
      field.style.backgroundColor = `hsl(${229 + x * .24} 78% ${34 + y * .12}%)`;
    });
  }, { passive: true });
  field.addEventListener('pointerleave', () => {
    orb.style.left = '50%'; orb.style.top = '50%'; coord.textContent = 'X 00   Y 00'; field.style.backgroundColor = '';
  });
})();
