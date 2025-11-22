// music-player.js — музичний плеєр із випадковою музикою, next/prev кнопками
import { musicPlayer } from '../data.js';

(function(){
  const playerSection = document.querySelector('.music-player');
  if (!playerSection) return;

  const audioPlayer = playerSection.querySelector('#audioPlayer');
  const playBtn = playerSection.querySelector('#playBtn');
  const prevBtn = playerSection.querySelector('#prevBtn');
  const nextBtn = playerSection.querySelector('#nextBtn');
  const currentSongDisplay = playerSection.querySelector('#currentSongDisplay');
  const playIcon = playerSection.querySelector('#playIcon');
  const pauseIcon = playerSection.querySelector('#pauseIcon');
  const progressBar = playerSection.querySelector('#progressBar');
  const currentTimeEl = playerSection.querySelector('#currentTime');
  const durationEl = playerSection.querySelector('#duration');
  const progressContainer = playerSection.querySelector('.music-player__progress-bar');

  if (!audioPlayer || !playBtn || !prevBtn || !nextBtn) return;

  let currentIndex = Math.floor(Math.random() * musicPlayer.length);
  let isPlaying = false;

  // Функція для отримання назви пісні з шляху
  function getSongName(path) {
    return path.split('/').pop().replace('.mp3', '');
  }

  // Завантажити пісню
  function loadSong(index) {
    if (musicPlayer.length === 0) return;
    currentIndex = index % musicPlayer.length;
    if (currentIndex < 0) currentIndex = musicPlayer.length + currentIndex;
    
    const songPath = musicPlayer[currentIndex];
    audioPlayer.src = songPath;
    currentSongDisplay.textContent = getSongName(songPath);
  }

  // Грати/Пауза
  function togglePlay() {
    if (musicPlayer.length === 0) return;
    
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    } else {
      if (audioPlayer.src === '') loadSong(currentIndex);
      audioPlayer.play().catch(e => console.warn('Помилка відтворення:', e));
      isPlaying = true;
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    }
  }

  // Наступна пісня
  function nextSong() {
    loadSong(currentIndex + 1);
    if (isPlaying) {
      audioPlayer.play().catch(e => console.warn('Помилка відтворення:', e));
    }
  }

  // Попередня пісня
  function prevSong() {
    loadSong(currentIndex - 1);
    if (isPlaying) {
      audioPlayer.play().catch(e => console.warn('Помилка відтворення:', e));
    }
  }

  // Обновити час і прогрес
  function updateTime() {
    const current = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (!isNaN(duration)) {
      const percent = (current / duration) * 100;
      progressBar.style.width = percent + '%';
      
      currentTimeEl.textContent = formatTime(current);
      durationEl.textContent = formatTime(duration);
    }
  }

  // Форматування часу (mm:ss)
  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Клік по прогресс-бару
  function seekToClick(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  // Коли пісня закінчується, переходимо на наступну
  audioPlayer.addEventListener('ended', nextSong);
  audioPlayer.addEventListener('timeupdate', updateTime);
  audioPlayer.addEventListener('play', () => {
    isPlaying = true;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  });
  audioPlayer.addEventListener('pause', () => {
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  });

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevSong);
  nextBtn.addEventListener('click', nextSong);
  progressContainer.addEventListener('click', seekToClick);

  // Завантажити першу випадкову пісню
  loadSong(currentIndex);
})();
