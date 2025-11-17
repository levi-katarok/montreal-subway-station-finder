import { useRef, useEffect } from 'react';
import type { ElevationPoint } from '../types';

interface ElevationProfileProps {
  elevationData: ElevationPoint[];
  width?: number;
  height?: number;
  language: 'en' | 'fr';
}

export function ElevationProfile({ elevationData, width = 800, height = 200, language }: ElevationProfileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || elevationData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate bounds
    const elevations = elevationData.map(p => p.elevation);
    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);
    const elevRange = maxElev - minElev;
    const totalDistance = elevationData[elevationData.length - 1].distance;

    // Padding
    const padding = { top: 20, right: 40, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Helper functions
    const xScale = (distance: number) => padding.left + (distance / totalDistance) * chartWidth;
    const yScale = (elevation: number) => 
      padding.top + chartHeight - ((elevation - minElev) / elevRange) * chartHeight;

    // Draw background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (elevation)
    const numHorizontalLines = 5;
    for (let i = 0; i <= numHorizontalLines; i++) {
      const y = padding.top + (chartHeight / numHorizontalLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Label
      const elevation = maxElev - (elevRange / numHorizontalLines) * i;
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Lato, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(elevation)}m`, padding.left - 10, y + 4);
    }

    // Vertical grid lines (distance)
    const numVerticalLines = 5;
    for (let i = 0; i <= numVerticalLines; i++) {
      const x = padding.left + (chartWidth / numVerticalLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      // Label
      const distance = (totalDistance / numVerticalLines) * i / 1000; // Convert to km
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px Lato, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${distance.toFixed(1)}km`, x, height - padding.bottom + 20);
    }

    // Draw elevation area
    ctx.beginPath();
    ctx.moveTo(xScale(0), height - padding.bottom);
    
    elevationData.forEach((point, index) => {
      const x = xScale(point.distance);
      const y = yScale(point.elevation);
      
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.lineTo(xScale(totalDistance), height - padding.bottom);
    ctx.closePath();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw elevation line
    ctx.beginPath();
    elevationData.forEach((point, index) => {
      const x = xScale(point.distance);
      const y = yScale(point.elevation);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Lato, sans-serif';
    
    // Y-axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(language === 'en' ? 'Elevation (m)' : 'Élévation (m)', 0, 0);
    ctx.restore();

    // X-axis label
    ctx.textAlign = 'center';
    ctx.fillText(language === 'en' ? 'Distance (km)' : 'Distance (km)', width / 2, height - 5);

  }, [elevationData, width, height, language]);

  if (elevationData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[150px] bg-black/50 rounded-lg border border-white/10">
        <p className="text-white/60 text-sm">
          {language === 'en' ? 'No elevation data available' : 'Aucune donnée d\'élévation disponible'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/50 rounded-lg p-2 border border-white/10">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  );
}

