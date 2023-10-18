document.addEventListener('DOMContentLoaded', function () {
    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    console.log('Query Parameters:', queryParams.toString());
    // Extract individual query parameters
    const fromLocation = queryParams.get('fromLocation');
    const toLocation = queryParams.get('toLocation');
    const date = queryParams.get('date');
    const time = queryParams.get('time');
    const noOfPersons = queryParams.get('noOfPersons');
    const sharingPrice = queryParams.get('sharingPrice');
    const userEmail = queryParams.get('userEmail'); // Access userEmail
    console.log('userEmail:', userEmail);
    // Access the "booking-details" div in your HTML
    const bookingDetailsDiv = document.getElementById('booking-details');

    // Create HTML elements to display the data
    const detailsList = document.createElement('ul');

    // Populate the list with booking details
    const fromLocationItem = document.createElement('li');
    fromLocationItem.textContent = `From: ${fromLocation}`;
    detailsList.appendChild(fromLocationItem);

    const toLocationItem = document.createElement('li');
    toLocationItem.textContent = `To: ${toLocation}`;
    detailsList.appendChild(toLocationItem);

    const dateItem = document.createElement('li');
    dateItem.textContent = `Date: ${date}`;
    detailsList.appendChild(dateItem);

    const timeItem = document.createElement('li');
    timeItem.textContent = `Time: ${time}`;
    detailsList.appendChild(timeItem);

    const noOfPersonsItem = document.createElement('li');
    noOfPersonsItem.textContent = `Number of Persons: ${noOfPersons}`;
    detailsList.appendChild(noOfPersonsItem);

    const sharingPriceItem = document.createElement('li');
    sharingPriceItem.textContent = `Sharing Price: ${sharingPrice}`;
    detailsList.appendChild(sharingPriceItem);

    const userEmailItem = document.createElement('li');
    userEmailItem.textContent = `User Email: ${userEmail}`;
    detailsList.appendChild(userEmailItem);

    // Append the list to the "booking-details" div
    bookingDetailsDiv.appendChild(detailsList);

    // Access the "confirmBookingButton" element
    const confirmBookingButton = document.getElementById('confirmBookingButton');

    // Add a click event listener to the "Confirm Booking" button
    confirmBookingButton.addEventListener('click', function () {
        // Prepare the data to send to the server
        const bookingData = {
            fromLocation,
            toLocation,
            date,
            time,
            noOfPersons,
            sharingPrice,
            userEmail, // Include userEmail
        };

        // Send a POST request to the server endpoint
        fetch('/confirm-booking', {
            method: 'POST',
            body: JSON.stringify(bookingData),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.status === 200) {
                // Handle successful booking confirmation
                return response.json().then((data) => {
                    console.log(data.message);
                    alert('Your Ride is Booked!!');
                    window.location.href="user.html";
                });
            } else if (response.status === 400) {
                // Display an alert for users not logged in
                return response.json().then((data) => {
                    alert(data.message);
                    window.location.href="/login";
                });
            }else if (response.status === 201) {
                // Display an alert for users not logged in
                return response.json().then((data) => {
                    alert(data.message);
                    window.location.href="/login";
                });
            } else {
                // Handle other error cases
                console.error('Error during booking confirmation:', response.status);
            }
        })
        .catch((error) => {
            console.error('Error during booking confirmation:', error);
        });
    });
});