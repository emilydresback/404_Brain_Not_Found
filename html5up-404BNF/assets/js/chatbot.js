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

// OpenAI call handling

const chatInput = 
    document.querySelector('.chat-input textarea');
const sendChatBtn = 
    document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const API_KEY = 
    "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";

//OpenAI Free APIKey

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = 
        className === "chat-outgoing" ? `<p>${message}</p>` : `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi
    .querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    role: "user",
                    content: userMessage
                }
            ]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            messageElement
            .textContent = data.choices[0].message.content;
        })
        .catch((error) => {
            messageElement
            .classList.add("error");
            messageElement
            .textContent = "Oops! Something went wrong. Please try again!";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) {
        return;
    }
    chatbox
    .appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox
    .scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);

function cancel() {
    let chatbotcomplete = document.querySelector(".chatBot");
    if (chatbotcomplete.style.display != 'none') {
        chatbotcomplete.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg)
    }
}
