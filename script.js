// Select all the elements with a class of 'line'
const lyrics = document.querySelectorAll('.line');

// Select the audio element
const audio = document.querySelector('audio');

// Select the element with a class of 'box' which will contain the lyrics
const lyricsBox = document.querySelector('.box');

// Add a timeupdate event listener to the audio element
audio.addEventListener('timeupdate', function() {

  // Get the current time of the audio
  let currentTime = audio.currentTime;

  // Set the current line to null
  let currentLine = null;

  // Loop through all the lines of the lyrics
  for (let i = 0; i < lyrics.length; i++) {

    // Get the start time of the line
    let lineTime = parseFloat(lyrics[i].getAttribute('data-start'));

    // Check if the current time is greater than or equal to the start time of the line
    // and less than the start time of the next line (or the end of the audio)
    if (lineTime <= currentTime && (i == lyrics.length - 1 || parseFloat(lyrics[i + 1].getAttribute('data-start')) > currentTime)) {

      // Remove the 'highlight' class from all the lines
      for (let j = 0; j < lyrics.length; j++) {
        lyrics[j].classList.remove('highlight');
      }

      // Add the 'highlight' class to the current line
      lyrics[i].classList.add('highlight');

      // Set the current line to the index of the highlighted line
      currentLine = i;

      // Break out of the loop once the current line is found
      break;
    }
  }

  // If the current line is not null (i.e. a line is currently highlighted)
  if (currentLine !== null) {

    // Calculate the scroll offset based on the height of the box and the height of the current line
    const scrollOffset = (lyricsBox.offsetHeight / 2) - (lyrics[currentLine].offsetHeight / 2);

    // Set the scrollTop property of the lyrics box to the offset of the current line
    lyricsBox.scrollTop = (lyrics[currentLine].offsetTop - scrollOffset);
  }
});


// Request microphone access from the user to enable autoplay in Chrome
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    // Start playing the audio
    audio.play();

    // Stop microphone stream acquired by getUserMedia
    stream.getTracks().forEach(function(track) {
      track.stop();
    });

    // Add the event listener for time updates to display the lyrics and scroll the container
    audio.addEventListener('timeupdate', displayLyrics);
  })
  .catch(function(err) {
    console.log("Error: " + err);
  });
