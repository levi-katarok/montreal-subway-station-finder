# 🚇 Montreal Transit Explorer

A comprehensive, multi-modal journey planner for Montreal's public transit system with real-time weather integration.

> **🚀 Quick Start:** New to this app? Check out [SETUP.md](./SETUP.md) for a 5-minute setup guide!

w## ✨ Features

### 🎯 Core Features
- **Multi-Modal Journey Planning**: Combine walking, biking, metro, REM, commuter trains, buses, and driving
- **Weather Integration**: Real-time weather-based route recommendations
- **Bilingual Support**: Full French/English interface
- **Accessibility Focus**: Filter for wheelchair-accessible routes
- **Transfer Information**: Detailed platform-to-platform transfer times and directions

### 🚉 Transit Coverage
- **Montreal Metro**: All 4 lines (Green, Orange, Blue, Yellow)
- **REM (Réseau express métropolitain)**: New automated light rail system
- **Exo Commuter Trains**: Integration with regional rail
- **STM Buses**: Bus + Metro combinations
- **BIXI**: Bike share integration

### 🌤️ Weather Features
- Real-time weather conditions for Montreal
- Temperature-adjusted travel times
- Indoor route recommendations in bad weather
- Precipitation and wind speed considerations
- Weather-specific travel mode suggestions

### 🏗️ Advanced Features
- Save favorite locations
- Park-and-ride route suggestions
- Indoor connection mapping
- Accessibility filters
- Real-time distance calculations
- Multiple route alternatives with rankings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Google Maps API key
- WeatherAPI.com API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/montreal-subway-explorer.git
   cd montreal-subway-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   VITE_WEATHERAPI_KEY=your_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 🔑 API Keys

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Distance Matrix API
4. Create credentials (API Key)
5. Restrict the key to your domain (recommended)

### WeatherAPI.com
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Get a free API key from your dashboard
3. Free tier includes:
   - Current weather data
   - 1,000,000 calls/month
   - Real-time weather updates

## 📁 Project Structure

```
montreal-transit-explorer/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── data/            # Station data, line info, transfers
│   ├── services/        # Weather, maps, multi-modal planning
│   ├── utils/           # Helpers, translations, storage
│   ├── components/      # UI components (future)
│   └── main.ts          # Application entry point
├── public/              # Static assets
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite build configuration
└── .env.example         # Environment variable template
```

## 🛠️ Tech Stack

- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Google Maps API**: Maps, places, directions
- **WeatherAPI.com**: Real-time weather data
- **LocalStorage**: Client-side data persistence

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow TypeScript best practices
2. Add types for all new functions/components
3. Write clear commit messages
4. Test on multiple browsers
5. Update documentation as needed

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- **STM (Société de transport de Montréal)** - Metro system data
- **ARTM** - REM and regional transit information
- **WeatherAPI.com** - Weather data API
- **Google Maps Platform** - Mapping and routing services

## 🗺️ Roadmap

- [ ] Real-time STM service alerts integration
- [ ] Route history and analytics
- [ ] Crowding predictions
- [ ] Station amenities database
- [ ] Voice navigation
- [ ] Offline mode with cached data
- [ ] Progressive Web App (PWA) support
- [ ] Integration with OPUS card balance

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: [your-email@example.com]

## 🏙️ About Montreal's Transit System

Montreal has one of the most extensive public transit systems in North America:
- **Metro**: 68 stations across 4 lines, opened 1966
- **REM**: New 67km automated light rail network
- **Exo**: 6 commuter train lines serving greater Montreal
- **STM Buses**: 200+ routes covering the city
- **BIXI**: 10,000+ bikes at 800+ stations

---

Made with ❤️ for Montreal residents and visitors
