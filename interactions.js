(() => {
  const root = document.documentElement;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => finePointer.matches && !reducedMotion.matches && !root.classList.contains('motion-paused');
  const cleanups = [];
  function attach(element, tilt) {
    let bounds, frame = 0, point;
    if (tilt) {
      element.classList.add('fx-tilt');
      const glow = document.createElement('span');
      glow.className = 'fx-spotlight';
      glow.setAttribute('aria-hidden', 'true');
      element.append(glow);
    }
    function reset() {
      cancelAnimationFrame(frame); frame = 0; bounds = null;
      element.classList.remove('is-hovered');
      ['--fx-rx', '--fx-ry', '--fx-mx', '--fx-my'].forEach(key => element.style.removeProperty(key));
    }
    element.addEventListener('pointerenter', event => {
      if (!enabled() || event.pointerType === 'touch') return;
      bounds = element.getBoundingClientRect();
      element.classList.add('is-hovered');
    });
    element.addEventListener('pointermove', event => {
      if (!enabled() || !bounds) return;
      point = {x: event.clientX - bounds.left, y: event.clientY - bounds.top};
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!enabled() || !bounds) return;
        const x = Math.max(-.5, Math.min(.5, point.x / bounds.width - .5));
        const y = Math.max(-.5, Math.min(.5, point.y / bounds.height - .5));
        if (tilt) {
          element.style.setProperty('--fx-x', point.x + 'px');
          element.style.setProperty('--fx-y', point.y + 'px');
          element.style.setProperty('--fx-rx', -y * 7 + 'deg');
          element.style.setProperty('--fx-ry', x * 9 + 'deg');
        } else {
          element.style.setProperty('--fx-mx', x * 10 + 'px');
          element.style.setProperty('--fx-my', y * 8 - 3 + 'px');
        }
      });
    });
    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
    element.addEventListener('blur', reset);
    cleanups.push(reset);
  }
  document.querySelectorAll('.card,.identity-art,.linkedin-card').forEach(el => attach(el, true));
  document.querySelectorAll('.button,.outline-button').forEach(el => attach(el, false));
  const resetAll = () => cleanups.forEach(reset => reset());
  new MutationObserver(() => { if (!enabled()) resetAll(); }).observe(root, {attributes: true, attributeFilter: ['class']});
  reducedMotion.addEventListener('change', resetAll);
  finePointer.addEventListener('change', resetAll);
  window.addEventListener('blur', resetAll);
  window.addEventListener('resize', resetAll);
  window.addEventListener('scroll', resetAll, {passive: true});
  // Touch feedback keeps normal scrolling, selection, and link navigation intact.
  document.querySelectorAll('.button,.outline-button,.linkedin-card,.github-strip').forEach(el => {
    el.classList.add('fx-tap');
    el.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'touch' || reducedMotion.matches || root.classList.contains('motion-paused') || el.disabled) return;
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'fx-ripple'; ripple.setAttribute('aria-hidden', 'true');
      ripple.style.setProperty('--tap-x', event.clientX - rect.left + 'px');
      ripple.style.setProperty('--tap-y', event.clientY - rect.top + 'px');
      ripple.style.setProperty('--tap-size', Math.max(rect.width, rect.height) * 2 + 'px');
      el.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), {once: true});
      setTimeout(() => ripple.remove(), 800);
    }, {passive: true});
  });
  if ('IntersectionObserver' in window && matchMedia('(max-width: 760px)').matches && !reducedMotion.matches) {
    const mobileReveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('fx-entered'); mobileReveal.unobserve(entry.target); }
    }), {threshold: .08});
    document.querySelectorAll('.resume-item,.message-panel,.github-strip,.resume-identity').forEach((el, index) => {
      el.classList.add('fx-mobile-reveal');
      el.style.setProperty('--reveal-delay', index % 2 * 70 + 'ms');
      mobileReveal.observe(el);
    });
  }
})();
