const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
//cred.js exports a const firebase = require("firebase-admin")
const admin = require("./firebase/cred.js");
const db = admin.firestore();
const uuid = require("uuid");
const auth = require("./auth/auth.js");


// Define app and port
const app = express();
const port = process.env.PORT;

//Middlware
app.use(cors());
app.use(express.json());

app.use("/", auth);

//INITIALIZE SERVER ON PORT
app.listen(port, () => 
    console.log(`Listening on Port ${process.env.PORT}!`)
);

//creating a new todo item
app.post("/todo", auth, async (request, response) => {
    let user = request.name;
    let description = request.body.description;
    let state = request.body.state;
    //check if there is a description- if not, return error
    if (description === undefined) {
        return response.json({"Error" : "No description found"})
    } 
    if (state === undefined) {
        return response.json({"Error" : "No state found"})
    } 
    let id = uuid.v1();
    
    //create new todo object
    let todoItem = {"id": id, "description": description, "state": state};

    //updates the firestore database
    let temp = await db.collection(user).doc(id);
    temp.set(todoItem);
    return response.json(todoItem);
});

app.post("/toggle", auth, async(request, response) => {
    let user = request.name;
    let id = request.body.id;

    //stores the information
    let temp = await db.collection(user).doc(id).get();

    let temp1 = await db.collection(user).doc(id);
    let todoItem = temp.data();

    //toggle the state
    todoItem.state = !todoItem.state;

    //updates the state
    temp1.set(todoItem);
    return response.json(todoItem);
});

app.post("/id", auth, async(request, response) => {
    let user = request.name;
    let description = request.body.description;
    let temp = await db.collection(user).get();
    let id;
    temp.forEach((doc) => {
        if(doc.data().description === description) {
            id = doc.data().id;
        }
    })
    return response.json({msg:"Success", id : id});
});

app.get("/getAll", auth, async(request, response) => {
    let user = request.name;
    let temp = await db.collection(user).get();

    //create a list of the users todo items
    const todoItems = [];
    temp.forEach((doc) => {
        todoItems.push(doc.data());
    });

    return response.json({msg:"Success", data : todoItems});
});



// check if user is valid
app.get("/auth", auth, (req, res) => {
    return res.json({ msg: "Success" });
  });
