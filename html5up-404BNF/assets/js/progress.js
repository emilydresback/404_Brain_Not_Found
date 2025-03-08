// Progress bar functionality for DeathValleyDash
// This file should be assets/js/progress.js

// Variables to track scavenger hunt progress
let totalLocations = 5; // Update this with the actual number of locations in your hunt
let foundLocations = 0;

// Function to update the progress bar
function updateProgressBar(percent) {
  const progressBar = document.getElementById("myProgressBar");
  if (progressBar) {
    progressBar.style.width = percent + "%";
  }
}

// Function to update progress when a new location is found
function locationFound() {
  foundLocations++;
  const percentComplete = (foundLocations / totalLocations) * 100;
  updateProgressBar(percentComplete);
  
  // You could add more functionality here like celebratory animations
  // or displaying messages when progress reaches certain milestones
  
  if (foundLocations === totalLocations) {
    // Hunt completed!
    alert("Congratulations! You've completed the Death Valley Dash!");
  }
}

// Initialize progress bar
document.addEventListener('DOMContentLoaded', function() {
  updateProgressBar(0); // Start with 0% progress
  
  // Make the progress bar advance when clicked (for testing purposes)
  // Remove this in production or replace with actual location detection
  const progressContainer = document.querySelector('.progress-container');
  if (progressContainer) {
    progressContainer.addEventListener('click', function() {
      if (foundLocations < totalLocations) {
        locationFound();
        console.log("Progress updated: " + foundLocations + "/" + totalLocations);
      }
    });
  }
});

// This function should be called from your map.js or chatbot.js 
// whenever a user successfully finds a location
// Example usage: locationFound();