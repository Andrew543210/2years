// counter.js — живий лічильник часу з 28.11.2023 20:00 (Київ)
(function(){
  // Визначаємо parentSection для роботи при динамічному підвантаженні
  const parentSection = document.querySelector('.counter');
  if(!parentSection) return;

  // Початкова дата: 28 листопада 2023, 20:00 Київ (UTC+2)
  // Date.UTC(2023, 10, 28, 18, 0, 0) => 18:00 UTC = 20:00 Київ
  const targetDate = new Date(Date.UTC(2023, 10, 28, 18, 0, 0));

  const elDays = parentSection.querySelector('.counter__cell[data-key="days"] .counter__value');
  const elHours = parentSection.querySelector('.counter__cell[data-key="hours"] .counter__value');
  const elMinutes = parentSection.querySelector('.counter__cell[data-key="minutes"] .counter__value');
  const elSeconds = parentSection.querySelector('.counter__cell[data-key="seconds"] .counter__value');

  if(!elDays || !elHours || !elMinutes || !elSeconds) return;

  let prev = { d: null, h: null, m: null, s: null };

  function computeParts(diffMs){
    const totalSeconds = Math.floor(diffMs / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);
    return { days, hours, minutes, seconds };
  }

  function formatNumber(n){
    return String(n).padStart(2,'0');
  }

  // Відключаємо анімацію зміни цифр
  function markNew(el){ /* no animation */ }

  function update(){
    const now = new Date();
    // Використовуємо UTC для коректного відліку незалежно від локального timezone
    const nowUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    let diff = nowUtc - targetDate.getTime();
    if(diff < 0) diff = 0;

    const p = computeParts(diff);

    if(p.days !== prev.d){
      elDays.textContent = formatNumber(p.days);
      prev.d = p.days;
    }
    if(p.hours !== prev.h){
      elHours.textContent = formatNumber(p.hours);
      prev.h = p.hours;
    }
    if(p.minutes !== prev.m){
      elMinutes.textContent = formatNumber(p.minutes);
      prev.m = p.minutes;
    }
    if(p.seconds !== prev.s){
      elSeconds.textContent = formatNumber(p.seconds);
      prev.s = p.seconds;
    }
  }

  // Початкове оновлення і інтервал
  update();
  setInterval(update, 1000);

  // Accessibility: прихований aria-live регіон (role="status") для повного опису
  let ariaLive = parentSection.querySelector('.counter__aria');
  if (!ariaLive) {
    ariaLive = document.createElement('div');
    ariaLive.setAttribute('role', 'status');
    ariaLive.setAttribute('aria-live', 'polite');
    ariaLive.setAttribute('aria-atomic', 'true');
    ariaLive.className = 'visually-hidden counter__aria';
    parentSection.appendChild(ariaLive);
  }

  setInterval(()=>{
    const now = new Date();
    const nowUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    let diff = nowUtc - targetDate.getTime();
    if(diff < 0) diff = 0;
    const p = computeParts(diff);
    if (ariaLive) ariaLive.textContent = `${p.days} днів, ${p.hours} годин, ${p.minutes} хвилин, ${p.seconds} секунд`;
  }, 1000);
})();
