// script.js

window.addEventListener('DOMContentLoaded', function() {
  var wordDisplay = document.getElementById('word-display');
  var intervalSelect = document.getElementById('interval-select');
  var intervalId;
  var generatorToggle = document.getElementById('generator-toggle');
  var isWordGenerationRunning = false;
  var definitionToggle = document.getElementById('definition-toggle');
  var definitionDisplay = document.getElementById('definition-display');
  var syllablesSelect = document.getElementById('syllables-select');
  var obscureWordsToggle = document.getElementById('obscure-words-toggle');
  var progressBar = document.getElementById('progress-bar');
  var progressBlocks = progressBar.getElementsByClassName('progress-block');
  
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
    if (!obscureWordsToggle.checked) {
      filteredWords = filteredWords.filter(function(word) {
        return word.c == 1;
      });
    }

    // Generate a random word from the filtered list
    if (filteredWords.length > 0) {
      var randomNumber = Math.floor(Math.random() * filteredWords.length);
      var randomWord = filteredWords[randomNumber].w;
      var definition = filteredWords[randomNumber].d;

      wordDisplay.textContent = randomWord;
      definitionDisplay.value = definition;
      
      updateProgressBar(); // Update the progress bar
    } else {
      wordDisplay.textContent = 'No matching words found.';
      definitionDisplay.value = '';
    }
  }

  function startWordGeneration() {
    var interval = intervalSelect.value * 1000; // Convert selected value to milliseconds
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
      generatorToggle.textContent = 'Start generator';
      generatorToggle.style.backgroundColor = 'red';
    } else {
      // Word generation is currently stopped, start it
      startWordGeneration();
      generatorToggle.textContent = 'Stop generator';
      generatorToggle.style.backgroundColor = 'green';
    }
  }

  function toggleDefinition() {
    if (definitionDisplay.style.display === 'none') {
      // Show the definition display and update the button text
      definitionDisplay.style.display = 'block';
      definitionToggle.textContent = 'Hide definition';
    } else {
      // Hide the definition display and update the button text
      definitionDisplay.style.display = 'none';
      definitionToggle.textContent = 'Show definition';
    }
  }

  function handleOptionChange() {
    if (isWordGenerationRunning) {
      // Word generation is currently running, update the interval duration
      var interval = intervalSelect.value * 1000; // Convert selected value to milliseconds
      clearInterval(intervalId);
      intervalId = setInterval(generateRandomWord, interval);
    }
  }

  function updateProgressBar() {
    var progress = 0;

    // Calculate the progress based on the displayed word
    if (wordDisplay.textContent !== 'No matching words found.') {
      progress = Math.floor((wordDisplay.textContent.length / 10) * progressBlocks.length);
    }

    // Reset all progress blocks to empty
    for (var i = 0; i < progressBlocks.length; i++) {
      progressBlocks[i].classList.remove('filled');
    }

    // Fill the progress blocks based on the calculated progress
    for (var j = 0; j < progress; j++) {
      progressBlocks[j].classList.add('filled');
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

  // Dynamically adjust the width of the generator toggle button to match the definition toggle button
  window.addEventListener('resize', function() {
    generatorToggle.style.width = definitionToggle.offsetWidth + 'px';
  });

  // Hide the definition display on page load
  definitionDisplay.style.display = 'none';

  generatorToggle.addEventListener('click', toggleWordGeneration);
  definitionToggle.addEventListener('click', toggleDefinition);
  syllablesSelect.addEventListener('change', handleOptionChange);
  obscureWordsToggle.addEventListener('change', handleOptionChange);
  intervalSelect.addEventListener('change', handleOptionChange);
});
