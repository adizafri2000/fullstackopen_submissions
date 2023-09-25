import weatherService from '../services/weather'
import { useState, useEffect } from 'react'

const CapitalWeather = (props) => {
    console.log('CapitalWeather props: ', props)
    const { name, lat, lon } = props
    const [weatherData, setWeatherData] = useState(null)

    useEffect(() => {
        console.log('CapitalWeather component useEffect taking place ...')
        weatherService
            .getOne(lat, lon)
            .then(capitalWeatherData => {
                console.log('Retrieved weather with weather service: ', capitalWeatherData)
                setWeatherData({ weatherData, ...capitalWeatherData })
            })
    }, [])

    // return empty string if weatherData is not yet loaded
    if (!weatherData)
        return ''

    return (
        <>
            {console.log('Beginning to render CapitalWeather component ...')}
            <h2>Weather in {name}</h2>
            <p>temperature {weatherData.current.temp} Celsius</p>
            {console.log('weather: ', weatherData.current.weather)}
            {console.log(`icon: ${weatherData.current.weather[0].icon}`)}
            <img src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} alt={weatherData.current.weather[0].description} />
            <p>wind {weatherData.current.wind_speed} m/s</p>
        </>
    )
}

export default CapitalWeather