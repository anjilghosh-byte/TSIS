# Tourist Safety Intelligence System (TSIS)

> **Know Before You Go.** A real-time travel safety dashboard combining weather forecasts, historical crime data, local news advisories, and emergency SOS assistance.

## Features

| Feature | Description |
|---------|-------------|
| Real-time Weather | Current conditions, 24h chart, 7-day forecast via Open-Meteo (free, no key) |
| Interactive Map | Leaflet/OpenStreetMap with destination + user location markers (free, no key) |
| Safety News | Destination-specific local advisories, weather alerts, incident reports |
| Crime Statistics | NCRB 2021-2024 historical trends with Recharts bar chart visualizations |
| Risk Engine | Explainable multi-factor risk: LOW / MODERATE / HIGH / SEVERE |
| Activity Safety | Beach, Trekking, Camping, Mountain Travel, Sightseeing specific analysis |
| Emergency SOS | GPS link + pre-filled message + SMS/call deep links |
| Contact Manager | Secure local-only CRUD emergency contact storage |
| Location Detection | Browser Geolocation API with manual fallback |
| Destination Search | Real-time geocoding via Open-Meteo (free, no key) |
| Demo Mode | Full demo with clearly labeled sample data |
| Responsive Design | Tested 320px to 1440px+ breakpoints |

## Tech Stack

- React 18 + TypeScript
- Vite 5 (build tool)
- Tailwind CSS 3.4 (styling)
- Recharts 2.12 (weather/crime charts)
- Leaflet + React-Leaflet + OpenStreetMap (maps, free)
- Lucide React (icons)
- Open-Meteo API (weather + geocoding, free, no key)
- NewsAPI.org (optional, graceful fallback)
- NCRB data embedded (no external API)

## Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Install Dependencies
```
npm install
```

## Environment Variables

Copy .env.example to .env:
```
cp .env.example .env
```

Edit .env:
```
# Weather: OPTIONAL - defaults to keyless Open-Meteo
VITE_OPENWEATHER_API_KEY=

# News: OPTIONAL - get free key at newsapi.org/register
VITE_NEWS_API_KEY=your_newsapi_key_here

# Map: OPTIONAL - defaults to free OpenStreetMap
VITE_MAP_API_KEY=

# Enable live APIs
VITE_ENABLE_LIVE_APIS=true
```

IMPORTANT: Never commit real API keys. The .env file is gitignored.

## Running Locally

### Development Server
```
npm run dev
```
Opens at: http://localhost:3000

### Production Build
```
npm run build
```

### Preview Production Build
```
npm run preview
```

### TypeScript Check
```
npm run lint
```

## API Setup

### Weather (Open-Meteo) - No key required
Free worldwide weather. TSIS uses it by default. Automatic 10-min cache.

### Geocoding (Open-Meteo) - No key required
Free worldwide location search. No setup needed.

### News API - Optional
1. Go to newsapi.org/register
2. Get free API key
3. Add to .env: VITE_NEWS_API_KEY=your_key

Without key: shows cached safety bulletins (labeled "CACHED BULLETINS")

### Map (OpenStreetMap/Leaflet) - No key required
Completely free. No setup needed.

### Crime Data - Embedded
NCRB 2021-2024 historical data is embedded. No external API.

## Application Pages

1. HOME - Hero search, featured destinations, how it works, safety philosophy
2. SAFETY ANALYSIS - Risk overview, weather, forecast, activity selector, risk breakdown, news, crime chart, map
3. EMERGENCY SOS - SOS button + modal, contact manager, emergency hotlines
4. CONTACTS - Full CRUD emergency contact management
5. HOW IT WORKS - Technical explanations, API details, SOS limitations

## Risk Calculation Methodology

The risk engine (riskAssessmentService.ts) uses deterministic, explainable scoring.

### Weather Thresholds (config/thresholds.ts)

| Parameter | LOW | MODERATE | HIGH | SEVERE |
|-----------|-----|----------|------|--------|
| Precipitation (mm) | <1 | >=1 | >=5 | >=15 |
| Wind Speed (km/h) | <20 | >=20 | >=45 | >=70 |
| Visibility (m) | >5000 | <5000 | <2000 | <500 |

### Risk Score Mapping
- LOW -> Safety Score 95/100 (Green)
- MODERATE -> Safety Score 72/100 (Amber)
- HIGH -> Safety Score 48/100 (Orange)
- SEVERE -> Safety Score 22/100 (Red)

### Factors
1. Weather risk (primary)
2. Activity-specific risk (modifier)
3. Official news/warning risk (override priority)
4. Historical crime indicator (secondary)

Official warnings always display prominently above calculated scores.

## Demo Mode

Toggle Live/Demo in the navbar. All demo data is clearly labeled.

Demo data includes: realistic weather scenarios, pre-built safety bulletins for
Digha, Darjeeling, Goa, Sundarbans, Manali, Rishikesh, and all crime trend data.

## Limitations

1. Weather: Open-Meteo provides forecast data - hyperlocal conditions may vary
2. Crime: NCRB data is historical regional-level, not location-precise
3. News: Without NewsAPI key, shows cached bulletins (labeled)
4. SOS SMS: Cannot send silently - user must confirm in messaging app
5. SOS Call: Uses tel: deep link - depends on device
6. Official Warnings: No direct government feed - uses news article matching
7. Location: Depends on browser permission + GPS signal
8. Coverage: Primarily India-focused in default dataset

## Future Improvements

- Backend API proxy for secure NewsAPI calls
- PWA with offline support
- Push notifications for weather alerts
- Server-side SOS SMS via Twilio
- Multi-language support (Hindi, Bengali, Tamil)
- IMD official alert feed integration
- User accounts + trip history
- React Native app port
- AI-powered news summarization

## Safety Disclaimer

TSIS provides advisory risk assessments, NOT official government safety clearances.
- Weather data may be delayed or incomplete
- Crime statistics are historical, NOT real-time predictions
- Always follow official government and local authority instructions
- In genuine emergencies, call 112 (India) or your national emergency number

## License

Academic prototype developed for educational purposes.
