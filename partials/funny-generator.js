// funny-generator.js — підтягує випадковий елемент із масиву `funny` і показує його
import { funny } from '../data.js';

export { funny };

export function initFunnyGenerator(items){
  const parent = document.querySelector('.funny-generator');
  if(!parent) return;

  const BTN = parent.querySelector('.funny-generator__btn');
  const RESULT = parent.querySelector('.funny-generator__result');

  if(!BTN || !RESULT) return;

  function showItem(src){
    RESULT.innerHTML = '';
    const isVideo = src.endsWith('.mp4');
    if(isVideo){
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.muted = false;
      video.playsInline = true;
      video.className = 'funny-generator__media';
      RESULT.appendChild(video);
      // Додаємо клас для анімації появи після невеликої затримки
      requestAnimationFrame(()=> requestAnimationFrame(()=> video.classList.add('is-new')));
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Смішний спогад';
      img.className = 'funny-generator__media';
      RESULT.appendChild(img);
      requestAnimationFrame(()=> requestAnimationFrame(()=> img.classList.add('is-new')));
    }
    // Оновлюємо доступність
    RESULT.setAttribute('aria-busy','false');
  }

  function pickRandom(){
    if(!items || items.length === 0) return;
    const idx = Math.floor(Math.random() * items.length);
    return items[idx];
  }

  BTN.addEventListener('click', (e)=>{
    e.preventDefault();
    RESULT.setAttribute('aria-busy','true');
    const item = pickRandom();
    if(item) showItem(item);
  });

  // Початковий state: підказка
  if(items && items.length > 0){
    RESULT.innerHTML = '<div class="funny-generator__hint">Натисніть «Усміхнись», щоб побачити випадковий спогад</div>';
  } else {
    RESULT.innerHTML = '<div class="funny-generator__hint">Спогади відсутні</div>';
  }
}
