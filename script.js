const words = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Spring", "Summer", "Autumn", "Winter"];

const wordContainer = document.getElementById("word");
const generateButton = document.getElementById("generate-button");
const numberInput = document.getElementById("number-input");

generateButton.addEventListener("click", () => {
  const selectedNumber = parseInt(numberInput.value);
  
  if (selectedNumber >= 1 && selectedNumber <= 30) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    wordContainer.textContent = randomWord;
  } else {
    wordContainer.textContent = "Please enter a valid number (1-30)";
  }
});
