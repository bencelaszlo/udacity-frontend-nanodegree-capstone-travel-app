const initalizeApplication = () => {
  const generateElement = document.querySelector('#generate');
  generateElement.addEventListener('click', updateUi);

  const startDateElement = document.querySelector('#startDate');
  startDateElement.min = new Date().toISOString().split('T')[0];

  const maxDate = new Date();
  const newDate = maxDate.getDate() + 15;
  maxDate.setDate(newDate);
  startDateElement.max = maxDate.toISOString().split('T')[0];
};

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

const getLocationInfo = async (location) => {
  const response = await fetch(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=bencelaszlo`, {
    method: 'GET'
  });

  return response.json();
};

const getWeather = async (days, location) => {
  const response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${location}&days=${days + 2}&key=735d4def59b348979a0a246d3fc88da4`, {
    method: 'GET'
  });

  return response.json();
};

const getPicture = async (location) => {
  const response = await fetch(`https://pixabay.com/api/?key=16594425-95ce33f4571e1209114762fd9&q=${location}&image_type=photo`, {
    method: 'GET'
  });
  return response.json();
};

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
  getLocationInfo(document.querySelector('#destination').value).then((locationResponse) => {
    const location = locationResponse.geonames[0];
    const startDate = document.querySelector('#startDate').value;

    const data = {
      latitude: location.lat,
      longitude: location.lng,
      country: location.countryName,
      startDate
    };

    saveLocation('http://localhost:8080/', data).then(() => {
      getAllData('http://localhost:8080/all').then((storedData) => {
        document.querySelector('#entryCity').innerHTML = `<span>City: ${location.toponymName}</span>`;
        document.querySelector('#entryCountry').innerHTML = `<span>Country: ${storedData.country}</span>`;

        const d = new Date();
        const daysBeforeTheTrip = Math.round((new Date(storedData.startDate) - d) / 86400000);
        document.querySelector('#entryStartDate').innerHTML = `<span>Start: ${storedData.startDate} (${daysBeforeTheTrip} ${daysBeforeTheTrip === 1 ? 'day' : 'days'})</span>`;
        document.querySelector('#entryLatitude').innerHTML = `<span>Latitude: ${storedData.latitude}</span>`;
        document.querySelector('#entryLongitude').innerHTML = `<span>Longitude: ${storedData.longitude}</span>`;

        getWeather(daysBeforeTheTrip, location.toponymName).then((forecast) => {
          const weather = forecast.data[forecast.data.length - 1].weather;
          document.querySelector('#entryWeather').innerHTML = `<img src="https://www.weatherbit.io/static/img/icons/${weather.icon}.png" alt="weather-icon"><br><span>${weather.description}</span>`;
        });

        getPicture(location.toponymName.replace(' ', '%')).then((pictures) => {
          const topPictureURL = pictures.hits[0].largeImageURL;
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
