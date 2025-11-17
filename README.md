# Montreal Bike Route Assistant 🚴‍♂️

An intelligent bike route planner for Montreal with AI-powered route suggestions, real-time safety scoring, elevation analysis, and air quality monitoring.

## ✨ Features

- 🤖 **AI-Powered Planning** - Chat with an LLM agent to find the perfect route
- 🗺️ **Smart Safety Scoring** - Routes rated 0-100 based on road types, traffic, and time of day
- ⛰️ **Elevation Profiles** - See hills before you ride them
- 🌬️ **Air Quality Data** - Real-time air quality monitoring
- 💬 **Streaming Chat** - Real-time responses with markdown formatting
- 🌍 **Bilingual** - Full support for English and French
- 📍 **Google Maps Integration** - Powered by MCP (Model Context Protocol)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun (package manager)
- OpenAI API Key - [Get one here](https://platform.openai.com/api-keys)
- Google Maps API Key - [Get one here](https://console.cloud.google.com/)

### Installation

```bash
# Install dependencies
bun install

# Create .env file in root
cat > .env << EOF
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
OPENAI_API_KEY=your_openai_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
EOF

# Start development servers
bun dev
```

This starts:
- **Frontend** at http://localhost:5173
- **API server** at http://localhost:3001

## 🏗️ Project Structure

```
montreal-bike-route-assistant/
├── apps/
│   ├── api/          # Express API server with LLM agent
│   └── client/       # React frontend (Vite)
├── packages/
│   └── shared/       # Shared TypeScript types
├── server/           # MCP server configuration
└── src/              # Legacy code (being migrated)
```

## 🧠 How Safety Score Works

Each route gets a safety score (0-100) based on:

- **Road Types** - Residential streets (+) vs highways (-)
- **Time of Day** - Daytime (+) vs rush hour/night (-)
- **Traffic Patterns** - Residential areas (+) vs major roads (-)
- **Route Warnings** - Google Maps safety warnings
- **Complexity** - Too many turns can be confusing

*The algorithm encourages longer rides through safer streets rather than shorter routes on busy roads.*

## 💻 Development

```bash
# Run everything
bun dev

# Run client only
cd apps/client && bun dev

# Run API only
cd apps/api && bun dev

# Type checking
bun run type-check

# Build for production
bun run build
```

## 🛠️ Tech Stack

- **Frontend** - React, TypeScript, Vite, Tailwind CSS
- **Backend** - Express, Node.js, TypeScript
- **AI** - OpenAI GPT-4o-mini via Vercel AI SDK 5.0
- **Maps** - Google Maps API + MCP Server
- **Package Manager** - Bun

## 📝 Key Commands

```bash
# Install package to client
bun add <package> --filter @montreal-bike-assistant/client

# Install package to API
bun add <package> --filter @montreal-bike-assistant/api

# Add to shared types
bun add <package> --filter @montreal-bike-assistant/shared
```

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your city!

## 📄 License

MIT

---

Built with ❤️ for Montreal cyclists
