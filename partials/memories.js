// memories.js — карусель легендарних спогадів з підтримкою фото та відео
import { legendary } from '../data.js';

export { legendary };

export function initMemories(items) {
  const parent = document.querySelector('.memories');
  if (!parent) return;

  const track = parent.querySelector('.memories__track');
  const dotsContainer = parent.querySelector('.memories__dots');
  const btnPrev = parent.querySelector('.memories__nav--prev');
  const btnNext = parent.querySelector('.memories__nav--next');

  if (!track || !dotsContainer || !btnPrev || !btnNext) return;

  const slides = items && items.length ? items : [];
  if (slides.length === 0) {
    track.innerHTML = '<div class="memories__empty">Спогади відсутні</div>';
    return;
  }

  let currentIndex = 0;

  // Створення слайдів
  function createSlide(src, index) {
    const slide = document.createElement('div');
    slide.className = 'memories__slide';
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', `Спогад ${index + 1} з ${slides.length}`);

    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'memories__media-wrapper';

    const isVideo = src.toLowerCase().endsWith('.mp4') || 
                   src.toLowerCase().endsWith('.webm') || 
                   src.toLowerCase().endsWith('.mov');

    if (isVideo) {
      const video = document.createElement('video');
      video.src = src;
      video.preload = 'metadata';
      video.playsInline = true;
      video.loop = false;
      video.controls = false;
      video.muted = true;

      // Play overlay
      const overlay = document.createElement('div');
      overlay.className = 'memories__play-overlay';
      overlay.innerHTML = '<div class="memories__play-icon"></div>';
      overlay.setAttribute('aria-label', 'Відтворити відео');

      mediaWrapper.appendChild(video);
      mediaWrapper.appendChild(overlay);

      // Клік для відкриття модального вікна з відео
      mediaWrapper.addEventListener('click', () => {
        openVideoModal(src);
      });

      mediaWrapper.style.cursor = 'pointer';
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Спогад ${index + 1}`;
      img.loading = index === 0 ? 'eager' : 'lazy';
      mediaWrapper.appendChild(img);
    }

    slide.appendChild(mediaWrapper);
    return slide;
  }

  // Створення dots
  function createDot(index) {
    const dot = document.createElement('button');
    dot.className = 'memories__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Перейти до спогаду ${index + 1}`);
    dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    
    if (index === 0) {
      dot.classList.add('is-active');
    }

    dot.addEventListener('click', () => {
      goToSlide(index);
    });

    return dot;
  }

  // Рендеринг слайдів і dots
  slides.forEach((src, i) => {
    const slide = createSlide(src, i);
    track.appendChild(slide);

    const dot = createDot(i);
    dotsContainer.appendChild(dot);
  });

  // Навігація
  function goToSlide(index, immediate = false) {
    // Нескінченне прокручування
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    currentIndex = index;
    const offset = -currentIndex * 100;
    
    if (immediate) {
      track.style.transition = 'none';
      track.style.transform = `translateX(${offset}%)`;
      // Відновлення transition після завершення
      setTimeout(() => {
        track.style.transition = '';
      }, 50);
    } else {
      track.style.transform = `translateX(${offset}%)`;
    }

    // Оновлення dots
    const allDots = dotsContainer.querySelectorAll('.memories__dot');
    allDots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('is-active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('is-active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    // Оновлення aria-label для навігаційних кнопок (кнопки завжди активні)
    btnPrev.setAttribute('aria-label', `Попереднє (${currentIndex + 1} з ${slides.length})`);
    btnNext.setAttribute('aria-label', `Наступне (${currentIndex + 1} з ${slides.length})`);
  }

  // Кнопки навігації
  btnPrev.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });

  btnNext.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
  });

  // Keyboard navigation
  parent.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        goToSlide(currentIndex + 1);
      } else if (diff < 0) {
        // Swipe right - prev
        goToSlide(currentIndex - 1);
      }
    }
  }

  // Модальне вікно для відео
  function openVideoModal(src) {
    // Створюємо модальне вікно
    const modal = document.createElement('div');
    modal.className = 'memories__modal is-open';

    const modalContent = document.createElement('div');
    modalContent.className = 'memories__modal-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'memories__modal-close';
    closeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeBtn.setAttribute('aria-label', 'Закрити відео');

    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(video);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Відтворення відео
    video.play().catch(() => {});

    // Закриття модального вікна
    function closeModal() {
      video.pause();
      modal.classList.remove('is-open');
      setTimeout(() => {
        modal.remove();
      }, 300);
      document.removeEventListener('keydown', onEscape);
    }

    function onEscape(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', onEscape);
  }

  // Ініціалізація
  goToSlide(0);
}
