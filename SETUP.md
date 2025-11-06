# 🚀 Setup Guide - Montreal Transit Explorer

## Quick Start (5 minutes)

### Step 1: Get API Keys

#### 1️⃣ Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Distance Matrix API
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

**⚠️ Important: Restrict your key!**
```
Application restrictions → HTTP referrers
Add: 
- http://localhost:* (for development)
- https://yourdomain.com/* (for production)
```

#### 2️⃣ WeatherAPI.com Key
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Go to your [dashboard](https://www.weatherapi.com/my/)
3. Copy your API key
4. Free tier: 1,000,000 calls/month ✅

---

### Step 2: Configure Your App

#### 📝 Edit `index.html` (Line 22)
Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual Google Maps key:

```html
<!-- Before -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initAutocomplete" async defer></script>

<!-- After -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAaBbCcDdEeFfGg-HhIiJjKkLlMmNnOoPp&libraries=places&callback=initAutocomplete" async defer></script>
```

#### 🔐 Create `.env` file
In the project root, create a file named `.env`:

```bash
# Create the file
touch .env
```

Add your WeatherAPI key:
```env
VITE_WEATHERAPI_KEY=your_actual_weatherapi_key_here
```

**Example:**
```env
VITE_WEATHERAPI_KEY=abc123def456ghi789jkl012mno345pqr
```

---

### Step 3: Run the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser to `http://localhost:3000`

---

## 🔒 Security Notes

### ⚠️ About API Key Exposure

This is a **client-side app**, so API keys are visible in the browser. This is **normal and expected** for:
- Google Maps API (designed for client-side use)
- WeatherAPI.com (free tier with rate limits)

### ✅ How to Protect Yourself

1. **Google Maps Key Restrictions**
   - Set HTTP referrer restrictions
   - Enable only needed APIs
   - Set daily quotas

2. **Monitor Usage**
   - Check [Google Cloud Console](https://console.cloud.google.com/) regularly
   - Check [WeatherAPI Dashboard](https://www.weatherapi.com/my/) regularly

3. **Rate Limits (Free Tiers)**
   - WeatherAPI: 1M calls/month
   - Google Maps: $200/month credit (covers ~28K loads)

### 🚨 When You Need a Backend

If you're worried about key exposure, you can use serverless functions to proxy API calls. See `README.md` for details.

---

## 🔧 Troubleshooting

### Error: `google is not defined`
- ✅ Make sure you replaced `YOUR_GOOGLE_MAPS_API_KEY` in `index.html`
- ✅ Check browser console for API loading errors
- ✅ Verify your API key has the required APIs enabled

### Error: `401 Unauthorized` (WeatherAPI)
- ✅ Create a `.env` file in the project root
- ✅ Add `VITE_WEATHERAPI_KEY=your_key_here`
- ✅ Restart the dev server (`npm run dev`)
- ✅ Verify your key at [WeatherAPI Dashboard](https://www.weatherapi.com/my/)

### Error: Map not loading
- Check browser console for errors
- Verify API key restrictions allow `localhost`
- Make sure all required APIs are enabled in Google Cloud Console

---

## 📦 Deployment

When you're ready to deploy:

```bash
# Build for production
npm run build

# The dist/ folder contains your static files
```

Deploy to:
- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: `vercel deploy`
- **GitHub Pages**: Push `dist/` to `gh-pages` branch
- **Any static host**: Upload `dist/` contents

**Remember:** Update HTTP referrer restrictions to include your production domain!

---

## ✅ Verification Checklist

- [ ] Google Maps API key added to `index.html`
- [ ] Google Maps API key restricted to your domains
- [ ] WeatherAPI key added to `.env` file
- [ ] All required Google APIs enabled
- [ ] Dev server running without errors
- [ ] Map loads successfully
- [ ] Weather widget appears
- [ ] Station search works

---

Need help? Check the [README.md](./README.md) or open an issue on GitHub.

