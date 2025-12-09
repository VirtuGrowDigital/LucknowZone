import React from "react";
import useWeather from "../hooks/useWeather";
import {
  WiHumidity,
  WiStrongWind,
  WiDaySunny,
  WiNightClear,
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiDayCloudy
} from "react-icons/wi";
import { MdWbSunny } from "react-icons/md";
import { useWeatherData } from "../context/WeatherContext";

// Icon mapping for conditionIcon from hook
const iconMap = {
  sun: <WiDaySunny />,
  "sun-cloud": <WiDayCloudy />,
  cloud: <WiCloud />,
  rain: <WiRain />,
  storm: <WiThunderstorm />,
  fog: <WiCloud className="opacity-70" />,
};

export default function LiveAQICard() {
  const {
    temperature,
    isDay,
    aqi,
    humidity,
    wind,
    uvIndex,
    condition,
    conditionIcon,
    stateAqi,
    cityAqiList,
  } = useWeatherData();

  // AQI label logic
  const getLabel = (v) => {
    if (!v) return "Loading...";
    if (v <= 50) return "GOOD";
    if (v <= 100) return "MODERATE";
    if (v <= 150) return "UNHEALTHY (SG)";
    if (v <= 200) return "UNHEALTHY";
    if (v <= 300) return "VERY UNHEALTHY";
    return "HAZARDOUS";
  };

  // Slider knob position
  const barPos = Math.min((aqi / 300) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-[30px] shadow-2xl bg-[#2A2A2A] text-white font-poppins relative">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          LIVE AQI
        </div>
        <div className="bg-white/10 px-4 py-1 rounded-full text-xs">
          Lucknow, India
        </div>
      </div>

      {/* MAIN AQI */}
      <div className="text-center">
        <h1 className="text-[78px] font-semibold text-red-400 leading-none">
          {aqi ?? "--"}
        </h1>
        <p className="text-sm opacity-60 tracking-wide">(AQI-US)</p>

        <p className="mt-3 text-lg tracking-[0.35em] text-gray-300 uppercase">
          {getLabel(aqi)}
        </p>
      </div>

      <div className="h-[1px] bg-white/10 my-6"></div>

      {/* PM LEVELS */}
      <div className="flex justify-between text-center mb-4">
        <div>
          <p className="text-xs opacity-50">PM10</p>
          <p className="text-xl">{Math.round((aqi ?? 0) * 0.8)} µg/m³</p>
        </div>

        <div>
          <p className="text-xs opacity-50">PM2.5</p>
          <p className="text-xl">{Math.round((aqi ?? 0) * 0.6)} µg/m³</p>
        </div>
      </div>

      {/* GRADIENT SLIDER */}
      <div className="mt-3">
        <div className="flex justify-between text-xs opacity-50 mb-1">
          <span>Good</span>
          <span>Hazardous</span>
        </div>

        <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-visible">

          {/* Gradient track */}
          <div
            className="
            absolute inset-0 rounded-full 
            bg-gradient-to-r 
            from-green-500 
            via-yellow-300 
            via-orange-400 
            via-red-500 
            to-red-800
          "
          ></div>

          {/* BIG ROUND KNOB */}
          <div
            className="
            absolute top-1/2 -translate-y-1/2
            w-8 h-8
            bg-white
            rounded-full
            border-[6px] border-[#E74C3C]
            shadow-[0_0_18px_rgba(231,76,60,0.9)]
            z-10
          "
            style={{ left: `calc(${barPos}% - 16px)` }}
          ></div>
        </div>
      </div>

      {/* WEATHER BOX */}
      <div className="bg-[#3A3A3A] rounded-[26px] p-6 mt-7 shadow-inner">
        <div className="flex items-center gap-3">
          <span className="text-4xl">
            {/* New condition icon */}
            {iconMap[conditionIcon] || <WiDaySunny />}
          </span>

          <div>
            <p className="text-3xl">{temperature ?? "--"}°C</p>
            <p className="text-sm opacity-60">
              {condition || "Loading..."}
            </p>
          </div>
        </div>

        <div className="h-[1px] bg-white/10 my-5"></div>

        <div className="grid grid-cols-3 text-center">
          <div>
            <WiHumidity className="mx-auto text-2xl opacity-90" />
            <p className="text-lg">{humidity ?? "--"}%</p>
            <p className="text-[11px] opacity-60">Humidity</p>
          </div>

          <div>
            <WiStrongWind className="mx-auto text-2xl opacity-90" />
            <p className="text-lg">{wind ?? "--"} km/h</p>
            <p className="text-[11px] opacity-60">Wind</p>
          </div>

          <div>
            <MdWbSunny className="mx-auto text-2xl text-yellow-300" />
            <p className="text-lg">{uvIndex ?? "--"}</p>
            <p className="text-[11px] opacity-60">UV Index</p>
          </div>
        </div>
      </div>

      {/* FOOTER — "Below AQI in Uttar Pradesh" */}
      <div className="relative group mt-6 cursor-pointer">

        <div className="bg-black/20 py-3 rounded-xl text-center text-sm">
          {stateAqi && aqi ? (
            <>
              <span className="text-green-400 font-semibold">
                {(stateAqi / aqi).toFixed(1)}x
              </span>{" "}
              Below AQI in Uttar Pradesh
            </>
          ) : (
            "Loading..."
          )}
        </div>

        {/* TOOLTIP */}
        <div
          className="
          absolute left-1/2 -translate-x-1/2 bottom-[65px]
          w-60 bg-[#1F1F1F] text-white text-xs rounded-xl p-4
          opacity-0 group-hover:opacity-100 transition-all duration-300
          shadow-xl border border-white/10 pointer-events-none
        "
        >
          <p className="text-center mb-2 opacity-70 text-[11px]">
            Major UP City AQIs
          </p>

          {cityAqiList?.map((c, i) => (
            <div key={i} className="flex justify-between py-1">
              <span>{c.name}</span>
              <span className="font-semibold">{c.aqi ?? "--"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
