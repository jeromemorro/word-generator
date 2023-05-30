// script.js

window.addEventListener('DOMContentLoaded', function() {
  var wordElement = document.getElementById('word');
  var secondsSelect = document.getElementById('seconds-select');
  var intervalId;
  var toggleButton = document.getElementById('toggle-button');
  var isWordGenerationRunning = false;
  var isDefinitionVisible = false;
  var definitionButton = document.getElementById('definition-button');
  var textControl = document.getElementById('text-control');
  var syllablesSelect = document.getElementById('syllables-select');
  var obscureWordsCheckbox = document.getElementById('obscure-words-checkbox');

  var words = []; // Array to store the word entries from the JSON file

  function generateRandomWord() {
    var filteredWords = words;

    // Filter words based on selected syllables
    var selectedSyllables = syllablesSelect.value;
    if (selectedSyllables !== '0') {
      filteredWords = filteredWords.filter(function(word) {
        return word.s == selectedSyllables;
      });
    }

    // Filter words based on obscure words checkbox
    if (!obscureWordsCheckbox.checked) {
      filteredWords = filteredWords.filter(function(word) {
        return word.c == 1;
      });
    }

    // Generate a random word from the filtered list
    if (filteredWords.length > 0) {
      var randomNumber = Math.floor(Math.random() * filteredWords.length);
      var randomWord = filteredWords[randomNumber].w;
      var definition = filteredWords[randomNumber].d;

      wordElement.textContent = randomWord;
      textControl.value = definition;
    } else {
      wordElement.textContent = 'No matching words found.';
      textControl.value = '';
    }
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

  function toggleDefinition() {
    if (isDefinitionVisible) {
      // Hide the text control and update the button text
      textControl.style.display = 'none';
      definitionButton.textContent = 'Show definition';
    } else {
      // Show the text control and update the button text
      textControl.style.display = 'block';
      definitionButton.textContent = 'Hide definition';
    }
    isDefinitionVisible = !isDefinitionVisible;
  }

  function handleOptionChange() {
    if (isWordGenerationRunning) {
      // Word generation is currently running, update the interval duration
      var interval = secondsSelect.value * 1000; // Convert selected value to milliseconds
      clearInterval(intervalId);
      intervalId = setInterval(generateRandomWord, interval);
    }
  }

  fetch('words-temp.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      words = data;
      startWordGeneration();
    })
    .catch(function(error) {
      console.error('Error fetching words:', error);
    });

  // Dynamically adjust the width of the toggle button to match the definition button
  window.addEventListener('resize', function() {
    toggleButton.style.width = definitionButton.offsetWidth + 'px';
  });

  // Hide the text control on page load
  textControl.style.display = 'none';

  toggleButton.addEventListener('click', toggleWordGeneration);
  definitionButton.addEventListener('click', toggleDefinition);
  syllablesSelect.addEventListener('change', handleOptionChange);
  obscureWordsCheckbox.addEventListener('change', handleOptionChange);
  secondsSelect.addEventListener('change', handleOptionChange);
});
