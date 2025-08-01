const words = [
    "javascript",
    "programming",
    "developer",
    "frontend",
    "backend",
    "database",
    "html",
    "css",
    "react",
    "angular",
  ];
  
  let originalWord = "";
  let jumbledWord = "";
  let score = 0;
  
  // Get DOM elements
  const jumbledWordElement = document.getElementById("jumbled-word");
  const guessInput = document.getElementById("guess");
  const messageElement = document.getElementById("message");
  const hintElement = document.getElementById("hint");
  const scoreElement = document.getElementById("score");
  const startButton = document.getElementById("start-btn");
  const submitButton = document.getElementById("submit-btn");
  const hintButton = document.getElementById("hint-btn");
  
  // Shuffle word
  function shuffleWord(word) {
    const shuffled = word.split("").sort(() => Math.random() - 0.5).join("");
    return shuffled === word ? shuffleWord(word) : shuffled; // Ensure it's not the same as original
  }
  
  // Start game
  startButton.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    originalWord = words[randomIndex];
    jumbledWord = shuffleWord(originalWord);
  
    jumbledWordElement.textContent = `Jumbled Word: ${jumbledWord}`;
    guessInput.value = "";
    messageElement.textContent = "";
    hintElement.textContent = "";
  });
  
  // Submit guess
  submitButton.addEventListener("click", () => {
    const userGuess = guessInput.value.trim().toLowerCase();
  
    if (userGuess === originalWord) {
      messageElement.textContent = "Correct! 🎉";
      messageElement.style.color = "green";
      score++;
      scoreElement.textContent = `Score: ${score}`;
      guessInput.value = "";
    } else {
      messageElement.textContent = "Incorrect. Try again! ❌";
      messageElement.style.color = "red";
    }
  });
  
  // Get hint
  hintButton.addEventListener("click", () => {
    if (originalWord) {
      hintElement.textContent = `Hint: The first letter is "${originalWord[0]}".`;
    } else {
      hintElement.textContent = "Start the game to get a hint!";
    }
  });
  