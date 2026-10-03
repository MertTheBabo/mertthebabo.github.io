(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-button');
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  function setTheme(theme) {
    root.dataset.theme = theme;
    const light = theme === 'light';
    if (button) {
      button.setAttribute('aria-label', light ? 'Koyu temaya geç' : 'Açık temaya geç');
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
function closeMenu(){nav?.classList.remove('menu-open'); menu?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-label','Menüyü aç');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç');nav?.classList.toggle('menu-open',open);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const motion=document.querySelector('.motion-button');
motion?.addEventListener('click',()=>{const paused=root.classList.toggle('motion-paused');motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Animasyonları sürdür':'Animasyonları duraklat');motion.querySelector('span').textContent=paused?'▷':'Ⅱ';});
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
