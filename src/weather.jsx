import axios from 'axios';
import React, { useState, useEffect } from 'react';
import sun from './assets/sun.png';
import cold from './assets/cold.png';
import cloudy from './assets/cloudy.png';

export default function Weather() {
    const [weather, setWeather] = useState(null);
    const [locationInfo, setLocationInfo] = useState("London");
    const [localLoc, setLocalLoc] = useState("");
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [humidity, setHumidity] = useState(null);
    const [windspeed, setWindspeed] = useState(null);
    const apiKey = import.meta.env.VITE_API_KEY;
    const [weatherImage, setWeatherImage] = useState(sun); 
    const [feelsLikeTem, setFeelsLike] = useState(null);

    useEffect(() => {
        if(locationInfo) {
            axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${locationInfo}&limit=1&appid=${apiKey}`)
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        const { lat, lon } = res.data[0];
                        setLat(lat);
                        setLon(lon);
                        setErrorMessage(""); // Reset errorMessage upon successful location fetch
                    } else {
                        setErrorMessage("Location not found. Please try another location.");
                        setWeather(null); 
                    }
                })
                .catch((error) => {
                    console.error('Error fetching geolocation data:', error);
                    setErrorMessage("An error occurred while fetching location data.");
                });
        }
    }, [locationInfo]);

    useEffect(() => {
        if(lat && lon) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then((res) => {
                    const newWeather = res.data.main.temp;
                    setWeather(newWeather);
                    setHumidity(res.data.main.humidity);
                    setWindspeed(res.data.wind.speed);
                    setFeelsLike(res.data.main.feels_like);
                    ImageIconChange(newWeather); 
                    setErrorMessage(""); // Reset errorMessage upon successful weather data fetch
                })
                .catch((error) => {
                    console.error('Error fetching weather data:', error);
                    setErrorMessage("An error occurred while fetching weather data.");
                });
        }
    }, [lat, lon]);

    function changeLocation() {
        setLocationInfo(localLoc);
    }

    function handleChange(e) {
        setLocalLoc(e.target.value);
    }

    function ImageIconChange(currentWeather) {
        if (currentWeather > 25) {
            setWeatherImage(sun);
        } else if (currentWeather < 25 && currentWeather > 10) {
            setWeatherImage(cloudy);
        } else if (currentWeather < 10) {
            setWeatherImage(cold);
        }
    }

    return (
        <div className='MainCont'>
            <h1>Current Location: {locationInfo}</h1>
            <div className='weatherData'>
            {errorMessage ? (
                <h2 className='temp' style={{ color: 'red' }}>{errorMessage}</h2>
            ) : (
                <h2 className='temp'>Temp: {weather ? `${weather} °C` : 'Loading...'} </h2>
            )}
            {/* Repeating the errorMessage check for other data might not be necessary if they all depend on the same API call. Consider showing a single error message for simplicity. */}
            <h2 className='humidity'>Humidity: {humidity ? `${humidity} %` : 'Loading...'} </h2>
            <h2 className='windspeed'>Wind Speed: {windspeed ? `${windspeed} kph` : 'Loading...'} </h2>
            <h2 className='feelsLike'>Feels Like: {feelsLikeTem ? `${feelsLikeTem} °C` : 'Loading...'} </h2>
            </div>
            <img src={weatherImage} className='weathericon' alt="Weather icon"/>
            <div className='div'>
                <input type="text" id='inputOb' value={localLoc} onChange={handleChange}/>
                <button id='button' onClick={changeLocation}>Change Location</button>
            </div>
        </div>
    );
}
