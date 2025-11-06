// ============================================================================
// MAIN ENTRY POINT - Montreal Transit Explorer (React)
// ============================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚇 Montreal Transit Explorer initializing...');

// Check for API keys
const weatherKey = import.meta.env.VITE_WEATHERAPI_KEY;

if (!weatherKey || weatherKey === '7728de99273a4c0186e151255250511') {
  console.warn('⚠️ WeatherAPI key not configured!');
  console.log('📝 Create a .env file with: VITE_WEATHERAPI_KEY=your_key_here');
  console.log('📖 See SETUP.md for detailed instructions');
}

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

