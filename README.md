# Tourist Safety Intelligence System (TSIS)

### Know Before You Go. Stay Informed While You Travel. Get Help When You Need It.

TSIS — **Tourist Safety Intelligence System** — is a smart travel companion designed to help tourists make better and safer travel decisions.

Instead of being just another travel-planning application, TSIS combines:

- Weather Intelligence
- Recent News & Alerts
- Historical Safety Information
- Smart Tourist Guide
- Day-wise Travel Planning
- AI-assisted Recommendations
- Emergency SOS
- User Accounts & Travel History

into one platform.

The idea is simple:

> **Before you go, know the place. While you travel, stay informed. If something goes wrong, get help quickly.**

---

# Table of Contents

* [What is TSIS?](#what-is-tsis)
* [The Problem](#the-problem)
* [Our Solution](#our-solution)
* [Our USP](#our-unique-selling-proposition)
* [Key Features](#key-features)
* [How TSIS Works](#how-tsis-works)
* [Complete User Journey](#complete-user-journey)
* [Tourist Guide & Travel Planner](#tourist-guide--travel-planner)
* [Safety Intelligence](#safety-intelligence)
* [Weather Intelligence](#weather-intelligence)
* [News Intelligence](#news-intelligence)
* [Historical Crime Data](#historical-crime-data)
* [SOS System](#sos-emergency-system)
* [User Accounts](#user-accounts)
* [Travel History](#travel-history)
* [Technology Stack](#technology-stack)
* [Project Architecture](#project-architecture)
* [Folder Structure](#folder-structure)
* [How to Fork the Project](#how-to-fork-the-project)
* [How to Clone the Project](#how-to-clone-the-project)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [API Setup](#api-setup)
* [Database Setup](#database-setup)
* [Running the Application](#running-the-application)
* [Demo Mode](#demo-mode)
* [Testing](#testing)
* [Security & Privacy](#security--privacy)
* [Limitations](#limitations)
* [Future Improvements](#future-improvements)
* [Contribution Guide](#contribution-guide)
* [Troubleshooting](#troubleshooting)
* [Project Philosophy](#project-philosophy)

---

# What is TSIS?

Imagine you're planning a trip to Digha.

You check the weather and it looks fine.

You plan to visit the beach and a few tourist attractions.

But after reaching there, you discover that:

* Heavy rain has started.
* A storm warning has been issued.
* An outdoor activity is not advisable.
* A nearby area has recently experienced a safety incident.
* You don't know what other places are worth visiting.
* You have no idea how to organize your trip efficiently.
* In an emergency, contacting your family quickly becomes difficult.

This is the problem TSIS is designed to address.

TSIS combines travel planning and safety intelligence into a single platform.

---

# The Problem

Most travel applications focus primarily on:

* Hotels
* Flights
* Restaurants
* Tourist attractions
* Reviews
* Itineraries

Safety information is usually separated from the actual travel-planning experience.

A tourist may need to check several different sources for:

> Weather -> News -> Safety -> Places -> Routes -> Emergency Contacts

This creates unnecessary confusion.

TSIS attempts to bring these pieces together.

---

# Our Solution

TSIS provides a centralized travel intelligence platform.

A tourist can enter:

> **Digha**

TSIS identifies the destination and provides:

### Weather

Current weather and forecasts.

### Safety

An advisory risk assessment based on available information.

### Recent Information

Relevant recent news and events.

### Tourist Guide

Places worth visiting.

### Travel Planner

A day-wise itinerary based on the number of days and user preferences.

### Maps

Location and route information.

### Emergency Assistance

SOS functionality and emergency contacts.

### Travel History

A personal record of places the user has visited.

---

# Our Unique Selling Proposition (USP)

The main USP of TSIS is:

> ## **Safety-aware travel planning.**

Traditional travel planners primarily answer:

> **"Where should I go?"**

Safety applications primarily answer:

> **"Is this area safe?"**

TSIS attempts to answer both:

> **"Where should I go, how should I plan it, and what safety/weather conditions should I know about before I go?"**

This creates a connected system:

```text
                    TSIS
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
     EXPLORE       ASSESS       RESPOND
        │            │            │
     Places       Weather        SOS
     Guide        Safety         Emergency
        │          News
        │          Crime
        ↓            ↓
             PLAN
                │
          Smart Itinerary
```

---

# Key Features

## 1. Smart Tourist Guide

Search any supported destination and discover relevant tourist attractions.

The system provides:

* Tourist attractions
* Categories
* Place descriptions
* Location
* Maps
* Approximate visiting duration
* Nearby places
* Relevant travel information

---

## 2. Smart Travel Planner

Tell TSIS:

> "I am visiting Jaipur for 4 days."

Then select preferences such as:

* History
* Culture
* Food
* Nature
* Photography
* Shopping
* Adventure
* Family
* Relaxed travel

TSIS generates a suggested day-wise itinerary.

---

## 3. Weather Intelligence

TSIS retrieves current and forecast weather information.

Depending on the available API, this can include:

* Temperature
* Feels-like temperature
* Humidity
* Wind
* Rain probability
* Visibility
* Weather condition
* UV index
* Forecast
* Weather alerts

---

## 4. Safety Intelligence

TSIS combines available information to create an **advisory safety/risk assessment**.

Possible factors include:

* Weather conditions
* Recent relevant news
* Historical crime information
* Activity suitability
* Official warnings where available

The system explains why a particular risk level was assigned.

---

## 5. Recent News

Relevant recent news can help tourists become aware of situations that may affect their trip.

Examples:

* Severe weather
* Local incidents
* Travel restrictions
* Major events
* Safety-related reports

TSIS does not fabricate news.

---

## 6. Historical Crime Information

Where reliable public data is available, TSIS can display historical crime statistics.

This may include:

* Region
* Year
* Crime category
* Reported cases
* Historical trends

### Important

Historical crime data does **not** predict that a crime will happen to a tourist.

It is provided as contextual information only.

---

# Destination Accuracy

One of the most important technical principles of TSIS is:

> **The destination must be geographically grounded before recommendations are generated.**

For example:

If the user enters:

> Digha

TSIS must not randomly recommend:

- Red Fort
- Howrah Bridge
- India Gate
- Jaipur City Palace

Instead, the system:

```text
User enters destination
        ↓
Geocoding
        ↓
Exact location identified
        ↓
Tourist places retrieved
        ↓
Geographic filtering
        ↓
Distance validation
        ↓
Verified attractions
        ↓
Itinerary generation
```

This prevents the AI from generating plausible-sounding but geographically incorrect recommendations.

---

# Weather-Aware Travel Planning

TSIS doesn't just show weather.

Where sufficient data is available, weather can influence the suggested itinerary.

For example:

If heavy rain is expected in the afternoon:

```text
Original:
2:00 PM -> Outdoor attraction

↓

Weather:
Heavy rain expected

↓

Suggested:
2:00 PM -> Indoor museum
5:00 PM -> Outdoor attraction
```

The user can still choose to keep the original plan.

TSIS does not override user decisions or official instructions.

---

# Tourist Guide & Travel Planner

The travel planner allows users to enter:

### Destination

Example:

> Kolkata

### Number of days

Example:

> 3 Days

### Interests

Example:

> History + Food + Culture

### Travel pace

Example:

> Balanced

TSIS can then generate:

```text
DAY 1
Heritage & Culture

Morning
Victoria Memorial

Afternoon
Indian Museum

Evening
Prinsep Ghat


DAY 2
Culture & Food

...


DAY 3
Modern Kolkata & Shopping

...
```

The exact recommendations depend on verified destination data.

---

# Geographic Itinerary Optimization

The itinerary engine attempts to group nearby attractions.

Instead of:

```text
Place A
↓
50 km
↓
Place B
↓
40 km
↓
Place C
```

it should prefer:

```text
Place A
↓
3 km
↓
Place B
↓
2 km
↓
Place C
```

This reduces unnecessary travel.

Where routing data is available, travel time can also be considered.

---

# Replan My Day

Travel conditions can change.

The application provides a:

> **Replan My Day**

option.

The system can check the latest available information and suggest adjustments.

Example:

> "Rain is now expected between 2 PM and 5 PM. We have moved the outdoor activity to the morning and suggested an indoor attraction for the afternoon."

---

# SOS Emergency System

TSIS includes an emergency assistance feature.

Users can add trusted emergency contacts.

Example:

```text
Father
Mother
Guardian
Family Member
```

The SOS interface provides quick access to emergency actions.

Depending on browser/device capabilities, TSIS can:

* Open a phone call using `tel:`
* Prepare an SMS/message
* Include the user's location
* Provide emergency service calling options
* Show the current location

---

# Important SOS Limitation

A normal web browser cannot silently send an SMS or make arbitrary phone calls without user/device interaction.

Therefore TSIS does not falsely claim that an emergency message was delivered.

Instead, it uses supported browser/device mechanisms such as:

```text
tel:
SMS/deep-link
```

where available.

The application must clearly tell the user when an action requires confirmation.

---

# User Accounts

TSIS supports user accounts.

Users can:

* Create an account
* Log in
* Log out
* Manage their profile
* Save trips
* Save itineraries
* Manage emergency contacts
* View travel history
* Save travel preferences

Guests can still use basic destination and safety features where appropriate.

---

# Travel History

Users can maintain a personal travel history.

Example:

```text
MY TRAVEL HISTORY

[Visited] Digha
Visited: August 2026
Duration: 3 Days

[Visited] Kolkata
Visited: July 2026
Duration: 2 Days

[Visited] Jaipur
Visited: March 2026
Duration: 4 Days
```

A destination should NOT automatically become "visited" merely because the user searched for it.

The user must explicitly mark it as visited.

---

# Saved Trips

Logged-in users can save generated itineraries.

For example:

```text
Saved Trips

Kolkata — 3 Days
Digha — 2 Days
Jaipur — 4 Days
```

Saved trips can be:

* Opened
* Edited
* Deleted
* Reused
* Marked as completed

---

# AI in TSIS

AI is used as an assistant rather than the source of truth.

AI can help with:

* Explaining destinations
* Summarizing news
* Personalizing itineraries
* Explaining safety information
* Answering travel-related questions
* Making the interface more conversational

However, AI should NOT invent:

* Weather
* Crime statistics
* Tourist attractions
* Opening hours
* Prices
* Official warnings
* Closures
* Emergency numbers

The factual layer should come from verified APIs/databases.

---

# How TSIS Works

The simplified architecture is:

```text
                 USER
                  │
                  ↓
          Destination Search
                  │
                  ↓
          Destination Resolver
                  │
         ┌────────┴────────┐
         ↓                 ↓
   Tourist Places       Weather
         │                 │
         ↓                 ↓
 Geographic Filter      Forecast
         │                 │
         └────────┬────────┘
                  ↓
            Safety Engine
                  │
       ┌──────────┼──────────┐
       ↓          ↓          ↓
     News       Crime      Alerts
       │          │          │
       └──────────┼──────────┘
                  ↓
          Itinerary Engine
                  │
                  ↓
             AI Layer
                  │
                  ↓
          Personalized Plan
                  │
                  ↓
                 SOS
```

---

# Technology Stack

The exact stack may vary depending on the implementation, but the recommended architecture is:

### Frontend

* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express

or a Next.js server architecture.

### Database

* PostgreSQL
* Supabase

or another compatible database.

### Maps

* Leaflet
* OpenStreetMap
* Mapbox
* Google Maps

depending on the configured implementation.

### Charts

* Recharts

### Authentication

* Supabase Auth
* Firebase Authentication
* Auth.js / NextAuth

depending on the implementation.

---

# Project Architecture

A typical structure is:

```text
TSIS/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── database/
│   ├── migrations/
│   └── schemas/
│
├── public/
│
├── tests/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The actual project structure may differ.

Always check the current repository before changing the architecture.

---

# How to Fork the Project

If the project is hosted on GitHub, you can create your own copy using **Fork**.

### Step 1

Open the TSIS GitHub repository.

### Step 2

Click:

> **Fork**

### Step 3

Choose your GitHub account.

### Step 4

GitHub will create your own copy of the repository.

You can now modify the project without changing the original repository.

---

# How to Clone Your Fork

After forking:

```bash
git clone https://github.com/YOUR-USERNAME/TSIS.git
```

Enter the project:

```bash
cd TSIS
```

Install dependencies:

```bash
npm install
```

If the project has separate frontend/backend folders, install dependencies in each folder according to its `package.json`.

---

# Environment Variables

Create a `.env` file based on:

```text
.env.example
```

Typical variables may include:

```env
WEATHER_API_KEY=
NEWS_API_KEY=
MAP_API_KEY=
DATABASE_URL=
AUTH_SECRET=
AI_API_KEY=
```

The exact variables depend on which services are enabled in the project.

### NEVER commit your real `.env` file.

Your `.gitignore` should contain:

```text
.env
.env.local
.env.*.local
```

---

# Weather API Setup

Create an account with the weather provider used by the project.

Obtain the API key.

Add it to:

```env
WEATHER_API_KEY=your_key_here
```

Restart the development server after changing environment variables.

Do not hardcode the key in frontend code.

---

# News API Setup

Obtain an API key from the configured news provider.

Add:

```env
NEWS_API_KEY=your_key_here
```

If the API is unavailable, TSIS should show a graceful fallback rather than crashing.

---

# Maps Setup

Depending on the configured provider, add the appropriate key.

Example:

```env
MAP_API_KEY=your_key_here
```

Never expose secret server-side keys in frontend source code.

---

# Database Setup

If the project uses Supabase/PostgreSQL:

1. Create a database project.
2. Obtain the connection/configuration details.
3. Add them to `.env`.
4. Run the required migrations.
5. Configure authentication.
6. Configure row-level security where required.

Example:

```env
DATABASE_URL=your_database_connection
```

---

# Authentication Setup

Configure the authentication provider used by the project.

The system should support:

```text
Sign Up
   ↓
Login
   ↓
Authenticated Session
   ↓
User Dashboard
   ↓
Saved Trips
Travel History
Emergency Contacts
Preferences
```

Passwords must never be stored as plain text.

---

# AI API Setup

If the project uses an AI API:

Add the appropriate key:

```env
AI_API_KEY=your_key_here
```

The AI layer should be treated as an enhancement.

The core application must not completely break if the AI service becomes unavailable.

---

# Running TSIS Locally

After installing dependencies and configuring `.env`:

```bash
npm run dev
```

The terminal should provide the local development URL.

Usually this will be something similar to:

```text
http://localhost:3000
```

or:

```text
http://localhost:5173
```

The exact port depends on the project configuration.

---

# Production Build

Before deployment, create a production build:

```bash
npm run build
```

Then run:

```bash
npm start
```

The exact commands depend on the framework used.

---

# Testing

TSIS should be tested at both feature and integration levels.

Important test cases include:

### Destination Testing

Search:

```text
Digha
Kolkata
Jaipur
Udaipur
Darjeeling
Puri
Goa
```

Verify that the attractions belong to the correct geographic region.

---

### Negative Geographic Testing

For Digha:

```text
Red Fort
Howrah Bridge
India Gate
```

must not appear as normal Digha attractions.

For Jaipur:

```text
Victoria Memorial
Gateway of India
```

must not appear as Jaipur attractions.

---

### Weather Testing

Test:

* Valid API response
* Missing fields
* API failure
* No internet
* Extreme weather

---

### Authentication Testing

Test:

* Registration
* Login
* Logout
* Invalid password
* Session persistence
* Unauthorized access

---

### Travel History Testing

Test:

```text
Search destination
      ↓
NOT automatically visited
      ↓
Mark as visited
      ↓
Add date
      ↓
Save
      ↓
Logout
      ↓
Login
      ↓
History still exists
```

---

### SOS Testing

Test:

* No emergency contacts
* One contact
* Multiple contacts
* Location permission
* Location denied
* Calling
* Message preparation

---

# Demo Mode

TSIS can support a Demo Mode for demonstrations and development.

Demo Mode may use sample data when real APIs are unavailable.

However, demo data must always be clearly labeled:

> **DEMO DATA**

Never present mock information as real-time information.

---

# Security & Privacy

TSIS handles potentially sensitive information such as:

* User accounts
* Emergency contacts
* Location
* Travel history
* Saved trips

Therefore:

### API Keys

Never expose secret keys.

### Passwords

Never store plain-text passwords.

### Location

Do not store precise location unnecessarily.

### Emergency Contacts

Only the authenticated user should be able to access their contacts.

### Travel History

Only the authenticated user should be able to access their history.

### Database

Use authorization rules at the backend/database level.

Do not rely only on frontend restrictions.

---

# Important Limitations

TSIS is an **advisory travel intelligence system**, not an official government safety authority.

### Weather

Weather information comes from external APIs and may change.

### Crime Data

Historical crime data does not predict future crime.

### News

News coverage may be incomplete or delayed.

### Safety Score

The safety score is an informational risk assessment.

It is not:

> "This destination is officially safe."

### Tourist Attractions

Opening hours, ticket prices and availability can change.

Users should verify important information with official sources.

### SOS

Browser-based applications have limitations regarding automatic calling and SMS.

TSIS does not claim successful delivery unless it can actually confirm it.

---

# Future Improvements

Possible future versions of TSIS could include:

## AI Voice Travel Assistant

Allow users to speak naturally with TSIS.

---

## Real-Time Government Alerts

Integrate official disaster-management and tourism alerts.

---

## Live Crowd Information

Show crowd levels where reliable live data is available.

---

## Offline Mode

Allow users to access:

* Saved itinerary
* Emergency contacts
* Important destination information

without internet access.

---

## Multilingual Support

Support languages such as:

* English
* Hindi
* Bengali
* Spanish
* French
* Other major tourist languages

---

## Smart Transport Integration

Integrate:

* Public transport
* Cab services
* Railways
* Airports

where appropriate APIs are available.

---

## Emergency Location Sharing

Improve the SOS system with verified emergency-service integrations.

---

## Personalized Travel Intelligence

Over time, TSIS could learn from explicit user preferences to improve itinerary recommendations.

---

# Contribution Guide

Contributions are welcome.

### Step 1

Fork the repository.

### Step 2

Clone your fork.

```bash
git clone https://github.com/YOUR-USERNAME/TSIS.git
```

### Step 3

Create a new branch.

```bash
git checkout -b feature/your-feature
```

### Step 4

Make your changes.

### Step 5

Test everything.

```bash
npm test
```

or use the project's configured test command.

### Step 6

Commit your changes.

```bash
git add .
git commit -m "Add: your feature"
```

### Step 7

Push the branch.

```bash
git push origin feature/your-feature
```

### Step 8

Create a Pull Request.

---

# Reporting Bugs

When reporting a bug, provide:

### 1. What happened?

Example:

> Digha itinerary showed Howrah Bridge.

### 2. What should have happened?

> Only Digha and relevant nearby attractions should have been recommended.

### 3. Steps to reproduce

```text
1. Open TSIS
2. Go to Plan My Trip
3. Enter Digha
4. Select 3 days
5. Generate itinerary
```

### 4. Environment

```text
OS:
Browser:
Node version:
TSIS version:
```

### 5. Screenshots

Include screenshots where possible.

---

# Troubleshooting

## Application doesn't start

Try:

```bash
npm install
```

Then:

```bash
npm run dev
```

---

## API isn't working

Check:

```text
.env
```

Make sure the API key is correct.

Then restart the development server.

---

## Database isn't connecting

Check:

* Database URL
* Credentials
* Network access
* Migrations
* Database status
```,Description:
