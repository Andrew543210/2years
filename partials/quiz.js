// quiz.js — логіка інтерактивної вікторини
(function() {
  const parentSection = document.querySelector('.quiz');
  if (!parentSection) return;

  // Масив запитань з правильними відповідями
  const questions = [
    {
      question: 'Скільки в хвилинах ми зустрічаємось?',
      answers: ['159 тис. хв', '115 млн хв', '1,05 млн хв', '658 тис. хв'],
      correct: 2
    },
    {
      question: 'Скільки у нашому чаті голосових?',
      answers: ['26к', '22к', '34к', '18к'],
      correct: 0
    },
    {
      question: 'Скільки разів було написане слово «люблю» у нашому чаті?',
      answers: ['500', '3400', '2200', '1600'],
      correct: 2
    },
    {
      question: 'Скільки по часу триває наш блог після скаймолу, коли ти вперше назвала мене «киця»?',
      answers: ['19 сек', '31 сек', '10 сек', '25 сек'],
      correct: 1
    },
    {
      question: 'Скільки квіток було в першому букеті, який я подарував?',
      answers: ['11', '5', '15', '9'],
      correct: 0
    },
    {
      question: 'Скільки лайків на нашому першому спільному пості?',
      answers: ['136', '166', '155', '149'],
      correct: 3
    },
    {
      question: 'Скільки моїх фотографій на подарунковій «18»?',
      answers: ['41', '28', '52', '34'],
      correct: 0
    },
    {
      question: 'Скільки сторіс в актуальних «КохаYou»?',
      answers: ['30', '49', '78', '56'],
      correct: 2
    },
    {
      question: 'У скількох групах ми зараз разом в телеграмі?',
      answers: ['3', '7', '9', '5'],
      correct: 3
    },
    {
      question: 'Наскільки сильно я тебе люблю?',
      answers: ['6', '100', '200 млрд', 'Немає такого числа!'],
      correct: 3
    }
  ];

  // Елементи DOM
  const questionContainer = parentSection.querySelector('.quiz__question-container');
  const currentEl = parentSection.querySelector('.quiz__current');
  const totalEl = parentSection.querySelector('.quiz__total');
  const questionText = parentSection.querySelector('.quiz__question-text');
  const answersForm = parentSection.querySelector('.quiz__answers');
  const answerLabels = parentSection.querySelectorAll('.quiz__answer');
  const answerTexts = parentSection.querySelectorAll('.quiz__answer-text');
  const radioInputs = parentSection.querySelectorAll('input[type="radio"]');
  const submitBtn = parentSection.querySelector('.quiz__submit');
  const modal = parentSection.querySelector('.quiz__modal');
  const modalMessage = parentSection.querySelector('.quiz__modal-message');
  const modalScore = parentSection.querySelector('.quiz__modal-score');
  const modalClose = parentSection.querySelector('.quiz__modal-close');

  // Стан вікторини
  let currentQuestion = 0;
  let score = 0;

  // Ініціалізація
  function init() {
    totalEl.textContent = questions.length;
    displayQuestion();
    
    // Слухачі подій
    radioInputs.forEach(input => {
      input.addEventListener('change', () => {
        submitBtn.disabled = false;
      });
    });

    submitBtn.addEventListener('click', handleSubmit);
    modalClose.addEventListener('click', closeModal);
    
    // Закриття модального вікна при кліку поза ним
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Відображення поточного питання
  function displayQuestion() {
    const q = questions[currentQuestion];
    
    currentEl.textContent = currentQuestion + 1;
    questionText.textContent = q.question;
    
    // Заповнити варіанти відповідей
    answerTexts.forEach((text, index) => {
      text.textContent = q.answers[index];
    });

    // Скинути вибір
    radioInputs.forEach(input => {
      input.checked = false;
    });
    
    submitBtn.disabled = true;

    // Анімація появи
    questionContainer.classList.remove('fade-out');
    questionContainer.classList.add('fade-in');
    setTimeout(() => {
      questionContainer.classList.remove('fade-in');
    }, 300);
  }

  // Обробка відповіді
  function handleSubmit() {
    const selectedInput = parentSection.querySelector('input[name="answer"]:checked');
    if (!selectedInput) return;

    const selectedAnswer = parseInt(selectedInput.value);
    const correctAnswer = questions[currentQuestion].correct;

    // Перевірка правильності
    if (selectedAnswer === correctAnswer) {
      score++;
    }

    // Анімація виходу
    questionContainer.classList.add('fade-out');

    // Перехід до наступного питання або показ результатів
    setTimeout(() => {
      currentQuestion++;
      
      if (currentQuestion < questions.length) {
        displayQuestion();
      } else {
        showResults();
      }
    }, 300);
  }

  // Показ результатів
  function showResults() {
    let message = '';
    
    if (score >= 0 && score <= 5) {
      message = 'Вірю, що ти розхвилювалась';
    } else if (score >= 6 && score <= 7) {
      message = 'Умнічка, люблю тебе';
    } else if (score >= 8 && score <= 10) {
      message = 'Каблучка не за горами!';
    }

    modalMessage.textContent = message;
    modalScore.textContent = `${score}/10`;
    
    modal.setAttribute('aria-hidden', 'false');
    
    // Фокус на модальне вікно для accessibility
    modal.focus();
  }

  // Закриття модального вікна
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    
    // Скидання вікторини
    currentQuestion = 0;
    score = 0;
    displayQuestion();
  }

  // Запуск
  init();
})();
