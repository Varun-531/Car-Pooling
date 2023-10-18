import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-auth.js";

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

const userInfoElement = document.getElementById("userInfo");
const userDetailsElement = document.getElementById("userDetails");

// Trigger "Get My Info" action on page load
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.displayName) {
            userInfoElement.innerText = `Hi ${user.displayName}\nEmail: ${user.email}`;
        } else {
            userInfoElement.innerHTML = `Hi ${user.email}`;
        }
    } else {
        alert('Please login to get your information');
        window.location.href='/login';

    }
});

// Trigger "Get User Details" action on page load
const userEmail = getCookie("userEmail");
if (userEmail) {
    fetchUserDetails(userEmail);
}

// Function to fetch user details and update HTML
async function fetchUserDetails(userEmail) {
    try {
        const response = await fetch("/getuserdetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail: userEmail }),
        });

        if (response.ok) {
            const htmlContent = await response.json();
            displayUserDetails(htmlContent);
            console.log(htmlContent);
             // Update the HTML content
        } else {
            userDetailsElement.innerText = "Error fetching user details.";
        }
    } catch (error) {
        userDetailsElement.innerText = "An error occurred while fetching user details.";
        console.error(error);
    }
}

// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to display user details in div blocks
function displayUserDetails(data) {
    userDetailsElement.innerHTML = ""; // Clear existing content

    const userPostsDiv = document.createElement("div");
    userPostsDiv.className = "user-posts";
    userPostsDiv.innerHTML = "<h2>User Posts</h2>";
    for (const post of data.userPosts) {
        const postDiv = document.createElement("div");
        postDiv.className ="user-posts";
        postDiv.innerHTML = `<p><b>Date:</b> ${post.date}</p>`;
        postDiv.innerHTML += `<p><b>Sharing Price: </b>${post.sharingPrice}</p>`;
        postDiv.innerHTML += `<p><b>User Email:</b> ${post.userEmail}</p>`;
        postDiv.innerHTML += `<p><b>From Location:</b> ${post.fromLocation}</p>`;
        postDiv.innerHTML += `<p><b>Time: </b>${post.time}</p>`;
        postDiv.innerHTML += `<p><b>To Location:</b> ${post.toLocation}</p>`;
        postDiv.innerHTML += `<p><b>No. of Persons:</b> ${post.noOfPersons}</p>`;
        userPostsDiv.appendChild(postDiv);
    }

    const confirmBookingsDiv = document.createElement("div");
    confirmBookingsDiv.className="confirm-bookings";
    confirmBookingsDiv.innerHTML = "<h2>Confirm Bookings</h2>";
    for (const booking of data.confirmBookings) {
        const bookingDiv = document.createElement("div");
        bookingDiv.className = "confirm-bookings";
        bookingDiv.innerHTML = `<p><b>Date:</b> ${booking.date}</p>`;
        bookingDiv.innerHTML += `<p><b>Sharing Price: </b>${booking.sharingPrice}</p>`;
        bookingDiv.innerHTML += `<p><b>User Email:</b> ${booking.Email1}</p>`;
        bookingDiv.innerHTML += `<p><b>From Location:</b> ${booking.fromLocation}</p>`;
        bookingDiv.innerHTML += `<p><b>Time: </b>${booking.time}</p>`;
        bookingDiv.innerHTML += `<p><b>To Location: </b>${booking.toLocation}</p>`;
        bookingDiv.innerHTML += `<p><b>No. of Persons:</b> ${booking.noOfPersons}</p>`;
        confirmBookingsDiv.appendChild(bookingDiv);
    }

    userDetailsElement.appendChild(userPostsDiv);
    userDetailsElement.appendChild(confirmBookingsDiv);
}
