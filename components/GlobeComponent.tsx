"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN";

export default function GlobeComponent() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      // style: "mapbox://styles/mapbox/satellite-v9",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      projection: "globe",
      center: [0, 0],
      zoom: 1.5,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      map.setFog({
        color: 'rgba(180, 200, 255, 0.3)',
        "high-color": 'rgba(36, 92, 223, 0.1)',
        "horizon-blend": 0.02,
        "space-color": 'rgba(0, 0, 0, 0)',
        "star-intensity": 0.5
      });

      map.setLight({
        anchor: "viewport",
        position: [1.5, 180, 80],
        color: 'rgba(32, 32, 32, 0)',
        intensity: 0.2
      });
    });

    return () => map.remove();
  }, []);

  const flyToTokyo = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [139.6917, 35.6895],
      zoom: 3,
      speed: 0.8,
      curve: 1.5,
      essential: true
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <div ref={mapContainer} className="absolute top-0 left-0 w-full h-full" />
      <button
        onClick={flyToTokyo}
        className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded shadow"
      >
        Fly to Tokyo
      </button>
    </div>
  );
}
