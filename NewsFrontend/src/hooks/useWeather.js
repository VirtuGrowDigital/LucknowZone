import { useState, useEffect, useCallback } from "react";
import { fetchWeatherApi } from "openmeteo";

// WEATHER CODE → Meaning + Icon
const weatherCodeMap = {
  0: { text: "Clear Sky", icon: "sun" },
  1: { text: "Mainly Clear", icon: "sun-cloud" },
  2: { text: "Partly Cloudy", icon: "sun-cloud" },
  3: { text: "Cloudy", icon: "cloud" },
  45: { text: "Foggy", icon: "fog" },
  48: { text: "Fog", icon: "fog" },
  51: { text: "Light Drizzle", icon: "rain" },
  61: { text: "Rainy", icon: "rain" },
  63: { text: "Rain", icon: "rain" },
  80: { text: "Showers", icon: "rain" },
  95: { text: "Thunderstorm", icon: "storm" },
};

// UP Cities
const upCities = [
  { name: "Lucknow", lat: 26.85, lon: 80.95 },
  { name: "Kanpur", lat: 26.45, lon: 80.35 },
  { name: "Varanasi", lat: 25.32, lon: 82.98 },
  { name: "Noida", lat: 28.5355, lon: 77.391 },
  { name: "Agra", lat: 27.1767, lon: 78.0081 },
  { name: "Meerut", lat: 28.9845, lon: 77.7064 },
];

// Helper to read array values safely
const extractValues = (v) => {
  try {
    return v?.valuesArray?.() ?? [];
  } catch {
    return [];
  }
};

export default function useWeather() {
  // CURRENT WEATHER STATES
  const [temperature, setTemperature] = useState(null);
  const [feelsLike, setFeelsLike] = useState(null);
  const [isDay, setIsDay] = useState(null);
  const [condition, setCondition] = useState("");
  const [conditionIcon, setConditionIcon] = useState("sun");

  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [rainProb, setRainProb] = useState(null);

  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);

  // AQI STATES
  const [aqi, setAqi] = useState(null);
  const [stateAqi, setStateAqi] = useState(null);
  const [cityAqiList, setCityAqiList] = useState([]);

  // WEEKLY FORECAST
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  // Fetch AQI for each city with fallback logic
  const fetchCityAQI = async (city) => {
    try {
      const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
      const params = {
        latitude: city.lat,
        longitude: city.lon,
        hourly: ["us_aqi", "pm2_5", "pm10"],
      };

      const res = await fetchWeatherApi(url, params);
      const hourly = res?.[0]?.hourly();
      if (!hourly) return null;

      let arr = extractValues(hourly.variables(0)); // us_aqi
      if (!arr.length) arr = extractValues(hourly.variables(1)); // pm2.5 fallback
      if (!arr.length) arr = extractValues(hourly.variables(2)); // pm10 fallback

      return arr.length ? Math.round(arr[0]) : null;
    } catch {
      return null;
    }
  };

  const fetchData = useCallback(async () => {
    try {
      // ---------------------------------------------
      // 1️⃣ FETCH CURRENT WEATHER (SDK)
      // ---------------------------------------------
      const weatherRes = await fetchWeatherApi(
        "https://api.open-meteo.com/v1/forecast",
        {
          latitude: 26.8393,
          longitude: 80.9231,
          current: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "wind_speed_10m",
            "uv_index",
            "weather_code",
            "is_day",
          ],
          daily: ["sunrise", "sunset", "precipitation_probability_max"],
          timezone: "Asia/Kolkata",
        }
      );

      const current = weatherRes?.[0]?.current();
      const dailySdk = weatherRes?.[0]?.daily();

      // CURRENT WEATHER VALUES
      const code = current?.variables(5)?.value() ?? 0;

      setTemperature(Math.round(current?.variables(0)?.value() ?? "--"));
      setFeelsLike(Math.round(current?.variables(1)?.value() ?? "--"));
      setHumidity(Math.round(current?.variables(2)?.value() ?? "--"));
      setWind(Math.round(current?.variables(3)?.value() ?? "--"));

      const uv = current?.variables(4)?.value();
      setUvIndex(uv != null ? Number(uv.toFixed(1)) : "--");

      setCondition(weatherCodeMap[code]?.text || "Unknown");
      setConditionIcon(weatherCodeMap[code]?.icon || "sun");

      setIsDay(current?.variables(6)?.value() === 1);

      // SUN TIMES
      setSunrise(extractValues(dailySdk?.variables?.(0))[0] ?? null);
      setSunset(extractValues(dailySdk?.variables?.(1))[0] ?? null);

      setRainProb(extractValues(dailySdk?.variables?.(2))[0] ?? null);

      // ---------------------------------------------
      // 2️⃣ FETCH WEEKLY FORECAST (REST JSON — 100% reliable)
      // ---------------------------------------------
      const dailyJson = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=26.8393&longitude=80.9231&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia/Kolkata"
      ).then((r) => r.json());

      const max = dailyJson?.daily?.temperature_2m_max ?? [];
      const min = dailyJson?.daily?.temperature_2m_min ?? [];
      let codes = dailyJson?.daily?.weather_code ?? [];

      // fallback if API removes weather_code
      if (!codes.length) {
        codes = Array(max.length).fill(code);
      }

      if (max.length && min.length) {
        const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const forecast = max.map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);

          return {
            day: daysShort[date.getDay()],
            max: Math.round(max[i] ?? 0),
            min: Math.round(min[i] ?? 0),
            icon: weatherCodeMap[codes[i]]?.icon || "sun",
            desc: weatherCodeMap[codes[i]]?.text || "Unknown",
          };
        });

        setWeeklyForecast(forecast);
      }

      // ---------------------------------------------
      // 3️⃣ FETCH AQI (Lucknow)
      // ---------------------------------------------
      const aqiRes = await fetchWeatherApi(
        "https://air-quality-api.open-meteo.com/v1/air-quality",
        {
          latitude: 26.8393,
          longitude: 80.9231,
          hourly: ["us_aqi", "pm2_5", "pm10"],
        }
      );

      const aqiHourly = aqiRes?.[0]?.hourly();
      let arr = extractValues(aqiHourly?.variables?.(0));

      if (!arr.length) arr = extractValues(aqiHourly?.variables?.(1));
      if (!arr.length) arr = extractValues(aqiHourly?.variables?.(2));

      setAqi(arr.length ? Math.round(arr[0]) : null);

      // ---------------------------------------------
      // 4️⃣ FETCH UP STATE AQI
      // ---------------------------------------------
      const list = [];
      for (const city of upCities) {
        const v = await fetchCityAQI(city);
        list.push({ name: city.name, aqi: v });
      }
      setCityAqiList(list);

      const valid = list.filter((c) => c.aqi !== null);
      setStateAqi(
        valid.length
          ? Math.round(valid.reduce((t, c) => t + c.aqi, 0) / valid.length)
          : null
      );
    } catch (err) {
      console.error("Weather/AQI fetch failed:", err);
    }
  }, []);

  // AUTOREFRESH
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    temperature,
    feelsLike,
    isDay,
    condition,
    conditionIcon,
    humidity,
    wind,
    uvIndex,
    rainProb,
    sunrise,
    sunset,

    aqi,
    stateAqi,
    cityAqiList,
    weeklyForecast,

    refresh: fetchData,
  };
}
