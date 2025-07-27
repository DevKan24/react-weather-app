import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const [unit, setUnit] = useState("imperial");

  // Ref to access input value directly
  const inputRef = useRef();

  // State for storing fetched weather data (false means no data yet)
  const [weatherData, setWeatherData] = useState(false);

  const [city, setCity] = useState("New York City");

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    setCity(city); // Update current city state with searched city

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${
        import.meta.env.VITE_WEATHERAPP_ID
      }`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      console.log(data); // For debugging: show full API response in console

      // Select appropriate icon based on weather condition code, fallback to clear icon
      const icon = allIcons[data.weather[0].icon] || clear_icon;

      // Update weatherData state with relevant info to display
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp), // Round temperature to integer
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false); // Hide weather display if error occurs
      console.error("Error in fetching weather data"); // Log error for debugging
    }
  };

  useEffect(() => {
    if (city) search(city); // Only search if city is set
  }, [unit]);

  return (
    <div className="weather">
      <div className="search-bar">
        <button
          className="unit-toggle"
          onClick={() =>
            setUnit((prev) => (prev === "imperial" ? "metric" : "imperial"))
          }
        >
          {unit === "imperial" ? "°F" : "°C"}
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search(inputRef.current.value);
              inputRef.current.value = ""; // Clear input after search
            }
          }}
        />

        {/* Search icon triggers search on click */}
        <img
          src={search_icon}
          alt=""
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {/* Conditionally render weather info if data is available */}
      {weatherData ? (
        <>
          <img src={weatherData.icon} alt="" className="weather-icon" />{" "}
          <p className="temperature">
            {weatherData.temperature}
            {unit === "imperial" ? "°F" : "°C"} {/* Show unit symbol */}
          </p>
          <p className="location">{weatherData.location}</p> {/* City name */}
          {/* Humidity and Wind Speed info */}
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="" />
              <div>
                <p>{weatherData.windSpeed} mph</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></> // Empty display when no weather data
      )}
    </div>
  );
};

export default Weather;
