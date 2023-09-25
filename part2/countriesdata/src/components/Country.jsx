import { useState, useEffect } from "react"
import countryService from '../services/country'
import CapitalWeather from "./CapitalWeather"

const Country = (props) => {
    console.log('Country props: ', props)
    const { countryName } = props
    const [countryData, setCountryData] = useState(null)

    useEffect(() => {
        console.log('Country component useEffect taking place ...')
        countryService
            .getOne(countryName)
            .then(singleCountryData => {
                console.log(`${countryName} data: `, singleCountryData)
                setCountryData({ countryData, ...singleCountryData })
            })
    }, [])

    // return empty string if countryData is not yet loaded
    if (!countryData)
        return ''

    const imgStyle = {
        border: '2px black solid'
    }

    return (
        <>
            {console.log('Beginning to render Country component')}
            <h2>{countryData.name.common}</h2>
            <p>capital {countryData.capital}</p>
            <p>area {countryData.area}</p>

            <p><b>languages</b></p>
            <ul>
                {
                    // Object.entries() method returns an array of arrays, where each inner array contains a key-value pair from the object
                    Object.entries(countryData.languages)
                        .map(([key, value]) => <li key={key}>{value}</li>)
                }
            </ul>
            <img style={imgStyle} src={countryData.flags.png} alt={countryData.flags.alt} />
            <CapitalWeather name={countryData.name.common} lat={countryData.capitalInfo.latlng[0]} lon={countryData.capitalInfo.latlng[1]} />
        </>
    )

}

export default Country
