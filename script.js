// script.js

window.addEventListener('DOMContentLoaded', function() {
  var wordElement = document.getElementById('word');
  var secondsSelect = document.getElementById('seconds-select');
  var intervalId;
  var toggleButton = document.getElementById('toggle-button');
  var isWordGenerationRunning = false;

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
    isWordGenerationRunning = true;
  }

  function stopWordGeneration() {
    clearInterval(intervalId);
    intervalId = null;
    isWordGenerationRunning = false;
  }

  function toggleWordGeneration() {
    if (isWordGenerationRunning) {
      // Word generation is currently running, stop it
      stopWordGeneration();
      toggleButton.textContent = 'Start generator';
      toggleButton.style.backgroundColor = 'red';
    } else {
      // Word generation is currently stopped, start it
      startWordGeneration();
      toggleButton.textContent = 'Stop generator';
      toggleButton.style.backgroundColor = 'green';
    }
  }

  secondsSelect.addEventListener('change', function() {
    // Update interval only if the word generation is currently running
    if (isWordGenerationRunning) {
      stopWordGeneration();
      startWordGeneration();
    }
  });

  toggleButton.addEventListener('click', toggleWordGeneration);

  startWordGeneration();
});
