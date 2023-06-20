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
  var hearWordButton = document.getElementById('hear-word-button');
  var voiceSelect = document.getElementById('voice-select');
  var syllablesSelect = document.getElementById('syllables-select');
  var obscureWordsToggle = document.getElementById('obscure-words-toggle');
  var playlistFrame = document.getElementById('playlist-frame');
  var loadPlaylistInput = document.getElementById('load-playlist-input');
  var loadPlaylistButton = document.getElementById('load-playlist-button');
  var fullscreenToggle = document.getElementById('fullscreen-toggle');
  var animationToggle = document.getElementById('animation-toggle');
  var hideControlsButton = document.getElementById('hide-controls');
  var hideControlsImage = hideControlsButton.querySelector('img');
  var hideControlsTitle = hideControlsButton.getAttribute('title');
  var row1 = document.querySelector('.row1');
  var row3Col1 = document.querySelector('.row3-col1');
  var row3Col2_1 = document.querySelector('.row3-col2-1');
  var row3Col2_2 = document.querySelector('.row3-col2-2');
  var row3Col3_1 = document.querySelector('.row3-col3-1');
  var row3Col3_2 = document.querySelector('.row3-col3-2');
  var row3Col4_1 = document.querySelector('.row3-col4-1');
  var row3Col4_2 = document.querySelector('.row3-col4-2');
  var row3Col5 = document.querySelector('.row3-col5');

  // Declare variables
  var promise; // Used to asynchronously load the speech synthesis voices
  var wordIntervalId; // ID for the word generation interval
  var progressIntervalId; // ID for the progress indicator interval
  var progressWidth; // Current width of the progress indicator
  var progressIteration; // Current iteration of the progress indicator
  var isFullscreen = false; // Flag to track fullscreen state
  var isProgressUpdating = false; // Flag to track if progress indicator is updating
  var isWordGenerationRunning = false; // Flag to track if word generation is running
  var intervalSelectValue = intervalSelect.value; // Selected value of the interval
    
  // Event listeners
  generatorToggle.addEventListener('click', toggleWordGeneration);
  intervalSelect.addEventListener('change', handleOptionChange);
  intervalSelect.addEventListener('input', handleOptionInput);
  definitionsToggle.addEventListener('change', handleDefinitionsToggle);
  hearWordButton.addEventListener('click', handleHearWordButtonClick);
  syllablesSelect.addEventListener('change', handleOptionChange);
  obscureWordsToggle.addEventListener('change', handleOptionChange);
  animationToggle.addEventListener('change', handleAnimationToggle);
  loadPlaylistInput.addEventListener('input', handlePlaylistInput);
  loadPlaylistButton.addEventListener('click', handleLoadPlaylistButtonClick);
  fullscreenToggle.addEventListener('click', handleFullScreenToggle);
  hideControlsButton.addEventListener('click', toggleRow3);

  // Load the speech synthesis voices
  promise = new Promise(loadVoices);
  promise.then(handleVoices);

  // Store the previous value of the interval select
  intervalSelect.dataset.previousValue = intervalSelectValue;

  // Fetch the word data from a JSON file
  fetch('words.json')
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
  
  function loadVoices(resolve) {
    // Check if voices are already available
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve(window.speechSynthesis.getVoices());
    } else {
      // Wait for the voiceschanged event
      window.speechSynthesis.addEventListener('voiceschanged', voicesChangedListener);
    }

    function voicesChangedListener() {
      window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedListener);
      resolve(window.speechSynthesis.getVoices());
    }
  }

  function handleVoices(voices) {
    // Select only the voices with 'English (United States)' language
    var englishVoices = voices.filter(voice => voice.lang.startsWith('en-US') || voice.lang.startsWith('nl-NL'));
    
    // Sort the englishVoices array alphabetically
    englishVoices.sort((a, b) => a.name.localeCompare(b.name));    
    
    // Clear any existing options
    voiceSelect.innerHTML = '';
    
    // Assign voices to the select-voices drop-down element
    englishVoices.forEach(createVoiceOption);

    // Enable the hearWord button
    hearWordButton.disabled = false; // Enable the button
  }

  function createVoiceOption(voice) {
    var option = document.createElement('option');
    option.value = voice.name;
    option.text = voice.name.split(' ')[1]; // Extract the given name from the voice name
    voiceSelect.appendChild(option);
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
      generatorToggle.title = 'Random word generator is not running';
    } else {
      iconSpan.classList.remove('green-play-icon');
      iconSpan.classList.add('red-stop-icon');
      textSpan.textContent = 'Stop generator';
      generatorToggle.style.backgroundColor = 'limegreen';
      generatorToggle.title = 'Random word generator is running';
    }
  }

  // Toggle definitions display
  function handleDefinitionsToggle() {
    var computedStyles = window.getComputedStyle(definitionsDisplay);
    var color = computedStyles.getPropertyValue('color');

    if (color === 'rgb(255, 255, 255)' || color === 'white') {
      // Hide the contents of the element
      definitionsDisplay.style.color = 'transparent';
      definitionsDisplay.style.overflow = 'hidden';
    } else {
      // Show the contents of the element
      definitionsDisplay.style.color = 'white';
      definitionsDisplay.style.overflow = 'auto';
    }
  }

  // Toggle the progress bar animation
  function handleAnimationToggle() {
    // Check if the checkbox is checked
    if (animationToggle.checked) {
      // Hide the progress indicator
      progressIndicator.style.display = 'none';
    } else {
      // Show the progress indicator
      progressIndicator.style.display = 'block';
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
    var match;
    var inputValue = loadPlaylistInput.value.trim();
    var isUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(inputValue);
    var regex = /^https:\/\/www\.youtube\.com\/playlist\?list=(.*)$/;

    if (!isUrl) {
      playlistFrame.src = 'https://www.youtube.com/embed/videoseries?list=' + inputValue;
    } else {
      match = inputValue.match(regex);
      if (!match) {
         playlistFrame.src = inputValue;
      } else {
         playlistFrame.src = 'https://www.youtube.com/embed/videoseries?list=' + match[1];
      }
    }

    loadPlaylistInput.value = '';

    playlistFrame.onerror = function() {
      loadPlaylistInput.value = inputValue;
      playlistFrame.style.backgroundImage = 'url("error.png")';
      playlistFrame.style.backgroundSize = 'cover';
      playlistFrame.textContent = 'Error loading playlist';
      playlistFrame.style.color = 'white'; // Set the font color to white
      playlistFrame.style.fontWeight = 'bold'; // Set the font style to bold
      playlistFrame.style.fontSize = '20px'; // Set the font size to 20 pixels
      playlistFrame.style.textAlign = 'center'; // Horizontally center the text
      playlistFrame.style.verticalAlign = 'top'; // Align the text to the top of the iframe
    };

    playlistFrame.onload = function() {
      playlistFrame.style.backgroundImage = 'none';
    };

    loadPlaylistButton.disabled = true;
  }

  function handleHearWordButtonClick() {
    var voices = window.speechSynthesis.getVoices();
    var utterance = new SpeechSynthesisUtterance(wordDisplay.textContent);
    var voiceToUse = voices.find(voice => voice.name === voiceSelect.value);
    utterance.voice = voiceToUse;
    window.speechSynthesis.speak(utterance);
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
  
  // Handle fullscreen toggle button click event
  function handleFullScreenToggle() {
    if (!isFullscreen) {
      // If not in fullscreen, enter fullscreen mode
      enterFullscreen();
    } else {
      // If already in fullscreen, exit fullscreen mode
      exitFullscreen();
    }
  }
  
   // Function to enter fullscreen mode
  function enterFullscreen() {
    // Request fullscreen based on browser compatibility
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }

    // Update state and button properties for fullscreen mode
    isFullscreen = true;
    fullscreenToggle.title = 'Exit full screen';
    fullscreenToggle.querySelector('img').src = 'min.png';
  }

  // Function to exit fullscreen mode
  function exitFullscreen() {
    // Exit fullscreen based on browser compatibility
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    // Update state and button properties for exiting fullscreen mode
    isFullscreen = false;
    fullscreenToggle.title = 'Enter full screen';
    fullscreenToggle.querySelector('img').src = 'max.png';
  }
  
  // Function to collapse and expand the row containing the controls
  function toggleRow3() {
    if (row3Col2_1.style.display === 'none') {
      // Expand row 3
      row3Col1.style.display = 'table-cell';
      row3Col2_1.style.display = 'table-cell';
      row3Col2_2.style.display = 'table-cell';
      row3Col3_1.style.display = 'table-cell';
      row3Col3_2.style.display = 'table-cell';
      row3Col4_1.style.display = 'table-cell';
      row3Col4_2.style.display = 'table-cell';
      row3Col5.style.display = 'table-cell';
      row1.style.height = '50vh';
      hideControlsImage.src = 'hide.png';
      hideControlsButton.setAttribute('title', 'Hide controls');
    } else {
      // Collapse row 3
      row3Col1.style.display = 'none';
      row3Col2_1.style.display = 'none';
      row3Col2_2.style.display = 'none';
      row3Col3_1.style.display = 'none';
      row3Col3_2.style.display = 'none';
      row3Col4_1.style.display = 'none';
      row3Col4_2.style.display = 'none';
      row3Col5.style.display = 'none';
      row1.style.height = '82vh';
      hideControlsImage.src = 'show.png';
      hideControlsButton.setAttribute('title', 'Show controls');
    }
  }
});
