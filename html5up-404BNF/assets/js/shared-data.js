// shared-data.js - Common data shared between map.js and progress.js

// Create a namespace for shared data
window.DeathValleyDash = {
    // User's current position
    currentUserPosition: null,
    
    // Hunt locations array
    huntLocations: [
      { 
        name: "Memorial Stadium", 
        position: { lat: 34.6785, lng: -82.8419 },
        index: 0,
        found: false,
        radius: 50 // Distance in meters to trigger "found" state
      },
      { 
        name: "Tillman Hall", 
        position: { lat: 34.6795, lng: -82.8369 },
        index: 1,
        found: false,
        radius: 50
      },
      { 
        name: "Cooper Library", 
        position: { lat: 34.6761, lng: -82.8357 },
        index: 2,
        found: false,
        radius: 50
      },
      { 
        name: "Bowman Field", 
        position: { lat: 34.6776, lng: -82.8377 },
        index: 3,
        found: false,
        radius: 50
      },
      { 
        name: "Hendrix Student Center", 
        position: { lat: 34.6758, lng: -82.8339 },
        index: 4,
        found: false,
        radius: 50
      }
    ],
    
    // Map instance (will be set by maps.js)
    map: null,
    
    // Total number of locations in the hunt
    totalLocations: 5,
    
    // Number of locations found so far
    foundLocations: 0,
    
    // Utility functions that might be needed by multiple files
    
    // Calculate distance between two coordinates using Haversine formula
    calculateDistance: function(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      const distance = R * c; // Distance in km
      return distance;
    },
    
    // Convert degrees to radians
    deg2rad: function(deg) {
      return deg * (Math.PI/180);
    }
  };
  
  console.log('Shared data initialized');