import { WeatherData, WeatherCurrent, HourlyForecastItem, DailyForecastItem } from '../types/weather';
import { LocationCoordinates } from '../types/location';

const WEATHER_CACHE = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// Map WMO Weather Codes to Human-Readable Descriptions
export function getWeatherDescriptionFromWmoCode(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Fog & Depositing Rime';
    case 51:
    case 53:
    case 55:
      return 'Light to Moderate Drizzle';
    case 56:
    case 57:
      return 'Freezing Drizzle';
    case 61:
      return 'Slight Rain';
    case 63:
      return 'Moderate Rain';
    case 65:
      return 'Heavy Rainfall';
    case 66:
    case 67:
      return 'Freezing Rain';
    case 71:
    case 73:
    case 75:
      return 'Snowfall';
    case 77:
      return 'Snow Grains';
    case 80:
    case 81:
      return 'Rain Showers';
    case 82:
      return 'Violent Rain Showers';
    case 85:
    case 86:
      return 'Snow Showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Severe Thunderstorm with Hail';
    default:
      return 'Variable Weather';
  }
}

export async function fetchWeatherData(
  coords: LocationCoordinates,
  forceDemo: boolean = false
): Promise<WeatherData> {
  const cacheKey = `${coords.lat.toFixed(2)}_${coords.lng.toFixed(2)}`;

  if (!forceDemo && WEATHER_CACHE.has(cacheKey)) {
    const cached = WEATHER_CACHE.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  if (forceDemo) {
    return generateDemoWeatherData(coords);
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error HTTP ${response.status}`);
    }

    const json = await response.json();

    const current: WeatherCurrent = {
      temperature: Math.round(json.current.temperature_2m),
      feelsLike: Math.round(json.current.apparent_temperature),
      weatherCondition: getWeatherDescriptionFromWmoCode(json.current.weather_code),
      weatherCode: json.current.weather_code,
      humidity: Math.round(json.current.relative_humidity_2m),
      windSpeed: Math.round(json.current.wind_speed_10m),
      windDirection: json.current.wind_direction_10m,
      visibility: 10000, // Default 10km standard clear visibility
      rainProbability: json.hourly.precipitation_probability ? json.hourly.precipitation_probability[0] || 0 : 0,
      precipitation: json.current.precipitation || 0,
      pressure: Math.round(json.current.surface_pressure || 1013),
      uvIndex: json.daily.uv_index_max ? Math.round(json.daily.uv_index_max[0]) : 5,
      timestamp: new Date().toISOString(),
    };

    const hourly: HourlyForecastItem[] = [];
    const hourlyTimes = json.hourly.time || [];
    const nowHour = new Date().getHours();
    
    for (let i = 0; i < Math.min(24, hourlyTimes.length); i++) {
      const timeStr = hourlyTimes[i];
      const hourDate = new Date(timeStr);
      const displayTime = `${hourDate.getHours().toString().padStart(2, '0')}:00`;

      hourly.push({
        time: displayTime,
        temperature: Math.round(json.hourly.temperature_2m[i]),
        feelsLike: Math.round(json.hourly.apparent_temperature[i]),
        weatherCondition: getWeatherDescriptionFromWmoCode(json.hourly.weather_code[i]),
        weatherCode: json.hourly.weather_code[i],
        rainProbability: json.hourly.precipitation_probability ? json.hourly.precipitation_probability[i] || 0 : 0,
        precipitation: json.hourly.precipitation ? json.hourly.precipitation[i] || 0 : 0,
        windSpeed: Math.round(json.hourly.wind_speed_10m[i]),
      });
    }

    const daily: DailyForecastItem[] = [];
    const dailyTimes = json.daily.time || [];
    for (let i = 0; i < Math.min(7, dailyTimes.length); i++) {
      const dateObj = new Date(dailyTimes[i]);
      const dateFormatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      daily.push({
        date: dateFormatted,
        minTemp: Math.round(json.daily.temperature_2m_min[i]),
        maxTemp: Math.round(json.daily.temperature_2m_max[i]),
        weatherCondition: getWeatherDescriptionFromWmoCode(json.daily.weather_code[i]),
        weatherCode: json.daily.weather_code[i],
        rainProbability: json.daily.precipitation_probability_max ? json.daily.precipitation_probability_max[i] || 0 : 0,
        precipitationSum: json.daily.precipitation_sum ? Math.round(json.daily.precipitation_sum[i] * 10) / 10 : 0,
        maxWindSpeed: Math.round(json.daily.wind_speed_10m_max[i]),
        uvIndexMax: json.daily.uv_index_max ? Math.round(json.daily.uv_index_max[i]) : 5,
      });
    }

    const result: WeatherData = { current, hourly, daily, isDemoData: false };
    WEATHER_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.warn('Live weather request failed, generating fallback demo weather:', error);
    return generateDemoWeatherData(coords);
  }
}

function generateDemoWeatherData(coords: LocationCoordinates): WeatherData {
  const current: WeatherCurrent = {
    temperature: 28,
    feelsLike: 31,
    weatherCondition: 'Partly Cloudy with Light Breeze',
    weatherCode: 2,
    humidity: 74,
    windSpeed: 18,
    windDirection: 140,
    visibility: 9000,
    rainProbability: 25,
    precipitation: 0.5,
    pressure: 1011,
    uvIndex: 6,
    timestamp: new Date().toISOString(),
  };

  const hourly: HourlyForecastItem[] = Array.from({ length: 24 }, (_, i) => {
    const hour = (new Date().getHours() + i) % 24;
    const isNight = hour < 6 || hour > 19;
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      temperature: isNight ? 24 + (i % 3) : 28 + (i % 4),
      feelsLike: isNight ? 26 : 32,
      weatherCondition: i === 5 || i === 6 ? 'Light Rain Showers' : 'Partly Cloudy',
      weatherCode: i === 5 || i === 6 ? 80 : 2,
      rainProbability: i === 5 || i === 6 ? 65 : 20,
      precipitation: i === 5 || i === 6 ? 2.8 : 0,
      windSpeed: 15 + (i % 8),
    };
  });

  const daily: DailyForecastItem[] = [
    { date: 'Today', minTemp: 24, maxTemp: 31, weatherCondition: 'Partly Cloudy', weatherCode: 2, rainProbability: 25, precipitationSum: 0.5, maxWindSpeed: 20, uvIndexMax: 7 },
    { date: 'Tomorrow', minTemp: 23, maxTemp: 29, weatherCondition: 'Moderate Rain Showers', weatherCode: 80, rainProbability: 70, precipitationSum: 8.4, maxWindSpeed: 28, uvIndexMax: 5 },
    { date: 'Day 3', minTemp: 22, maxTemp: 28, weatherCondition: 'Thunderstorm Expected', weatherCode: 95, rainProbability: 85, precipitationSum: 16.2, maxWindSpeed: 42, uvIndexMax: 4 },
    { date: 'Day 4', minTemp: 24, maxTemp: 30, weatherCondition: 'Mainly Clear', weatherCode: 1, rainProbability: 15, precipitationSum: 0, maxWindSpeed: 16, uvIndexMax: 8 },
    { date: 'Day 5', minTemp: 25, maxTemp: 32, weatherCondition: 'Clear Sky', weatherCode: 0, rainProbability: 10, precipitationSum: 0, maxWindSpeed: 14, uvIndexMax: 9 },
    { date: 'Day 6', minTemp: 24, maxTemp: 31, weatherCondition: 'Partly Cloudy', weatherCode: 2, rainProbability: 30, precipitationSum: 1.2, maxWindSpeed: 18, uvIndexMax: 7 },
    { date: 'Day 7', minTemp: 23, maxTemp: 30, weatherCondition: 'Light Drizzle', weatherCode: 51, rainProbability: 45, precipitationSum: 3.0, maxWindSpeed: 22, uvIndexMax: 6 },
  ];

  return { current, hourly, daily, isDemoData: true };
}
