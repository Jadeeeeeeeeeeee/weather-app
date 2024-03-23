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
    const stromApiKey = import.meta.env.VITE_STORM_GLASS_API_KEY;
    const [weatherImage, setWeatherImage] = useState(sun); 
    const [feelsLikeTem, setFeelsLike] = useState(null);
    const [tommrowWeather, setTommorow] = useState(null);
    const [in2daysWeather, set2days] = useState(null);
    const [in3daysWeather, set3days] = useState(null);
    const [in4daysWeather, set4days] = useState(null);
    // const [dateTommrow, setDateTommrow] = useState(null);
    // const [date2days, setDate2days] = useState(null);
    // const [date3days, setDate3days] = useState(null);
    // const [date4days, setDate4days] = useState(null);

    
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

    useEffect(() => {
        // Make sure both lat and lon are not null or undefined
        if (lat && lon) {
          axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
          .then((res) => {
            setTommorow(res.data.list[6].main.temp);
            set2days(res.data.list[14].main.temp);
            set3days(res.data.list[23].main.temp)
            set4days(res.data.list[30].main.temp)
            // setDateTommrow(res.data.list[1].dt_txt);
            // setDate2days(res.data.list[2].dt_txt);
            // setDate3days(res.data.list[3].dt_txt);
            // setDate4days(res.data.list[4].dt_txt);
          })
          .catch((error) => {
            console.error("Error fetching the forecast data:", error);
            setErrorMessage("An error occurred while fetching forecast data.");
          });
        }
      }, [lat, lon, apiKey]); // Added apiKey as a dependency
      

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
                <h2 className='temp'>Temp: {weather}°C </h2>
            )}
            {/* Repeating the errorMessage check for other data might not be necessary if they all depend on the same API call. Consider showing a single error message for simplicity. */}
            <h2 className='humidity'>Humidity: {humidity}%</h2>
            <h2 className='windspeed'>Wind Speed: {windspeed} kph</h2>
            <h2 className='feelsLike'>Feels Like: {feelsLikeTem}°C </h2>
            </div>
            <div className='forcast'>
               <h2 className='forcastText'>tommrow: {tommrowWeather}°C</h2>
               <h2 className='forcastText'>in 2 days: {in2daysWeather}°C</h2>
               <h2 className='forcastText'>in 3 days: {in3daysWeather}°C</h2>
               <h2 className='forcastText'>in 4 days: {in4daysWeather}°C</h2>
            </div>
            <img src={weatherImage} className='weathericon' alt="Weather icon"/>
            <div className='div'>
                <input type="text" id='inputOb' value={localLoc} onChange={handleChange}/>
                <button id='button' onClick={changeLocation}>Change Location</button>
            </div>
            <h5>if youre testing this and your phone app says something diffrent click on <a href="">this article</a> (phone apps are mostly non accurate you can search the results you got here on google too and see its correct)</h5>
        </div>
    );
}
