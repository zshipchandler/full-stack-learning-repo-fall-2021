
import firebase from "firebase/compat/app";
import "firebase/compat/auth"; //v9

//TODO: ADD configuration
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCCZdBE2TdhLDrNY4QT5ef9cnwTiCw8kpA",
    authDomain: "todoapp-c6cbe.firebaseapp.com",
    databaseURL: "https://todoapp-c6cbe-default-rtdb.firebaseio.com",
    projectId: "todoapp-c6cbe",
    storageBucket: "todoapp-c6cbe.appspot.com",
    messagingSenderId: "846644989453",
    appId: "1:846644989453:web:8b2855ea32b02b29050f44",
    measurementId: "G-8CY9W1W4H2"
  };

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth, firebase };

