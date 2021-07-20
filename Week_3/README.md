# Week 3: NodeJS, Calling Third Party APIs, and NOSQL Basics
# Learning Objectives
- Basics of JS and NodeJS
- Building, Testing, and Interacting with APIs 
- Understanding how NOSQL/Document Databases operate at a high level
# Classwork
Today, we will be interacting with TheDogAPI, a public third party API which allows users to view different dog breeds and vote for their favorite dog pics. Additionally, we will be writing our own API to interact with TheDogAPI to perform specific actions: 

1. Getting the first 10 dog breeds from the API
2. Allowing users to vote for multiple pictures by passing in an array of image ids
3. Getting all the votes for a particular user


We will be using the following NodeJS modules
1. **Express**: API creation service: spins up middlewares to respond to HTTP Requests.
2. **Supervisor**: watches for code changes and gives developers hot-reloading behavior (no need to restart application after each change).
3. **Axios**: HTTP client library which allows the sending of HTTP requests.
4. **DotEnv**: loads environment variables from a `.env` file into `processing.env`. 

Although NodeJS code is provided in a step by step manner to follow, it is recommended to code independently

Be sure to have registered for an account on [TheDogAPI Website](https://thedogapi.com/signup) and received an API Key.

## Getting Started
1. Navigate to the Week 3 Classwork Directory 
2. Install the project dependencies
    ```
    npm install express supervisor axios dotenv
    ```
    NPM will automatically generate a `package.json` file where you can confirm that the requirements libraries have been satisfied.
3. Create a .env file and add your API KEY
    ```
    API_KEY=SOMETHING
    ```
4. Add the following boilerplate code to `index.js`
    ```js
    // Resolve Module Imports
    const express = require("express");
    const axios = require("axios").default;
    require("dotenv").config();

    // Initializes a new express app
    const app = express();
    const X_API_KEY = process.env.API_KEY;
    const port = 3000;

    // Exposes an API on your local computer
    app.listen(port, () => {
        console.log("App Listening on Port 3000");
    });

    //More Configuration
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))
    ```
    The `require()` keyword loads in the external dependencies 
5. Make sure the server runs by running the following terminal commands
    ```
    $ npm run dev
    > ...
    > App Listening on Port 3000
    ```
    Note: the following command can be found in `package.json` under `scripts`. Extra scripts are often included including ones for testing and production (They will not be necessary in this project).

## Writing the Functions
1. Add the following custom HTTP JS Functions 
    ```js
    // Helper HTTP Functions to auto parse out the contents of response
    async function httpGET(url, config) {
        try {
            const response = await axios.get(url, config);
            return response.data;
        } catch (error) {
            console.error(error);
            return error.response.data;
        }
    }
    async function httpPOST(url, body, config) {
        try {
            const response = await axios.post(url, body, config);
            return response.data;
        } catch (error) {
            console.error(error);
            return error.response.data;
        }
    }
    ```
    We've added these to reduce the time needed to parse json requests and responses.
### Fetching the first 10 dog breeds (GET)

<details><summary>Request/Response Structure</summary>
<p>

## Endpoint 

```
(GET) localhost:3000/breeds
```

## Sample Response
```json
{
    "data": [
        {
            "name": "Affenpinscher",
            "height": "9 - 11.5",
            "weight": "6 - 13",
            "origin": "Germany, France",
            "life_span": "10 - 12 years",
            "image_id": "BJa4kxc4X"
        },
        {
            "name": "Afghan Hound",
            "height": "25 - 27",
            "weight": "50 - 60",
            "origin": "Afghanistan, Iran, Pakistan",
            "life_span": "10 - 13 years",
            "image_id": "hMyT4CDXR"
        },
        {
            "name": "African Hunting Dog",
            "height": "30",
            "weight": "44 - 66",
            "origin": "",
            "life_span": "11 years",
            "image_id": "rkiByec47"
        },
        ...
    ]
}
```

</p>
</details>

1. Add the Endpoint 
    ```js
    // Get Doge Breeds => first 10 {name, height,weight,origin,life_span, image_id}
    app.get("/breeds", async (req, res) => {
        res.json({"message": "ok"});
    });
    ```
    `app.get("/breeds")` specifies a GET request at the relative endpoint of `/breeds`. `async` marks the function as asynchronous, a functionality needed for calling third party APIs. `req` and `res` stand for request and response.
2. Call the Dog API 
    ```js
    // Get Doge Breeds => first 10 {name, height,weight,origin,life_span, image_id}
    app.get("/breeds", async (req, res) => {
        const call = await httpGET("https://api.thedogapi.com/v1/breeds",{ params: { limit: 10 }});

        res.json({"message": "ok"});
    });
    ```
3. Process the Information into Response
    ```js
    // Get Doge Breeds => first 10 {name, height,weight,origin,life_span, image_id}
    app.get("/breeds", async (req, res) => {
    const call = await httpGET("https://api.thedogapi.com/v1/breeds", { params: { limit: 10 }});
    const response = call.map((data) => {
        return {
            name: <FILL_THIS_IN>,
            height: <FILL_THIS_IN>,
            weight: <FILL_THIS_IN>,
            origin: <FILL_THIS_IN>,
            life_span: <FILL_THIS_IN>,
            image_id: <FILL_THIS_IN>,
        };
    });

    res.json({"message": "ok"});
    });
    ```
    The [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function iterates through an array and returns an array with modified elements.
4. Return the Response as JSON
    ```js
    // Get Doge Breeds => first 10 {name, height,weight,origin,life_span, image_id}
    app.get("/breeds", async (req, res) => {
    const call = await httpGET("https://api.thedogapi.com/v1/breeds", { params: { limit: 10 }});
    const response = call.map((data) => {
        return {
            name: <FILL_THIS_IN>,
            height: <FILL_THIS_IN>,
            weight: <FILL_THIS_IN>,
            origin: <FILL_THIS_IN>,
            life_span: <FILL_THIS_IN>,
            image_id: <FILL_THIS_IN>
        };
    });
    // Return Response
    res.json({data: response});
    });
    ```
### Voting for multiple images 
<details><summary>Request/Response Structure</summary>
<p>

## Endpoint 

```
(POST) localhost:3000/votes
```
## Sample Request
```json
{
    "data": [
        {"image_id": "BJa4kxc4X","value": 0},
        {"image_id": "BJa4kxc4d","value": 1}
    ]
}
```
## Sample Response
```json
{
    "data": [
        {
            "message": "SUCCESS",
            "id": 40861
        },
        {
            "message": "SUCCESS",
            "id": 40862
        }
    ]
}
```

</p>
</details>

1. Add the Endpoint 
    ```js
    // Vote for Dog Breeds in a list
    app.post("/votes", async (req, res) => {
        res.json({"message": "ok"});
    });
    ```
    Note that since this is a post request, we have an `app.post()` rather than `app.get()`
2. Get the Contents of the JSON Request Body
    ```js
    // Vote for Dog Breeds in a list
    app.post("/votes", async (req, res) => {
        // Parse the Body
        const body = req.body;
        res.json({"message": "ok"});
    });
    ```
3. Iterate through the list of votes 
    ```js
    // Vote for Dog Breeds in a list
    app.post("/votes", async (req, res) => {
    // Parse the Body
    const body = req.body;

    // Sending multiple requests and storing them in an array
    let promiseArray = body.data.map((item) =>
        httpPOST(
        "https://api.thedogapi.com/v1/votes",
        {
            image_id: <FILL_THIS_IN>,
            value: <FILL_THIS_IN>,
        },
        {
            headers: {
            "x-api-key": X_API_KEY,
            },
        }
        )
    );
        res.json({"message": "ok"});
    });
    ```
4. Wait for all requests to be resolved and process data
    ```js
    // Vote for Dog Breeds in a list
    app.post("/votes", async (req, res) => {
    // Parse the Body
    const body = req.body;

    // Sending multiple requests and storing them in an array
    let promiseArray = body.data.map((item) =>
        httpPOST(
        "https://api.thedogapi.com/v1/votes",
        {
            image_id: <FILL_THIS_IN>,
            value: <FILL_THIS_IN>,
        },
        {
            headers: {
            "x-api-key": X_API_KEY,
            },
        }
        )
    );
    // Wait for all Requests to finish processing
    const response = await Promise.all(promiseArray).then((results) => {
        return results;
    });

    res.json({"message": "ok"});
    });
    ```
5. Return formatted response
    ```js
    // Vote for Dog Breeds in a list
    app.post("/votes", async (req, res) => {
    // Parse the Body
    const body = req.body;

    // Sending multiple requests and storing them in an array
    let promiseArray = body.data.map((item) =>
        httpPOST(
        "https://api.thedogapi.com/v1/votes",
        {
            image_id: <FILL_THIS_IN>,
            value: <FILL_THIS_IN>,
        },
        {
            headers: {
            "x-api-key": X_API_KEY,
            },
        }
        )
    );
    // Wait for all Requests to finish processing
    const response = await Promise.all(promiseArray).then((results) => {
        return results;
    });

    // Return Response
    res.json({ data: response });
    });
    ```

    
### **Bonus**: Getting all votes for a user
<details><summary>Request/Response Structure</summary>
<p>

## Endpoint 

```
(GET) localhost:3000/votes
```
## Sample Response
```json
{
    "data": [
        {
            "id": 40716,
            "image_id": "asf2",
            "sub_id": "my-user-1234",
            "created_at": "2021-07-17T22:53:49.000Z",
            "value": 1,
            "country_code": "US"
        },
        {
            "id": 40717,
            "image_id": "asf2",
            "sub_id": null,
            "created_at": "2021-07-17T22:54:09.000Z",
            "value": 1,
            "country_code": "US"
        },
        ...
    ]
}
```

</p>
</details>

# Deliverables
Add the `index.js` file in the deliverables folder.  
# Links

