export interface WeatherCurrent {
  temperature: number;           // in °C
  feelsLike: number;             // in °C
  weatherCondition: string;       // e.g. "Clear Sky", "Heavy Rain", "Thunderstorm"
  weatherCode: number;           // WMO weather interpretation code
  humidity: number;              // in %
  windSpeed: number;             // in km/h
  windDirection: number;         // in degrees
  visibility: number;            // in meters or km
  rainProbability: number;       // in %
  precipitation: number;         // in mm
  pressure: number;              // in hPa
  uvIndex: number;               // 0 - 12+
  sunrise?: string;              // ISO or formatted string
  sunset?: string;               // ISO or formatted string
  timestamp: string;
}

export interface HourlyForecastItem {
  time: string;                  // e.g. "14:00" or ISO
  temperature: number;
  feelsLike: number;
  weatherCondition: string;
  weatherCode: number;
  rainProbability: number;
  precipitation: number;
  windSpeed: number;
}

export interface DailyForecastItem {
  date: string;                  // e.g. "2026-08-08" or "Sat, Aug 8"
  minTemp: number;
  maxTemp: number;
  weatherCondition: string;
  weatherCode: number;
  rainProbability: number;
  precipitationSum: number;
  maxWindSpeed: number;
  uvIndexMax: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  isDemoData?: boolean;
}
