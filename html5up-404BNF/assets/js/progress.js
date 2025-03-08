// Simple Progress Bar Implementation
// This is a completely rewritten version with minimal complexity

// Initialize the DeathValleyDash namespace with basic properties
window.DeathValleyDash = {
    currentStep: 0,
    totalSteps: 5,  // Total number of riddles - now set to 5
    nodePositions: [10, 30, 50, 70, 90] // Percentage positions for the 5 nodes
};

// Function to update the progress bar
function updateProgressBar(step) {
    // Get DOM elements
    const progressFill = document.getElementById('progress-fill');
    const nodes = document.querySelectorAll('.progress-node');
    
    if (!progressFill || nodes.length === 0) {
        console.error("Progress bar elements not found");
        return;
    }
    
    // Validate the step number
    if (step < 0) step = 0;
    if (step > window.DeathValleyDash.totalSteps) step = window.DeathValleyDash.totalSteps;
    
    // Save the current step
    window.DeathValleyDash.currentStep = step;
    
    // Calculate progress percentage
    let percentage = 0;
    
    // For steps 1-5, use the predefined node positions
    if (step > 0 && step <= 5) {
        percentage = window.DeathValleyDash.nodePositions[step - 1];
    } 
    // For steps 6-15, distribute the remaining space (90-100%)
    else if (step > 5) {
        const remainingSteps = window.DeathValleyDash.totalSteps - 5;
        const remainingPercentage = 10; // From 90% to 100%
        const extraStep = step - 5;
        
        // Calculate additional percentage beyond 90%
        const additionalPercentage = (extraStep / remainingSteps) * remainingPercentage;
        percentage = 90 + additionalPercentage;
    }
    
    // Set the width of the progress fill
    progressFill.style.width = percentage + '%';
    
    // Update node colors
    // For step <= 5, highlight nodes up to the current step
    // For step > 5, highlight all 5 nodes
    const activeNodes = Math.min(step, 5);
    
    nodes.forEach((node, index) => {
        if (index < activeNodes) {
            // Active node
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
    
    console.log(`Progress updated: ${step}/${window.DeathValleyDash.totalSteps}, width: ${percentage}%`);
    
    // Check if all steps are complete
    if (step >= window.DeathValleyDash.totalSteps) {
        // Show completion message or trigger completion event
        showCompletionMessage();
    }
}

// Function to advance to the next step
function advanceProgress() {
    const nextStep = window.DeathValleyDash.currentStep + 1;
    if (nextStep <= window.DeathValleyDash.totalSteps) {
        updateProgressBar(nextStep);
        return true;
    }
    return false;
}

// Function to get the current riddle location
function getCurrentRiddleLocation() {
    // Access the riddles array from the parent scope if available
    if (window.riddles && window.riddles.length > 0) {
        const index = window.DeathValleyDash.currentStep - 1;
        if (index >= 0 && index < window.riddles.length) {
            return window.riddles[index].location;
        }
    }
    
    // Fallback if riddles aren't available in expected format
    return `Location ${window.DeathValleyDash.currentStep}`;
}

// Function to show completion message
function showCompletionMessage() {
    // Show congratulations popup
    showCongratulationsPopup();
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
        document.body.removeChild(overlay);
        alert("Visit the Student Union to claim your Clemson prize package!");
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

// Initialize the progress bar on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize progress bar to step 0
    updateProgressBar(0);
    
    // Get the solve button
    const solveButton = document.getElementById('verify-location-btn');
    
    // Configure the solve button
    if (solveButton) {
        solveButton.style.display = "none"; // Initially hidden
        solveButton.style.alignItems = "center";
        solveButton.style.justifyContent = "center";
        solveButton.style.textAlign = "center";
        
        // Remove any existing listeners and add new one
        const newButton = solveButton.cloneNode(true);
        solveButton.parentNode.replaceChild(newButton, solveButton);
        
        // When solve button is clicked, advance to the next step
        newButton.addEventListener('click', function() {
            const advanced = advanceProgress();
            
            if (advanced) {
                // Get the location name for the current riddle
                let locationName = "Unknown";
                if (typeof getCurrentRiddleLocation === 'function') {
                    locationName = getCurrentRiddleLocation();
                }
                
                // If we have a riddle chatbot, advance to the next riddle
                if (typeof window.advanceToNextRiddle === 'function') {
                    window.advanceToNextRiddle();
                }
                
                // Show success message
                const step = window.DeathValleyDash.currentStep;
                const message = `Solved! You found ${locationName}! (${step} of ${window.DeathValleyDash.totalSteps})`;
                if (typeof updateLocationDisplay === 'function') {
                    updateLocationDisplay(message);
                } else {
                    console.log(message);
                }
            } else {
                console.log("All riddles already completed!");
            }
        });
    } else {
        console.error("Solve button not found");
    }
});

// Function to show the solve button (called when start hunt is clicked)
function showSolveButton() {
    const solveButton = document.getElementById('verify-location-btn');
    if (solveButton) {
        solveButton.style.display = "flex";
    }
}

// Function to update location display (fallback implementation)
function updateLocationDisplay(message) {
    const display = document.getElementById('location-coordinates');
    if (display) {
        display.textContent = message;
        display.style.display = 'block';
    } else {
        console.log(message);
    }
}