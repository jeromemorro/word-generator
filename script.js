// script.js

window.addEventListener('DOMContentLoaded', function() {
  var wordElement = document.getElementById('word');
  var secondsSelect = document.getElementById('seconds-select');
  var intervalId;
  var button = document.getElementById('toggle-button');

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

  function stopWordGeneration() {
    clearInterval(intervalId);
  }

  function toggleWordGeneration() {
    if (intervalId) {
      // Word generation is currently running, stop it
      stopWordGeneration();
      button.textContent = 'Start';
      button.style.backgroundColor = 'green';
    } else {
      // Word generation is currently stopped, start it
      startWordGeneration();
      button.textContent = 'Stop';
      button.style.backgroundColor = 'red';
    }
  }

  secondsSelect.addEventListener('change', function() {
    stopWordGeneration();
    startWordGeneration();
  });

  button.addEventListener('click', toggleWordGeneration);

  startWordGeneration();
});
