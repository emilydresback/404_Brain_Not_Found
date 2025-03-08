// DeathValleyDash Progress Tracking and Location Verification 
// This file handles location verification and progress tracking for the scavenger hunt

// Function to verify current location
function verifyCurrentLocation() {
    console.log("Verifying location button clicked");
    
    // Check if the DeathValleyDash namespace exists
    if (!window.DeathValleyDash || !window.DeathValleyDash.currentUserPosition) {
        console.error("User position not available");
        updateLocationDisplay("Unable to determine your location. Please ensure location services are enabled.");
        return;
    }
    
    // Display the user's current location
    const userLat = window.DeathValleyDash.currentUserPosition.lat.toFixed(6);
    const userLng = window.DeathValleyDash.currentUserPosition.lng.toFixed(6);
    updateLocationDisplay(`Your current location: ${userLat}, ${userLng}`);
    
    console.log("Current position:", window.DeathValleyDash.currentUserPosition);

    // Check if there are hunt locations defined
    if (!window.DeathValleyDash.huntLocations || window.DeathValleyDash.huntLocations.length === 0) {
        console.error("Hunt locations not defined");
        updateLocationDisplay("Hunt locations are not configured. Please refresh the page.");
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
                updateLocationDisplay(`You found ${locationName}! ${nextLocationIndex + 1} out of ${window.DeathValleyDash.totalLocations} locations found.`);
                
                // If we have a riddle chatbot, advance to the next riddle
                if (typeof window.advanceToNextRiddle === 'function') {
                    window.advanceToNextRiddle();
                }
                
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
                updateLocationDisplay("Found a location, but couldn't update progress. Please refresh the page.");
            }
        }
    } else {
        updateLocationDisplay("You've already found all locations!");
    }
}

// Function to update the location display on the page
function updateLocationDisplay(message) {
    const locationDisplay = document.getElementById('location-coordinates');
    if (locationDisplay) {
        locationDisplay.textContent = message;
        locationDisplay.style.display = 'block'; // Make sure it's visible
    } else {
        // If location-coordinates element doesn't exist, update map-status as fallback
        const mapStatus = document.getElementById('map-status');
        if (mapStatus) {
            mapStatus.textContent = message;
        } else {
            console.error("Location display elements not found");
            alert(message);
        }
    }
}

// Function to update progress bar based on current progress
function updateProgress(stepNumber) {
    // Get all progress nodes
    const nodes = document.querySelectorAll('.progress-node');
    const progressFill = document.getElementById('progress-fill');
    
    if (!progressFill || nodes.length === 0) {
        console.error("Progress bar elements not found");
        return;
    }
    
    // Update DeathValleyDash found locations counter
    window.DeathValleyDash.foundLocations = stepNumber;
    
    // Calculate progress percentage
    const progressPercent = ((stepNumber) / window.DeathValleyDash.totalLocations) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Update node styles
    nodes.forEach((node, index) => {
        if (index + 1 <= stepNumber) {
            // Completed nodes
            node.style.backgroundColor = '#F56600';
            node.style.borderColor = '#F56600';
            node.style.color = 'white';
        } else {
            // Future nodes
            node.style.backgroundColor = '#f1f1f1';
            node.style.borderColor = '#ccc';
            node.style.color = '#333';
        }
    });
    
    console.log(`Progress updated: ${stepNumber}/${window.DeathValleyDash.totalLocations} locations found`);
}

// Make sure we attach the event listener properly
document.addEventListener('DOMContentLoaded', function() {
    // Set up DeathValleyDash namespace if it doesn't exist
    window.DeathValleyDash = window.DeathValleyDash || {};
    window.DeathValleyDash.foundLocations = window.DeathValleyDash.foundLocations || 0;
    window.DeathValleyDash.totalLocations = window.DeathValleyDash.totalLocations || 5; // Update this based on your actual number of locations
    
    // Get the verification button
    const verifyButton = document.getElementById('verify-location-btn');
    
    // Center the text in the button
    if (verifyButton) {
        verifyButton.style.display = "flex";
        verifyButton.style.alignItems = "center";
        verifyButton.style.justifyContent = "center";
        verifyButton.style.textAlign = "center";
        
        console.log("Verify location button found, attaching event listener");
        
        // Remove any existing listeners to avoid duplicates
        const newButton = verifyButton.cloneNode(true);
        verifyButton.parentNode.replaceChild(newButton, verifyButton);
        
        // Add our new listener
        newButton.addEventListener('click', verifyCurrentLocation);
    } else {
        console.error("Verify location button not found in DOM");
    }
    
    // Add click handler to progress container to advance progress (for testing)
    const progressContainer = document.getElementById('progress-container');
    if (progressContainer) {
        progressContainer.addEventListener('click', function() {
            // Advance to next location
            const nextStep = (window.DeathValleyDash.foundLocations || 0) + 1;
            if (nextStep <= window.DeathValleyDash.totalLocations) {
                console.log(`Advancing progress to step ${nextStep}`);
                updateProgress(nextStep);
                
                // If we have a riddle chatbot, advance to the next riddle
                if (typeof window.advanceToNextRiddle === 'function') {
                    window.advanceToNextRiddle();
                }
                
                // Update found locations
                window.DeathValleyDash.foundLocations = nextStep;
                
                // Show message
                updateLocationDisplay(`Advanced to location ${nextStep}/${window.DeathValleyDash.totalLocations} (Test Mode)`);
            } else {
                console.log("All locations already found");
                updateLocationDisplay("All locations found! Hunt completed.");
            }
        });
        console.log("Added click handler to progress bar for testing");
    }
    
    // Initialize progress bar if needed
    if (window.DeathValleyDash.foundLocations > 0) {
        updateProgress(window.DeathValleyDash.foundLocations);
    }

    console.log("progress.js initialized successfully");
});