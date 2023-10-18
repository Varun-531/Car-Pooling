import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";
const apiKey = '16c3ab5b2d3640dc9d3b51d78b4260ea';
const apiUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';

async function fetchPlaceSuggestions(inputValue) {
    try {
        const response = await fetch(`${apiUrl}?text=${inputValue}&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data.features; // Geoapify API returns suggestions in the 'features' array
    } catch (error) {
        console.error('Error fetching place suggestions:', error);
        return [];
    }
}

function addAutocompleteToInputs() {
    const textInputs = document.querySelectorAll('input[type="text"]');

    textInputs.forEach((input) => {
        const suggestions = document.createElement('div');
        suggestions.className = 'suggestions';
        input.parentNode.appendChild(suggestions);

        input.addEventListener('input', async function () {
            const inputValue = input.value.trim();
            suggestions.innerHTML = '';

            if (inputValue.length >= 3) {
                const placeSuggestions = await fetchPlaceSuggestions(inputValue);

                placeSuggestions.forEach((place) => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = place.properties.name;
                    suggestion.addEventListener('click', () => {
                        input.value = place.properties.name;
                        suggestions.style.display = 'none'; // Hide suggestions after clicking
                    });

                    suggestions.appendChild(suggestion);
                });

                const inputRect = input.getBoundingClientRect();
                suggestions.style.top = inputRect.bottom + 'px';
                suggestions.style.left = inputRect.left + 'px';
                suggestions.style.display = 'block';
            } else {
                suggestions.style.display = 'none';
            }
        });
    });

    document.addEventListener('click', function (e) {
        textInputs.forEach((input) => {
            const suggestions = input.nextElementSibling;
            if (e.target !== input && e.target !== suggestions) {
                suggestions.style.display = 'none';
            }
        });
    });
}

addAutocompleteToInputs();

const firebaseConfig = {
    apiKey: "AIzaSyBQyv7gL4j1t8lyrNFoPFad3Yn8mJSrav4",
    authDomain: "wheels-together-64d28.firebaseapp.com",
    projectId: "wheels-together-64d28",
    storageBucket: "wheels-together-64d28.appspot.com",
    messagingSenderId: "656709491900",
    appId: "1:656709491900:web:3055a7da065d7d2d3784b9",
    measurementId: "G-ZK974E6BZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the reference to the DOM element where you want to display the user info
const userInfoElement = document.getElementById("userInfo");

// Add an event listener to the "Get My Info" button
// document.getElementById("getInfoButton").addEventListener("click", () => {
// Get the Firebase Auth object
const auth = getAuth(app);

// Check if a user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        logoutButton.style.display = 'block';
        loginSignupButton.style.display = 'none';
        console.log(user);
        document.cookie = `userEmail=${user.email}; expires=Wed, 01 Jan 2099 00:00:00 UTC; path=/`;
        document.cookie = `userDisplayName=${user.displayName}; expires=Wed, 01 Jan 2099 00:00:00 UTC; path=/`;
        // User is logged in
        if (user.displayName)
            userInfoElement.innerText = `Hello ${user.displayName}`
        else
            userInfoElement.innerHTML = `Hi ${user.email}`
    } else {
        // User is not logged in
        logoutButton.style.display = 'none';
        loginSignupButton.style.display = 'block';
        userInfoElement.innerText = "Please log in";
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.form1');
    const searchResultsDiv = document.getElementById('searchResults');

    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the form from submitting normally

        const placeInput1 = document.getElementById('placeInput1').value;
        const placeInput2 = document.getElementById('placeInput2').value;

        // Send an AJAX request to the server
        fetch(`/search?placeInput1=${placeInput1}&placeInput2=${placeInput2}`)
            .then(response => response.json())
            .then(data => {
                // Clear previous search results
                searchResultsDiv.innerHTML = '';

                if (data.length === 0) {
                    searchResultsDiv.innerHTML = 'No matching posts found';
                } else {
                    data.forEach((post, index) => {
                        // Create and append a div for each result
                        const resultDiv = document.createElement('div');
                        resultDiv.className = 'result';

                        const innerDiv = document.createElement('div'); // Create a nested div
                        innerDiv.className = 'result-details';

                        const pFrom = document.createElement('p');
                        pFrom.id = `fromLocation_${index}`;
                        pFrom.textContent = `From: ${post.fromLocation}`;
                        innerDiv.appendChild(pFrom);

                        const pTo = document.createElement('p');
                        pTo.id = `toLocation_${index}`;
                        pTo.textContent = `To: ${post.toLocation}`;
                        innerDiv.appendChild(pTo);

                        const pDate = document.createElement('p');
                        pDate.id = `date_${index}`;
                        pDate.textContent = `Date: ${post.date}`;
                        innerDiv.appendChild(pDate);

                        const pTime = document.createElement('p');
                        pTime.id = `time_${index}`;
                        pTime.textContent = `Time: ${post.time}`;
                        innerDiv.appendChild(pTime);

                        resultDiv.appendChild(innerDiv); // Add the innerDiv to the resultDiv

                        // Create a "View" button
                        const viewButton = document.createElement('button');
                        viewButton.textContent = 'View';
                        viewButton.addEventListener('click', function () {
                            // Handle the click event for the "View" button here
                            // You can access the details of the post using the `post` object

                            // Construct the URL with query parameters and data
                            const queryParams = new URLSearchParams();
                            queryParams.set('fromLocation', post.fromLocation);
                            queryParams.set('toLocation', post.toLocation);
                            queryParams.set('date', post.date);
                            queryParams.set('time', post.time);
                            queryParams.set('noOfPersons', post.noOfPersons); // Add noOfPersons as a query parameter
                            queryParams.set('sharingPrice', post.sharingPrice);
                            queryParams.set('userEmail', post.userEmail); // Add sharingPrice as a query parameter
                            console.log(queryParams);
                            // Navigate to booking.html with the query parameters
                            window.location.href = `booking.html?${queryParams.toString()}`;
                        });

                        resultDiv.appendChild(viewButton);

                        searchResultsDiv.appendChild(resultDiv);
                    });
                }

                // Scroll to the searchResultsDiv
                searchResultsDiv.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Error:', error);
                searchResultsDiv.innerHTML = 'Error searching for posts';
            });
    });
});




function clearCookies() {
    console.log('hello')
    document.cookie = 'userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'userDisplayName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
  
  const loginSignupButton = document.getElementById("loginSignupButton");
  
  loginSignupButton.addEventListener("click", function () {
      clearCookies();
      window.location.href = "login.html";
  });
  

const button2 = document.getElementById("button2");

button2.addEventListener("click", function () {
    window.location.href = "owner.html";
});

const infoButton = document.getElementById("info");

infoButton.addEventListener("click", function () {
    window.location.href = "user.html";
});

const logoutButton = document.getElementById('logoutButton'); // Replace with the actual button ID
function handleLogout() {
    clearCookies();
    auth.signOut()
        .then(() => {
            // Sign-out successful.
            window.location.href = '/login'; // Redirect to the login page
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
}

// Add a click event listener to the logout button
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        handleLogout();
    });
}