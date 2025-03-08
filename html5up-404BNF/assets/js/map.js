// maps.js - Shows a map centered on user's location using Leaflet and OpenStreetMap

// Global variables
let map;
let userMarker;

function initMap() {
  console.log("Initializing map with Leaflet...");
  
  // If map already exists, remove it and create a fresh one
  if (map) {
    map.remove();
  }
  
  // Create map with default center (Clemson University) in case geolocation fails
  map = L.map('map').setView([34.6765, -82.8364], 15);
  
  // Add the OpenStreetMap tiles - no API key needed!
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Update status
  const statusElement = document.getElementById('map-status');
  if (statusElement) {
    statusElement.textContent = 'Getting your location...';
  }
  
  // Try to get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = [position.coords.latitude, position.coords.longitude];
        
        // Center map on user's location
        map.setView(userLocation, 15);
        
        // Add a marker for user's location
        if (userMarker) {
          userMarker.remove();
        }
        
        userMarker = L.circleMarker(userLocation, {
          radius: 8,
          fillColor: "#4285F4",
          color: "#FFFFFF",
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(map);
        
        // Store the user position globally
        window.currentUserPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Update status message
        if (statusElement) {
          statusElement.textContent = 'Map updated with your current location!';
        }
        
        // Set up hunt locations
        setupHuntLocations(map);
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (statusElement) {
          statusElement.textContent = 'Error getting your location. Using default location.';
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    // Browser doesn't support geolocation
    console.error("Geolocation is not supported by this browser");
    if (statusElement) {
      statusElement.textContent = 'Geolocation is not supported by your browser.';
    }
  }
  
  // Store map globally
  window.map = map;
  
  return map;
}

// Set up hunt locations
function setupHuntLocations(map) {
  // Define hunt locations (coordinates for Clemson landmarks)
  const locations = [
    { name: "Memorial Stadium", lat: 34.6785, lng: -82.8419 },
    { name: "Tillman Hall", lat: 34.6795, lng: -82.8369 },
    { name: "Cooper Library", lat: 34.6761, lng: -82.8357 },
    { name: "Bowman Field", lat: 34.6776, lng: -82.8377 },
    { name: "Hendrix Student Center", lat: 34.6758, lng: -82.8339 }
  ];
  
  // Clear existing hunt locations from previous setup
  if (window.huntLocations) {
    // Remove any markers from these locations if they exist
    window.huntLocations.forEach(location => {
      if (location.marker) {
        location.marker.remove();
      }
    });
  }
  
  // Create hunt location objects and add them to the global array
  window.huntLocations = locations.map((location, index) => {
    // Check if the location was previously found
    const wasFound = window.huntLocations && 
                     window.huntLocations[index] && 
                     window.huntLocations[index].found;
    
    // If this location was already found, add a marker for it
    let marker = null;
    if (wasFound) {
      marker = L.marker([location.lat, location.lng], {
        title: location.name
      }).addTo(map);
    }
    
    return {
      position: { lat: location.lat, lng: location.lng },
      name: location.name,
      index: index,
      found: wasFound || false,
      radius: 50, // Distance in meters to trigger "found" state
      marker: marker
    };
  });
}

// Verify current location and regenerate map
function verifyCurrentLocation() {
  console.log("Verifying location and regenerating map...");
  
  // First, regenerate the map to get fresh location
  initMap();
  
  // Then check for nearby locations
  setTimeout(() => {
    if (!window.currentUserPosition) {
      alert("Unable to determine your location. Please enable location services.");
      return;
    }
    
    if (!window.huntLocations) {
      alert("Hunt locations are not set up properly.");
      return;
    }
    
    let foundLocation = null;
    let closestDistance = Infinity;
    let closestLocation = null;
    
    // Check if user is near any hunt location
    for (const location of window.huntLocations) {
      if (!location.found) {
        const distance = calculateDistance(
          window.currentUserPosition.lat, 
          window.currentUserPosition.lng,
          location.position.lat, 
          location.position.lng
        );
        
        // Convert distance to meters (approximate)
        const distanceMeters = distance * 1000;
        
        // Keep track of closest location
        if (distanceMeters < closestDistance) {
          closestDistance = distanceMeters;
          closestLocation = location;
        }
        
        // Check if user is within the designated radius
        if (distanceMeters <= location.radius) {
          foundLocation = location;
          break;
        }
      }
    }
    
    if (foundLocation) {
      // Mark location as found
      foundLocation.found = true;
      
      // Add marker for found location
      foundLocation.marker = L.marker([foundLocation.position.lat, foundLocation.position.lng], {
        title: foundLocation.name
      }).addTo(map);
      
      // Update progress if progress.js is loaded
      if (typeof updateProgress === 'function') {
        updateProgress(foundLocation.index + 1);
      }
      
      // Show success message
      alert(`You found ${foundLocation.name}!`);
    } else if (closestLocation) {
      // Give a hint about the closest location
      const distanceMsg = closestDistance < 1 ? 
        `${Math.round(closestDistance * 1000)} meters` : 
        `${closestDistance.toFixed(2)} kilometers`;
      
      alert(`You're not at a landmark yet. The closest location is ${closestLocation.name}, about ${distanceMsg} away.`);
    } else {
      alert("You're not near any hunt locations. Keep exploring!");
    }
  }, 1000); // Small delay to ensure location is updated
}

// Calculate distance between two coordinates using Haversine formula
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

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize map
  initMap();
  
  // Set up verification button
  const verifyButton = document.getElementById('verify-location-btn');
  if (verifyButton) {
    verifyButton.addEventListener('click', verifyCurrentLocation);
  }
});