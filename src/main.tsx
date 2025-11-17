// ============================================================================
// MAIN ENTRY POINT - Montreal Transit Explorer (React)
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚴 Montreal Bike Route Assistant initializing...');

// Load Google Maps API dynamically with environment variable
const loadGoogleMaps = () => {
  return new Promise<void>((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('❌ VITE_GOOGLE_MAPS_API_KEY not found in environment variables');
      console.log('📝 Add VITE_GOOGLE_MAPS_API_KEY=your_key to your .env file');
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      console.log('✅ Google Maps already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,elevation`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('✅ Google Maps API loaded');
      resolve();
    };

    script.onerror = () => {
      console.error('❌ Failed to load Google Maps API');
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });
};

// Initialize app
const initApp = async () => {
  try {
    // Load Google Maps first
    await loadGoogleMaps();

    // Render React app
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } else {
      console.error('❌ Root element not found!');
    }
  } catch (error) {
    console.error('❌ Initialization failed:', error);

    // Show error message to user
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: black; color: white; font-family: 'Lato', sans-serif; text-align: center; padding: 20px;">
          <div>
            <h1 style="font-size: 2em; margin-bottom: 20px;">⚠️ Configuration Error</h1>
            <p style="margin-bottom: 10px;">Google Maps API key not configured.</p>
            <p style="opacity: 0.7;">Add <code style="background: #333; padding: 2px 8px; border-radius: 4px;">VITE_GOOGLE_MAPS_API_KEY</code> to your .env file</p>
          </div>
        </div>
      `;
    }
  }
};

// Start initialization
initApp();

