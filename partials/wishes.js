// wishes.js — логіка інтерактивного календаря побажань

import { wishes } from '../data.js';

(function() {
  'use strict';

  // Отримуємо DOM елементи
  const calendar = document.querySelector('.wishes__calendar');
  const messageArea = document.querySelector('.wishes__message');

  // Перевірка наявності елементів
  if (!calendar || !messageArea || !wishes || wishes.length === 0) {
    console.error('Wishes: Required elements or data not found');
    return;
  }

  // Стан відкритих ячейок (тепер скидається при оновленні сторінки)
  let revealedCells = [];

  /**
   * Створює сітку календаря з ячейками
   */
  function createCalendar() {
    const fragment = document.createDocumentFragment();

    wishes.forEach((wish, index) => {
      const cell = document.createElement('button');
      cell.className = 'wishes__cell';
      cell.textContent = index + 1;
      cell.setAttribute('aria-label', `Побажання ${index + 1}`);
      cell.dataset.index = index;

      // Якщо ячейка вже відкрита, додаємо клас
      if (revealedCells.includes(index)) {
        cell.classList.add('is-revealed');
      }

      // Додаємо обробник події
      cell.addEventListener('click', () => handleCellClick(index, cell));

      fragment.appendChild(cell);
    });

    calendar.appendChild(fragment);
  }

  /**
   * Обробляє клік по ячейці
   */
  function handleCellClick(index, cell) {
    // Якщо ячейка вже відкрита, не робимо нічого
    if (revealedCells.includes(index)) {
      showWish(wishes[index]);
      return;
    }

    // Додаємо індекс до відкритих
    revealedCells.push(index);

    // Додаємо клас з анімацією
    cell.classList.add('is-revealed');

    // Показуємо побажання з невеликою затримкою для плавності
    setTimeout(() => {
      showWish(wishes[index]);
    }, 200);

    // Додаємо тактильний відгук (якщо підтримується)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  /**
   * Показує побажання в area повідомлень
   */
  function showWish(wishText) {
    // Спочатку приховуємо попереднє повідомлення
    messageArea.classList.remove('is-visible');

    setTimeout(() => {
      // Очищаємо попередній вміст
      messageArea.innerHTML = '';

      // Створюємо новий текст
      const messageText = document.createElement('div');
      messageText.className = 'wishes__message-text';
      messageText.textContent = wishText;

      messageArea.appendChild(messageText);

      // Показуємо з анімацією fade-in
      requestAnimationFrame(() => {
        messageArea.classList.add('is-visible');
      });
    }, 300);
  }

  /**
   * Показує початкове повідомлення
   */
  function showInitialMessage() {
    const messageText = document.createElement('div');
    messageText.className = 'wishes__message-text';
    messageText.textContent = 'Натисни на будь-яку ячейку, щоб відкрити побажання 💫';
    messageArea.appendChild(messageText);
    messageArea.classList.add('is-visible');
  }

  /**
   * Функція скидання (для розробки/тестування)
   * Викликати в консолі: window.resetWishes()
   */
  window.resetWishes = function() {
    if (confirm('Скинути всі відкриті побажання?')) {
      // Перезавантажуємо сторінку для чистого стану
      location.reload();
    }
  };

  /**
   * Ініціалізація модуля
   */
  function init() {
    createCalendar();
    showInitialMessage();

    console.log('✨ Wishes calendar initialized');
    console.log(`📊 Revealed: ${revealedCells.length}/${wishes.length}`);
  }

  // Запускаємо ініціалізацію
  init();

})();
