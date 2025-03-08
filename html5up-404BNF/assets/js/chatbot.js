// chatbot.js - AI-driven chat implementation for DeathValleyDash

// Get DOM elements
const hintButton = document.getElementById('hint-button');
const chatbox = document.querySelector(".chatbox");
let riddleStarted = false;
let waitingForResponse = false;

// OpenAI API endpoint
const API_URL = "https://api.openai.com/v1/chat/completions";

// API key - ADD YOUR KEY WHEN TESTING LOCALLY, REMOVE BEFORE PUSHING TO GITHUB
const apiKey = 0;

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
        
        // Check if API key is set
        if (!API_KEY) {
            throw new Error("API key not configured. Please add your OpenAI API key for testing.");
        }
        
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
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
        console.log("API Response received");
        
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
        
        // Provide a useful fallback response
        if (error.message.includes("API key")) {
            loadingMessage.innerHTML = `<p>API key not configured. For a hackathon demo, use pre-defined responses or configure the key.</p>`;
        } else {
            loadingMessage.innerHTML = `<p>Sorry, I'm having trouble connecting to my AI services. Please try again or check console for details.</p>`;
        }
        
        // For hackathon demo, you might want to use fallback responses here
        // Example: loadingMessage.innerHTML = `<p>Here's a riddle about Tillman Hall...</p>`;
    } finally {
        waitingForResponse = false;
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