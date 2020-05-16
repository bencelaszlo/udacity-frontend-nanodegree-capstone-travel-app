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
    return;
};

const getLocationInfo = async (location) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?q=${location}&maxRows=1&username=bencelaszlo`, {
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
        referrerPolicy: 'no-referrer',
    });
    return response.json();
}

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
                document.querySelector('#entryStartDate').innerHTML = `<span>Start: ${storedData.startDate} (${daysBeforeTheTrip} ${daysBeforeTheTrip == 1 ? 'day' : 'days'})</span>`;
                document.querySelector('#entryLatitude').innerHTML = `<span>Latitude: ${storedData.latitude}</span>`;
                document.querySelector('#entryLongitude').innerHTML = `<span>Longitude: ${storedData.longitude}</span>`;
            });
        });
    });
}

export { getLocationInfo, saveLocation, getAllData, updateUi }