// script.js

window.addEventListener('DOMContentLoaded', function() {
  // Get references to HTML elements
  var wordDisplay = document.getElementById('word-display');
  var intervalSelect = document.getElementById('interval-select');
  var generatorToggle = document.getElementById('generator-toggle-button');
  var iconSpan = generatorToggle.querySelector('.green-play-icon');
  var textSpan = generatorToggle.querySelector('.generator-toggle-button-text');
  var progressIndicator = document.getElementById('progress-indicator');
  var definitionsToggle = document.getElementById('definitions-toggle');
  var definitionsDisplay = document.getElementById('definitions-display');
  var syllablesSelect = document.getElementById('syllables-select');
  var obscureWordsToggle = document.getElementById('obscure-words-toggle');
  var playlistFrame = document.getElementById('playlist-frame');
  var loadPlaylistInput = document.getElementById('load-playlist-input');
  var loadPlaylistButton = document.getElementById('load-playlist-button');

  // Declare variables
  var wordIntervalId; // ID for the word generation interval
  var progressIntervalId; // ID for the progress indicator interval
  var progressWidth; // Current width of the progress indicator
  var progressIteration; // Current iteration of the progress indicator
  var isProgressUpdating = false; // Flag to track if progress indicator is updating
  var isWordGenerationRunning = false; // Flag to track if word generation is running
  var intervalSelectValue = intervalSelect.value; // Selected value of the interval

  // Event listeners
  generatorToggle.addEventListener('click', toggleWordGeneration);
  intervalSelect.addEventListener('change', handleOptionChange);
  intervalSelect.addEventListener('input', handleOptionInput);
  definitionsToggle.addEventListener('change', toggleDefinitions);
  syllablesSelect.addEventListener('change', handleOptionChange);
  obscureWordsToggle.addEventListener('change', handleOptionChange);
  loadPlaylistInput.addEventListener('input', handlePlaylistInput);
  loadPlaylistButton.addEventListener('click', handleLoadPlaylistButtonClick);
  window.addEventListener('resize', adjustGeneratorToggleButtonHeight);

  // Adjust generator toggle button height on page load
  adjustGeneratorToggleButtonHeight();

  // Store the previous value of the interval select
  intervalSelect.dataset.previousValue = intervalSelectValue;

  // Fetch the word data from a JSON file
  fetch('words-temp.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      words = data; // Store the fetched word entries in the 'words' array
      startWordGeneration(); // Start word generation
      displayStartGenerator(false);
    })
    .catch(function(error) {
      console.error('Error fetching words:', error);
    });

  // Function to adjust generator toggle button height
  function adjustGeneratorToggleButtonHeight() {
    generatorToggle.style.height = loadPlaylistButton.offsetHeight + 'px';
  }

  // Generate a random word from the filtered list
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
      var definitions = filteredWords[randomNumber].d;

      if (!isProgressUpdating) {
        wordDisplay.textContent = randomWord;
        definitionsDisplay.value = definitions;
        startProgressIndicator();      
      }
    } else {
      wordDisplay.textContent = 'No matching words found.';
      definitionsDisplay.value = '';
    }
  }

  // Start word generation
  function startWordGeneration() {
    var interval = intervalSelectValue * 1000; // Convert selected value to milliseconds
    generateRandomWord(); // Generate the first word immediately
    wordIntervalId = setInterval(generateRandomWord, interval);
    isWordGenerationRunning = true;
  }

  // Stop word generation
  function stopWordGeneration() {
    clearInterval(wordIntervalId);
    wordIntervalId = null;
    isWordGenerationRunning = false;
    resetProgressIndicator();
  }

  // Toggle word generation on button click
  function toggleWordGeneration() {
    if (isWordGenerationRunning) {
      // Word generation is currently running, stop it
      stopWordGeneration();
      displayStartGenerator(true);
    } else {
      // Word generation is currently stopped, start it
      startWordGeneration();
      displayStartGenerator(false);
    }
  }

  function displayStartGenerator(isTrue) {
    if (isTrue) {
      iconSpan.classList.remove('red-stop-icon');
      iconSpan.classList.add('green-play-icon');
      textSpan.textContent = 'Start generator';
      generatorToggle.style.backgroundColor = 'red';
    } else {
      iconSpan.classList.remove('green-play-icon');
      iconSpan.classList.add('red-stop-icon');
      textSpan.textContent = 'Stop generator';
      generatorToggle.style.backgroundColor = 'limegreen';
    }
  }

  // Toggle definitions display
  function toggleDefinitions() {
    var computedStyles = window.getComputedStyle(definitionsDisplay);
    var display = computedStyles.getPropertyValue('display');

    if (display === 'none') {
      // Show the definitions display 
      definitionsDisplay.style.display = 'block';
    } else {
      // Hide the definitions display 
      definitionsDisplay.style.display = 'none';
    }
  }

  // Update the interval duration
  function handleOptionChange() {
    if (isWordGenerationRunning) {
      intervalSelectValue = intervalSelect.value;
    }
  }

  // Handle input of interval selection
  function handleOptionInput() {
    var previousValue = intervalSelect.dataset.previousValue || intervalSelectValue; // Store the previous value

    if (!intervalSelect.checkValidity()) {
      intervalSelect.reportValidity(); // Display the warning message
    
      // Revert the value after a short delay
      setTimeout(function() {
        intervalSelect.value = previousValue; // Restore the previous value
      }, 2500);
    } else {
      intervalSelect.dataset.previousValue = intervalSelect.value; // Update the previous value
      intervalSelectValue = intervalSelect.value;
    }
  }

  // Handle playlist input event
  function handlePlaylistInput() {
    var inputValue = loadPlaylistInput.value.trim(); // Trim whitespace

    if (inputValue.length > 0) {
      loadPlaylistButton.disabled = false; // Enable the button
    } else {
      loadPlaylistButton.disabled = true; // Disable the button
    }
  }

  // Handle load playlist button click event
  function handleLoadPlaylistButtonClick() {
    var inputValue = loadPlaylistInput.value.trim();
    var isUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(inputValue);

    if (isUrl) {
      playlistFrame.src = inputValue;
    } else {
      playlistFrame.src = 'https://www.youtube.com/embed/videoseries?list=' + inputValue;
    }

    loadPlaylistInput.value = '';

    playlistFrame.onerror = function() {
      loadPlaylistInput.value = inputValue;
      playlistFrame.style.backgroundImage = 'url("error-graphic.png")';
      // Or, you can set a custom text message
      // playlistFrame.textContent = 'Error loading playlist';
    };

    playlistFrame.onload = function() {
      playlistFrame.style.backgroundImage = 'none';
    };

    loadPlaylistButton.disabled = true;
  }

  // Start the progress indicator
  function startProgressIndicator() {
    progressWidth = 100;
    progressIteration = intervalSelectValue;
    progressIndicator.style.width = progressWidth + '%';
    progressIntervalId = setInterval(updateProgressIndicator, 1000);
    isProgressUpdating = true;
  }

  // Stop the progress indicator
  function stopProgressIndicator() {
    clearInterval(progressIntervalId);
    progressIntervalId = null;
    isProgressUpdating = false;
  }

  // Update the progress indicator
  function updateProgressIndicator() {
    var stepWidth = Math.ceil(100 / intervalSelectValue);

    progressIteration -= 1;
    progressWidth = Math.max(progressWidth - stepWidth, 0);  // Ensure progressWidth doesn't go below 0
    progressIndicator.style.width = progressWidth + '%';

    if (progressIteration < 0) {
      stopProgressIndicator();
      generateRandomWord();
    }
  }

  // Reset the progress indicator
  function resetProgressIndicator() {
    stopProgressIndicator();
    progressWidth = 0;
    progressIndicator.style.width = progressWidth + '%';
  }
});
