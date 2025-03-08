function initMap() {
    // Default center (Clemson University) in case geolocation fails
    const defaultCenter = { lat: 34.6765, lng: -82.8364 };
    
    // Create the map with default center initially
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: defaultCenter,
      mapTypeId: "roadmap",
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });
    
    // Try to get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // If successful, recenter the map on user's location
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Update map center
          map.setCenter(userLocation);
          
          // Add a marker for the user's location
          const userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Your Location",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2
            }
          });
          
          // Store the user position and map globally for other functions
          window.currentUserPosition = userLocation;
          window.userMap = map;
          window.userMarker = userMarker;
          
          // Update status message if there's a status element
          const statusElement = document.getElementById('map-status');
          if (statusElement) {
            statusElement.textContent = 'Location found! You can now start the hunt.';
          }
        },
        (error) => {
          // Handle geolocation error
          console.error("Geolocation error:", error);
          const statusElement = document.getElementById('map-status');
          if (statusElement) {
            statusElement.textContent = 'Error getting your location. Please enable location services.';
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Browser doesn't support geolocation
      console.error("Geolocation is not supported by this browser");
      const statusElement = document.getElementById('map-status');
      if (statusElement) {
        statusElement.textContent = 'Geolocation is not supported by your browser.';
      }
    }
    
    // Store the map globally for other functions to access
    window.map = map;
  }
  
  window.initMap = initMap;