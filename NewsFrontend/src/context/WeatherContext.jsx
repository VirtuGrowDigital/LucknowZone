import { createContext, useContext } from "react";
import useWeather from "../hooks/useWeather";

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const weather = useWeather();  // this is valid
  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  );
}

// THIS MUST BE A FUNCTION (React hook-style)
export function useWeatherData() {
  return useContext(WeatherContext);
}

// ⛔ Do NOT export anything else
