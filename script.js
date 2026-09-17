const heartSymbols = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝'];

// ============ ФОНОВЫЕ СЕРДЕЧКИ ============
function createFallingHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (16 + Math.random() * 26) + 'px';
  const dur = 5 + Math.random() * 5;
  h.style.animation = `fallDown ${dur}s linear`;
  h.style.animationDelay = Math.random() * 2 + 's';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), (dur + 3) * 1000);
}
setInterval(createFallingHeart, 350);
for (let i = 0; i < 10; i++) createFallingHeart();

// ============ ВЗРЫВ СЕРДЕЧЕК ============
function explodeHearts(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.fontSize = (18 + Math.random() * 30) + 'px';
    const angle = Math.random() * Math.PI * 2;
    const dist = 200 + Math.random() * 600;
    h.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    h.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    const dur = 1 + Math.random() * 1.5;
    h.style.animation = `burst ${dur}s cubic-bezier(0.2, 0.8, 0.3, 1) forwards`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), (dur + 0.5) * 1000);
  }
}

// ============ КНОПКА «НЕТ» ============
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const container = document.getElementById('container');

const noTexts = ['Нет','Точно нет?','Подумай ещё','Ну пожалуйста','Не будь таким','Я расстроюсь','Последний шанс','Ты уверен?','Я плачу 😢','Ладно, жми Да'];

let attempt = 0;
let initialized = false;
let startW = 0;
let startH = 0;

function moveNo() {
  if (attempt < noTexts.length) noBtn.textContent = noTexts[attempt];
  attempt++;

  // Первый раз — фиксируем размеры, отвязываем от потока
  if (!initialized) {
    const btnRect = noBtn.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();

    startW = btnRect.width;
    startH = btnRect.height;

    noBtn.style.position = 'absolute';
    noBtn.style.left = (btnRect.left - contRect.left) + 'px';
    noBtn.style.top = (btnRect.top - contRect.top) + 'px';
    noBtn.style.margin = '0';
    noBtn.style.boxSizing = 'border-box';
    noBtn.style.padding = '0';
    noBtn.style.display = 'flex';
    noBtn.style.alignItems = 'center';
    noBtn.style.justifyContent = 'center';
    noBtn.style.width = startW + 'px';
    noBtn.style.height = startH + 'px';
    noBtn.style.fontSize = '20px';
    noBtn.style.transition = 'left 0.35s cubic-bezier(0.34, 1.2, 0.64, 1), ' +
                             'top 0.35s cubic-bezier(0.34, 1.2, 0.64, 1), ' +
                             'width 0.35s ease, height 0.35s ease, ' +
                             'font-size 0.35s ease, opacity 0.35s ease';
    initialized = true;
  }

  // Уменьшаем на 12% каждый раз
  const factor = Math.pow(0.88, attempt);
  const newW = Math.max(40, startW * factor);
  const newH = Math.max(20, startH * factor);
  const newFont = Math.max(8, 20 * factor);
  const newOpacity = Math.max(0, 1 - attempt * 0.1);

  noBtn.style.width = newW + 'px';
  noBtn.style.height = newH + 'px';
  noBtn.style.fontSize = newFont + 'px';
  noBtn.style.opacity = newOpacity;

  // Размеры карточки и её padding
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const cs = getComputedStyle(container);
  const padL = parseFloat(cs.paddingLeft);
  const padR = parseFloat(cs.paddingRight);
  const padT = parseFloat(cs.paddingTop);
  const padB = parseFloat(cs.paddingBottom);

  // Границы внутри карточки
  const minX = padL;
  const minY = padT;
  const maxX = Math.max(minX, cw - padR - newW);
  const maxY = Math.max(minY, ch - padB - newH);

  const x = minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);

  noBtn.style.left = Math.round(x) + 'px';
  noBtn.style.top = Math.round(y) + 'px';

  // Исчезает после 9 попыток
  if (attempt >= 9) {
    noBtn.style.transition = 'opacity 0.5s ease';
    noBtn.style.opacity = '0';
    setTimeout(() => { noBtn.style.display = 'none'; }, 550);
  }
}

noBtn.addEventListener('mouseenter', moveNo);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); }, { passive: false });
noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNo(); });

// ============ КНОПКА «ДА» ============
yesBtn.addEventListener('click', () => {
  const rect = yesBtn.getBoundingClientRect();
  explodeHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 120);

  setTimeout(() => {
    document.querySelectorAll('.heart').forEach(h => h.remove());
    document.getElementById('container').outerHTML = `
      <div class="container final">
        <span class="big-heart" id="bigHeart">❤️</span>
        <h1>Я знал(а)!</h1>
        <p>Ты сделал(а) мой день 💖</p>
      </div>
    `;

    setInterval(() => {
      explodeHearts(Math.random() * innerWidth, Math.random() * innerHeight, 15);
    }, 300);

    document.getElementById('bigHeart').addEventListener('click', () => {
      const r = document.getElementById('bigHeart').getBoundingClientRect();
      explodeHearts(r.left + r.width / 2, r.top + r.height / 2, 50);
    });
  }, 400);
});