import './styles/style.scss'

import { getLocationInfo, saveLocation, getAllData, updateUi } from './js/app'

const generateElement = document.querySelector('#generate');
generateElement.addEventListener('click', updateUi);

export {
    getLocationInfo,
    saveLocation,
    getAllData,
    updateUi
}