import { useState, useEffect } from 'react'
import axios from 'axios'


const Weather = ({city}) => {
  const [weather, setWeather] = useState(null)
  const api_key = process.env.REACT_APP_API_KEY
  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
    .then(response => {
      setWeather(response.data)
    })
  },[])
  if(weather){
    return(
      <div>
        <h2>Weather in {city}</h2>
        <p>temperature {weather.main.temp} Celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description}/>
        <p>wind {weather.wind.speed} m/s</p>
  
      </div>
    )
  }
  else{
    return(
      <div>
        Loading weather information
      </div>
    )
  }


}

const Country = ( {country}) => {
  return(
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <b>languages:</b>
      <ul>
      {
        Object.values(country.languages).map( lang => <li key={country.capital + lang}>{lang}</li>)
      }
      </ul>
      <img src={country.flags.png} width="150px" alt={"flag of" + country.name.common}/>
      <Weather city={country.capital}/>
    </div>
  )
}

const CountryList = ({countriesToShow, setCurrentFilter}) => {
  const amount = countriesToShow.length
  if(amount === 0){
    return(
      <p>No matches, specify another filter</p>
    )
  }
  if(amount > 1 && amount < 11){
    return(
      <ul style={{listStyleType : "none", margin : 0, padding : 0}}>
       {countriesToShow.map( country => 
       <li key={country.name.common}>{country.name.common} <button onClick={() => setCurrentFilter(country.name.common)}>show</button>  </li>
       )}
      </ul>
     )
  }
  if(amount > 10){
    return(
      <p>Too many matches, specify another filter</p>
    )
  }
  if(amount === 1){
    return(
      <Country country={countriesToShow[0]}/>
    )
  }
}


const Filter = ({value,onChange}) => {
  return (
    <div>
      find countries <input value={value} onChange={onChange}/>
    </div>
  )
}





const App = () => {
  const [countries, setCountries] = useState([])
  const [currentFilter, setCurrentFilter] = useState('')
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setCurrentFilter(event.target.value)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(currentFilter.toLowerCase())).sort()
  const sortedCountries = countriesToShow.sort()


  return (
    <div>
      <Filter value={currentFilter} onChange={handleFilterChange}/>
      <CountryList countriesToShow={sortedCountries} setCurrentFilter={setCurrentFilter}/>
    </div>
  )

}

export default App