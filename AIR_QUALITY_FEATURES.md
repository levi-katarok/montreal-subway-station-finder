# 🌫️ Air Quality & Health-Conscious Routing

## Overview

The Montreal Transit Explorer now includes **real-time air quality monitoring** and **health-conscious routing** powered by WeatherAPI.com. This makes it unique among transit apps by prioritizing user health and well-being.

---

## 🎯 Key Features

### 1. **Real-Time Air Quality Data**
```typescript
interface AirQualityData {
  aqi: number;              // US EPA Air Quality Index (1-6)
  pm2_5: number;            // Fine particulate matter (μg/m³)
  pm10: number;             // Coarse particulate matter (μg/m³)
  o3: number;               // Ozone (μg/m³)
  no2: number;              // Nitrogen Dioxide (μg/m³)
  co: number;               // Carbon Monoxide (μg/m³)
  so2: number;              // Sulfur Dioxide (μg/m³)
  category: string;         // Good, Moderate, Unhealthy, etc.
  healthMessage: string;    // Personalized health advice
}
```

### 2. **Health-Based Route Recommendations**
The app now considers:
- **Air Quality Index (AQI)** - Prioritizes routes with better air
- **Weather Conditions** - Temperature, precipitation, visibility
- **Indoor Connections** - RESO underground city network
- **Sensitive Groups** - Special warnings for vulnerable populations

### 3. **Smart Travel Time Adjustments**
Travel times automatically adjust based on:
- Poor air quality → Slower walking speeds
- Extreme cold → Reduced mobility
- Heavy precipitation → Cautious travel
- Low visibility → Safer, slower navigation

---

## 📊 Air Quality Index (AQI) Scale

| AQI | Category | Color | Health Impact | Recommendation |
|-----|----------|-------|---------------|----------------|
| 1 | Good | 🟢 Green | None | All activities safe |
| 2 | Moderate | 🟡 Yellow | Minor for sensitive | Limit prolonged outdoor exposure |
| 3 | Unhealthy for Sensitive | 🟠 Orange | Sensitive groups affected | Use indoor routes |
| 4 | Unhealthy | 🔴 Red | Everyone affected | Avoid outdoor activities |
| 5 | Very Unhealthy | 🟣 Purple | Serious health effects | Stay indoors |
| 6 | Hazardous | 🟤 Maroon | Emergency conditions | Do not go outside |

---

## 🏥 Health-Conscious Features

### For Everyone
- Real-time AQI monitoring
- Air quality alerts
- Indoor route preferences
- Weather-adjusted travel times

### For Sensitive Groups
Special considerations for:
- 🫁 **Asthma sufferers** - Avoid high PM2.5/ozone
- 🤧 **Allergy sufferers** - Consider with pollen data (future)
- 👶 **Parents with strollers** - Prefer indoor, flat routes
- 👴 **Elderly** - Temperature and AQI warnings
- ♿ **Wheelchair users** - Accessible + indoor options
- 🏃 **Athletes** - Know when outdoor exercise is safe

---

## 🌡️ Combined Health Dashboard

The app shows:

```
Current Conditions:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🌡️ Temperature: -8°C (feels like -12°C)
🌫️ Air Quality: Moderate (AQI: 2)
💨 Wind: 15 km/h
👁️ Visibility: 8 km
☀️ UV Index: 1

Health Recommendation:
━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Moderate air quality. Sensitive individuals
   should limit prolonged outdoor exposure.

🏢 Prefer indoor routes via RESO system
🚇 Metro recommended over walking/biking
```

---

## 🗺️ Route Selection Logic

### Priority System

**Excellent Conditions** (AQI 1, 15-25°C):
```
Priority: Walking > Biking > Metro
Message: "Perfect weather for outdoor activities!"
```

**Moderate Conditions** (AQI 2, 5-15°C or 25-30°C):
```
Priority: Metro > Walking > Biking
Message: "Consider indoor routes if sensitive"
```

**Poor Conditions** (AQI 3+, <5°C or >30°C):
```
Priority: Metro (indoor) > Driving > Walking
Message: "Avoid prolonged outdoor exposure"
```

**Extreme Conditions** (AQI 4+, <-15°C):
```
Priority: Driving > Metro (indoor only) > Avoid outdoor
Message: "Health alert! Stay indoors if possible"
```

---

## 💻 API Integration

### WeatherAPI.com Endpoint
```typescript
const response = await fetch(
  `https://api.weatherapi.com/v1/current.json?` +
  `key=YOUR_API_KEY&` +
  `q=Montreal,Canada&` +
  `aqi=yes`
);
```

### Response Includes:
- Current temperature & feels-like
- Weather conditions
- **Air quality data (PM2.5, PM10, O₃, NO₂, CO, SO₂)**
- Wind speed & direction
- Visibility
- UV index
- Humidity

---

## 📱 User Experience

### Visual Indicators

**Air Quality Badge:**
```
🟢 Good (AQI: 1)
🟡 Moderate (AQI: 2)
🟠 Unhealthy for Sensitive (AQI: 3)
🔴 Unhealthy (AQI: 4)
```

**Health Warnings:**
```
⚠️ High pollution detected
💡 Consider indoor routes
✅ Excellent air quality
```

**Route Adjustments:**
```
Walking time: 15 min → 18 min
Reason: Poor air quality slows travel
Alternative: Metro (12 min, indoor)
```

---

## 🎨 UI Components

### 1. Health Dashboard Widget
```html
<div class="health-dashboard">
  <div class="aqi-indicator" style="background-color: #00e400">
    🟢 Good (AQI: 1)
  </div>
  <div class="pollutants">
    PM2.5: 8 μg/m³ (low)
    PM10: 15 μg/m³ (low)
    O₃: 45 μg/m³ (low)
    NO₂: 22 μg/m³ (low)
  </div>
  <div class="recommendation">
    ✅ Excellent air quality. All routes safe.
  </div>
</div>
```

### 2. Route Comparison with Health Scores
```
Route A: Walking (15 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━
🚶 100% outdoor exposure
🌫️ AQI: 2 (Moderate)
⚠️ Not recommended for sensitive groups

Route B: Metro (12 min) ⭐ RECOMMENDED
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 100% indoor/protected
🌫️ No air quality concerns
✅ Safe for all users
```

---

## 🧪 Example Scenarios

### Scenario 1: Good Air Quality Day
```typescript
{
  weather: {
    temperature: 20,
    condition: 'clear',
    airQuality: { aqi: 1, category: 'Good' }
  },
  recommendation: '✅ Perfect for walking or biking!',
  routePriority: ['walking', 'biking', 'metro']
}
```

### Scenario 2: High Pollution Day
```typescript
{
  weather: {
    temperature: 18,
    condition: 'clouds',
    airQuality: { aqi: 3, category: 'Unhealthy for Sensitive', pm2_5: 38 }
  },
  recommendation: '⚠️ High PM2.5. Use indoor routes.',
  routePriority: ['metro-indoor', 'driving', 'walking']
}
```

### Scenario 3: Winter Smog
```typescript
{
  weather: {
    temperature: -12,
    condition: 'clouds',
    airQuality: { aqi: 4, category: 'Unhealthy', pm2_5: 45, no2: 110 }
  },
  recommendation: '🚨 Poor air + cold. Stay indoors!',
  routePriority: ['metro-indoor-only', 'avoid-outdoor']
}
```

---

## 🔬 Pollutant Information

### PM2.5 (Fine Particulate Matter)
- **Size**: < 2.5 micrometers
- **Sources**: Vehicle exhaust, combustion, industrial emissions
- **Health Impact**: Penetrates deep into lungs and bloodstream
- **Safe Level**: < 12 μg/m³

### PM10 (Coarse Particulate Matter)
- **Size**: < 10 micrometers
- **Sources**: Dust, pollen, mold, construction
- **Health Impact**: Respiratory irritation
- **Safe Level**: < 50 μg/m³

### O₃ (Ozone)
- **Sources**: Sunlight + vehicle/industrial emissions
- **Health Impact**: Lung damage, asthma attacks
- **Safe Level**: < 100 μg/m³
- **Peak**: Summer afternoons

### NO₂ (Nitrogen Dioxide)
- **Sources**: Traffic, power plants
- **Health Impact**: Respiratory inflammation
- **Safe Level**: < 40 μg/m³

---

## 📈 Implementation Benefits

### For Users
- ✅ Healthier travel decisions
- ✅ Protection for vulnerable groups
- ✅ Real-time air quality awareness
- ✅ Personalized route recommendations

### For Montreal
- ✅ Reduced air pollution exposure
- ✅ Increased public transit usage on high-pollution days
- ✅ Better health outcomes
- ✅ Data-driven urban planning insights

### Unique Differentiator
- ❌ **Other transit apps**: Just show fastest route
- ✅ **This app**: Healthiest route based on air quality + weather

---

## 🚀 Future Enhancements

### Pollen Integration
```typescript
interface PollenData {
  tree: 'low' | 'medium' | 'high' | 'very high';
  grass: 'low' | 'medium' | 'high' | 'very high';
  weed: 'low' | 'medium' | 'high' | 'very high';
  dominant: string; // e.g., "birch", "ragweed"
}
```

### Historical Trends
- Show air quality patterns (rush hour, seasonal)
- "Best times to travel" recommendations
- "Avoid this route during peak pollution hours"

### Personal Health Profiles
```typescript
interface UserHealthProfile {
  conditions: ['asthma', 'allergies'];
  sensitivity: 'high' | 'moderate' | 'low';
  autoPreferIndoor: boolean;
}
```

### Air Quality Heatmap
- Visualize pollution levels across Montreal
- Identify cleanest routes
- Avoid high-pollution corridors

---

## 📊 API Usage & Costs

### WeatherAPI.com Pricing
- **Free Tier**: 1M calls/month
- **Pro Plus Trial**: 5M calls/month (trial until Nov 19, 2025)
- **Current Usage**: 0 calls made
- **Cache Duration**: 10 minutes (reduces API calls)

### Estimated Usage
- 1 user = 1 call per search
- 10-minute cache = max 6 calls/hour/user
- 1,000 daily users = ~6,000 calls/day
- **Well within free tier limits!**

---

## 🎓 Educational Value

The app teaches users:
- How air quality affects health
- What PM2.5, O₃, NO₂ mean
- When to avoid outdoor activities
- Benefits of indoor transit routes
- Connection between traffic and pollution

---

## 🏆 Competitive Advantage

| Feature | Google Maps | Citymapper | Transit | **Our App** |
|---------|-------------|------------|---------|-------------|
| Route Planning | ✅ | ✅ | ✅ | ✅ |
| Real-time Transit | ✅ | ✅ | ✅ | ⏳ Future |
| Weather Info | ✅ | ❌ | ❌ | ✅ |
| **Air Quality** | ❌ | ❌ | ❌ | ✅ |
| **Health Routing** | ❌ | ❌ | ❌ | ✅ |
| Indoor Routes | ❌ | ❌ | ❌ | ✅ |
| Accessibility | ✅ | ✅ | ✅ | ✅ |

**We're the ONLY transit app with air quality-based routing!** 🏆

---

## 📞 Technical Support

### API Documentation
- **WeatherAPI.com Docs**: https://www.weatherapi.com/docs/
- **Air Quality API**: https://www.weatherapi.com/docs/#apis-current

### Health Resources
- **US EPA AQI**: https://www.airnow.gov/aqi/aqi-basics/
- **WHO Air Quality Guidelines**: https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health

---

**This feature makes our app a health-first transit solution! 🏥🚇**
