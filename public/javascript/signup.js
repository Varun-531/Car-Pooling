import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth ,GoogleAuthProvider ,signInWithPopup } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyBQyv7gL4j1t8lyrNFoPFad3Yn8mJSrav4",
    authDomain: "wheels-together-64d28.firebaseapp.com",
    projectId: "wheels-together-64d28",
    storageBucket: "wheels-together-64d28.appspot.com",
    messagingSenderId: "656709491900",
    appId: "1:656709491900:web:3055a7da065d7d2d3784b9",
    measurementId: "G-ZK974E6BZF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en'
const provider = new GoogleAuthProvider();

const auth1 = getAuth();

const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")

window.signup = function(e){
  e.preventDefault();
  var obj = {
      name:username.value,
      email:email.value,
      pass:password.value,
  }
  createUserWithEmailAndPassword(auth1,obj.email,obj.pass)
  .then(function(success){
      alert("Signup Successfully")
      window.location.href="./login.html"
  })
  .catch(function(err){
      alert("error" + err)
  })
  console.log(obj)``
};

const googleLogin = document.getElementById("google1")
googleLogin.addEventListener("click",function(){
    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "./home.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
})

var loginButton = document.getElementById("login");
        
        // Add a click event listener to the button
        loginButton.addEventListener("click", function() {
            // Redirect to another web page
            window.location.href = "login.html";
});