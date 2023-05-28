window.addEventListener('DOMContentLoaded', function() {
  var wordElement = document.getElementById('word');
  var secondsSelect = document.getElementById('seconds-select');
  var intervalId;

  function generateRandomWord() {
    var words = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Spring', 'Summer', 'Autumn', 'Winter'];
    var randomNumber = Math.floor(Math.random() * words.length);
    var randomWord = words[randomNumber];
    wordElement.textContent = randomWord;
  }

  function startWordGeneration() {
    var interval = secondsSelect.value * 1000; // Convert selected value to milliseconds
    generateRandomWord();
    intervalId = setInterval(generateRandomWord, interval);
  }

  function updateInterval() {
    clearInterval(intervalId);
    startWordGeneration();
  }

  secondsSelect.addEventListener('change', updateInterval);

  startWordGeneration();
});
