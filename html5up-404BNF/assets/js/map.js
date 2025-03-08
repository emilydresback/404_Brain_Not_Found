
// Load environment variables from .env file
require('dotenv').config();

// Fetch API key from server
/*fetch('/maps-api-key')
  .then(response => response.json())
  .then(data => {
    const script = document.createElement('script');
    const apiKey = env.GOOGLE_MAPS_API_KEY; // TODO: Replace with API Key
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  })
  .catch(error => {
    console.error('Error loading API key:', error);
    document.getElementById('map-status').textContent = 'Error loading map. Please try again later.';
  });*/

const script = document.createElement('script');
let apiKey = MapAPIPhrase(); // TODO: Replace with API Key
script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.body.appendChild(script);
  
// Global variables
let map;
let userMarker;
let huntLocations = [];
let watchId;

// Initialize the map (this function will be called by the Google Maps API once loaded)
function initMap() {
  // Default center on Clemson University
  const clemsonCenter = { lat: 34.6765, lng: -82.8364 };
  
  // Create map centered on Clemson
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: clemsonCenter,
    mapTypeId: "roadmap",
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  });
  
  // Set up location tracking
  setupLocationTracking();
  
  // Set up hunt locations (these would be your actual scavenger hunt locations)
  setupHuntLocations();
  
  // Update status
  document.getElementById('map-status').textContent = 'Map loaded! Enable location to start the hunt.';
}

// Set up location tracking
function setupLocationTracking() {
  if (navigator.geolocation) {
    // Options for the location tracking
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    };
    
    // Start watching position
    watchId = navigator.geolocation.watchPosition(
      updateUserPosition,
      handleLocationError,
      options
    );
    
    // Also get position immediately
    navigator.geolocation.getCurrentPosition(
      updateUserPosition,
      handleLocationError,
      options
    );
  } else {
    document.getElementById('map-status').textContent = 'Geolocation is not supported by this browser.';
  }
}

// Update user position on map
function updateUserPosition(position) {
  const userPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  
  // Create marker if it doesn't exist
  if (!userMarker) {
    userMarker = new google.maps.Marker({
      position: userPosition,
      map: map,
      icon: {
        url: 'images/user-location.png', // Replace with your custom marker icon
        scaledSize: new google.maps.Size(32, 32)
      },
      title: "Your Location"
    });
  } else {
    // Update existing marker
    userMarker.setPosition(userPosition);
  }
  
  // Center map on user
  map.setCenter(userPosition);
  
  // Check if user is near any hunt locations
  checkProximityToLocations(userPosition);
  
  // Update status
  document.getElementById('map-status').textContent = 'Location tracking active. Find the hidden locations!';
}

// Handle location errors
function handleLocationError(error) {
  let errorMessage;
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = "Location access denied. Please enable location services.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorMessage = "Location request timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorMessage = "An unknown error occurred.";
      break;
  }
  
  document.getElementById('map-status').textContent = errorMessage;
}

// Set up hunt locations
function setupHuntLocations() {
  // Define hunt locations (coordinates for Clemson landmarks)
  const locations = [
    { name: "Memorial Stadium", lat: 34.6785, lng: -82.8419 },
    { name: "Tillman Hall", lat: 34.6795, lng: -82.8369 },
    { name: "Cooper Library", lat: 34.6761, lng: -82.8357 },
    { name: "Bowman Field", lat: 34.6776, lng: -82.8377 },
    { name: "Hendrix Student Center", lat: 34.6758, lng: -82.8339 }
  ];
  
  // Create hidden markers for each location (not visible to the user)
  huntLocations = locations.map((location, index) => {
    return {
      position: { lat: location.lat, lng: location.lng },
      name: location.name,
      index: index,
      found: false,
      radius: 50 // Distance in meters to trigger "found" state
    };
  });
}

// Check if user is near any hunt locations
function checkProximityToLocations(userPosition) {
  huntLocations.forEach(location => {
    if (!location.found) {
      const distance = calculateDistance(
        userPosition.lat, userPosition.lng,
        location.position.lat, location.position.lng
      );
      
      // Convert distance to meters (approximate)
      const distanceMeters = distance * 1000;
      
      // Check if user is within the designated radius
      if (distanceMeters <= location.radius) {
        // Mark location as found
        location.found = true;
        
        // Call the progress update function (from progress.js)
        if (typeof updateProgress === 'function') {
          updateProgress(location.index + 1);
        }
        
        // Show a notification
        alert(`You found ${location.name}!`);
        
        // Add marker for found location
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
    }
  });
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

// Clean up when the page is unloaded
window.addEventListener('beforeunload', function() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
});