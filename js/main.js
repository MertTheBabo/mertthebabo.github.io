/* mertthebabo.github.io — tek script dosyası (defer ile yüklenir). */

/* --- Tema, menü, hareket tercihi, reveal, okuma çubuğu, e-posta kopyalama --- */
(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-button');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  function setTheme(theme) {
    root.dataset.theme = theme;
    const light = theme === 'light';
    if (button) {
      const label = light ? 'Koyu temaya geç' : 'Açık temaya geç';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.setAttribute('aria-pressed', String(light));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', light ? '#f3f6f1' : '#090d0c');
  }
  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark'); // tema <head> içinde belirlendi; burada yalnızca buton/meta senkronize edilir
  button?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || root.classList.contains('motion-paused');
    if (document.startViewTransition && !calm) document.startViewTransition(() => setTheme(theme));
    else setTheme(theme);
    try { localStorage.setItem('mert-theme', theme); } catch {}
  });
})();

(() => {
const root = document.documentElement;
const nav = document.getElementById('main-nav');
const menu = document.querySelector('.menu-button');
const isOpen=()=>menu?.getAttribute('aria-expanded')==='true';
function closeMenu(returnFocus){if(!isOpen())return;nav?.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menüyü aç');if(returnFocus)menu.focus();}
function openMenu(){menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Menüyü kapat');nav?.classList.add('menu-open');nav?.querySelector('a')?.focus();}
menu?.addEventListener('click',()=>isOpen()?closeMenu(true):openMenu());
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu(false)));
nav?.addEventListener('focusout',e=>{if(!e.relatedTarget||!e.relatedTarget.closest('#main-nav,.menu-button'))closeMenu(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu(true);});
const motion=document.querySelector('.motion-button');
function setMotion(paused){root.classList.toggle('motion-paused',paused);if(!motion)return;const label=paused?'Animasyonları sürdür':'Animasyonları duraklat';motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',label);motion.title=label;}
setMotion(root.classList.contains('motion-paused')); // tercih <head> içinde uygulandı; burada buton senkronize edilir
motion?.addEventListener('click',()=>{const paused=!root.classList.contains('motion-paused');setMotion(paused);try{localStorage.setItem('mert-motion',paused?'paused':'running');}catch{}});
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}}),{threshold:.08});
 if(!reduced.matches)document.querySelectorAll('.about-main,.section-heading,.card,.contact-row').forEach(el=>{el.classList.add('reveal-ready');reveal.observe(el);});
 const sections=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.querySelectorAll('section[id]').forEach(s=>s.classList.toggle('is-current',s===e.target));if(e.isIntersecting)nav?.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-20% 0px -55% 0px'});
 document.querySelectorAll('section[id]').forEach(el=>sections.observe(el));
}
const progress=document.querySelector('.reading-progress'),back=document.querySelector('.back-top');let queued=false;
function update(){const max=root.scrollHeight-window.innerHeight;progress?.style.setProperty('--progress',(max>0?Math.min(100,window.scrollY/max*100):0)+'%');back?.classList.toggle('visible',window.scrollY>600);queued=false;}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});window.addEventListener('resize',update);update();
if(window.matchMedia('(pointer: fine)').matches&&!reduced.matches)document.querySelectorAll('.card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mouse-x',e.clientX-r.left+'px');card.style.setProperty('--mouse-y',e.clientY-r.top+'px');}));
document.getElementById('print-cv')?.addEventListener('click',()=>window.print());
})();

document.querySelectorAll('.copy-button').forEach(button => {
  const status = button.parentElement.querySelector('.copy-status');
  let timer;
  button.addEventListener('click', async () => {
    const text = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
      status.innerHTML = 'Kopyalandı <span aria-hidden="true">✓</span>';
      clearTimeout(timer);
      timer = setTimeout(() => { status.textContent = ''; }, 1500);
    } catch {
      location.href = 'mailto:' + text; // pano erişimi yoksa e-posta istemcisine düş
    }
  });
});

/* --- Kartlarda eğim/ışık, butonlarda mıknatıs, dokunmatik dalga, mobil reveal --- */
(() => {
  const root = document.documentElement;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const enabled = () => finePointer.matches && !reducedMotion.matches && !root.classList.contains('motion-paused');
  const resets = new Map();
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
    resets.set(element, reset);
  }
  document.querySelectorAll('.card,.identity-art,.linkedin-card').forEach(el => attach(el, true));
  document.querySelectorAll('.button,.outline-button').forEach(el => attach(el, false));
  const resetAll = () => resets.forEach(reset => reset());
  const resetHovered = () => document.querySelectorAll('.is-hovered').forEach(el => resets.get(el)?.());
  new MutationObserver(() => { if (!enabled()) resetAll(); }).observe(root, {attributes: true, attributeFilter: ['class']});
  reducedMotion.addEventListener('change', resetAll);
  finePointer.addEventListener('change', resetAll);
  window.addEventListener('blur', resetAll);
  window.addEventListener('resize', resetAll);
  window.addEventListener('scroll', resetHovered, {passive: true});
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

/* --- İletişim formu (FormSubmit AJAX) --- */
(() => {
const form=document.getElementById('contact-form');
if(!form)return;
const status=document.getElementById('contact-status');
const button=document.getElementById('contact-send');
const name=document.getElementById('contact-name');
const email=document.getElementById('contact-email');
const subject=document.getElementById('contact-subject');
const message=document.getElementById('contact-message');
function validate(){
 name.value=name.value.trim();
 email.value=email.value.trim();
 subject.value=subject.value.trim();
 message.value=message.value.trim();
 message.setCustomValidity(message.value.length<10?'Lütfen en az 10 karakterlik bir mesaj yaz.':'');
 return form.reportValidity();
}
form.addEventListener('input',()=>{
 message.setCustomValidity('');
 status.textContent='';
});
form.addEventListener('submit',async event=>{
 event.preventDefault();
 if(button.disabled||!validate())return;
 if(form.elements._honey.value)return;
 button.disabled=true;
 status.dataset.state='pending';
 status.textContent='Mesajın gönderiliyor, lütfen bekle.';
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch('https://formsubmit.co/ajax/elmacimerterdem@gmail.com',{
   method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal
  });
  const result=await response.json();
  if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('submission');
  status.dataset.state='success';
  status.textContent='Mesajın iletildi. Teşekkür ederim!';
  form.reset();
 }catch(error){
  status.dataset.state='error';
  status.textContent=error.name==='AbortError'
   ?'Gönderim sonucu doğrulanamadı. Tekrar denemeden önce biraz bekle veya doğrudan e-posta gönder.'
   :'Mesaj gönderilemedi. Lütfen tekrar dene veya doğrudan e-posta bağlantısını kullan.';
 }finally{
  clearTimeout(timeout);
  button.disabled=false;
 }
});
})();

/* --- Animasyon performansı --- */
// Hero ve kayan yazı ekran dışındayken animasyonlarını durdur (CSS: .is-offscreen)
if ('IntersectionObserver' in window) {
  const offscreen = new IntersectionObserver(entries => entries.forEach(entry =>
    entry.target.classList.toggle('is-offscreen', !entry.isIntersecting)));
  document.querySelectorAll('.hero, .ticker').forEach(el => offscreen.observe(el));
}
