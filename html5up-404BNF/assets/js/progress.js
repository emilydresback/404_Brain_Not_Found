// Progress bar and location verification functionality for DeathValleyDash

// Variables to track scavenger hunt progress
let totalLocations = 5;
let foundLocations = 0;

// Function to update the progress bar
function updateProgress(locationNumber) {
  // Get the progress bar fill element
  const progressFill = document.getElementById('progress-fill');
  
  // Get all node elements
  const nodes = document.querySelectorAll('.progress-node');
  
  if (progressFill && nodes.length > 0) {
    // Update the progress bar width
    const percent = (locationNumber / totalLocations) * 100;
    progressFill.style.width = percent + '%';
    
    // Update nodes - mark completed nodes
    for (let i = 0; i < nodes.length; i++) {
      if (i < locationNumber) {
        // Completed nodes
        nodes[i].style.backgroundColor = '#F56600';
        nodes[i].style.borderColor = '#D45500';
        nodes[i].style.color = 'white';
      } else {
        // Incomplete nodes
        nodes[i].style.backgroundColor = '#f1f1f1';
        nodes[i].style.borderColor = '#ccc';
        nodes[i].style.color = 'black';
      }
    }
    
    console.log('Progress updated to location ' + locationNumber + ' of ' + totalLocations);
    
    if (locationNumber === totalLocations) {
      setTimeout(function() {
        alert('Congratulations! You completed the Death Valley Dash!');
      }, 600);
    }
  } else {
    console.error('Progress bar or nodes not found!');
  }
}

// Function to handle location verification button click
function verifyLocation() {
  // Check if the map.js variables are available
  if (typeof currentUserPosition === 'undefined' || !currentUserPosition) {
    alert('Unable to determine your location. Please make sure location services are enabled.');
    return;
  }
  
  if (typeof huntLocations === 'undefined' || !huntLocations.length) {
    alert('Hunt locations not loaded. Please refresh the page and try again.');
    return;
  }
  
  // Check proximity to hunt locations
  let foundLocation = null;
  
  for (const location of huntLocations) {
    if (!location.found) {
      const distance = calculateDistance(
        currentUserPosition.lat, currentUserPosition.lng,
        location.position.lat, location.position.lng
      );
      
      // Convert distance to meters (approximate)
      const distanceMeters = distance * 1000;
      
      // Check if user is within the designated radius
      if (distanceMeters <= location.radius) {
        // Mark location as found
        location.found = true;
        foundLocation = location;
        foundLocations = location.index + 1;
        
        // Update progress
        updateProgress(foundLocations);
        
        // Add marker for found location if map is available
        if (typeof map !== 'undefined' && map) {
          const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            icon: {
              url: 'images/location-found.png', // Replace with your custom marker
              scaledSize: new google.maps.Size(32, 32)
            },
            title: location.name
          });
        }
        
        break;
      }
    }
  }
  
  if (foundLocation) {
    // Location found!
    alert(`You found ${foundLocation.name}!`);
  } else {
    // No location nearby
    alert('You are not near any hunt locations. Keep exploring!');
  }
}

// Calculate distance between two coordinates using Haversine formula
// This is a duplicate of the function in maps.js, but included here for independence
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

// Convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Initialize progress bar and verification button
document.addEventListener('DOMContentLoaded', function() {
  // Initialize progress bar
  updateProgress(0);
  
  // Set up verification button click handler
  const verifyButton = document.getElementById('verify-location-btn');
  if (verifyButton) {
    verifyButton.addEventListener('click', verifyLocation);
    console.log('Location verification button initialized');
  } else {
    console.error('Location verification button not found!');
  }
  
  // For testing purposes, make the progress bar clickable to advance progress
  const progressContainer = document.querySelector('#progress-container');
  if (progressContainer) {
    progressContainer.addEventListener('click', function() {
      if (foundLocations < totalLocations) {
        foundLocations++;
        updateProgress(foundLocations);
      }
    });
    console.log('Progress bar click handler initialized (for testing)');
  }
  
  console.log('Progress tracking initialized');
});