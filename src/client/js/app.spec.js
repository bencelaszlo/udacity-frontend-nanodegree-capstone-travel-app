import 'regenerator-runtime/runtime.js';
import { getLocationInfo, getWeather, getPicture } from './app';

describe('getWeather', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('It should call fetch with the given days and location parameter', async () => {
    const mockWeather = {
      mockTemperature: 20
    };

    fetchMock.mockOnce(JSON.stringify(mockWeather));

    const location = 'Miskolc';
    const days = 5;
    await getWeather(days, location);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://api.weatherbit.io/v2.0/forecast/daily?city=Miskolc&days=7&key=735d4def59b348979a0a246d3fc88da4', { method: 'GET' });
  });
});

describe('getPicture', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('It should call fetch with the given location parameter', async () => {
    const mockPicture = {
      url: 'mockURL'
    };

    fetchMock.mockOnce(JSON.stringify(mockPicture));

    const location = 'Miskolc';
    await getPicture(location);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://pixabay.com/api/?key=16594425-95ce33f4571e1209114762fd9&q=Miskolc&image_type=photo', { method: 'GET' });
  });
});

describe('getLocationInfo', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('It should call fetch with the given location parameter', async () => {
    const mockLocationData = {
      mockData: 'mockValue'
    };

    fetchMock.mockOnce(JSON.stringify(mockLocationData));

    const location = 'Miskolc';
    await getLocationInfo(location);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://api.geonames.org/searchJSON?q=Miskolc&maxRows=1&username=bencelaszlo', { method: 'GET' });
  });
});
