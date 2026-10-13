
const GOAL = 20;
const TIME_LIMIT = 30;
const TOTAL_CANS = 25;

const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");
const progressBar = document.getElementById("progress-bar");
const canGrid = document.getElementById("can-grid");
const startButton = document.getElementById("start-button");
const celebration = document.getElementById("celebration");
const winTitle = document.getElementById("win-title");
const winMessage = document.getElementById("win-message");
const playAgainButton = document.getElementById("play-again");
const confettiContainer = document.getElementById("confetti-container");

let score = 0;
let timeLeft = TIME_LIMIT;
let gameActive = false;
let timerId = null;

// Create the 25 cans on the page.
function createCans() {
  canGrid.innerHTML = "";

  for (let i = 0; i < TOTAL_CANS; i++) {
    const can = document.createElement("button");

    can.className = "can";
    can.type = "button";
    can.textContent = "🥫";
    can.setAttribute("aria-label", `Collect can ${i + 1}`);
    can.disabled = true;

    can.addEventListener("click", function () {
      collectCan(can);
    });

    canGrid.appendChild(can);
  }
}

// Update the score, timer, progress bar, and message.
function updateDisplay() {
  scoreElement.textContent = `${score} / ${GOAL}`;
  timerElement.textContent = `${timeLeft}s`;

  const progress = Math.min((score / GOAL) * 100, 100);
  progressBar.style.width = `${progress}%`;

  if (gameActive) {
    messageElement.textContent =
      `Great job! You have collected ${score} of ${GOAL} cans.`;
  }
}

// Start or restart the game.
function startGame() {
  clearInterval(timerId);
  clearConfetti();

  score = 0;
  timeLeft = TIME_LIMIT;
  gameActive = true;
  celebration.hidden = true;
  startButton.textContent = "Restart Game";

  createCans();

  const cans = canGrid.querySelectorAll(".can");
  cans.forEach(function (can) {
    can.disabled = false;
  });

  updateDisplay();
  messageElement.textContent =
    "Go! Collect 20 cans before time runs out!";

  timerId = setInterval(function () {
    timeLeft--;
    timerElement.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame(false);
    }
  }, 1000);
}

// Add one point when a can is collected.
function collectCan(can) {
  if (!gameActive || can.disabled) {
    return;
  }

  score++;
  can.disabled = true;
  can.classList.add("collected");
  can.textContent = "💧";
  can.setAttribute("aria-label", "Can collected");

  updateDisplay();

  if (score >= GOAL) {
    endGame(true);
  }
}

// End the game with a win or a loss.
function endGame(won) {
  gameActive = false;
  clearInterval(timerId);

  const cans = canGrid.querySelectorAll(".can");
  cans.forEach(function (can) {
    can.disabled = true;
  });

  if (won) {
    winTitle.textContent = "🎉 Quest Completed!";
    winMessage.textContent =
      `Amazing! You collected ${score} cans in ` +
      `${TIME_LIMIT - timeLeft} seconds. You are a Water Quest champion!`;

    messageElement.textContent =
      `You won! ${score} cans collected. Great work!`;

    celebration.hidden = false;
    launchConfetti(120);
  } else {
    messageElement.textContent =
      `Time's up! You collected ${score} of ${GOAL} cans. Try again!`;

    winTitle.textContent = "⏰ Time's Up!";
    winMessage.textContent =
      `You collected ${score} of ${GOAL} cans. ` +
      "Try again and see if you can complete your water quest!";

    celebration.hidden = false;
  }

  startButton.textContent = "Play Again";
}

// Create colorful falling confetti.
function launchConfetti(amount) {
  const colors = ["#ffc907", "#00a6c8", "#ff6b6b", "#70d6a5", "#a78bfa"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    confettiContainer.appendChild(piece);
  }

  // Remove confetti after the animation finishes.
  setTimeout(clearConfetti, 5000);
}

function clearConfetti() {
  confettiContainer.innerHTML = "";
}

startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

// Prepare the page before the first game.
createCans();
updateDisplay();
