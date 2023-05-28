const words = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Spring", "Summer", "Autumn", "Winter"];

const wordContainer = document.getElementById("word");
const numberSelect = document.getElementById("number-select");

let intervalId;

numberSelect.addEventListener("change", () => {
  const selectedNumber = parseInt(numberSelect.value);
  
  if (selectedNumber >= 1 && selectedNumber <= 30) {
    clearInterval(intervalId);
    startWordCycle(selectedNumber);
  } else {
    wordContainer.textContent = "Please select a valid number (1-30)";
    clearInterval(intervalId);
  }
});

function startWordCycle(seconds) {
  let index = 0;
  
  intervalId = setInterval(() => {
    const word = words[index];
    wordContainer.textContent = word;
    
    index = (index + 1) % words.length;
  }, seconds * 1000);
}
