
const firebase = require("firebase-admin");
//loading credentials from cred.json- lets you access firebase on account
const credentials = require("./cred.json");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL: "https://<yourproject>.firebaseio.com",
});

module.exports = firebase;