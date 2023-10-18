const admin = require("firebase-admin");
const express = require('express');
var passwordHash = require('password-hash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var serviceAccount = require("./key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "wheelstogether@outlook.com",
    pass: "Neekucheppanu"
  }
});

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = admin.firestore();

app.get("/login", function (req, res) {
  console.log("Received a request for /login");
  res.sendFile(__dirname + "/public/" + "login.html");
});

app.get("/", function (req, res) {
  console.log("Received a request for /login");
  res.sendFile(__dirname + "/public/" + "home.html");
});

app.get("/signup", function (req, res) {
  console.log("Received a request for /signup");
  res.sendFile(__dirname + "/public/" + "signup.html");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
  try {
    
    const fromLocation = req.body.fromLocation;
    const toLocation = req.body.toLocation;
    const date = req.body.date;
    const time = req.body.time;
    const noOfPersons = parseInt(req.body.noOfPersons); // Parse as an integer
    const sharingPrice = parseFloat(req.body.sharingPrice); // Parse as a float
    const userEmail = req.body.hiddenField1; // Retrieve the user's email
    const da = new Date();

    // Create a new document in the "userPosts" collection
    const docRef = await db.collection('userPosts').add({
      fromLocation,
      toLocation,
      date,
      time,
      noOfPersons,
      sharingPrice,
      userEmail,
      da,
      // Include the user's email in the document
    });

    const emailOptions = {
      from: "wheelstogether@outlook.com",
      to: userEmail,
      subject: "Form Submission Confirmation",
      text: `Dear User,

Thank you for your submission to WheelsTogether. Your ride details have been received and are as follows:

- From: ${fromLocation}
- To: ${toLocation}
- Date: ${date}
- Time: ${time}
- Number of Persons: ${noOfPersons}
- Sharing Price:  ₹${sharingPrice.toFixed(2)} 

We will work on finding suitable matches for your carpooling request. You will be notified once we find a match. 

Thank you for choosing WheelsTogether for your carpooling needs.

Best regards,
WheelsTogether Team`
    };

    transporter.sendMail(emailOptions, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Sent: " + info.response);
    });

    console.log('Document written with ID: ', docRef.id);
    console.log('Posted successfully!..');
    res.sendFile(__dirname + "/public/" + "user.html");
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Error submitting form');
  }
});


app.get('/search', async (req, res) => {
  try {
    console.log('Reached /search route');
    // Retrieve the fromLocation and toLocation from the request query parameters
    const fromLocation = req.query.placeInput1;
    const toLocation = req.query.placeInput2;
    if (!fromLocation || !toLocation) {
      return res.status(400).json({
        error: 'Both fromLocation and toLocation parameters are required'
      });
    }

    // Use fromLocation and toLocation to query Firestore for matching data
    const userPostsRef = db.collection('userPosts'); // Update the collection name to match your Firestore schema
    const query = userPostsRef
      .where('fromLocation', '==', fromLocation)
      .where('toLocation', '==', toLocation);
    const querySnapshot = await query.get();
    console.log('Searching for posts with fromLocation:', fromLocation, 'and toLocation:', toLocation);
    console.log('Number of matching documents:', querySnapshot.size);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'No matching posts found' });
    }

    const matchingPosts = [];
    querySnapshot.forEach((doc) => {
      matchingPosts.push(doc.data());
    });

    res.json(matchingPosts);
    console.log(matchingPosts);
  } catch (error) {
    console.error('Error searching for posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/confirm-booking', async (req, res) => {
  const bookingData = req.body;
  const userEmail = bookingData.userEmail; // Assuming userEmail is included in bookingData
  const cookieEmail = req.cookies.userEmail; // Retrieve email from the cookie
  if (!cookieEmail) {
    // If the userEmail doesn't match the cookieEmail or it's not provided, return an error response
    return res.status(400).json({ message: 'Authentication required to confirm the booking' });
  }

  // Define email options for both recipients

  // Function to send emails and remove the record from the database
  const sendEmailsAndRemoveRecord = async () => {
    try {

      // Remove the record from the database
      const userPostsRef = db.collection('userPosts'); // Update the collection name
      const query = userPostsRef
        .where('fromLocation', '==', bookingData.fromLocation)
        .where('toLocation', '==', bookingData.toLocation)
        .where('date', '==', bookingData.date)
        .where('time', '==', bookingData.time);
      const querySnapshot = await query.get();
      if (!querySnapshot.empty) {
        // Delete the first matching document
        const fromLocation = req.body.fromLocation;
        const toLocation = req.body.toLocation;
        const date = req.body.date;
        const time = req.body.time;
        const noOfPersons = parseInt(req.body.noOfPersons); // Parse as an integer
        const sharingPrice = parseFloat(req.body.sharingPrice); // Parse as a float
        // Retrieve the user's email
        const da = new Date();
        // Create a new document in the "confirmBookings" collection
        const docRef = await db.collection('confirmBookings').add({
          fromLocation,
          toLocation,
          date,
          time,
          noOfPersons,
          sharingPrice,
          Email1: userEmail,
          Email2: cookieEmail,
          da, // Include the user's email in the document
        });
        console.log(docRef);
        const doc = querySnapshot.docs[0];
        await doc.ref.delete();
        console.log('Record removed from the database');
        const confirmationText = `Dear User,

Your ride has been confirmed. Thank you for using our service!

Ride Details:
- From: ${fromLocation}
- To: ${toLocation}
- Date: ${date}
- Time: ${time}
- Number of Persons: ${noOfPersons}
- Sharing Price:  ₹${sharingPrice.toFixed(2)}
- Car Owner Email: ${userEmail}
- Co Traveller: ${cookieEmail}

We hope you have a safe and pleasant journey!

Best regards,
Wheels Together Team`

        // Email options for both recipients
        const userOptions = {
          from: 'wheelstogether@outlook.com',
          to: userEmail,
          subject: 'Ride Confirmation',
          text: confirmationText,
        };

        const cookieOptions = {
          from: 'wheelstogether@outlook.com',
          to: cookieEmail,
          subject: 'Ride Confirmation',
          text: confirmationText,
        };

        // Send confirmation emails
        await transporter.sendMail(userOptions);
        console.log('Confirmation email sent to user:', userEmail);

        await transporter.sendMail(cookieOptions);
        console.log('Confirmation email sent to email from the cookie:', cookieEmail);

      } else {
        console.log('Record not found in the database');
        res.status(201).json({ message: 'Ride not found' });
      }

      res.status(200).json({ message: 'Booking confirmed successfully' });
    } catch (error) {
      console.error('Error sending emails or removing record:', error);
      res.status(500).json({ message: 'Error sending confirmation emails or removing record' });
    }
  };
  // Call the function to send emails and remove the record
  sendEmailsAndRemoveRecord();
});


app.post('/getuserdetails', async (req, res) => {
  try {
    const userEmail = req.body.userEmail;
    console.log('get detailsl: ', userEmail);// Assuming you send the user's email in the request body
    const db = admin.firestore();
    const userPostsRef = db.collection('userPosts').where('userEmail', '==', userEmail)
    const confirmBookingsRef = db.collection('confirmBookings').where('Email2', '==', userEmail)

    const [userPostsSnapshot, confirmBookingsSnapshot] = await Promise.all([
      userPostsRef.get(),
      confirmBookingsRef.get(),
    ]);

    const userPostsData = userPostsSnapshot.docs.map((doc) => doc.data());
    const confirmBookingsData = confirmBookingsSnapshot.docs.map((doc) => doc.data());
    confirmBookingsData.sort((a, b) => b.da - a.da);
    userPostsData.sort((a, b) => b.da - a.da);
    console.log(confirmBookingsData);
    res.status(200).json({
      userPosts: userPostsData,
      confirmBookings: confirmBookingsData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
