// Chatbot and Riddle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const riddleText = document.getElementById('riddle-text');
    const startButton = document.getElementById('start-button');
    const hintButton = document.getElementById('hint-button');
    const huntStatus = document.getElementById('hunt-status');
    
    // Clemson campus scavenger hunt riddles
    let OpenAIRiddles = [];
    
    // Full library of riddles to fall back on
    const fallbackRiddleLibrary = [
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
        },
        {
            text: "My chimes ring across campus, a historic tower standing tall. Once a military headquarters, now I oversee it all.",  
            hint: "Originally known as Old Main, I now house the College of Education.",  
            location: "Tillman Hall"  
        },
        {
            text: "Step onto my open grass, where cadets once drilled in the past. Now a place for games and sun, my tradition is second to none.",  
            hint: "Located at the heart of campus, this field hosts homecoming displays and student activities.",  
            location: "Bowman Field"  
        },
        {
            text: "A house of books and learning so grand, students come here to study and plan. With floors of knowledge and rooms so quiet, I'm a haven when finals incite a riot.",  
            hint: "Named after a former university president, this library has an extensive digital and print collection.",  
            location: "R.M. Cooper Library"  
        },
        {
            text: "Though I'm not a castle, I share its name, holding business minds with fortune and fame. In me, future CEOs and leaders train, solving problems with financial gain.",  
            hint: "This modern building is home to the Wilbur O. and Ann Powers College of Business.",  
            location: "Powers Hall (College of Business)"  
        },
        {
            text: "Walk beneath my grand design, an arched entrance standing fine. I welcome all, both young and old, to Clemson's campus, strong and bold.",  
            hint: "Donated by the Class of 1944, I serve as the university's front door for visitors.",  
            location: "Class of 1944 Visitors Center"  
        }
    ];
    
    // Function to get 5 random riddles from the library
    function getRandomRiddles(riddleLibrary, count) {
        // Make a copy of the array to avoid modifying the original
        const riddlesCopy = [...riddleLibrary];
        
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = riddlesCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [riddlesCopy[i], riddlesCopy[j]] = [riddlesCopy[j], riddlesCopy[i]];
        }
        
        // Return the first 'count' elements
        return riddlesCopy.slice(0, count);
    }
    
    // Function to fetch riddles from the Replit API with timeout
    async function runPythonCode() {
        try {
            // Create an AbortController to implement timeout
            const controller = new AbortController();
            const signal = controller.signal;
            
            // Set timeout of 5 seconds
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            // Make a GET request to the Flask API on Replit
            const response = await fetch('https://4b6335f6-f3c9-45c2-853a-e3f31ac3741d-00-10b8is8h8q5l.spock.replit.dev/run-code', {
                signal: signal
            });
            
            // Clear the timeout
            clearTimeout(timeoutId);

            // Parse the JSON response
            OpenAIRiddles = await response.json();
            console.log("Fetched riddles from API:", OpenAIRiddles);
            
            // If we have riddles, update the global window.riddles for other components
            if (OpenAIRiddles && OpenAIRiddles.length > 0) {
                window.riddles = OpenAIRiddles;
                return OpenAIRiddles;
            } else {
                console.warn("No riddles received from API, using fallback riddles");
                // Fall back to random selection from the library
                OpenAIRiddles = getRandomRiddles(fallbackRiddleLibrary, 5);
                window.riddles = OpenAIRiddles;
                return OpenAIRiddles;
            }
        } catch (error) {
            // Check if it's a timeout
            if (error.name === 'AbortError') {
                console.warn("Request to Replit timed out after 5 seconds, using fallback riddles");
            } else {
                console.error("Error fetching riddles from API:", error);
            }
            
            // Fall back to random selection from the library
            OpenAIRiddles = getRandomRiddles(fallbackRiddleLibrary, 5);
            window.riddles = OpenAIRiddles;
            return OpenAIRiddles;
        }
    }
    
    // Fetch riddles when page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Try to fetch riddles but don't wait for completion
        runPythonCode().catch(error => {
            console.error("Error during initial riddle fetch:", error);
        });
    });
    
    // Use OpenAIRiddles for the riddles, initially empty but will be populated
    const riddles = OpenAIRiddles;
    
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
            // Check if riddles have been loaded
            if (!OpenAIRiddles || OpenAIRiddles.length === 0) {
                console.log("No riddles loaded yet, fetching or using fallback...");
                // Try to fetch riddles if they haven't been loaded yet
                runPythonCode()
                    .then((riddles) => {
                        console.log("Riddles loaded successfully:", riddles);
                        OpenAIRiddles = riddles;
                        window.riddles = riddles;
                        startHunt();
                    })
                    .catch(error => {
                        console.error("Error loading riddles:", error);
                        // Use fallback riddles if there's an error
                        OpenAIRiddles = getRandomRiddles(fallbackRiddleLibrary, 5);
                        window.riddles = OpenAIRiddles;
                        console.log("Using fallback riddles:", OpenAIRiddles);
                        startHunt();
                    });
            } else {
                console.log("Riddles already loaded, starting hunt...");
                startHunt();
            }
        }
    });
    
    // Function to start the hunt once riddles are loaded
    function startHunt() {
        // Log riddles to confirm what we're using
        console.log("Starting hunt with riddles:", OpenAIRiddles);
        
        // Check and use fallback if necessary one more time
        if (!OpenAIRiddles || OpenAIRiddles.length === 0) {
            console.warn("No riddles available at start, using fallback...");
            OpenAIRiddles = getRandomRiddles(fallbackRiddleLibrary, 5);
            window.riddles = OpenAIRiddles;
        }
        
        // Start the hunt
        huntStarted = true;
        currentRiddleIndex = 0;
        huntStatus.textContent = "Hunt in progress";
        
        // Update button display - keep same position
        startButton.style.display = 'none';
        hintButton.style.display = 'flex'; // Use flex to maintain centering
        hintButton.style.width = '80%'; // Make hint button take width
        
        // Make sure the button container keeps its height
        const buttonContainer = startButton.parentElement;
        if (buttonContainer) {
            const currentHeight = buttonContainer.offsetHeight;
            buttonContainer.style.minHeight = currentHeight + 'px';
        }
        
        // Display first riddle
        if (OpenAIRiddles && OpenAIRiddles.length > 0) {
            riddleText.textContent = OpenAIRiddles[currentRiddleIndex].text;
            console.log("Displaying first riddle:", OpenAIRiddles[currentRiddleIndex].text);
        } else {
            console.error("No riddles available even after fallback check");
            riddleText.textContent = "Error: No riddles available. Please refresh the page.";
        }
        
        addSystemMessage("Your hunt has begun! Solve the riddle and find the location on campus. Use the 'Solve Riddle' button when you think you know the answer.");
        
        // Show the solve button
        if (typeof showSolveButton === 'function') {
            showSolveButton();
        } else {
            const solveButton = document.getElementById('verify-location-btn');
            if (solveButton) {
                solveButton.style.display = 'flex';
            }
        }
        
        // Initialize progress bar
        if (typeof updateProgressBar === 'function') {
            updateProgressBar(0);
        }
    }
    
    // Function to advance to next riddle (called by the progress system)
    window.advanceToNextRiddle = function() {
        console.log("advanceToNextRiddle called, current index:", currentRiddleIndex);
        if (huntStarted && currentRiddleIndex < OpenAIRiddles.length - 1) {
            // Get location of the solved riddle
            const solvedLocation = OpenAIRiddles[currentRiddleIndex].location;
            
            // Advance to next riddle
            currentRiddleIndex++;
            console.log("Advanced to riddle index:", currentRiddleIndex);
            
            if (OpenAIRiddles && OpenAIRiddles.length > currentRiddleIndex) {
                riddleText.textContent = OpenAIRiddles[currentRiddleIndex].text;
            } else {
                console.error("No next riddle available");
                riddleText.textContent = "Error: No more riddles available.";
            }
            
            // Show success message with the location
            addSystemMessage(`Correct! You found ${solvedLocation}! Here's your next riddle.`);
            
            // Make riddles available to the progress system
            window.riddles = OpenAIRiddles;
        } else if (huntStarted && currentRiddleIndex === OpenAIRiddles.length - 1) {
            // Get location of the final solved riddle
            const solvedLocation = OpenAIRiddles[currentRiddleIndex].location;
            
            // Hunt completed
            addSystemMessage(`Correct! You found ${solvedLocation}! Congratulations! You've completed the Death Valley Dash! You've successfully found all the locations on campus. Claim your prize at the Student Union.`);
            huntStatus.textContent = "Hunt completed";
            hintButton.style.display = 'none';
            startButton.textContent = "Hunt Completed";
            startButton.style.display = 'block';
            startButton.disabled = true;
            
            // Make riddles available to the progress system
            window.riddles = OpenAIRiddles;
        } else {
            console.error("Cannot advance riddle - hunt not started or no more riddles");
        }
    };
    
    // Hint button click handler
    hintButton.addEventListener('click', function() {
        if (huntStarted && currentRiddleIndex >= 0) {
            // Check if we have OpenAIRiddles loaded and if there's a hint for this riddle
            if (OpenAIRiddles && OpenAIRiddles.length > currentRiddleIndex && OpenAIRiddles[currentRiddleIndex].hint) {
                addSystemMessage("Hint: " + OpenAIRiddles[currentRiddleIndex].hint);
            } else if (window.riddles && window.riddles.length > currentRiddleIndex && window.riddles[currentRiddleIndex].hint) {
                // Fallback to window.riddles if OpenAIRiddles isn't available
                addSystemMessage("Hint: " + window.riddles[currentRiddleIndex].hint);
            } else {
                // If no hint is available, provide a generic message
                addSystemMessage("Sorry, no hint is available for this riddle. Try looking closely at the clues!");
            }
        }
    });
    
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