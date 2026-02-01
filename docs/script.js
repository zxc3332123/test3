// Knowledge Data from PDF
const knowledgeData = [
  {
    "title": "名校",
    "description": "指知名度高且學術地位優越的學校，常被家長視為未來成功的保證與門票。"
  },
  {
    "title": "專業",
    "description": "大學中主修的學科領域。選擇「好專業」通常被認為與未來的就業競爭力直接掛鉤。"
  },
  {
    "title": "找工作",
    "description": "畢業後進入職場的過程。許多人認為名校學歷是通過企業篩選第一關的重要利器。"
  },
  {
    "title": "興趣",
    "description": "個人主觀的喜好與熱情。在生涯規劃中，個人興趣往往會與長輩的現實考量產生衝突。"
  },
  {
    "title": "第一印象",
    "description": "社會大眾對一個人的初步觀感。名校學歷通常能帶給他人專業、優秀的正面第一印象。"
  },
  {
    "title": "商管學院",
    "description": "培養商業與管理人才的學院。在這份資料中，這是家長偏好、認為較有前途的傳統科系選擇。"
  },
  {
    "title": "設計學門",
    "description": "涉及創意與藝術的專業領域。代表了學生對自我實踐的追求，而非傳統的升學路徑。"
  },
  {
    "title": "父母期待",
    "description": "父母對子女學業與職涯的期望。這些期待有時會成為子女追求個人夢想時的阻力。"
  },
  {
    "title": "觀點差異",
    "description": "不同身份（如學生、老闆、家長）對於同一個問題（如學歷價值）會有截然不同的看法。"
  },
  {
    "title": "社會評價",
    "description": "大眾對學歷與成就的普遍標準。這些社會觀念會深刻影響個人的選擇與職涯規劃。"
  }
];

// Game State
let currentCards = [];
let currentIndex = 0;
let isFlipped = false;

// DOM Elements
const app = document.getElementById('app');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const completionScreen = document.getElementById('completion-screen');

const cardElement = document.getElementById('knowledge-card');
const cardTitle = document.getElementById('card-title');
const cardDescription = document.getElementById('card-description');

const currentCountSpan = document.getElementById('current-count');
const totalCountSpan = document.getElementById('total-count');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');
const controlsDiv = document.querySelector('.controls');

// Initialize
function init() {
  totalCountSpan.textContent = knowledgeData.length;

  startBtn.addEventListener('click', startGame);
  cardElement.addEventListener('click', flipCard);
  nextBtn.addEventListener('click', nextCard);
  resetBtn.addEventListener('click', resetGame);
  restartBtn.addEventListener('click', startGame);
}

// Logic Functions
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  let newArray = JSON.parse(JSON.stringify(array));

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]
    ];
  }
  return newArray;
}

function startGame() {
  currentCards = shuffle(knowledgeData);
  currentIndex = 0;
  isFlipped = false;

  // Reset UI
  cardElement.classList.remove('flipped');
  cardElement.classList.remove('card-exit', 'card-enter'); // Clear anims
  updateCardUI();

  // Switch Screens
  startScreen.classList.remove('active');
  startScreen.classList.add('hidden');

  completionScreen.classList.remove('active');
  completionScreen.classList.add('hidden');

  gameScreen.classList.remove('hidden');
  gameScreen.classList.add('active');

  controlsDiv.classList.remove('visible');
}

function updateCardUI() {
  const cardData = currentCards[currentIndex];
  cardTitle.innerText = cardData.title;
  cardDescription.innerText = cardData.description;
  currentCountSpan.innerText = currentIndex + 1;
}

let isProcessing = false; // Prevent double clicks

function flipCard() {
  if (isProcessing) return;

  isFlipped = !isFlipped;
  if (isFlipped) {
    cardElement.classList.add('flipped');
    controlsDiv.classList.add('visible');
  } else {
    cardElement.classList.remove('flipped');
    // Optional: Hide button if they flip back? 
    // controlsDiv.classList.remove('visible'); // Commented out to keep flow easier
  }
}

// Mascot Data
const mascotImages = [
  'mascot_0.png',
  'mascot_1.png',
  'mascot_2.png',
  'mascot_3.png',
  'mascot_4.png',
  'mascot_5.png'
];

function updateMascot() {
  const mascotImg = document.querySelector('.mascot-img');
  if (!mascotImg) return;

  // Animate out
  mascotImg.style.opacity = '0';
  mascotImg.style.transform = 'translateY(20px)';

  setTimeout(() => {
    // Pick new random
    let newSrc;
    do {
      const randomIndex = Math.floor(Math.random() * mascotImages.length);
      newSrc = mascotImages[randomIndex];
    } while (mascotImg.getAttribute('src') === newSrc && mascotImages.length > 1);

    mascotImg.src = newSrc;

    // Animate in
    mascotImg.onload = () => {
      mascotImg.style.opacity = '1';
      mascotImg.style.transform = 'translateY(0)';
    };
    // Fallback
    setTimeout(() => {
      mascotImg.style.opacity = '1';
      mascotImg.style.transform = 'translateY(0)';
    }, 100);

  }, 300);
}

function nextCard() {
  if (currentIndex < currentCards.length - 1) {
    if (isProcessing) return;
    isProcessing = true;

    // Apply Exit Animation
    cardElement.classList.add('card-exit');

    setTimeout(() => {
      currentIndex++;
      isFlipped = false;

      // Hard Reset State for New Card
      cardElement.classList.remove('flipped');
      cardElement.classList.remove('card-exit');

      updateCardUI();
      updateMascot(); // Change mascot on new card

      // Add Enter Animation
      cardElement.classList.add('card-enter');

      // Cleanup Enter Class after animation
      setTimeout(() => {
        cardElement.classList.remove('card-enter');
        isProcessing = false;
      }, 400);

      controlsDiv.classList.remove('visible');
    }, 400); // Wait for exit animation

  } else {
    finishGame();
  }
}

function finishGame() {
  gameScreen.classList.remove('active');
  gameScreen.classList.add('hidden');

  completionScreen.classList.remove('hidden');
  completionScreen.classList.add('active');
}

function resetGame() {
  startGame();
  updateMascot();
}

// Start
init();
updateMascot();
