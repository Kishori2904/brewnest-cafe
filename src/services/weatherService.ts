export type WeatherConditionType =
  | 'sunny'
  | 'warm'
  | 'mild'
  | 'chilly'
  | 'cold'
  | 'rainy'
  | 'snowy'
  | 'stormy';

export interface WeatherData {
  latitude: number;
  longitude: number;
  cityName: string;
  regionName: string;
  temperature: number; // Celsius
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  conditionType: WeatherConditionType;
  conditionLabel: string;
  isDay: boolean;
  windSpeed: number;
  timestamp: number;
  source: 'live_gps' | 'city_preset' | 'simulated' | 'default_noida';
}

export interface WeatherRecommendation {
  vibeTitle: string;
  baristaNote: string;
  badge: string;
  temperatureTag: string;
  primaryDrinkId: string;
  primaryFoodId: string;
  secondaryDrinkId: string;
  tags: string[];
}

export const PRESET_LOCATIONS = [
  { name: 'Noida (BrewNest Hub)', region: 'Uttar Pradesh', lat: 28.585, lon: 77.345 },
  { name: 'New Delhi', region: 'Delhi NCR', lat: 28.6139, lon: 77.209 },
  { name: 'Bengaluru', region: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Mumbai', region: 'Maharashtra', lat: 19.076, lon: 72.8777 },
  { name: 'Shimla (Hill Station)', region: 'Himachal', lat: 31.1048, lon: 77.1734 },
  { name: 'London', region: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
];

export const SIMULATION_PRESETS: {
  label: string;
  icon: string;
  weather: WeatherData;
}[] = [
  {
    label: 'Sunny & Hot (34°C)',
    icon: '☀️',
    weather: {
      latitude: 28.585,
      longitude: 77.345,
      cityName: 'Noida',
      regionName: 'Uttar Pradesh',
      temperature: 34,
      apparentTemperature: 37,
      humidity: 42,
      weatherCode: 0,
      conditionType: 'sunny',
      conditionLabel: 'Hot & Clear Sunshine',
      isDay: true,
      windSpeed: 8,
      timestamp: Date.now(),
      source: 'simulated',
    },
  },
  {
    label: 'Rainy Showers (21°C)',
    icon: '🌧️',
    weather: {
      latitude: 28.585,
      longitude: 77.345,
      cityName: 'Noida',
      regionName: 'Uttar Pradesh',
      temperature: 21,
      apparentTemperature: 20,
      humidity: 88,
      weatherCode: 63,
      conditionType: 'rainy',
      conditionLabel: 'Cool Rain Showers',
      isDay: true,
      windSpeed: 14,
      timestamp: Date.now(),
      source: 'simulated',
    },
  },
  {
    label: 'Chilly Winter (12°C)',
    icon: '❄️',
    weather: {
      latitude: 28.585,
      longitude: 77.345,
      cityName: 'Noida',
      regionName: 'Uttar Pradesh',
      temperature: 12,
      apparentTemperature: 10,
      humidity: 75,
      weatherCode: 45,
      conditionType: 'cold',
      conditionLabel: 'Crisp Foggy Morning',
      isDay: true,
      windSpeed: 6,
      timestamp: Date.now(),
      source: 'simulated',
    },
  },
  {
    label: 'Pleasant Spring (24°C)',
    icon: '🌤️',
    weather: {
      latitude: 28.585,
      longitude: 77.345,
      cityName: 'Noida',
      regionName: 'Uttar Pradesh',
      temperature: 24,
      apparentTemperature: 24,
      humidity: 50,
      weatherCode: 1,
      conditionType: 'warm',
      conditionLabel: 'Gentle Breeze & Mild Sun',
      isDay: true,
      windSpeed: 10,
      timestamp: Date.now(),
      source: 'simulated',
    },
  },
];

/**
 * Maps WMO weather code to human-readable text and general condition
 */
export function getWMOInfo(code: number): { label: string; condition: WeatherConditionType } {
  if (code === 0) return { label: 'Clear Sky', condition: 'sunny' };
  if (code === 1 || code === 2) return { label: 'Partly Cloudy', condition: 'warm' };
  if (code === 3) return { label: 'Overcast & Gloomy', condition: 'mild' };
  if (code === 45 || code === 48) return { label: 'Misty Fog', condition: 'chilly' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', condition: 'rainy' };
  if (code >= 61 && code <= 67) return { label: 'Rain Showers', condition: 'rainy' };
  if (code >= 71 && code <= 77) return { label: 'Snow Flurries', condition: 'snowy' };
  if (code >= 80 && code <= 82) return { label: 'Heavy Rain', condition: 'rainy' };
  if (code >= 85 && code <= 86) return { label: 'Snow Showers', condition: 'snowy' };
  if (code >= 95) return { label: 'Thunderstorm', condition: 'stormy' };
  return { label: 'Pleasant Weather', condition: 'mild' };
}

/**
 * Classifies weather into condition type considering both temperature and precipitation
 */
export function classifyCondition(temp: number, weatherCode: number): WeatherConditionType {
  // If precipitating, rain/snow overrides temperature
  if (weatherCode >= 95) return 'stormy';
  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return 'rainy';
  if (weatherCode >= 71 && weatherCode <= 77) return 'snowy';

  // Otherwise by temperature
  if (temp >= 28) return 'sunny';
  if (temp >= 22) return 'warm';
  if (temp >= 16) return 'mild';
  if (temp >= 10) return 'chilly';
  return 'cold';
}

/**
 * Reverse geocodes coordinates to city/region name
 */
async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; region: string }> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Your City';
      const region = data.principalSubdivision || data.countryName || 'Local Region';
      return { city, region };
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }
  return { city: 'Local Area', region: 'Near You' };
}

/**
 * Fetches real-time weather from Open-Meteo free public API
 */
export async function fetchWeatherForCoordinates(
  lat: number,
  lon: number,
  source: 'live_gps' | 'city_preset' | 'default_noida' = 'live_gps',
  overrideCity?: string,
  overrideRegion?: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.statusText}`);
  }

  const data = await response.json();
  const current = data.current;

  let city = overrideCity;
  let region = overrideRegion;

  if (!city) {
    const geo = await reverseGeocode(lat, lon);
    city = geo.city;
    region = geo.region;
  }

  const temp = Math.round(current.temperature_2m);
  const apparentTemp = Math.round(current.apparent_temperature);
  const weatherCode = current.weather_code;
  const wmo = getWMOInfo(weatherCode);
  const conditionType = classifyCondition(temp, weatherCode);

  return {
    latitude: lat,
    longitude: lon,
    cityName: city || 'Noida',
    regionName: region || 'Uttar Pradesh',
    temperature: temp,
    apparentTemperature: apparentTemp,
    humidity: Math.round(current.relative_humidity_2m),
    weatherCode: weatherCode,
    conditionType: conditionType,
    conditionLabel: wmo.label,
    isDay: Boolean(current.is_day),
    windSpeed: Math.round(current.wind_speed_10m),
    timestamp: Date.now(),
    source: source,
  };
}

/**
 * Generates barista menu recommendations based on weather conditions
 */
export function getRecommendationForWeather(weather: WeatherData): WeatherRecommendation {
  const { temperature, conditionType, cityName } = weather;

  switch (conditionType) {
    case 'sunny':
      return {
        vibeTitle: 'Sunlit Afternoon Cooling Refreshment',
        badge: 'Beat the Heat · Chilled Pick',
        temperatureTag: `${temperature}°C · Hot & Bright`,
        primaryDrinkId: 'coffee-cold-brew',
        primaryFoodId: 'dessert-cheesecake',
        secondaryDrinkId: 'coffee-iced-tonic',
        tags: ['16h Steeped', 'No Bitterness', 'Chilled Berry Coulis', 'Hydrating'],
        baristaNote: `It is currently ${temperature}°C in ${cityName}. When the sun is blazing, hot coffee can feel dehydrating. Our 16-Hour Artisanal Cold Brew is slow-steeped over crystal ice for zero acidity and a silky clean caffeine lift. Pair it with chilled New York Cheesecake for the ultimate refreshing escape!`,
      };

    case 'warm':
      return {
        vibeTitle: 'Pleasant Day Iced Pick-Me-Up',
        badge: 'Warm Day Favorite',
        temperatureTag: `${temperature}°C · Warm & Sunny`,
        primaryDrinkId: 'coffee-iced-latte',
        primaryFoodId: 'snack-sandwich',
        secondaryDrinkId: 'coffee-iced-caramel',
        tags: ['Madagascar Vanilla', 'Crushed Ice', 'Crisp Sourdough', 'Energizing'],
        baristaNote: `With a lovely ${temperature}°C outside in ${cityName}, an Iced Vanilla Bean Latte hits the exact sweet spot. Shaken with Madagascar vanilla bean syrup over fresh whole milk, it pairs brilliantly with our hot, crunchy cast-iron grilled cheese sandwich!`,
      };

    case 'rainy':
    case 'stormy':
      return {
        vibeTitle: 'Monsoon Warmth & Sizzling Bites',
        badge: 'Rainy Day Comfort Companion',
        temperatureTag: `${temperature}°C · Wet & Rainy`,
        primaryDrinkId: 'coffee-mocha',
        primaryFoodId: 'snack-garlic-bread',
        secondaryDrinkId: 'snack-peri-fries',
        tags: ['Melted Belgian Ganache', 'Hot Garlic Butter', 'Comfort Food', 'Spiced Crunch'],
        baristaNote: `Rain is pattering down in ${cityName}! There is nothing quite like watching raindrops slide down the window pane while clutching a steaming mug of 70% Belgian Dark Chocolate Mocha and pulling apart hot, bubbling cheesy garlic bread with roasted herb butter.`,
      };

    case 'cold':
    case 'chilly':
    case 'snowy':
      return {
        vibeTitle: 'Cozy Winter Soul Warmer',
        badge: 'Chilly Day Shield',
        temperatureTag: `${temperature}°C · Crisp & Cold`,
        primaryDrinkId: 'coffee-cappuccino',
        primaryFoodId: 'main-alfredo',
        secondaryDrinkId: 'coffee-americano',
        tags: ['Dense Micro-Foam', 'Parmesan Garlic Alfredo', 'Piping Hot', 'Warming Spices'],
        baristaNote: `A crisp ${temperature}°C chill calls for genuine internal warmth. Our Head Barista pulls an extra-dense micro-foam cappuccino dusted with raw cocoa, paired with piping hot penne pasta tossed in roasted garlic butter and 24-month aged parmesan cream.`,
      };

    case 'mild':
    default:
      return {
        vibeTitle: 'Mild Weather Harmonious Brew',
        badge: 'Perfect Weather Balance',
        temperatureTag: `${temperature}°C · Mild & Gentle`,
        primaryDrinkId: 'coffee-latte',
        primaryFoodId: 'dessert-fudge-cake',
        secondaryDrinkId: 'coffee-americano',
        tags: ['Rosette Art', 'Steamed Milk', 'Rich Belgian Fudge', 'Café Classic'],
        baristaNote: `At an easygoing ${temperature}°C in ${cityName}, this is textbook café weather. Order our silky Rosette Caffè Latte with whole milk steamed to sweet 62°C, and treat yourself to a decadent slice of triple-layer Belgian chocolate fudge cake.`,
      };
  }
}
