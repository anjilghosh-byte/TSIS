/**
 * Configurable thresholds for weather risk calculations.
 * Used by riskAssessmentService.ts.
 */
export const WEATHER_THRESHOLDS = {
  rain: {
    moderate: 2.5,   // > 2.5 mm/h
    high: 7.6,       // > 7.6 mm/h
    severe: 25.0,    // > 25 mm/h
  },
  windSpeed: {
    moderate: 30,    // > 30 km/h
    high: 50,        // > 50 km/h
    severe: 75,      // > 75 km/h (Storm/Cyclone)
  },
  temperature: {
    extremeHeat: 40, // > 40°C
    severeHeat: 45,  // > 45°C
    extremeCold: 0,  // < 0°C
    severeCold: -10, // < -10°C
  },
  visibility: {
    poor: 3000,      // < 3000 meters
    veryPoor: 1000,  // < 1000 meters
    hazardous: 500,  // < 500 meters
  },
  uvIndex: {
    high: 6,         // > 6
    veryHigh: 8,     // > 8
    extreme: 11,     // > 11
  },
};
