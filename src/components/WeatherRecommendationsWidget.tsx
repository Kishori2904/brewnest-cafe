import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  MapPin,
  RefreshCw,
  Plus,
  Check,
  Thermometer,
  Droplets,
  Compass,
  Sparkles,
  ChevronDown,
  Quote,
  Flame,
  Coffee,
} from 'lucide-react';
import {
  WeatherData,
  WeatherRecommendation,
  fetchWeatherForCoordinates,
  getRecommendationForWeather,
  PRESET_LOCATIONS,
  SIMULATION_PRESETS,
} from '../services/weatherService';
import { MENU_ITEMS } from '../data/cafeData';
import { MenuItem } from '../types';

interface WeatherRecommendationsWidgetProps {
  onAddToTray: (item: MenuItem) => void;
  onSelectItemForModal: (item: MenuItem) => void;
  onAddBothToTray?: (drink: MenuItem, food: MenuItem) => void;
  trayItemIds: string[];
}

export const WeatherRecommendationsWidget: React.FC<WeatherRecommendationsWidgetProps> = ({
  onAddToTray,
  onSelectItemForModal,
  onAddBothToTray,
  trayItemIds,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [showLocationMenu, setShowLocationMenu] = useState<boolean>(false);

  // Default coordinates: Noida Café Hub
  const NOIDA_LAT = 28.585;
  const NOIDA_LON = 77.345;

  // Fetch weather for specified coords
  const loadWeather = useCallback(
    async (
      lat: number,
      lon: number,
      source: 'live_gps' | 'city_preset' | 'default_noida',
      city?: string,
      region?: string
    ) => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const data = await fetchWeatherForCoordinates(lat, lon, source, city, region);
        setWeather(data);
      } catch (err) {
        console.error('Failed to load weather:', err);
        setErrorMsg('Unable to retrieve weather data at this moment.');
        // Fallback to simulated sunny Noida
        setWeather(SIMULATION_PRESETS[0].weather);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Request user's GPS coordinates
  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      loadWeather(NOIDA_LAT, NOIDA_LON, 'default_noida', 'Noida (BrewNest Base)', 'Uttar Pradesh');
      return;
    }

    setLoading(true);
    setIsGpsActive(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await loadWeather(latitude, longitude, 'live_gps');
      },
      (err) => {
        console.warn('Geolocation denied or timed out:', err.message);
        setIsGpsActive(false);
        // Fallback to Noida café base
        loadWeather(NOIDA_LAT, NOIDA_LON, 'default_noida', 'Noida (BrewNest Base)', 'Uttar Pradesh');
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [loadWeather]);

  // Initial load: Attempt GPS, or fallback to Noida
  useEffect(() => {
    handleRequestLocation();
  }, [handleRequestLocation]);

  // Active recommendations based on current weather
  const recommendation = useMemo<WeatherRecommendation | null>(() => {
    if (!weather) return null;
    return getRecommendationForWeather(weather);
  }, [weather]);

  // Lookup menu items
  const primaryDrink = useMemo(() => {
    if (!recommendation) return null;
    return MENU_ITEMS.find((m) => m.id === recommendation.primaryDrinkId) || MENU_ITEMS[0];
  }, [recommendation]);

  const primaryFood = useMemo(() => {
    if (!recommendation) return null;
    return MENU_ITEMS.find((m) => m.id === recommendation.primaryFoodId) || MENU_ITEMS[1];
  }, [recommendation]);

  const secondaryDrink = useMemo(() => {
    if (!recommendation) return null;
    return MENU_ITEMS.find((m) => m.id === recommendation.secondaryDrinkId) || null;
  }, [recommendation]);

  // Weather icon helper
  const renderWeatherIcon = () => {
    if (!weather) return <CloudSun className="w-5 h-5 text-amber-500" />;
    switch (weather.conditionType) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-amber-500 animate-spin-slow" />;
      case 'rainy':
      case 'stormy':
        return <CloudRain className="w-6 h-6 text-blue-500" />;
      case 'snowy':
        return <Snowflake className="w-6 h-6 text-sky-400" />;
      case 'cold':
      case 'chilly':
        return <Thermometer className="w-6 h-6 text-indigo-400" />;
      case 'warm':
      case 'mild':
      default:
        return <CloudSun className="w-6 h-6 text-amber-500" />;
    }
  };

  const isPrimaryDrinkInTray = primaryDrink ? trayItemIds.includes(primaryDrink.id) : false;
  const isPrimaryFoodInTray = primaryFood ? trayItemIds.includes(primaryFood.id) : false;
  const isSecondaryDrinkInTray = secondaryDrink ? trayItemIds.includes(secondaryDrink.id) : false;

  return (
    <section
      id="weather-pairing"
      className="bg-white dark:bg-[#190F09] rounded-3xl border border-stone-200/90 dark:border-amber-950/60 shadow-sm overflow-hidden transition-colors duration-300"
    >
      {/* Header bar with Live Location & Weather readout */}
      <div className="px-5 sm:px-8 py-5 border-b border-stone-200/70 dark:border-amber-950/50 bg-[#FAF7F2] dark:bg-[#140C07] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300/60 dark:border-amber-800/50 flex items-center justify-center shrink-0 shadow-2xs">
            {renderWeatherIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C5D3B] dark:text-amber-400">
                Weather-Synced Barista Menu
              </span>
              {weather?.source === 'live_gps' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  Live GPS
                </span>
              ) : weather?.source === 'simulated' ? (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                  Simulated
                </span>
              ) : (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-[#251710] text-stone-600 dark:text-stone-400">
                  Station Weather
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1810] dark:text-[#F7EAE1] flex items-center gap-1.5">
                <span>{weather?.cityName || 'Detecting Location...'}</span>
                {weather && (
                  <span className="text-sm sm:text-base font-mono font-semibold text-stone-600 dark:text-amber-300/90">
                    · {weather.temperature}°C
                  </span>
                )}
              </h3>
              {weather && (
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  ({weather.conditionLabel})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Location & Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Geolocation Button */}
          <button
            onClick={handleRequestLocation}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#20140C] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#2C190F] border border-stone-300/70 dark:border-amber-950/50 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            title="Use browser location to fetch local weather"
          >
            <MapPin className={`w-3.5 h-3.5 ${isGpsActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#8C5D3B] dark:text-amber-400'}`} />
            <span>{isGpsActive ? 'Using My Location' : 'Locate Me'}</span>
            {loading && <RefreshCw className="w-3 h-3 animate-spin text-stone-400 ml-1" />}
          </button>

          {/* Preset Location Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#20140C] text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#2C190F] border border-stone-300/70 dark:border-amber-950/50 shadow-2xs transition-all cursor-pointer"
            >
              <span>Cities</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLocationMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#1E110A] rounded-2xl shadow-xl border border-stone-200 dark:border-amber-950/70 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Select Region
                </div>
                {PRESET_LOCATIONS.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      setIsGpsActive(false);
                      setShowLocationMenu(false);
                      loadWeather(loc.lat, loc.lon, 'city_preset', loc.name, loc.region);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-[#2A170E] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-stone-400">{loc.region}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Weather Simulation Toolbar */}
      <div className="px-4 sm:px-8 py-2.5 bg-[#F5EFE6]/60 dark:bg-[#160D08] border-b border-stone-200/60 dark:border-amber-950/40 flex items-center justify-start sm:justify-between overflow-x-auto gap-2 no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8C5D3B] dark:text-amber-400" />
            <span>Test Weather Conditions:</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {SIMULATION_PRESETS.map((preset) => {
            const isSelected =
              weather?.source === 'simulated' &&
              weather?.temperature === preset.weather.temperature &&
              weather?.conditionType === preset.weather.conditionType;

            return (
              <button
                key={preset.label}
                onClick={() => {
                  setIsGpsActive(false);
                  setWeather(preset.weather);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 shadow-xs ring-1 ring-amber-400/40'
                    : 'bg-white/80 dark:bg-[#20140C] text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-[#2C190F] border border-stone-200/60 dark:border-amber-950/30'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {weather && recommendation && primaryDrink && primaryFood && (
        <div className="p-5 sm:p-8 space-y-6">
          {/* Weather Condition Banner & Barista Weather Pairing Note */}
          <div className="relative p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-[#1F120A] border border-amber-200/80 dark:border-amber-900/40 space-y-3">
            <Quote className="w-7 h-7 text-amber-700/25 dark:text-amber-400/20 absolute top-4 right-4 pointer-events-none" />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#8C5D3B] dark:bg-amber-500 text-white dark:text-stone-950 shadow-2xs">
                {recommendation.badge}
              </span>
              <span className="text-xs font-semibold text-stone-600 dark:text-amber-200/80 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>{recommendation.temperatureTag}</span>
              </span>
              {weather.humidity && (
                <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Humidity: {weather.humidity}%</span>
                </span>
              )}
              {weather.windSpeed && (
                <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-stone-400" />
                  <span>Wind: {weather.windSpeed} km/h</span>
                </span>
              )}
            </div>

            <div>
              <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-[#F7EAE1]">
                {recommendation.vibeTitle}
              </h4>
              <p className="font-serif italic text-sm sm:text-base text-stone-800 dark:text-amber-100/90 leading-relaxed mt-1.5">
                "{recommendation.baristaNote}"
              </p>
            </div>

            {/* Flavor & Sensory Tags */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                Weather Match Highlights:
              </span>
              {recommendation.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white dark:bg-[#2A170E] text-stone-700 dark:text-amber-200 border border-amber-200/60 dark:border-amber-950/40"
                >
                  ✦ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Grid of Curated Items Matching Current Weather */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Primary Recommended Drink (Hot or Iced) */}
            <div className="bg-stone-50/80 dark:bg-[#1E110A] rounded-2xl border border-stone-200/80 dark:border-amber-950/40 p-4 flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-700/50 transition-colors">
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-900">
                  <img
                    src={primaryDrink.image}
                    alt={primaryDrink.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2B1810] text-amber-200 shadow-xs">
                      {weather.temperature >= 22 ? '❄️ Chilled Drink' : '🔥 Steaming Brew'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/95 dark:bg-black/90 text-stone-900 dark:text-amber-300">
                      ₹{primaryDrink.price}
                    </span>
                  </div>
                </div>

                <div>
                  <h5
                    onClick={() => onSelectItemForModal(primaryDrink)}
                    className="font-serif text-base font-bold text-stone-900 dark:text-[#F7EAE1] hover:text-[#8C5D3B] dark:hover:text-amber-400 cursor-pointer"
                  >
                    {primaryDrink.name}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                    {primaryDrink.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onAddToTray(primaryDrink)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isPrimaryDrinkInTray
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 hover:bg-[#1E110A] dark:hover:bg-amber-400'
                  }`}
                >
                  {isPrimaryDrinkInTray ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>In Tray</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Drink (₹{primaryDrink.price})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectItemForModal(primaryDrink)}
                  className="px-2.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-[#28150C] border border-stone-200 dark:border-amber-950/50 hover:bg-stone-100 dark:hover:bg-[#341C10] cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>

            {/* 2. Primary Recommended Food / Treat */}
            <div className="bg-stone-50/80 dark:bg-[#1E110A] rounded-2xl border border-stone-200/80 dark:border-amber-950/40 p-4 flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-700/50 transition-colors">
              <div className="space-y-3">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-900">
                  <img
                    src={primaryFood.image}
                    alt={primaryFood.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8C5D3B] text-white shadow-xs">
                      {weather.temperature >= 22 ? '🍰 Chilled Treat' : '🧀 Warm Comfort Food'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/95 dark:bg-black/90 text-stone-900 dark:text-amber-300">
                      ₹{primaryFood.price}
                    </span>
                  </div>
                </div>

                <div>
                  <h5
                    onClick={() => onSelectItemForModal(primaryFood)}
                    className="font-serif text-base font-bold text-stone-900 dark:text-[#F7EAE1] hover:text-[#8C5D3B] dark:hover:text-amber-400 cursor-pointer"
                  >
                    {primaryFood.name}
                  </h5>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                    {primaryFood.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onAddToTray(primaryFood)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isPrimaryFoodInTray
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 hover:bg-[#1E110A] dark:hover:bg-amber-400'
                  }`}
                >
                  {isPrimaryFoodInTray ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>In Tray</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Pairing (₹{primaryFood.price})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectItemForModal(primaryFood)}
                  className="px-2.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-[#28150C] border border-stone-200 dark:border-amber-950/50 hover:bg-stone-100 dark:hover:bg-[#341C10] cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>

            {/* 3. Secondary Drink / Combo Special */}
            {secondaryDrink ? (
              <div className="bg-stone-50/80 dark:bg-[#1E110A] rounded-2xl border border-stone-200/80 dark:border-amber-950/40 p-4 flex flex-col justify-between space-y-4 hover:border-amber-300 dark:hover:border-amber-700/50 transition-colors">
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-900">
                    <img
                      src={secondaryDrink.image}
                      alt={secondaryDrink.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-700 text-amber-100 shadow-xs">
                        Alternative Pick
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/95 dark:bg-black/90 text-stone-900 dark:text-amber-300">
                        ₹{secondaryDrink.price}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5
                      onClick={() => onSelectItemForModal(secondaryDrink)}
                      className="font-serif text-base font-bold text-stone-900 dark:text-[#F7EAE1] hover:text-[#8C5D3B] dark:hover:text-amber-400 cursor-pointer"
                    >
                      {secondaryDrink.name}
                    </h5>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
                      {secondaryDrink.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onAddToTray(secondaryDrink)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isSecondaryDrinkInTray
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2B1810] dark:bg-amber-500 text-amber-100 dark:text-stone-950 hover:bg-[#1E110A] dark:hover:bg-amber-400'
                    }`}
                  >
                    {isSecondaryDrinkInTray ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Tray</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Drink (₹{secondaryDrink.price})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onSelectItemForModal(secondaryDrink)}
                    className="px-2.5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-[#28150C] border border-stone-200 dark:border-amber-950/50 hover:bg-stone-100 dark:hover:bg-[#341C10] cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Quick Combo Bar */}
          {onAddBothToTray && (
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#140C07] border border-stone-200/80 dark:border-amber-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300/60 dark:border-amber-800/60 flex items-center justify-center text-amber-900 dark:text-amber-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="font-serif text-sm font-bold text-stone-900 dark:text-[#F7EAE1]">
                    Order Today's Complete Weather Combo
                  </h6>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {primaryDrink.name} + {primaryFood.name} (Total ₹{primaryDrink.price + primaryFood.price})
                  </p>
                </div>
              </div>

              <button
                onClick={() => onAddBothToTray(primaryDrink, primaryFood)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#2B1810] dark:text-stone-950 bg-amber-300 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Weather Combo (₹{primaryDrink.price + primaryFood.price})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
