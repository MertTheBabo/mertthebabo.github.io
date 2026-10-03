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
    setTheme(theme);
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
 const sections=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)nav?.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+e.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-20% 0px -55% 0px'});
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
