import { useState, useEffect } from 'react'
import Country from './components/Country'
import countryService from './services/country'

const App = () => {
  const [countries, setCountries] = useState(null)
  const [countrySearch, setCountrySearch] = useState('')

  useEffect(() => {
    // initialize countries array state with all the countries in the API
    countryService
      .getAll()
      .then(countriesData => {
        console.log('Viewing countriesData from countryService: ', countriesData)
        setCountries(countriesData)
      })

    console.log('Viewing content of countries state: ', countries)
    console.log('Viewing filtered countries: ', filteredCountries())
  },
    // run useEffect everytime the countrySearch state is changed.
    // this is initially unnecessary, but since showCountryView()
    // resets the countries array, the countries array will continue
    // to only contain that one particular country throughout execution until browser refresh
    [countrySearch])

  // return filtered countries array if 
  // filter countrySearch is not null and 
  // countries array is not null (meaning that the API has fetched all data), 
  // else an empty array
  const filteredCountries = () => {
    return (countrySearch && countries) ?
      countries.filter(c => c.name.common.toLowerCase().includes(countrySearch.toLowerCase()))
      : []
  }

  const handleCountryChange = (event) => {
    const editingCountry = event.target.value
    console.log(`countrySearch input change detected: ${editingCountry}`)
    setCountrySearch(editingCountry)
  }

  // shows the view for a particular country similar to the view when
  // only one country is found but in turn resets the countries array/state
  // to contain that one particular country
  const showCountryView = (event) => {
    event.preventDefault()
    const selectedCountry = event.target.value
    console.log(`Viewing country: `, selectedCountry)

    // filter and set countries array/state to contain only the selected country
    setCountries(countries.filter(c => c.name.common === selectedCountry))
  }

  return (
    <>
      <div>
        <form>
          <p>find countries <input value={countrySearch} onChange={handleCountryChange} /></p>
          {
            /*
            cases:
            0: nothing
            1: specific country
            <=10: list of countries
            >10: <p>Too many matches, specify another filter</p>
            */
            filteredCountries().length <= 10 ?
              (filteredCountries().length === 1 ?
                // print details of the single country found
                <Country countryName={filteredCountries()[0].name.common} />
                : filteredCountries().map(c =>
                  <p key={c.name.common}>
                    {c.name.common} <button value={c.name.common} onClick={showCountryView}>show</button>
                  </p>
                )
              )
              : <p>Too many matches, specify another filter</p>
          }
        </form>
      </div>
    </>
  )
}

export default App
