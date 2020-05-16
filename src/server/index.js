// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express, CORS and Body Parser
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configure the server port and cross origin allowance
const PORT = 8080;

// Start up an instance of app
const app = express();

/* Middleware*/
// Configure body-parser as middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

app.get('/all', (req, res) => {
    try {
        res.status(200).send(projectData);
    } catch (error) {
        console.error(JSON.stringify(error));
        res.status(500).send();
    }
});

app.post('/', (req, res) => {
    try {
        const { temperature, date, userResponse } = req.body;
        if (!(temperature && date && userResponse)) {
            throw new Error('temperature, date and userResponse are required fields');
        }
        projectData = {
            temperature: temperature,
            date: date,
            userResponse: userResponse
        };
        res.status(200).send();
    } catch (error) {
        console.error(JSON.stringify(error));
        res.status(500).send(error);
    }
});