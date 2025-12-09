import React from "react";
import { useWeatherData } from "../context/WeatherContext";

import {
  WiDaySunny,
  WiDayCloudy,
  WiCloud,
  WiRain,
  WiThunderstorm,
} from "react-icons/wi";

export default function WeatherForecastCard() {
  const { temperature, condition, conditionIcon, weeklyForecast } =
    useWeatherData();

  const iconMap = {
    sun: <WiDaySunny className="text-yellow-400 text-6xl drop-shadow-lg" />,
    "sun-cloud": <WiDayCloudy className="text-yellow-300 text-6xl drop-shadow-lg" />,
    cloud: <WiCloud className="text-gray-300 text-6xl drop-shadow-lg" />,
    rain: <WiRain className="text-blue-400 text-6xl drop-shadow-lg" />,
    storm: <WiThunderstorm className="text-yellow-200 text-6xl drop-shadow-lg" />,
  };

  const safeForecast = Array.isArray(weeklyForecast)
    ? weeklyForecast.slice(0, 4)
    : [];

  return (
    <div className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-7 border border-white/40 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
      
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-wide">
        Weather Forecast
      </h2>

      {/* Current Weather Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <p className="text-6xl font-extrabold bg-gradient-to-br from-yellow-400 to-orange-500 text-transparent bg-clip-text drop-shadow-md">
            {temperature ?? "--"}°
          </p>

          <div className="flex items-center">
            {iconMap[conditionIcon] || iconMap.sun}
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-gray-800">Lucknow</p>
          <p className="text-sm text-gray-500">{condition || "Loading..."}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gray-300/40 my-6"></div>

      {/* Forecast Grid */}
      <div className="grid grid-cols-4 gap-4 text-center">
        {safeForecast.length ? (
          safeForecast.map((d, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <p className="text-gray-700 text-sm font-medium">{d.day}</p>

              <div className="flex justify-center my-2">
                <span className="text-4xl">
                  {iconMap[d.icon] || iconMap.sun}
                </span>
              </div>

              <p className="text-lg font-semibold text-gray-800">{d.max}°</p>
              <p className="text-xs text-gray-500">{d.min}° min</p>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-gray-500 text-sm">
            Loading forecast...
          </p>
        )}
      </div>
    </div>
  );
}
