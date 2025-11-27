// event-calendar.js — логіка календара
import { cute } from '../data.js';

export { cute };

export function initEventCalendar(items) {
  const parentSection = document.querySelector('.event-calendar');
  if (!parentSection) return;

  const ITEMS_PER_PAGE = 20; // 5x4
  const GRID = parentSection.querySelector('.event-calendar__grid');
  const MODAL = parentSection.querySelector('.event-calendar__modal');
  const MODAL_BACKDROP = parentSection.querySelector('.event-calendar__modal-backdrop');
  const MODAL_CLOSE = parentSection.querySelector('.event-calendar__modal-close');
  const MODAL_MEDIA = parentSection.querySelector('.event-calendar__modal-media');
  const BTN_PREV = parentSection.querySelector('.event-calendar__btn-prev');
  const BTN_NEXT = parentSection.querySelector('.event-calendar__btn-next');
  const PAGE_INFO = parentSection.querySelector('.event-calendar__page-info');

  let currentPage = 0;
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  // Очищуємо localStorage при завантаженні (всі спогади стають нетакими)
  localStorage.removeItem('openedMemories');
  const openedMemories = [];

  // SVG Heart inline
  const heartSvg = `<svg class="event-calendar__heart" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>`;

  function renderPage() {
    GRID.innerHTML = '';
    const start = currentPage * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, items.length);

    for (let i = start; i < end; i++) {
      const item = items[i];
      const div = document.createElement('div');
      div.className = 'event-calendar__item';
      div.setAttribute('role', 'gridcell');
      div.innerHTML = heartSvg;

      // Перевіряємо, чи цей спогад вже розкритий
      if (openedMemories.includes(item)) {
        div.classList.add('is-opened');
      }

      div.addEventListener('click', () => {
        if (!div.classList.contains('is-opened')) {
          openModal(item, div);
        }
      });
      GRID.appendChild(div);
    }

    updatePageInfo();
    updateNavigation();
  }

  function updatePageInfo() {
    PAGE_INFO.textContent = `Сторінка ${currentPage + 1} з ${totalPages}`;
  }

  function updateNavigation() {
    BTN_PREV.disabled = currentPage === 0;
    BTN_NEXT.disabled = currentPage === totalPages - 1;
  }

  function openModal(item, itemElement) {
    MODAL_MEDIA.innerHTML = '';
    const isVideo = item.endsWith('.mp4');

    if (isVideo) {
      const video = document.createElement('video');
      video.src = item;
      video.controls = true;
      video.autoplay = true;
      MODAL_MEDIA.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item;
      img.alt = 'Медіа';
      MODAL_MEDIA.appendChild(img);
    }

    MODAL.classList.add('is-active');
    MODAL.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Додаємо спогад до списку розкритих
    if (!openedMemories.includes(item)) {
      openedMemories.push(item);
      localStorage.setItem('openedMemories', JSON.stringify(openedMemories));

      // Оновлюємо стан ячейки
      if (itemElement) {
        itemElement.classList.add('is-opened');
      }
    }
  }

  function closeModal() {
    MODAL.classList.remove('is-active');
    MODAL.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    MODAL_MEDIA.innerHTML = '';
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      renderPage();
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    }
  }

  // Event listeners
  BTN_NEXT.addEventListener('click', nextPage);
  BTN_PREV.addEventListener('click', prevPage);
  MODAL_CLOSE.addEventListener('click', closeModal);
  MODAL_BACKDROP.addEventListener('click', closeModal);

  // Закриття за ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && MODAL.classList.contains('is-active')) {
      closeModal();
    }
  });

  // Keyboard navigation (стрілки)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  });

  // Перша рендеризація
  renderPage();
}
