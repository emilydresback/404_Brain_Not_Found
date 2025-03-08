// Function to verify current location
function verifyCurrentLocation() {
    console.log("Verifying location button clicked");
    
    // Check if the DeathValleyDash namespace exists
    if (!window.DeathValleyDash || !window.DeathValleyDash.currentUserPosition) {
      console.error("User position not available");
      alert("Unable to determine your location. Please ensure location services are enabled.");
      return;
    }
    
    console.log("Current position:", window.DeathValleyDash.currentUserPosition);
    
    // Check if there are hunt locations defined
    if (!window.DeathValleyDash.huntLocations || window.DeathValleyDash.huntLocations.length === 0) {
      console.error("Hunt locations not defined");
      alert("Hunt locations are not configured. Please refresh the page.");
      return;
    }
    
    // For testing purposes, automatically find the next location
    // You can later replace this with actual GPS-based verification
    const nextLocationIndex = window.DeathValleyDash.foundLocations;
    if (nextLocationIndex < window.DeathValleyDash.totalLocations) {
      // Mark the location as found
      if (window.DeathValleyDash.huntLocations[nextLocationIndex]) {
        window.DeathValleyDash.huntLocations[nextLocationIndex].found = true;
        
        // Get the location name
        const locationName = window.DeathValleyDash.huntLocations[nextLocationIndex].name;
        
        // Update the progress bar
        if (typeof updateProgress === 'function') {
          updateProgress(nextLocationIndex + 1);
          
          // Show success message
          alert(`You found ${locationName}! ${nextLocationIndex + 1} out of ${window.DeathValleyDash.totalLocations} locations found.`);
          
          // If using a map, add a marker for the found location
          if (window.DeathValleyDash.map && window.DeathValleyDash.huntLocations[nextLocationIndex].position) {
            const marker = new google.maps.Marker({
              position: window.DeathValleyDash.huntLocations[nextLocationIndex].position,
              map: window.DeathValleyDash.map,
              icon: {
                url: 'images/location-found.png', // Replace with your custom marker
                scaledSize: new google.maps.Size(32, 32)
              },
              title: locationName
            });
          }
        } else {
          console.error("updateProgress function not found");
          alert("Found a location, but couldn't update progress. Please refresh the page.");
        }
      }
    } else {
      alert("You've already found all locations!");
    }
  }
  
  // Make sure we attach the event listener properly
  document.addEventListener('DOMContentLoaded', function() {
    const verifyButton = document.getElementById('verify-location-btn');
    
    if (verifyButton) {
      console.log("Verify location button found, attaching event listener");
      
      // Remove any existing listeners to avoid duplicates
      const newButton = verifyButton.cloneNode(true);
      verifyButton.parentNode.replaceChild(newButton, verifyButton);
      
      // Add our new listener
      newButton.addEventListener('click', verifyCurrentLocation);
    } else {
      console.error("Verify location button not found in DOM");
    }
  });