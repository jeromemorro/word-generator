window.addEventListener('DOMContentLoaded', function() {
  var wordElement = document.getElementById('word');
  var numberSelect = document.getElementById('number-select');

  function generateRandomWord() {
    var words = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Spring', 'Summer', 'Autumn', 'Winter'];
    var randomNumber = Math.floor(Math.random() * words.length);
    var randomWord = words[randomNumber];
    wordElement.textContent = randomWord;
  }

  function startWordGeneration() {
    var interval = numberSelect.value * 1000; // Convert selected value to milliseconds
    generateRandomWord();
    setInterval(generateRandomWord, interval);
  }

  startWordGeneration();
});
