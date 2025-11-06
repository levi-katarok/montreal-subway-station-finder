# 🔧 Quick Fix for Your Current Errors

## Error 1: `google is not defined`

**Fix:** Add your Google Maps API key to `index.html`

1. **Get a Google Maps API key:**
   - Go to https://console.cloud.google.com/
   - Enable: Maps JavaScript API, Places API, Directions API, Distance Matrix API
   - Create an API key

2. **Edit `index.html` line 22:**
   ```html
   <!-- Replace YOUR_GOOGLE_MAPS_API_KEY with your actual key -->
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_KEY_HERE&libraries=places&callback=initAutocomplete" async defer></script>
   ```

---

## Error 2: `401 Unauthorized` (WeatherAPI)

**Fix:** Create a `.env` file with your WeatherAPI key

1. **Get a WeatherAPI.com key:**
   - Sign up at https://www.weatherapi.com/signup.aspx
   - Copy your API key from the dashboard

2. **Create `.env` file in project root:**
   ```bash
   # In the same folder as package.json
   touch .env
   ```

3. **Add your key to `.env`:**
   ```env
   VITE_WEATHERAPI_KEY=your_actual_weatherapi_key_here
   ```

4. **Restart the dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Start it again
   npm run dev
   ```

---

## ✅ Verification

After fixing both:
1. Refresh your browser
2. Check console - should see: `🚇 Montreal Transit Explorer initializing...`
3. No error messages
4. Map loads
5. Weather widget appears (if you have a valid key)

---

## 🔒 Important: Restrict Your API Keys!

### Google Maps Key
In Google Cloud Console → Credentials → Your API Key:
- **Application restrictions:** HTTP referrers
- **Add:**
  - `http://localhost:*`
  - `http://127.0.0.1:*`
  - `https://yourdomain.com/*` (when you deploy)

### WeatherAPI Key
- Free tier: 1,000,000 calls/month
- Monitor usage at: https://www.weatherapi.com/my/

---

**Need more help?** See [SETUP.md](./SETUP.md) for detailed instructions.

