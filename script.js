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

  function generateRandomWord() {
    var words = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Spring', 'Summer', 'Autumn', 'Winter'];
    var randomNumber = Math.floor(Math.random() * words.length);
    var randomWord = words[randomNumber];
    wordElement.textContent = randomWord;

    // Generate random sentences for the text control
    var sentences = [
      'The quick brown fox jumps over the lazy dog.',
      'OpenAI\'s ChatGPT is a powerful language model.',
      'I love coding and learning new technologies.',
      'The sun sets in the west, bringing an end to the day.',
      'This is a super long sentence filed with a bunch of nonsense wording that should push the boundaries of the new text control that I have created today purely for my testing purposes.',
      'Artificial intelligence is transforming various industries.'
    ];
    var randomSentences = '';
    for (var i = 0; i < 2; i++) {
      var randomIndex = Math.floor(Math.random() * sentences.length);
      randomSentences += sentences[randomIndex] + ' ';
    }
  textControl.textContent = randomSentences;
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
    
    // Adjust the width of the definition button to match the toggle button
    definitionButton.style.width = toggleButton.style.width';  
  }
  
  window.addEventListener('resize', function() {
    toggleButton.style.width = definitionButton.offsetWidth + 'px';
  });  
  
  secondsSelect.addEventListener('change', function() {
    // Update interval only if the word generation is currently running
    if (isWordGenerationRunning) {
      stopWordGeneration();
      startWordGeneration();
    }
  });

  // Dynamically adjust the width of the toggle button to match the definition button
  toggleButton.style.width = definitionButton.offsetWidth + 'px';
  
  // Hide the text control on page load
  textControl.style.display = 'none';
  
  toggleButton.addEventListener('click', toggleWordGeneration);
  definitionButton.addEventListener('click', toggleDefinition);
  
  startWordGeneration();
});
