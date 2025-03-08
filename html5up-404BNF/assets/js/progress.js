// Function to update the progress bar
function updateProgressBar(percent) {
    const progressBar = document.getElementById("myProgressBar");
    progressBar.style.width = percent + "%";
  }
  
  // Example usage for manual control:
  // updateProgressBar(25); // Set progress to 25%
  // updateProgressBar(50); // Set progress to 50%
  // updateProgressBar(100); // Set progress to 100%
  
  // Scroll-based progress bar
  window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    updateProgressBar(scrolled);
  };
  
  // Alternative: For a loading progress or other custom use case
  // Comment out the window.onscroll function above and use this pattern instead
  
  /*
  // Example: Simulating a loading process
  document.addEventListener('DOMContentLoaded', function() {
    let progress = 0;
    const interval = setInterval(function() {
      progress += 5;
      updateProgressBar(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        console.log("Loading complete!");
      }
    }, 200); // Update every 200ms
  });
  */