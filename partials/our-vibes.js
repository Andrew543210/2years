// partials/our-vibes.js — Рендерить 5x4 грід з відео та відкриває їх fullscreen при кліку
import { vibes } from '../data.js';

export { vibes };

export function initOurVibes(items){
  const parent = document.querySelector('.our-vibes');
  if(!parent) return;

  const GRID = parent.querySelector('.our-vibes__grid');
  if(!GRID) return;

  const maxCount = 20; // 5 * 4
  const list = (items && items.length) ? items.slice(0, maxCount) : [];

  function createThumb(src, idx){
    const wrapper = document.createElement('button');
    wrapper.className = 'our-vibes__item';
    wrapper.type = 'button';
    wrapper.setAttribute('aria-label', `Відео ${idx+1}`);
    wrapper.tabIndex = 0;

    const video = document.createElement('video');
    video.src = src;
    video.preload = 'metadata';
    video.muted = true; // без звуку у гріді
    video.playsInline = true;
    video.controls = false;
    video.loop = true; // для невеличкої анімації
    video.className = 'our-vibes__thumb-video';

    // маленька автопідгрузка — спробувати відтворювати тихенько для показу руху
    video.addEventListener('loadedmetadata', ()=>{
      try{ video.play().catch(()=>{}); }catch(e){}
    });

    const overlay = document.createElement('div');
    overlay.className = 'our-vibes__overlay';
    overlay.innerHTML = `<div class="our-vibes__play-hint" aria-hidden="true">▶</div>`;

    wrapper.appendChild(video);
    wrapper.appendChild(overlay);

    // При кліку — відкриваємо fullscreen і показуємо відео спочатку
    wrapper.addEventListener('click', (e)=>{
      e.preventDefault();
      openFullscreenPlayer(src);
    });

    return wrapper;
  }

  function openFullscreenPlayer(src){
    // Створюємо обгортку
    const wrapper = document.createElement('div');
    wrapper.className = 'our-vibes__fs-wrapper';

    const video = document.createElement('video');
    video.className = 'our-vibes__fs-video';
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.muted = true; // згідно вимоги — без звуку
    video.playsInline = true;
    video.currentTime = 0;

    wrapper.appendChild(video);
    document.body.appendChild(wrapper);

    // Запит fullscreen (користувацька дія вже є) і програвання
    const enter = () => {
      if(video.requestFullscreen){
        video.requestFullscreen().catch(()=>{});
      }
      video.play().catch(()=>{});
    };

    enter();

    // Закриття при ESC або клік по фоні
    function cleanup(){
      try{ if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); }catch(e){}
      video.pause();
      wrapper.remove();
      document.removeEventListener('keydown', onKey);
      wrapper.removeEventListener('click', onWrapperClick);
      document.removeEventListener('fullscreenchange', onFSChange);
    }

    function onKey(e){ if(e.key === 'Escape') cleanup(); }
    function onWrapperClick(e){ if(e.target === wrapper) cleanup(); }
    function onFSChange(){ if(!document.fullscreenElement) cleanup(); }

    document.addEventListener('keydown', onKey);
    wrapper.addEventListener('click', onWrapperClick);
    document.addEventListener('fullscreenchange', onFSChange);
  }

  // Очищуємо і рендеримо список
  GRID.innerHTML = '';
  if(list.length === 0){
    GRID.innerHTML = '<div class="our-vibes__hint">Матеріали відсутні</div>';
    return;
  }

  list.forEach((src, i) => {
    const node = createThumb(src, i);
    GRID.appendChild(node);
  });
}
