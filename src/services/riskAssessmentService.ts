import { WeatherData } from '../types/weather';
import { CrimeData } from '../types/crime';
import { NewsData } from '../types/news';
import { ActivityType } from '../types/location';
import { RiskAssessment, RiskLevel } from '../types/risk';
import { WEATHER_THRESHOLDS } from '../config/thresholds';

export function calculateRiskAssessment(
  weather: WeatherData,
  crime: CrimeData,
  news: NewsData,
  activity: ActivityType = 'general_tourism'
): RiskAssessment {
  const current = weather.current;
  const recommendations: string[] = [];
  
  // 1. Evaluate Weather Risk
  let weatherRisk: RiskLevel = 'LOW';

  // Rain & Thunderstorm checks
  if (current.weatherCode >= 95 || current.precipitation >= WEATHER_THRESHOLDS.rain.severe) {
    weatherRisk = 'SEVERE';
  } else if (current.precipitation >= WEATHER_THRESHOLDS.rain.high || current.weatherCode === 82 || current.weatherCode === 65) {
    weatherRisk = 'HIGH';
  } else if (current.precipitation >= WEATHER_THRESHOLDS.rain.moderate || current.weatherCode >= 51) {
    weatherRisk = 'MODERATE';
  }

  // Wind checks
  if (current.windSpeed >= WEATHER_THRESHOLDS.windSpeed.severe) {
    weatherRisk = 'SEVERE';
  } else if (current.windSpeed >= WEATHER_THRESHOLDS.windSpeed.high && weatherRisk !== 'SEVERE') {
    weatherRisk = 'HIGH';
  } else if (current.windSpeed >= WEATHER_THRESHOLDS.windSpeed.moderate && weatherRisk === 'LOW') {
    weatherRisk = 'MODERATE';
  }

  // Visibility checks
  if (current.visibility < WEATHER_THRESHOLDS.visibility.hazardous && weatherRisk !== 'SEVERE') {
    weatherRisk = 'HIGH';
  } else if (current.visibility < WEATHER_THRESHOLDS.visibility.veryPoor && weatherRisk === 'LOW') {
    weatherRisk = 'MODERATE';
  }

  // Extreme Temp checks
  if (current.temperature >= WEATHER_THRESHOLDS.temperature.severeHeat || current.temperature <= WEATHER_THRESHOLDS.temperature.severeCold) {
    if (weatherRisk !== 'SEVERE') weatherRisk = 'HIGH';
  }

  // 2. Evaluate Activity-Specific Risk
  let activityRisk: RiskLevel = 'LOW';

  switch (activity) {
    case 'beach':
    case 'water_sports':
      if (current.weatherCode >= 95 || current.windSpeed >= 40 || current.precipitation >= 5) {
        activityRisk = 'SEVERE';
        recommendations.push('Avoid water sports and swimming due to high swell, strong wind, or thunderstorm risks.');
      } else if (current.windSpeed >= 25 || current.precipitation > 1) {
        activityRisk = 'HIGH';
        recommendations.push('Follow lifeguard red-flag advisories and avoid deep waters.');
      } else {
        recommendations.push('Always swim in designated safe zones monitored by lifeguards.');
      }
      if (current.uvIndex >= 8) {
        recommendations.push('High UV Index detected: Apply SPF 50+ sunscreen and wear protective eyewear.');
      }
      break;

    case 'trekking':
    case 'hiking':
      if (current.weatherCode >= 95 || current.precipitation >= 10 || current.visibility < 1000) {
        activityRisk = 'SEVERE';
        recommendations.push('Trekking is strictly unsafe due to landslide/thunderstorm risk. Check local forest/mountain authority bulletins.');
      } else if (current.precipitation >= 3 || current.visibility < 3000) {
        activityRisk = 'HIGH';
        recommendations.push('Trail conditions may be slippery. Carry sturdy waterproof boots and stay on marked trails.');
      } else {
        recommendations.push('Ensure offline GPS maps are downloaded and inform your contact before heading out.');
      }
      break;

    case 'mountain_travel':
      if (current.visibility < 1000 || current.weatherCode >= 95 || current.precipitation >= 15) {
        activityRisk = 'SEVERE';
        recommendations.push('Mountain road travel hazardous due to poor visibility and potential rockfall. Delay non-essential transit.');
      } else if (current.precipitation >= 4 || current.visibility < 3000) {
        activityRisk = 'HIGH';
        recommendations.push('Drive with fog lights on and reduce speeds on hair-pin bends.');
      }
      break;

    case 'camping':
      if (current.weatherCode >= 95 || current.windSpeed >= 35 || current.precipitation >= 8) {
        activityRisk = 'SEVERE';
        recommendations.push('Do not pitch tents near riverbeds or steep slopes during thunderstorm warnings.');
      } else if (current.precipitation > 2) {
        activityRisk = 'MODERATE';
        recommendations.push('Ensure tent rainflies are secure and elevate gear above ground level.');
      }
      break;

    default:
      if (current.precipitation > 5) {
        recommendations.push('Carry rain gear and umbrella while sightseeing outdoor monuments.');
      }
      recommendations.push('Keep emergency contacts accessible and verify transportation timetables.');
      break;
  }

  // 3. Evaluate News & Official Warning Risk
  let newsRisk: RiskLevel = 'LOW';
  let officialWarning: RiskAssessment['officialWarning'] | undefined = undefined;

  const warningArticle = news.articles.find((a) => a.isOfficialWarning || a.category === 'closure');
  if (warningArticle) {
    newsRisk = warningArticle.category === 'closure' ? 'HIGH' : 'MODERATE';
    officialWarning = {
      title: warningArticle.title,
      description: warningArticle.description,
      issuedBy: warningArticle.source,
    };
    recommendations.unshift(`Official Advisory: ${warningArticle.title} (Source: ${warningArticle.source}). Follow local instructions.`);
  }

  // 4. Evaluate Crime Risk
  const latestCrimeYear = crime.yearlyTrends[crime.yearlyTrends.length - 1];
  let crimeRisk: RiskLevel = 'LOW';
  if (latestCrimeYear && latestCrimeYear.touristTargetedIncidents > 100) {
    crimeRisk = 'MODERATE';
    recommendations.push('Maintain standard urban vigilance: Avoid carrying large amounts of cash and use registered taxis.');
  }

  // 5. Determine Overall Risk (Official Warning & Severe Conditions override normal calculation)
  let overallRisk: RiskLevel = 'LOW';
  const riskLevels: RiskLevel[] = [weatherRisk, activityRisk, newsRisk, crimeRisk];

  if (riskLevels.includes('SEVERE') || (officialWarning && warningArticle?.category === 'closure')) {
    overallRisk = 'SEVERE';
  } else if (riskLevels.includes('HIGH')) {
    overallRisk = 'HIGH';
  } else if (riskLevels.includes('MODERATE')) {
    overallRisk = 'MODERATE';
  }

  // Numerical Score (100 = Best/Safest)
  let numericalScore = 95;
  if (overallRisk === 'MODERATE') numericalScore = 72;
  if (overallRisk === 'HIGH') numericalScore = 48;
  if (overallRisk === 'SEVERE') numericalScore = 22;

  // Build natural language explanation ("Why?")
  let explanation = '';
  if (overallRisk === 'SEVERE') {
    explanation = `Severe risk detected due to ${
      weatherRisk === 'SEVERE' ? `hazardous weather conditions (${current.weatherCondition}, ${current.precipitation}mm rain, ${current.windSpeed}km/h wind)` : 'official authority closures'
    } for planned ${activity.replace('_', ' ')} activities. Travel or outdoor participation is strongly discouraged without consulting local authorities.`;
  } else if (overallRisk === 'HIGH') {
    explanation = `High risk level calculated. Current weather (${current.weatherCondition}) or activity demands increased caution. Outdoor plans should be adjusted or postponed if conditions deteriorate.`;
  } else if (overallRisk === 'MODERATE') {
    explanation = `Moderate risk level. Weather conditions are mostly manageable (${current.temperature}°C, ${current.weatherCondition}), but planned ${activity.replace('_', ' ')} requires precautionary measures.`;
  } else {
    explanation = `Low risk level. Current weather conditions (${current.temperature}°C, ${current.weatherCondition}) and historical safety statistics indicate favorable travel conditions.`;
  }

  // Ensure recommendations list is clean & deduplicated
  const uniqueRecs = Array.from(new Set(recommendations));

  return {
    overallRisk,
    numericalScore,
    factors: {
      weatherRisk,
      crimeRisk,
      newsRisk,
      activityRisk,
    },
    explanation,
    recommendations: uniqueRecs,
    officialWarning,
    evaluatedActivity: activity,
  };
}
