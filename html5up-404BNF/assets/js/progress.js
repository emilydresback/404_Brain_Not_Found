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
    
    // For testing purposes - if isHalfway is true, make it false and complete the current step
    // Otherwise, set isHalfway to true to show progress toward next location
    if (window.DeathValleyDash.isHalfway) {
        // Complete the current step
        const nextLocationIndex = window.DeathValleyDash.foundLocations + 1;
        
        if (nextLocationIndex <= window.DeathValleyDash.totalLocations) {
            // Mark the location as found
            if (window.DeathValleyDash.huntLocations[nextLocationIndex - 1]) {
                window.DeathValleyDash.huntLocations[nextLocationIndex - 1].found = true;
                window.DeathValleyDash.isHalfway = false;
                
                // Get the location name
                const locationName = window.DeathValleyDash.huntLocations[nextLocationIndex - 1].name || `Location ${nextLocationIndex}`;
                
                // Update the progress bar
                updateProgress(nextLocationIndex, false);
                window.DeathValleyDash.foundLocations = nextLocationIndex;
                
                // Show success message
                updateLocationDisplay(`You found ${locationName}! ${nextLocationIndex} out of ${window.DeathValleyDash.totalLocations} locations found.`);
                
                // If we have a riddle chatbot, advance to the next riddle
                if (typeof window.advanceToNextRiddle === 'function') {
                    window.advanceToNextRiddle();
                }
                
                // If using a map, add a marker for the found location
                addLocationMarker(nextLocationIndex - 1, locationName);
            }
        }
    } else {
        // Set to halfway for the next location
        window.DeathValleyDash.isHalfway = true;
        const currentStep = window.DeathValleyDash.foundLocations;
        
        if (currentStep < window.DeathValleyDash.totalLocations) {
            // Update progress to show halfway
            updateProgress(currentStep, true);
            
            // Show halfway message
            updateLocationDisplay(`You're getting closer to the next location! Keep exploring.`);
        }
    }
}

// Helper function to add a marker to the map
function addLocationMarker(locationIndex, locationName) {
    if (window.DeathValleyDash.map && window.DeathValleyDash.huntLocations[locationIndex].position) {
        const marker = new google.maps.Marker({
            position: window.DeathValleyDash.huntLocations[locationIndex].position,
            map: window.DeathValleyDash.map,
            icon: {
                url: 'images/location-found.png', // Replace with your custom marker
                scaledSize: new google.maps.Size(32, 32)
            },
            title: locationName
        });
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
function updateProgress(stepNumber, isHalfway) {
    // Get all progress nodes
    const nodes = document.querySelectorAll('.progress-node');
    const progressFill = document.getElementById('progress-fill');
    
    if (!progressFill || nodes.length === 0) {
        console.error("Progress bar elements not found");
        return;
    }
    
    // Update DeathValleyDash found locations counter
    window.DeathValleyDash = window.DeathValleyDash || {};
    window.DeathValleyDash.foundLocations = stepNumber;
    window.DeathValleyDash.totalLocations = window.DeathValleyDash.totalLocations || nodes.length;
    
    // Node positions are at 10%, 30%, 50%, 70%, 90%
    // Map step numbers directly to these percentages
    let progressPercent = 0;
    
    // If isHalfway is true, show halfway to the next node
    if (isHalfway) {
        switch(stepNumber) {
            case 0: // Halfway to first node
                progressPercent = 5; // Halfway to 10%
                break;
            case 1: // Halfway to second node
                progressPercent = 20; // Halfway between 10% and 30%
                break;
            case 2: // Halfway to third node
                progressPercent = 40; // Halfway between 30% and 50%
                break;
            case 3: // Halfway to fourth node
                progressPercent = 60; // Halfway between 50% and 70%
                break;
            case 4: // Halfway to fifth node
                progressPercent = 80; // Halfway between 70% and 90%
                break;
            default:
                progressPercent = 0;
        }
    } else {
        // Full node positions
        switch(stepNumber) {
            case 1:
                progressPercent = 10; // First node position
                break;
            case 2:
                progressPercent = 30; // Second node position
                break;
            case 3:
                progressPercent = 50; // Third node position
                break;
            case 4:
                progressPercent = 70; // Fourth node position
                break;
            case 5:
                progressPercent = 90; // Fifth node position
                break;
            default:
                progressPercent = 0;
        }
    }
    
    console.log(`Updating progress bar to ${progressPercent}% for step ${stepNumber} ${isHalfway ? '(halfway)' : ''}`);
    
    // Update the progress fill width
    progressFill.style.width = progressPercent + "%";
    
    // Update node styles
    nodes.forEach((node, index) => {
        // Determine if this node should be active
        const nodeNumber = index + 1;
        
        if (nodeNumber <= stepNumber) {
            // Active/completed node
            node.style.backgroundColor = '#F56600';
            node.style.borderColor = '#F56600';
            node.style.color = 'white';
        } else {
            // Inactive node
            node.style.backgroundColor = '#f1f1f1';
            node.style.borderColor = '#ccc';
            node.style.color = '#333';
        }
    });
    
    console.log(`Progress updated: ${stepNumber}/${window.DeathValleyDash.totalLocations} locations found`);
    
    // Check if all locations are found
    if (stepNumber >= window.DeathValleyDash.totalLocations) {
        console.log("All locations found! Showing congratulations popup.");
        showCongratulationsPopup();
    }
}

// Function to show congratulations popup
function showCongratulationsPopup() {
    // Check if popup already exists (avoid duplicates)
    if (document.getElementById('congrats-popup')) {
        return;
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.id = 'congrats-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '30px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    popup.style.zIndex = '1000000';
    popup.style.maxWidth = '90%';
    popup.style.width = '400px';
    popup.style.textAlign = 'center';
    popup.style.animation = 'popupFadeIn 0.5s ease-out';
    
    // Add confetti background
    popup.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'confetti\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M10 10L15 10L15 15L10 15Z\' fill=\'%23F56600\' /%3E%3Cpath d=\'M30 10L35 10L35 15L30 15Z\' fill=\'%23522D80\' /%3E%3Cpath d=\'M20 20L22 20L22 22L20 22Z\' fill=\'%23F56600\' /%3E%3Cpath d=\'M5 25L7 25L7 27L5 27Z\' fill=\'%23522D80\' /%3E%3Cpath d=\'M30 30L33 30L33 33L30 33Z\' fill=\'%23F56600\' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23confetti)\' /%3E%3C/svg%3E")';
    popup.style.backgroundSize = '200px 200px';
    
    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    contentWrapper.style.padding = '20px';
    contentWrapper.style.borderRadius = '8px';
    contentWrapper.style.marginBottom = '20px';
    
    // Create popup content
    const title = document.createElement('h2');
    title.textContent = 'Congratulations!';
    title.style.color = '#F56600';
    title.style.marginTop = '0';
    
    const message = document.createElement('p');
    message.textContent = 'You\'ve successfully completed the Death Valley Dash and found all locations on campus! You\'re a true Clemson Tiger!';
    message.style.fontSize = '16px';
    message.style.lineHeight = '1.5';
    message.style.marginBottom = '20px';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Claim Your Prize!';
    closeButton.style.backgroundColor = '#F56600';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '10px 20px';
    closeButton.style.borderRadius = '5px';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    // Add hover effect
    closeButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#522D80';
    });
    
    closeButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#F56600';
    });
    
    // Add click event to close
    closeButton.addEventListener('click', function() {
        document.body.removeChild(popup);
        alert("Visit the Student Union to claim your Clemson prize brick at the demo site!");
    });
    
    // Add overlay behind popup
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = '999999';
    overlay.style.animation = 'overlayFadeIn 0.5s ease-out';
    
    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupFadeIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes overlayFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Assemble the popup
    contentWrapper.appendChild(title);
    contentWrapper.appendChild(message);
    popup.appendChild(contentWrapper);
    popup.appendChild(closeButton);
    
    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

// Make sure we attach the event listener properly
document.addEventListener('DOMContentLoaded', function() {
    // Set up DeathValleyDash namespace if it doesn't exist
    window.DeathValleyDash = window.DeathValleyDash || {};
    window.DeathValleyDash.foundLocations = window.DeathValleyDash.foundLocations || 0;
    window.DeathValleyDash.totalLocations = window.DeathValleyDash.totalLocations || 5; // Update this based on your actual number of locations
    window.DeathValleyDash.isHalfway = window.DeathValleyDash.isHalfway || false;
    
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
            // Toggle between halfway and full positions
            if (window.DeathValleyDash.isHalfway) {
                // Move to the next full position
                const nextStep = (window.DeathValleyDash.foundLocations || 0) + 1;
                window.DeathValleyDash.isHalfway = false;
                
                if (nextStep <= window.DeathValleyDash.totalLocations) {
                    console.log(`Advancing progress to step ${nextStep}`);
                    updateProgress(nextStep, false);
                    
                    // If we have a riddle chatbot, advance to the next riddle
                    if (typeof window.advanceToNextRiddle === 'function') {
                        window.advanceToNextRiddle();
                    }
                    
                    // Update found locations
                    window.DeathValleyDash.foundLocations = nextStep;
                    
                    // Show message
                    updateLocationDisplay(`Found location ${nextStep}/${window.DeathValleyDash.totalLocations} (Test Mode)`);
                } else {
                    console.log("All locations already found");
                    updateLocationDisplay("All locations found! Hunt completed.");
                }
            } else {
                // Move to halfway to the next position
                window.DeathValleyDash.isHalfway = true;
                const currentStep = window.DeathValleyDash.foundLocations || 0;
                
                if (currentStep < window.DeathValleyDash.totalLocations) {
                    console.log(`Setting halfway progress after step ${currentStep}`);
                    updateProgress(currentStep, true);
                    
                    // Show message
                    updateLocationDisplay(`Making progress toward next location... (Test Mode)`);
                }
            }
        });
        console.log("Added click handler to progress bar for testing with halfway positions");
    }
    
    // Initialize progress bar if needed
    if (window.DeathValleyDash.foundLocations > 0) {
        updateProgress(window.DeathValleyDash.foundLocations, window.DeathValleyDash.isHalfway);
    }

    console.log("progress.js initialized successfully");
});