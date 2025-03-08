// Progress bar with nodes script
(function() {
    // Get the progress bar fill element
    var progressFill = document.getElementById('progress-fill');
    
    // Get all node elements
    var nodes = document.querySelectorAll('.progress-node');
    
    // Set up variables
    var totalLocations = 5;
    var foundLocations = 0;
    
    // Function to update progress
    function updateProgress(locationNumber) {
      // Update the progress bar width
      var percent = (locationNumber / totalLocations) * 100;
      progressFill.style.width = percent + '%';
      
      // Update nodes - mark completed nodes
      for (var i = 0; i < nodes.length; i++) {
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
    }
    
    // Make the progress bar or any node clickable to advance progress (for testing)
    document.addEventListener('click', function(event) {
      // Only update if we haven't reached max
      if (foundLocations < totalLocations) {
        foundLocations++;
        updateProgress(foundLocations);
      }
    });
    
    // Initialize
    console.log('Node-based progress bar initialized');
    updateProgress(0);
  })();