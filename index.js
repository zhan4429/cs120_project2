// Game variables
let answer = "";
let maxAttempts = 6;
let game = null;
let guessInput = null;

// On-screen keyboard layout
const keyboardDict = {
  "top-keys": ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  "middle-keys": ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  "bottom-keys": ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
};

// Local dictionary in case API fails
const localDictionary = [
  "ABOUT",
  "APPLE",
  "BRAVE",
  "CRANE",
  "DREAM",
  "EAGER",
  "FAITH",
  "GLORY",
  "HAPPY",
  "IDEAL",
  "JUMBO",
  "KNACK",
  "LIGHT",
  "MIGHT",
  "NOBLE",
  "OCEAN",
  "PRIDE",
  "QUICK",
  "RIVER",
  "SHINE",
  "TRUST",
  "UNITY",
  "VIVID",
  "WORLD",
  "YOUTH",
  "ZEBRA",
  "PLANT",
  "GHOST",
  "BRICK",
  "CROWN",
  "FLAME",
  "GRACE",
  "HEART",
  "JELLY",
  "LUNCH",
  "MUSIC",
  "NURSE",
  "OASIS",
  "PEACH",
  "QUEEN",
  "ROBIN",
  "SUGAR",
  "TIGER",
  "ULTRA",
  "VIRUS",
  "WATER",
  "XENON",
  "YACHT",
  "ZONAL",
  "BLINK",
  "CHAMP",
  "DANCE",
  "ELDER",
  "FROST",
  "GIANT",
  "HONEY",
  "IVORY",
  "JOKER",
  "KARMA",
  "LEMON",
  "MAGIC",
  "NIGHT",
  "OPERA",
  "PIXEL",
  "QUILT",
  "RANCH",
  "SCOPE",
  "THORN",
  "USUAL",
  "VOUCH",
  "WHALE",
  "YIELD",
];

// Game class
function Game() {
  this.currentAttempt = 0;
  this.validated = false;
  this.gameOver = false;
}

// Restart the game
function restartGame() {
  // 1. Reset Game State
  game = new Game();

  for (let row = 0; row < maxAttempts; row++) {
    for (let col = 0; col < 5; col++) {
      let cell = document.getElementById(`cell-${row}-${col}`);
      cell.textContent = "";
      cell.className = "cell";
    }
  }
  // Reset keyboard colors
  for (let rowKeyboard in keyboardDict) {
    let rowKeys = keyboardDict[rowKeyboard];
    rowKeys.forEach((key) => {
      let keyDiv = document.getElementById(key);
      keyDiv.style.backgroundColor = "white";
      keyDiv.style.color = "black";
    });
  }
  guessInput.value = "";
  guessInput.blur();
  document.getElementById("guess-input").classList.remove("hide");
  document.getElementById("hint").classList.remove("hide");
  document.getElementById("guess-button").classList.remove("hide");
  document.getElementById("restart-button").classList.add("hide");
  fetchNewWord();
  guessInput.focus();
}

// Fetch a new word
function fetchNewWord() {
  // Using a public API to fetch a random 5-letter word
  fetch("https://random-word-api.herokuapp.com/word?length=5")
    .then((response) => response.json())
    .then((data) => {
      answer = data[0].toUpperCase();
      console.log("New Target word from API is: ", answer);
    })
    .catch((error) => {
      console.error("Error fetching word using API:", error);
      // Fallback to local dictionary if API fails
      let randomIndex = Math.floor(Math.random() * localDictionary.length);
      answer = localDictionary[randomIndex];
      console.log("New Target word from local dictionary is: ", answer);
    });
}

// Validate the guess input is a 5-letter word
function validate() {
  let guessWord = guessInput.value.trim();
  if (guessWord.length !== 5 || !/^[a-zA-Z]+$/.test(guessWord)) {
    alert("Guess must be a 5-letter word containing only letters.");
    guessInput.focus();
    guessInput.select();
    game.validated = false;
    return false;
  } else {
    game.validated = true;
    return true;
  }
}

// When the game ends, reveal the restart button and hide input elements
function stop() {
  document.getElementById("restart-button").classList.remove("hide");
  document.getElementById("guess-button").classList.add("hide");
  document.getElementById("guess-input").classList.add("hide");
  document.getElementById("hint").classList.add("hide");
}

// Process the player's guess
function processGuess() {
  let guessWord = guessInput.value.trim().toUpperCase();
  let correctLetters = 0;
  // Update the game board
  for (let col = 0; col < 5; col++) {
    if (answer.includes(guessWord[col])) {
      document.getElementById(guessWord[col]).style.backgroundColor =
        "goldenrod";
    } else {
      document.getElementById(guessWord[col]).style.backgroundColor =
        "darkgray";
    }
    let cell = document.getElementById(`cell-${game.currentAttempt}-${col}`);
    cell.textContent = guessWord[col];
    if (guessWord[col] === answer[col]) {
      cell.className = "cell correct";
      correctLetters++;
    } else if (answer.includes(guessWord[col])) {
      cell.className = "cell present";
    } else {
      cell.className = "cell";
    }
  }
  game.currentAttempt++;

  // Check for win/loss conditions, setTimeout to allow UI update before alert
  if (correctLetters === 5) {
    game.gameOver = true;
    setTimeout(() => {
      alert("Congratulations! You've guessed the word!");
      stop();
    }, 100);
    return;
  }
  if (game.currentAttempt === maxAttempts) {
    game.gameOver = true;
    setTimeout(() => {
      alert(`Game Over! The correct word was: ${answer}`);
      stop();
    }, 100);
    return;
  }

  // Reset input for next guess
  guessInput.value = "";
  guessInput.focus();
}

// Initialize the game on window load
window.onload = function () {
  game = new Game();
  // Create a 6x5 grid for the game board
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.id = `cell-${row}-${col}`;
      document.getElementById("game-board").appendChild(cell);
    }
  }

  // Create on-screen keyboard
  let keyboardDiv = document.getElementById("keyboard");
  for (rowKeyboard in keyboardDict) {
    let rowDiv = document.createElement("div");
    rowDiv.className = rowKeyboard;
    let rowKeys = keyboardDict[rowKeyboard];
    rowKeys.forEach((key) => {
      var keyDiv = document.createElement("div");
      keyDiv.className = "key";
      keyDiv.id = key;
      if (key === "ENTER" || key === "BACKSPACE") {
        keyDiv.classList.add("wide-key");
      }
      keyDiv.textContent = key;
      rowDiv.appendChild(keyDiv);
    });
    keyboardDiv.appendChild(rowDiv);
  }

  // Input validation and feedback
  guessInput = document.getElementById("guess-input");

  const guessForm = document.getElementById("guess-form");
  if (guessForm) {
    guessForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (game.gameOver) {
        return;
      }
      if (!game.validated) {
        return;
        // only process the guess if validated
      } else {
        processGuess();
      }
    });
  }

  fetchNewWord();
  guessInput.focus();
};
