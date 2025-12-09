import Header from "./Components/Header";
import HeroSection from "./Components/HeroSection";
import MainNav from "./Components/MainNav";
import LiveAQICard from "./Components/LiveAQICard";
import WeatherForecastCard from "./Components/WeatherForecastCard";
import { WeatherProvider } from "./context/WeatherContext";

export default function App() {
  return (
    <>
      <Header />
      <HeroSection />
      <MainNav />

      {/* WEATHER CONTEXT WRAPS BOTH CARDS */}
      <WeatherProvider>
        <div className="py-10 flex justify-center">
          <LiveAQICard />
        </div>

        <div className="mt-8">
          <WeatherForecastCard />
        </div>
      </WeatherProvider>
    </>
  );
}
