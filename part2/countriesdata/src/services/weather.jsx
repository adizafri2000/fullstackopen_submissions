import axios from 'axios'
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const baseUrl = 'https://api.openweathermap.org/data/3.0/onecall'

/**
 * Retrieves weather data of the country's capital from openweathermap API. Returns numerical values in metric unit (e.g metres, celsius etc)
 * @param {*} latitude latitude of country's capital
 * @param {*} longitude longitude of country's capital
 * @returns 
 */
const getOne = (latitude, longitude) => {
    const request = axios.get(`${baseUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`)
    return request.then(response => response.data)
}

export default { getOne }