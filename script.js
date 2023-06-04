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

  // Store the previous value of the interval select
  intervalSelect.dataset.previousValue = intervalSelectValue;

  // Event listeners
  generatorToggle.addEventListener('click', toggleWordGeneration);
  intervalSelect.addEventListener('change', handleOptionChange);
  intervalSelect.addEventListener('input', handleOptionInput);
  definitionsToggle.addEventListener('change', toggleDefinitions);
  syllablesSelect.addEventListener('change', handleOptionChange);
  obscureWordsToggle.addEventListener('change', handleOptionChange);
  loadPlaylistInput.addEventListener('input', handlePlaylistInput);
  loadPlaylistButton.addEventListener('click', handleLoadPlaylistButtonClick);

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

  // Start word generation with the selected interval
  function startWordGeneration() {
    generateRandomWord();
    var intervalValue = parseInt(intervalSelect.value);

    if (isNaN(intervalValue) || intervalValue <= 0) {
      stopWordGeneration();
    } else {
      wordIntervalId = setInterval(generateRandomWord, intervalValue * 1000);
      isWordGenerationRunning = true;
      displayStartGenerator(true);
    }
  }

  // Stop word generation
  function stopWordGeneration() {
    clearInterval(wordIntervalId);
    isWordGenerationRunning = false;
    displayStartGenerator(false);
  }

  // Toggle word generation
  function toggleWordGeneration() {
    if (isWordGenerationRunning) {
      stopWordGeneration();
    } else {
      startWordGeneration();
    }
  }

  // Handle option change event for interval and syllables select elements
  function handleOptionChange(event) {
    if (isWordGenerationRunning) {
      stopWordGeneration();
      startWordGeneration();
    }
  }

  // Handle input event for interval select element
  function handleOptionInput(event) {
    var inputValue = parseInt(event.target.value);
    if (isNaN(inputValue) || inputValue <= 0) {
      event.target.value = intervalSelect.dataset.previousValue;
    } else {
      intervalSelect.dataset.previousValue = event.target.value;
    }
  }

  // Toggle definitions display
  function toggleDefinitions() {
    definitionsDisplay.classList.toggle('hidden');
  }

  // Start progress indicator animation
  function startProgressIndicator() {
    progressWidth = 0;
    progressIteration = 0;
    isProgressUpdating = true;
    progressIndicator.style.width = progressWidth + '%';
    progressIndicator.classList.remove('hidden');
    progressIntervalId = setInterval(updateProgressIndicator, 100);
  }

  // Update progress indicator
  function updateProgressIndicator() {
    progressIteration++;
    progressWidth = progressIteration * 10;

    if (progressWidth > 100) {
      stopProgressIndicator();
    } else {
      progressIndicator.style.width = progressWidth + '%';
    }
  }

  // Stop progress indicator
  function stopProgressIndicator() {
    clearInterval(progressIntervalId);
    isProgressUpdating = false;
    progressIndicator.classList.add('hidden');
  }

  // Handle playlist input event
  function handlePlaylistInput() {
    var playlistUrl = loadPlaylistInput.value;
    playlistFrame.src = playlistUrl;
  }

  // Handle load playlist button click event
  function handleLoadPlaylistButtonClick() {
    var playlistUrl = loadPlaylistInput.value;
    if (playlistUrl) {
      window.open(playlistUrl);
    }
  }
});
