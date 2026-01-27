import axios from "axios";

// Load the API key
const API_KEY = import.meta.env.VITE_API_KEY;

const getWeather = city => {
  const Url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  const currentWeather = axios.get(Url).then(response => {
    console.log("response", response);
    // Extract temperature, wind and city from response data
    const info = {
      temperature: response.data.main.temp,
      wind: response.data.wind.speed,
      city: response.data.name,
      icon: response.data.weather[0].icon,
    };
    return info;
  });

  return currentWeather;
};

export default getWeather;
