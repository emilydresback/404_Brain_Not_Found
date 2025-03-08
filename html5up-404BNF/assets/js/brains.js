let riddleMap = new Map(); // Global storage for POIs and their riddles

async function getPointsOfInterest(lat, lng) {
    let apiKey = "AIzaSyCppCsNVKSyj-VmbrT30z05eymhyGs86LI"
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
    let apiKey = "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"

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
        throw new Error("Geolocation is not supported by your browser.");
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const pois = await getPointsOfInterest(lat, lng);
            if (pois.length === 0) {
                reject(new Error("No points of interest found."));
                return;
            }

            const riddles = await getRiddlesForPOIs(pois);

            // Store results in a map
            riddleMap.clear();
            riddles.forEach(poi => riddleMap.set(poi.name, poi.riddle));

            resolve(riddleMap);
        }, () => {
            reject(new Error("Unable to retrieve location."));
        });
    });
}

// Run function on page load
document.addEventListener("DOMContentLoaded", generateRiddlesForLocation);
