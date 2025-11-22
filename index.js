// index.js — підвантаження partials та імпорт логіки лічильника

// Підвантаження partial hero
async function loadPartial(id, url, fallbackHtml) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Не вдалося завантажити ' + url);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    return true;
  } catch (err) {
    console.warn(err);
    document.getElementById(id).innerHTML = fallbackHtml;
    return false;
  }
}

// Завантажити hero
loadPartial('hero-root', 'hero.html', `\n<section class="hero" aria-label="Герой — 2 роки разом">\n  <div class="hero__content">\n    <h1 class="hero__title">2 роки разом</h1>\n    <p class="hero__subtitle">Це наша історія</p>\n    <div class="hero__actions">\n      <a class="btn" href="#story" role="button">Переглянути історію</a>\n    </div>\n  </div>\n</section>`);

// Завантажити counter і після вставки імпортувати логіку
loadPartial('counter-root', 'partials/counter.html', `<section class='counter'><div>Лічильник недоступний</div></section>`)
  .then(() => {
    import('./partials/counter.js').catch(e => console.warn('counter.js import error', e));
  });

// Завантажити event-calendar
loadPartial('event-calendar-root', 'partials/event-calendar.html', `<section class='event-calendar'><div>Календар недоступний</div></section>`)
  .then(() => {
    return import('./partials/event-calendar.js');
  })
  .then(({ cute, initEventCalendar }) => {
    initEventCalendar(cute);
  })
  .catch(e => console.warn('event-calendar.js import error', e));

// Завантажити partial "Генератор смішних спогадів"
loadPartial('funny-generator-root', 'partials/funny-generator.html', `<section class='funny-generator'><div>Генератор недоступний</div></section>`)
  .then(() => {
    return import('./partials/funny-generator.js');
  })
  .then(({ funny, initFunnyGenerator }) => {
    initFunnyGenerator(funny);
  })
  .catch(e => console.warn('funny-generator.js import error', e));

// Завантажити partial "Our Vibes"
loadPartial('our-vibes-root', 'partials/our-vibes.html', `<section class='our-vibes'><div>Our Vibes недоступні</div></section>`)
  .then(() => {
    return import('./partials/our-vibes.js');
  })
  .then(({ vibes, initOurVibes }) => {
    initOurVibes(vibes);
  })
  .catch(e => console.warn('our-vibes.js import error', e));

// Завантажити музичний плеєр
loadPartial('music-player-root', 'partials/music-player.html', `<section class='music-player'><div>Музичний плеєр недоступний</div></section>`)
  .then(() => {
    import('./partials/music-player.js').catch(e => console.warn('music-player.js import error', e));
  });

