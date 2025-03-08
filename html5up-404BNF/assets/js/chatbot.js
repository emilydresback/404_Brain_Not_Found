// Chatbot and Riddle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const riddleText = document.getElementById('riddle-text');
    const startButton = document.getElementById('start-button');
    const hintButton = document.getElementById('hint-button');
    const huntStatus = document.getElementById('hunt-status');
    
    // Get a random subset of riddles
    function getRandomRiddles(allRiddles, count) {
        // Make a copy of the array to avoid modifying the original
        const riddlesCopy = [...allRiddles];
        
        // Shuffle the array using Fisher-Yates algorithm
        for (let i = riddlesCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [riddlesCopy[i], riddlesCopy[j]] = [riddlesCopy[j], riddlesCopy[i]];
        }
        
        // Return the first 'count' elements
        return riddlesCopy.slice(0, count);
    }
    
    // Clemson campus scavenger hunt riddles
async function runPythonCode() {
    // Make a GET request to the Flask API on Replit
    const response = await fetch('https://4b6335f6-f3c9-45c2-853a-e3f31ac3741d-00-10b8is8h8q5l.spock.replit.dev/run-code');
        
    // Parse the JSON response
    const OpenAIRiddles = await response.json();
}

const allRiddles = [
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
    },
    {
        text: "I'm home to Tigers both big and small, where you'll hear the squeak of sneakers and the roar of the ball. Championships are won within my dome, where fans and players all feel at home.",  
        hint: "Named after a former coach, I host basketball games and major campus events.",  
        location: "Littlejohn Coliseum"  
    },
    {
        text: "I sit on a hill and tell a tale, of history deep and lessons well. Once home to a statesman bold, I now preserve memories old.",  
        hint: "This historic home was owned by John C. Calhoun before becoming university property.",  
        location: "Fort Hill Plantation"  
    },
    {
        text: "A hidden gem, a place serene, with blossoms bright and leaves of green. A tribute to a woman fair, I offer peace beyond compare.",  
        hint: "Named after Anna Calhoun Clemson, I am home to native and exotic plants.",  
        location: "Clemson Botanical Gardens"  
    },
    {
        text: "With bells that chime and gardens near, I stand for honor year by year. A tribute to those who fought and fell, in my shadow, their stories dwell.",  
        hint: "This carillon tower and memorial garden honor those who served in World War II.",  
        location: "Memorial Park & Carillon Garden"  
    },
    {
        text: "Through my doors, minds ignite, where circuits spark and robots take flight. Engineers come to solve and create, pushing the limits of knowledge great.",  
        hint: "This hall houses electrical and computer engineering research.",  
        location: "Riggs Hall"  
    },
    {
        text: "A bridge of glass and steel so bright, crossing over roads day and night. A modern touch for those who roam, guiding students safely home.",  
        hint: "This pedestrian bridge connects core campus to the business school.",  
        location: "Douthit Hills Pedestrian Bridge"  
    },
    {
        text: "I was built for science, research, and more, where chemicals mix and reactions pour. A hub for minds that test and try, seeking answers far and nigh.",  
        hint: "This hall is named after a renowned chemist and houses state-of-the-art labs.",  
        location: "Hunter Hall"  
    },
    {
        text: "Though I once held textiles tight, now business minds fill me with light. My brick walls tell a tale of trade, where Clemson's economic plans are laid.",  
        hint: "Once a textile building, I now support the business school and entrepreneurship.",  
        location: "Sirrine Hall"  
    },
    {
        text: "Athletes train, their limits exceed, within my walls, they gain their speed. I house the strong, the fast, the bold, preparing Tigers for stories told.",  
        hint: "This athletic center supports football, basketball, and Olympic sports training.",  
        location: "Allen N. Reeves Football Complex"  
    },
    {
        text: "I house art, performance, and flair, where culture thrives and talents share. Exhibits, plays, and music divine, in my halls, the arts align.",  
        hint: "This facility hosts concerts, art exhibitions, and theatrical performances.",  
        location: "Brooks Center for the Performing Arts"  
    },
    {
        text: "I am the hub where students eat, where campus friends and strangers meet. Breakfast, lunch, and dinner too, I serve it all—just walk on through.",  
        hint: "This main dining hall is located near the residence halls.",  
        location: "Schilletter Dining Hall"  
    },
    {
        text: "My namesake coached with passion grand, leading Tigers across the land. On my fields, young athletes play, with dreams to win another day.",  
        hint: "This athletic park is named after a legendary Clemson football coach.",  
        location: "Jervey Athletic Center"  
    },
    {
        text: "I house students through the years, a place of friendships, laughs, and cheers. From late-night talks to test-day stress, within my walls, they do their best.",  
        hint: "This dorm complex houses thousands of students each year.",  
        location: "Manning Hall"  
    },
    {
        text: "A historic home from years gone by, I was moved so I wouldn't die. With history rich and stories deep, I stand where Clemson's past will keep.",  
        hint: "Originally from the Lowcountry, I was relocated to Clemson to preserve history.",  
        location: "Hanover House" 
    },
    {
        text: "I'm where equations fill the board, where numbers dance and graphs are stored. If math's your love, then come inside, for logic's rules are here applied.",  
        hint: "This hall is home to Clemson's School of Mathematical and Statistical Sciences.",  
        location: "Martin Hall"  
    },
    {
        text: "I was built to inspire, to guide the way, for leaders learning day by day. With classrooms bright and knowledge vast, I prepare students for careers that last.",  
        hint: "This building houses Clemson's College of Education.",  
        location: "Old Main (Tillman Hall)"  
    },
    {
        text: "Tucked between the trees I hide, with peaceful trails to walk inside. A quiet place to think and rest, where nature shows her very best.",  
        hint: "This outdoor area is home to gardens, trails, and research projects.",  
        location: "S.C. Botanical Garden"  
    },
    {
        text: "I echo with a history proud, where students walk beneath me now. A passage built with bricks so fine, a tunnel marking Tiger time.",  
        hint: "This underground tunnel allows safe crossing near Death Valley.",  
        location: "Clemson Memorial Stadium Pedestrian Tunnel"  
    },
    {
        text: "I stand tall and house the wise, where scholars write and knowledge lies. Within my walls, research grows, through books and screens, the future flows.",  
        hint: "This library annex offers additional study space beyond the main library.",  
        location: "Cooper Library Annex"  
    },
    {
        text: "I hum with gears and metal bright, where engineers work day and night. With circuits, bolts, and structures tall, I build the future for us all.",  
        hint: "This building houses Clemson's Mechanical Engineering department.",  
        location: "Fluor Daniel Engineering Innovation Building"  
    },
    {
        text: "I watch the sunsets over blue, reflecting skies of orange hue. A peaceful place where students meet, to rest, to row, or just to greet.",  
        hint: "This lake is a popular spot for recreation and reflection.",  
        location: "Lake Hartwell"  
    },
    {   
        text: "Inside my walls, minds take flight, designing buildings tall and bright. Drafting tables, models too, future architects pass through.",  
        hint: "This hall is home to Clemson's School of Architecture.",  
        location: "Lee Hall"  
    },
    {
        text: "My steps are climbed by student feet, a central spot where classmates meet. Here you'll find a helping hand, to guide your journey, bold and planned.",  
        hint: "This center provides career counseling, advising, and student support.",  
        location: "Academic Success Center"  
    },
    {
        text: "From history's past, my walls remain, a structure tied to Clemson's name. I housed the textiles of the past, now my purpose is still steadfast.",  
        hint: "This former textile building has been repurposed for academics and research.",  
        location: "Godfrey Hall"  
    },
    {
        text: "Though I was once a station grand, where trains would stop at my command, now I serve a different way, helping travelers day by day.",  
        hint: "This historic station still serves Amtrak passengers.",  
        location: "Clemson Amtrak Station"  
    },
    {
        text: "I am where Tigers come to play, with fields of green and courts in array. From soccer games to tennis grand, intramurals thrive across my land.",  
        hint: "This recreation complex hosts intramural sports and student activities.",  
        location: "Fike Recreation Center"  
    },
    {
        text: "A quiet place to think and pray, where students come throughout the day. Within my walls, peace is found, a sacred space on campus ground.",  
        hint: "This non-denominational chapel serves the spiritual needs of students.",  
        location: "Samuel J. Cadden Chapel"  
    },
    {
        text: "With glass so bright and space so grand, I help students take a stand. A place where work and play align, a student's home to meet and dine.",  
        hint: "This student center offers dining, study areas, and event spaces.",  
        location: "Watt Family Innovation Center"  
    },
    {
        text: "I am where science takes its course, with test tubes, charts, and research force. From chemicals to plants and more, students here will knowledge store.",  
        hint: "This building houses biology, chemistry, and agricultural research.",  
        location: "Life Sciences Building"  
    },
    {
        text: "I am the place where Tigers rest, after long days of doing their best. With rooms and lounges, study too, I'm home to many, old and new.",  
        hint: "This dorm is one of the largest residence halls on campus.",  
        location: "Douthit Hills"  
    },
    {
        text: "I house the brave, the strong, the bold, who serve their country as they're told. Within my halls, cadets train well, preparing for the stories they'll tell.",  
        hint: "This building is home to Clemson's ROTC programs.",  
        location: "Military & Veteran Engagement Center"  
    },
    {
        text: "I welcome visitors from far and near, sharing history that we hold dear. From artifacts to stories told, I keep Clemson's memories bold.",  
        hint: "This museum showcases the history of Clemson University.",  
        location: "Clemson Area History Museum"  
    },
    {
        text: "Across the lake, I proudly stand, with wind and waves at my command. Athletes row, their oars cut deep, chasing dreams they long to keep.",  
        hint: "This facility supports Clemson's rowing team and aquatic research.",  
        location: "Clemson Rowing Center"  
    },
    {
        text: "I sit atop the highest view, where orange skies reflect the hue. Students come to sit and see, the beauty of their university.",  
        hint: "This overlook provides one of the best sunset views near campus.",  
        location: "Dike Trail Overlook"  
    }
];
    
    
    // Select 5 random riddles for this session
    //const riddles = getRandomRiddles(allRiddles, 5);
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
            riddleText.textContent = riddles[currentRiddleIndex].text;
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
    });
    
    // Function to advance to next riddle (called by the progress system)
    window.advanceToNextRiddle = function() {
        if (huntStarted && currentRiddleIndex < riddles.length - 1) {
            // Get location of the solved riddle
            const solvedLocation = riddles[currentRiddleIndex].location;
            
            // Advance to next riddle
            currentRiddleIndex++;
            riddleText.textContent = riddles[currentRiddleIndex].text;
            
            // Show success message with the location
            addSystemMessage(`Correct! You found ${solvedLocation}! Here's your next riddle.`);
            
            // Make riddles available to the progress system
            window.riddles = riddles;
        } else if (huntStarted && currentRiddleIndex === riddles.length - 1) {
            // Get location of the final solved riddle
            const solvedLocation = riddles[currentRiddleIndex].location;
            
            // Hunt completed
            addSystemMessage(`Correct! You found ${solvedLocation}! Congratulations! You've completed the Death Valley Dash! You've successfully found all the locations on campus. Claim your prize at the Student Union.`);
            huntStatus.textContent = "Hunt completed";
            hintButton.style.display = 'none';
            startButton.textContent = "Hunt Completed";
            startButton.style.display = 'block';
            startButton.disabled = true;
            
            // Make riddles available to the progress system
            window.riddles = riddles;
        }
    };
    
    // Hint button click handler
    hintButton.addEventListener('click', function() {
        if (huntStarted && currentRiddleIndex >= 0 && currentRiddleIndex < riddles.length) {
            addSystemMessage("Hint: " + riddles[currentRiddleIndex].hint);
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
