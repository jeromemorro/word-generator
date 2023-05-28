const words = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Spring", "Summer", "Autumn", "Winter"];

const wordContainer = document.getElementById("word");
const generateButton = document.getElementById("generate-button");
const numberSelect = document.getElementById("number-select");

generateButton.addEventListener("click", () => {
  const selectedNumber = parseInt(numberSelect.value);
  
  if (selectedNumber >= 1 && selectedNumber <= 30) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    wordContainer.textContent = randomWord;
  } else {
    wordContainer.textContent = "Number of seconds between words";
  }
});
