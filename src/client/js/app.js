// Initalize the application, load saved last travel data
const initalizeApplication = () => {
  // Add event listener to the search button
  const generateElement = document.querySelector('#generate');
  generateElement.addEventListener('click', updateUi);

  // Set today as the minimum selectable date
  const startDateElement = document.querySelector('#startDate');
  startDateElement.min = new Date().toISOString().split('T')[0];

  // Calculate and set today + 15 day as the maximum selectable date
  const maxDate = new Date();
  const newDate = maxDate.getDate() + 15;
  maxDate.setDate(newDate);
  startDateElement.max = maxDate.toISOString().split('T')[0];

  // Load saved data from the localStorage and update the UI
  document.querySelector('#entryImage').innerHTML = `<img src="${localStorage.getItem('picture')}" alt="picture about the destination">`;
  document.querySelector('#entryCity').innerHTML =  `<span>City: ${localStorage.getItem('city')}</span>`;
  document.querySelector('#entryCountry').innerHTML = `<span>Country: ${localStorage.getItem('country')}</span>`;
  document.querySelector('#entryWeather').innerHTML = `<img src="https://www.weatherbit.io/static/img/icons/${localStorage.getItem('weatherIcon')}.png" alt="weather-icon"><br><span>${localStorage.getItem('weatherDescription')}</span>`;
  document.querySelector('#entryStartDate').innerHTML = `<span>Start: ${localStorage.getItem('startDate')}</span>`;
  document.querySelector('#entryLatitude').innerHTML = `<span>Latitude: ${localStorage.getItem('latitude')}</span>`;
  document.querySelector('#entryLongitude').innerHTML = `<span>Longitude: ${localStorage.getItem('longitude')}</span>`;
};

// Save location data in the back-end
const saveLocation = async (path, data) => {
  await fetch(path, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
};

// Query location to a name
const getLocationInfo = async (location) => {
  const response = await fetch(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=bencelaszlo`, {
    method: 'GET'
  });

  return response.json();
};

// Query weather data to a given location and time
const getWeather = async (days, location) => {
  const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&days=${days + 2}&key=735d4def59b348979a0a246d3fc88da4`, {
    method: 'GET'
  });

  return response.json();
};

// Query pictures to a given location
const getPicture = async (location) => {
  const response = await fetch(`https://pixabay.com/api/?key=16594425-95ce33f4571e1209114762fd9&q=${location}&image_type=photo`, {
    method: 'GET'
  });
  return response.json();
};

// Get data from the back-end
const getAllData = async (path) => {
  const response = await fetch(path, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  return response.json();
};

const updateUi = () => {
  // Query location data
  getLocationInfo(document.querySelector('#destination').value).then((locationResponse) => {
    const location = locationResponse.geonames[0];
    const startDate = document.querySelector('#startDate').value;

    // Crate data object
    const data = {
      latitude: location.lat,
      longitude: location.lng,
      country: location.countryName,
      startDate
    };

    // Send location data to the back-end
    saveLocation('http://localhost:8080/', data).then(() => {
      getAllData('http://localhost:8080/all').then((storedData) => {
        // Save location data to the localStorage
        localStorage.setItem('city', location.toponymName);
        localStorage.setItem('country', storedData.country);
        localStorage.setItem('latitude', storedData.latitude);
        localStorage.setItem('longitude', storedData.longitude);
        localStorage.setItem('startDate', storedData.startDate);

        // Set location data in the UI
        document.querySelector('#entryCity').innerHTML = `<span>City: ${location.toponymName}</span>`;
        document.querySelector('#entryCountry').innerHTML = `<span>Country: ${storedData.country}</span>`;
        document.querySelector('#entryLatitude').innerHTML = `<span>Latitude: ${storedData.latitude}</span>`;
        document.querySelector('#entryLongitude').innerHTML = `<span>Longitude: ${storedData.longitude}</span>`;

        // Set date and calculate days, update the UI
        const d = new Date();
        const daysBeforeTheTrip = Math.round((new Date(storedData.startDate) - d) / 86400000);
        document.querySelector('#entryStartDate').innerHTML = `<span>Start: ${storedData.startDate} (${daysBeforeTheTrip} ${daysBeforeTheTrip === 1 ? 'day' : 'days'})</span>`;


        // Query weather data
        getWeather(daysBeforeTheTrip, location.toponymName).then((forecast) => {
          const weather = forecast.data[forecast.data.length - 1].weather;
          // Save weather data to the localStorage
          localStorage.setItem('weatherIcon', weather.icon);
          localStorage.setItem('weatherDescription', weather.description);
          // update the UI with weather data
          document.querySelector('#entryWeather').innerHTML = `<img src="https://www.weatherbit.io/static/img/icons/${weather.icon}.png" alt="weather-icon"><br><span>${weather.description}</span>`;
        });

        // Query pictures
        getPicture(location.toponymName.replace(' ', '%')).then((pictures) => {
          const topPictureURL = pictures.hits[0].largeImageURL;
          // Save the first picture to the localStorage
          localStorage.setItem('picture', topPictureURL);
          // update the UI with the picture
          document.querySelector('#entryImage').innerHTML = `<img src="${topPictureURL} alt="picture about the destination">`;
        });
      });
    });
  });
};

export {
  initalizeApplication,
  updateUi
};
