// Chatbot and Riddle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const riddleText = document.getElementById('riddle-text');
    const startButton = document.getElementById('start-button');
    const hintButton = document.getElementById('hint-button');
    const huntStatus = document.getElementById('hunt-status');
    
    // Clemson campus scavenger hunt riddles
    const riddles = [
        {
            text: "I roar with the crowd on Saturdays, my name suggests danger and doom. Find me where 80,000+ fans wear orange and make noise.",
            hint: "Howard's Rock is rubbed before players Run Down The Hill here.",
            location: "Memorial Stadium (Death Valley)"
        },
        {
            text: "Wisdom flows like water at this campus heart. Look for Cooper's name and scholars hard at work.",
            hint: "The main library has a reflection pond outside where students often study.",
            location: "Cooper Library & Reflection Pond"
        },
        {
            text: "Rub my paw for luck as the semester ends, I'm cast in bronze and watch over campus. Seek the class of '39 gift.",
            hint: "This tiger statue is located outside the football stadium's east entrance.",
            location: "Tiger Statue at Howard's Rock"
        },
        {
            text: "Named for a plant scientist, I'm where future farmers learn. Look for tractors and greenhouses nearby.",
            hint: "This agricultural building is named after a former Clemson botanist and teacher.",
            location: "Poole Agricultural Center"
        },
        {
            text: "My amphitheater hosts concerts and events, built into a hillside on campus. Romans would approve of my design.",
            hint: "Located near the Cooper Library, this outdoor venue hosts many campus events.",
            location: "Outdoor Amphitheater"
        },
        {
            text: "Find where the clocktower chimes, surrounded by bricks bearing alumni names. My garden honors a 10th president.",
            hint: "This garden features a carillon bell tower and commemorative bricks.",
            location: "Carillon Garden"
        },
        {
            text: "Tigers shop, eat, and gather in this modern center named for a president. Look for bowling balls and Post Office boxes.",
            hint: "This student center has dining, a bookstore, and recreational facilities.",
            location: "Hendrix Student Center"
        },
        {
            text: "Original heart of campus, I'm the oldest building with a bell tower. My iconic image represents Clemson itself.",
            hint: "This historic building was the first constructed on campus and appears in the Clemson logo.",
            location: "Tillman Hall (Old Main)"
        },
        {
            text: "Mathematical mysteries and computer science happen here. Named for a generous couple, I'm where tech tigers code.",
            hint: "This building houses the School of Computing and is named for benefactors.",
            location: "McAdams Hall"
        },
        {
            text: "Athletes train in my waters to become champions. Look for lanes, diving boards, and orange tiger paws.",
            hint: "This aquatic facility is where the swimming and diving teams compete.",
            location: "Fike Recreation Center Pool"
        }
    ];
    
    // Hunt state
    let huntStarted = false;
    let currentRiddleIndex = -1;
    
    // Add welcome message
    function addSystemMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'system-message';
        messageEl.style.marginBottom = '10px';
        messageEl.style.padding = '10px';
        messageEl.style.backgroundColor = '#f0f0f0';
        messageEl.style.borderRadius = '5px';
        messageEl.style.borderLeft = '3px solid #F56600';
        messageEl.textContent = message;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Add welcome message on load
    addSystemMessage("Welcome to Death Valley Dash! I'm your AI Riddle Master. Press 'Start Hunt' to begin your adventure around Clemson's campus. Each riddle will lead you to a new location, and you can verify when you arrive using the 'Verify Location' button on the map.");
    
    // Start button click handler
    startButton.addEventListener('click', function() {
        if (!huntStarted) {
            // Start the hunt
            huntStarted = true;
            currentRiddleIndex = 0;
            huntStatus.textContent = "Hunt in progress";
            
            // Update button display
            startButton.style.display = 'none';
            hintButton.style.display = 'block';
            hintButton.style.width = '100%'; // Make hint button take full width
            
            // Display first riddle
            riddleText.textContent = riddles[currentRiddleIndex].text;
            addSystemMessage("Your hunt has begun! Solve the riddle and find the location on campus. Use the map to navigate and the 'Verify Location' button when you think you're in the right spot.");
            
            // Update progress bar to show first node as active
            updateProgressUI(1);
        }
    });
    
    // Hint button click handler
    hintButton.addEventListener('click', function() {
        if (huntStarted && currentRiddleIndex >= 0 && currentRiddleIndex < riddles.length) {
            addSystemMessage("Hint: " + riddles[currentRiddleIndex].hint);
        }
    });
    
    // Function to advance to next riddle
    window.advanceToNextRiddle = function() {
        if (huntStarted && currentRiddleIndex < riddles.length - 1) {
            currentRiddleIndex++;
            riddleText.textContent = riddles[currentRiddleIndex].text;
            addSystemMessage(`Great job! You've found location ${currentRiddleIndex}. Here's your next riddle.`);
            
            // Update progress
            updateProgressUI(currentRiddleIndex + 1);
        } else if (huntStarted && currentRiddleIndex === riddles.length - 1) {
            // Hunt completed
            addSystemMessage("Congratulations! You've completed the Death Valley Dash! You've successfully found all the locations on campus. Claim your prize at the Student Union.");
            huntStatus.textContent = "Hunt completed";
            hintButton.style.display = 'none';
            startButton.textContent = "Hunt Completed";
            startButton.style.display = 'block';
            startButton.disabled = true;
            
            // Update progress to completed
            updateProgressUI(riddles.length);
        }
    };
    
    // This would be connected to the verify-location-btn
    document.getElementById('verify-location-btn').addEventListener('click', function() {
        // This is where you would check if the user is actually at the correct location
        // For this demo, we'll just simulate successful verification
        
        // In a real implementation, you would check the user's GPS location against
        // the target location coordinates. If close enough, call advanceToNextRiddle()
        
        // Simulate verification (replace with actual verification logic)
        if (huntStarted && currentRiddleIndex >= 0 && currentRiddleIndex < riddles.length) {
            setTimeout(() => {
                // Simulating successful verification
                advanceToNextRiddle();
            }, 1500);
            
            addSystemMessage("Verifying your location...");
        } else if (!huntStarted) {
            addSystemMessage("Please start the hunt first by clicking the 'Start Hunt' button.");
        }
    });
    
    // Update progress UI
    function updateProgressUI(step) {
        // Get all progress nodes
        const nodes = document.querySelectorAll('.progress-node');
        const progressFill = document.getElementById('progress-fill');
        
        // Calculate progress percentage
        const progressPercent = ((step - 1) / (riddles.length - 1)) * 100;
        progressFill.style.width = `${progressPercent}%`;
        
        // Update node styles
        nodes.forEach((node, index) => {
            if (index + 1 < step) {
                // Completed nodes
                node.style.backgroundColor = '#F56600';
                node.style.borderColor = '#F56600';
                node.style.color = 'white';
            } else if (index + 1 === step) {
                // Current node
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
    }
});