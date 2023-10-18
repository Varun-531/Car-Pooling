const apiKey = '16c3ab5b2d3640dc9d3b51d78b4260ea';
const apiUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';

async function fetchPlaceSuggestions(inputValue, input) {
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

function addAutocompleteToInput(input) {
    const suggestions = document.createElement('div');
    suggestions.className = 'suggestions';
    input.parentNode.appendChild(suggestions);

    input.addEventListener('input', async function () {
        const inputValue = input.value.trim();
        suggestions.innerHTML = '';

        if (inputValue.length >= 3) {
            const placeSuggestions = await fetchPlaceSuggestions(inputValue, input);

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
}

function initializeAutocomplete() {
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach((input) => addAutocompleteToInput(input));
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAutocomplete();
  });

  document.addEventListener('click', function (e) {
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach((input) => {
      const suggestions = input.nextElementSibling;
      if (e.target !== input && e.target !== suggestions) {
        suggestions.style.display = 'none';
      }
    });
  });


// Function to get the value of a cookie by its name
function getCookieValue(name) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
          return decodeURIComponent(cookieValue);
      }
  }
  return null;
}

// Retrieve user email from the cookies
const userEmail = getCookieValue("userEmail");

// Set the value of the hidden field with the user's email
const hiddenField1 = document.getElementById("hiddenField1");
if (hiddenField1 && userEmail) {
    hiddenField1.value = userEmail;
}

// Add a submit event listener to the form
// ... (Previous code)

// Function to handle the JSON response
function handleFormSubmissionResponse(data) {
    if (data.success) {
      alert(data.message);
      window.location.href="user.html"; // Display the success message in an alert
    } else {
      alert(data.message);
      window.location.href="user.html"; // Handle error messages if needed
    }
  }
  
  // Add a submit event listener to the form
  document.addEventListener("submit", async (event) => {
    if (event.target.id === "rideForm") {
      // Check if the user email is retrieved from the cookies
      const userEmail = getCookieValue("userEmail");
  
      if (!userEmail) {
        event.preventDefault(); // Prevent form submission
        alert("Please log in to post a ride.");
        window.location.href = "/login";
      } 
    }
  });
  
  // ... (Rest of the code)
  