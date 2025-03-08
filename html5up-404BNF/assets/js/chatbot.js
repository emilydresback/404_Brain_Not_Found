// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const hintButton = document.getElementById('hint-button');
    const chatMessages = document.getElementById('chat-messages');
    
    // Riddles for each location
    const riddles = [
        "I stand tall with a clock on my face, Clemson's most iconic place. What am I?",
        "Tigers roar within my walls, 80,000 strong for football calls. What am I?",
        "Books and knowledge fill my floors, students study behind my doors. What am I?",
        "A peaceful garden where plants grow, botanical knowledge on display and show. What am I?",
        "A center for students to gather and meet, with food and activities that can't be beat. What am I?"
    ];
    
    // Hints for each riddle
    const hints = [
        "This building has been the face of Clemson since 1893.",
        "The official name of this place is Memorial Stadium.",
        "Students often pull all-nighters here during finals week.",
        "This location features plants from around the world in a tranquil setting.",
        "Named after a former Clemson student body president who died in 1994."
    ];
    
    let currentRiddle = 0;
    
    // Send first riddle after a delay
    setTimeout(function() {
        addBotMessage(riddles[currentRiddle]);
    }, 1000);
    
    // Function to add bot message
    function addBotMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message';
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show hint
    function showHint() {
        if (currentRiddle < hints.length) {
            addBotMessage("Hint: " + hints[currentRiddle]);
        }
    }
    
    // Event listener for hint button
    hintButton.addEventListener('click', showHint);
});