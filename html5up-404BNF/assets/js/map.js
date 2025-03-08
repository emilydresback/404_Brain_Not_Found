// Key locations on campus
const locations = [
    { id: "location1", name: "Tillman Hall", lat: 34.6796, lng: -82.8371, found: false },
    { id: "location2", name: "Death Valley Stadium", lat: 34.6785, lng: -82.8417, found: false },
    { id: "location3", name: "Cooper Library", lat: 34.6772, lng: -82.8367, found: false },
    { id: "location4", name: "Botanical Gardens", lat: 34.6730, lng: -82.8230, found: false },
    { id: "location5", name: "Hendrix Student Center", lat: 34.6755, lng: -82.8354, found: false }
  ];
  
  // Clemson center coordinates
  const clemsonCenter = { lat: 34.6761, lng: -82.8364 };
  
  // Map variable
  let map;
  let userMarker;
  const markers = [];
  
  // Initialize the map
  function initMap() {
    // Create the map
    map = new google.maps.Map(document.getElementById("map"), {
      center: clemsonCenter,
      zoom: 15,
      mapTypeId: "roadmap",
      mapTypeControl: false,
      fullscreenControl: false
    });
    
    // Add markers for key locations
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png"
        }
      });
      
      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div><strong>${location.name}</strong></div>`
      });
      
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        
        // Toggle the location as found when marker is clicked
        const locationElement = document.getElementById(location.id);
        if (locationElement) {
          toggleLocation(location.id);
        }
      });
      
      markers.push({ id: location.id, marker: marker });
    });
    
    // Add user location tracking
    trackUserLocation();
  }
  
  // Track user location
  function trackUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          document.getElementById("map-status").textContent = 
            `Your location: ${userPos.lat.toFixed(6)}, ${userPos.lng.toFixed(6)}`;
          
          // Add or update user marker
          if (!userMarker) {
            userMarker = new google.maps.Marker({
              position: userPos,
              map: map,
              title: "Your Location",
              icon: {
                url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }
            });
          } else {
            userMarker.setPosition(userPos);
          }
          
          // Check if user is near any locations
          checkProximity(userPos);
        },
        (error) => {
          document.getElementById("map-status").textContent = 
            `Error: ${getGeolocationErrorMessage(error)}`;
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    } else {
      document.getElementById("map-status").textContent = 
        "Geolocation is not supported by this browser.";
    }
  }
  
  // Check if user is near any locations
  function checkProximity(userPos) {
    locations.forEach(location => {
      const distance = getDistance(
        userPos.lat, userPos.lng,
        location.lat, location.lng
      );
      
      // If within 50 meters of a location, mark it as found
      if (distance < 50) {
        const locationElement = document.getElementById(location.id);
        if (locationElement && !location.found) {
          // Mark as found if not already found
          toggleLocation(location.id);
          
          // Update marker icon to green
          const marker = markers.find(m => m.id === location.id);
          if (marker) {
            marker.marker.setIcon("https://maps.google.com/mapfiles/ms/icons/green-dot.png");
          }
        }
      }
    });
  }
  
  // Calculate distance between two points in meters
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    return R * c; // distance in meters
  }
  
  // Get error message for geolocation errors
  function getGeolocationErrorMessage(error) {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        return "User denied the request for Geolocation.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case error.TIMEOUT:
        return "The request to get user location timed out.";
      default:
        return "An unknown error occurred.";
    }
  }
  
  // Update marker when location is toggled
  function updateMarker(locationId, isFound) {
    const marker = markers.find(m => m.id === locationId);
    if (marker) {
      marker.marker.setIcon(isFound ? 
        "https://maps.google.com/mapfiles/ms/icons/green-dot.png" : 
        "https://maps.google.com/mapfiles/ms/icons/orange-dot.png");
    }
  }
  
  // Override the toggleLocation function to also update markers
  document.addEventListener('DOMContentLoaded', function() {
    // Wait until the original toggleLocation function is defined
    const originalToggleLocation = window.toggleLocation;
    
    // Replace it with our enhanced version
    window.toggleLocation = function(locationId) {
      // Call the original function
      originalToggleLocation(locationId);
      
      // Update the marker
      const location = huntLocations.find(loc => loc.id === locationId);
      if (location) {
        updateMarker(locationId, location.found);
      }
    };
  });