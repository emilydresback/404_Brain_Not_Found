// chatbot.js - Direct OpenAI API version

// Get DOM elements
const hintButton = document.getElementById('hint-button');
const chatbox = document.querySelector(".chatbox");
let riddleStarted = false;
let waitingForResponse = false;

// OpenAI API endpoint
const API_URL = "https://api.openai.com/v1/chat/completions";

// API key 
const OPENAI_API_KEY = os.getenv("OPENAI_API_KEY");

// Conversation history for context
let conversationHistory = [
    {
        role: "system",
        content: "You are an AI guide for a Clemson University scavenger hunt called DeathValleyDash. Your job is to provide riddles about Clemson campus landmarks and give hints when asked. Keep responses under 50 words. Begin by welcoming the user. When they click 'Start', provide a riddle about a Clemson landmark. When they click 'Hint', provide a hint for your most recent riddle without revealing the answer."
    }
];

// Function to create and add a message to the chat
function addMessage(text, isBot) {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat");
    chatLi.classList.add(isBot ? "chat-incoming" : "chat-outgoing");
    chatLi.innerHTML = `<p>${text}</p>`;
    chatbox.appendChild(chatLi);
    chatbox.scrollTop = chatbox.scrollHeight;
    return chatLi;
}

// Function to show a loading message
function showLoading() {
    return addMessage("Thinking...", true);
}

// Generate response from OpenAI API
async function generateResponse(userAction) {
    // Add user action to conversation history
    conversationHistory.push({
        role: "user",
        content: userAction
    });
    
    const loadingMessage = showLoading();
    
    try {
        // Log what we're sending
        console.log("Sending request to OpenAI API...");
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
                max_tokens: 150,
                temperature: 0.7
            })
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response received:", data);
        
        // Get the response text
        const aiMessage = data.choices[0].message.content;
        
        // Update loading message with actual response
        loadingMessage.innerHTML = `<p>${aiMessage}</p>`;
        
        // Add AI response to conversation history
        conversationHistory.push({
            role: "assistant",
            content: aiMessage
        });
        
        // Limit context size to prevent token limits
        if (conversationHistory.length > 10) {
            conversationHistory = [
                conversationHistory[0], // Keep system prompt
                ...conversationHistory.slice(-9) // Keep last 9 messages
            ];
        }
        
    } catch (error) {
        console.error("Error details:", error);
        loadingMessage.innerHTML = `<p>Sorry, I'm having trouble connecting to my AI services. Please try again or check console for details.</p>`;
    } finally {
        waitingForResponse = false;
    }
}

//Code to handle getting the initial locations and producing the riddles: Javascript Version

async function getPointsOfInterest(lat, lng) {
    const apiKey = 'MAPS_API_KEY'; //TODO: Figure out how to add the key with environment var
    const radius = 1609; // 1 mile in meters
    const type = 'point_of_interest'; // General category for points of interest
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error(`API Error: ${data.status}`);
        }

        // Get the first 5 points of interest
        return data.results.slice(0, 5).map(place => ({
            name: place.name,
            address: place.vicinity,
            location: place.geometry.location
        }));
    } catch (error) {
        console.error("Error fetching points of interest:", error);
        return [];
    }
}


//Code to generate riddles

async function getRiddlesForPOIs(pois) {
    const apiKey = 'OPENAI_API_KEY'; //TODO: Figure out how to add the key with environment var
    const prompt = pois.map(poi => `Create a riddle about a place called "${poi.name}", which is located at "${poi.address}".`).join("\n");

    const body = {
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return pois.map((poi, index) => ({
            ...poi,
            riddle: data.choices[0].message.content.split("\n")[index] || "No riddle available."
        }));
    } catch (error) {
        console.error("Error generating riddles:", error);
        return pois.map(poi => ({ ...poi, riddle: "Could not generate a riddle." }));
    }
}

// Handle button click
hintButton.addEventListener("click", function() {
    // Prevent multiple clicks while waiting for response
    if (waitingForResponse) return;
    waitingForResponse = true;
    
    if (!riddleStarted) {
        // First click - Start the game
        riddleStarted = true;
        hintButton.textContent = "Hint";
        generateResponse("Start the scavenger hunt. Give me a riddle about a Clemson landmark.");
    } else {
        // Subsequent clicks - Give hint
        generateResponse("I need a hint for the current riddle, please.");
    }
});

// Add initial welcome message on page load
document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing messages
    while (chatbox.firstChild) {
        chatbox.removeChild(chatbox.firstChild);
    }
    
    // Add welcome message
    addMessage("Welcome to DeathValleyDash! I'll guide you with riddles about hidden locations around Clemson. Click 'Start' to begin the adventure!", true);
});

// Log when the script is loaded
console.log("Chatbot script loaded successfully!");