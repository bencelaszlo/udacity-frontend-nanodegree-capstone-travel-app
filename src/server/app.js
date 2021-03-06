// Setup empty JS object to act as endpoint for all routes
let locationData = {};

// Require Express, CORS and Body Parser
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();

/* Middleware */
// Configure body-parser as middleware
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Send all saved data
app.get('/all', (req, res) => {
  try {
    res.status(200).send(locationData);
  } catch (error) {
    console.error(JSON.stringify(error));
    res.status(500).send();
  }
});

// Save location data
app.post('/', (req, res) => {
  try {
    const { latitude, longitude, country, startDate } = req.body;

    // Throw an error when something is missing from the location data object
    if (!(latitude && longitude && country && startDate)) {
      throw new Error('latitude, longitude, country, startDate are required fields');
    }

    locationData = {
      latitude,
      longitude,
      country,
      startDate
    };

    res.status(200).send();
  } catch (error) {
    console.error(JSON.stringify(error));
    res.status(500).send(error);
  }
});

module.exports = app;
