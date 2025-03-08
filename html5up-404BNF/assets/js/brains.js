let riddleMap = new Map(); // Global storage for POIs and their riddles

async function getPointsOfInterest(lat, lng) {
    const apiKey = env.GOOGLE_MAPS_API_KEY; // TODO: Replace with API Key
    const radius = 1609; // 1 mile in meters
    const type = 'point_of_interest';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error(`API Error: ${data.status}`);
        }

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

async function getRiddlesForPOIs(pois) {
    const apiKey = env.OPENAI_API_KEY; // TODO: Replace with API Key
    const prompt = pois.map(poi => `Create a riddle about a place called "${poi.name}", which is located at "${poi.address}".`).join("\n");

    const body = {
        model: "gpt-3.5-mini",
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

async function generateRiddlesForLocation() {
    if (!navigator.geolocation) {
        document.getElementById("output").innerText = "Geolocation is not supported by your browser.";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        document.getElementById("output").innerText = "Fetching points of interest...";

        const pois = await getPointsOfInterest(lat, lng);
        if (pois.length === 0) {
            document.getElementById("output").innerText = "No points of interest found.";
            return;
        }

        document.getElementById("output").innerText = "Generating riddles...";
        const riddles = await getRiddlesForPOIs(pois);

        // Store results in a map
        riddleMap.clear();
        riddles.forEach(poi => riddleMap.set(poi.name, poi.riddle));

        // Display the riddles
        let outputHTML = "<h2>Generated Riddles:</h2><ul>";
        riddles.forEach(poi => {
            outputHTML += `<li><strong>${poi.name}</strong>: ${poi.riddle}</li>`;
        });
        outputHTML += "</ul>";
        document.getElementById("output").innerHTML = outputHTML;
    }, () => {
        document.getElementById("output").innerText = "Unable to retrieve location.";
    });
}

// Run function on page load
document.addEventListener("DOMContentLoaded", generateRiddlesForLocation);
