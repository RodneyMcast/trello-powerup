// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "REDACTED",
    authDomain: "whisky-5295a.firebaseapp.com",
    databaseURL: "https://whisky-5295a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "whisky-5295a",
    storageBucket: "whisky-5295a.appspot.com",
    messagingSenderId: "155703083316",
    appId: "1:155703083316:web:93de951ada87037109e561",
    measurementId: "G-M1KWZF7BNK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to add a task to Trello
function addToTrello(taskName) {
    console.log(`Adding ${taskName} to Trello`);

    fetch('https://api.trello.com/1/cards', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key: 'your_api_key', // Replace with your Trello API key
            token: 'your_oauth_token', // Replace with your Trello OAuth token
            idList: 'your_list_id', // Replace with your Trello list ID
            name: taskName
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Successfully added to Trello:', data);
        alert(`Task "${taskName}" added to Trello!`);
    })
    .catch(error => {
        console.error('Error adding to Trello:', error);
        alert('Failed to add task to Trello.');
    });
}

// Fetch Current Volumes and Render Dashboard
document.addEventListener("DOMContentLoaded", () => {
    const currentVolumesUl = document.getElementById("current-volumes");
    const historyDiv = document.getElementById("history");

    const drinksRef = ref(db, "drinks");

    onValue(drinksRef, (snapshot) => {
        const drinks = snapshot.val();
        currentVolumesUl.innerHTML = ""; 
        historyDiv.innerHTML = ""; 

        for (const drink in drinks) {
            const data = drinks[drink];

            currentVolumesUl.innerHTML += `
                <li>
                    <strong>${drink}</strong>: ${data.current_volume} L
                    <button onclick="addToTrello('${drink}')">Add to Trello</button>
                </li>
            `;

            let historyHtml = `<h3>${drink}</h3><ul>`;
            for (const timestamp in data.history) {
                historyHtml += `<li>${timestamp}: ${data.history[timestamp]} L</li>`;
            }
            historyHtml += "</ul>";
            historyDiv.innerHTML += historyHtml;
        }
    });
});
