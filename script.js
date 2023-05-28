const words = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Spring", "Summer", "Autumn", "Winter"];

const wordContainer = document.getElementById("word");
const generateButton = document.getElementById("generate-button");

generateButton.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex];
  wordContainer.textContent = randomWord;
});
