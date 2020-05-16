import './styles/style.scss'

import { getWeather, saveWeather, getAllData, updateUi } from './js/app'

const generateElement = document.querySelector('#generate');
generateElement.addEventListener('click', updateUi);

export {
    getWeather,
    saveWeather,
    getAllData,
    updateUi
}