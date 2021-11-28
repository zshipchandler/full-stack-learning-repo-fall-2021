//called in index.js
const firebase = require("../firebase/cred");
const jwt = require("jwt-decode");
const { default: jwtDecode } = require("jwt-decode");

//allows you to decode JWT tokens
function authMiddleware(req, res, next) {
  //getting the token
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    return res.status(401).send({ message: "No token provided" });
  }

  //if there no bearer (usually formatted with one), error
  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  //get first value from bearer token
  const token = headerToken.split(" ")[1];

  //calling methods from firebase that actually authorize/check token
  firebase
    .auth()
    .verifyIdToken(token)
    .then(() => {
      // Send some important metadata to each call
      req.name = jwtDecode(token).name;
      next();
    })
    .catch(() => res.status(403).send({ msg: "Could not authorize" }));
}

module.exports = authMiddleware;