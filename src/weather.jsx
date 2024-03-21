import axios from 'axios';
import React, { useState, useEffect } from 'react';


export default function Weather() {
    const [weather, setWeather] = useState(null);
    const [locationInfo, setLocationInfo] = useState("London");
    const [localLoc, setLocalLoc] = useState("");
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); // New state variable for error messages
    const apiKey = import.meta.env.VITE_API_KEY;


    // Fetch latitude and longitude based on the locationInfo
    useEffect(() => {
        if(locationInfo) {
            axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${locationInfo}&limit=1&appid=${apiKey}`)
                .then((res) => {
                    if (res.data && res.data.length > 0) {
                        const { lat, lon } = res.data[0];
                        setLat(lat);
                        setLon(lon);
                        setErrorMessage(""); // Clear any existing error message
                    } else {
                        // Location not found, set an error message
                        setErrorMessage("Location not found. Please try another location.");
                        setWeather(null); // Clear previous weather data
                    }
                })
                .catch((error) => {
                    console.error('Error fetching geolocation data:', error);
                    setErrorMessage("An error occurred while fetching location data.");
                });
        }
    }, [locationInfo]);

    // Fetch weather based on latitude and longitude
    useEffect(() => {
        if(lat && lon) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
                .then((res) => {
                    setWeather(res.data.main.temp);
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

    return (
        <>
            <h1>Current Location: {locationInfo}</h1>
            {errorMessage ? (
                <h2 style={{ color: 'red' }}>{errorMessage}</h2>
            ) : (
                <h2>Weather: {weather ? `${weather} °C` : 'Loading...'} </h2>
            )}
                <input type="text" id='inputOb' value={localLoc} onChange={handleChange}/>
            <button onClick={changeLocation}>Change Location</button>
        </>
    );
}
