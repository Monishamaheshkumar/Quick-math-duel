let correctAnswer = 0;
let computerTimeout;
let gameActive = false;
let playerScore = 0;
let computerScore = 0;
let round = 1;
let selectedDifficulty = "easy";

// DOM Elements
const welcomeScreen = document.getElementById("welcomeScreen");
const gameScreen = document.getElementById("gameScreen");

const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const computerAnswerEl = document.getElementById("computerAnswer");
const roundEl = document.getElementById("roundNumber");
const optionsEl = document.getElementById("options");

// Start the game with selected difficulty
function startGame(difficulty) {
  selectedDifficulty = difficulty;
  welcomeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  // Reset game state
  playerScore = 0;
  computerScore = 0;
  round = 1;
  playerScoreEl.textContent = 0;
  computerScoreEl.textContent = 0;
  roundEl.textContent = 1;

  startRound();
}

// Generate a new question based on difficulty
function generateQuestion() {
  let num1, num2, ops;

  if (selectedDifficulty === "easy") {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    ops = ['+'];
  } else if (selectedDifficulty === "medium") {
    num1 = Math.floor(Math.random() * 50) + 10;
    num2 = Math.floor(Math.random() * 30) + 5;
    ops = ['+', '-', '*'];
  } else {
    num1 = Math.floor(Math.random() * 100) + 50;
    num2 = Math.floor(Math.random() * 50) + 10;
    ops = ['+', '-', '*', '/'];
  }

  const op = ops[Math.floor(Math.random() * ops.length)];
  let question = `${num1} ${op} ${num2}`;
  correctAnswer = Math.round(eval(question) * 10) / 10;
 questionEl.innerText = "Solve: " + question;
showQuestionWithAnimation();





  generateOptions();
}

// Create multiple choice options
function generateOptions() {
  const answers = new Set();
  answers.add(correctAnswer);

  // Determine if the correct answer is a decimal or whole number
  const isDecimal = !Number.isInteger(correctAnswer);

  while (answers.size < 3) {
    let offset = Math.random() * 10 - 5; // range: -5 to +5
    let wrong = correctAnswer + offset;

    // Round to 1 decimal if correct is decimal, else to whole number
    wrong = isDecimal
      ? Math.round(wrong * 10) / 10
      : Math.round(wrong);

    // Avoid duplicates or negative numbers
    if (wrong !== correctAnswer && wrong >= 0) {
      answers.add(wrong);
    }
  }

  // Shuffle and show
  const shuffled = Array.from(answers).sort(() => Math.random() - 0.5);
  optionsEl.innerHTML = "";

  shuffled.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => playerAnswer(ans);
    optionsEl.appendChild(btn);
  });
}


// Handle player's answer
function playerAnswer(selected) {
  if (!gameActive) return;

  clearTimeout(computerTimeout);
  disableOptions();

  if (selected === correctAnswer) {
    playerScore++;
    playerScoreEl.innerText = playerScore;
    resultEl.innerText = "✅ You answered first and won!";
    computerAnswerEl.innerText = "Computer was too slow!";
  } else {
    resultEl.innerText = "❌ Wrong answer!";
    computerAnswerEl.innerText = `Correct was: ${correctAnswer}`;
  }

  gameActive = false;
}

// Disable option buttons after answer
function disableOptions() {
  document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
}

// Start a new round
function startRound() {
  gameActive = true;
  resultEl.innerText = "";
  computerAnswerEl.innerText = "";
  optionsEl.innerHTML = "";

  generateQuestion();
  startBtn.innerText = "Next";
  roundEl.innerText = round;

  let delay = Math.random() * 2500 + 500;

  computerTimeout = setTimeout(() => {
    if (gameActive) {
      gameActive = false;
      computerScore++;
      computerScoreEl.innerText = computerScore;
      resultEl.innerText = "💻 Computer answered first. You lose!";
      computerAnswerEl.innerText = `Computer's Answer: ${correctAnswer} 🤖`;
      disableOptions();
    }
  }, delay);
}

// Handle "Start" or "Next" button click
startBtn.addEventListener("click", () => {
  if (!gameActive) {
    round++;
    roundEl.textContent = round;
    startRound();
  }
});

// 🔊 Background Music Control
const bgMusic = document.getElementById("bg-music");
const toggleBtn = document.getElementById("toggleMusic");

let isPlaying = false;

toggleBtn.addEventListener("click", () => {
  if (!isPlaying) {
    bgMusic.play();
    bgMusic.muted = false;
    isPlaying = true;
    toggleBtn.textContent = "🔊 Mute";
  } else {
    bgMusic.muted = !bgMusic.muted;
    toggleBtn.textContent = bgMusic.muted ? "🔇 Unmute" : "🔊 Mute";
  }
});

// 🛑 Exit Button: Show result and reset game
document.getElementById("exitButton").addEventListener("click", () => {
  const user = playerScore;
  const comp = computerScore;

  let message = `🏁 Game Over!\n\n👤 You: ${user}\n🤖 Computer: ${comp}\n\n`;

  if (user > comp) {
    message += "🎉 You win!";
  } else if (comp > user) {
    message += "💻 Computer wins!";
  } else {
    message += "🤝 It's a tie!";
  }

  alert(message);
  location.reload(); // Refreshes the game
});

function showQuestionWithAnimation() {
  const container = document.getElementById("questionContainer");

  // Reset the animation
  container.classList.remove("active");

  // Delay before triggering again
  setTimeout(() => {
    container.classList.add("active");
  }, 50);
}

