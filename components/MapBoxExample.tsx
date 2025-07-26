"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { buildGeoJsonPoints, buildGeoJsonLines, buildGeoJsonFrom } from "@/utils/geojsonBuilders";
import { setupLayers } from "./MapLayer";
import { setupInteractions } from "./MapInteractions";
import MapOverlay from "./MapOverlay";
import { getProviderColor } from "@/utils/utils";
import MapControlPanel from "./SidePanel";
import { dataCenters } from "@/data/exchange_servers";
import MapStatsPanel from "./MapStatsPanel";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const MapBoxExample: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const selectedFeatureRef = useRef(null);
  const [selectedConnection, setSelectedConnection] = useState<{
    sourceId: string;
    targetId: string;
  } | null>(null);

  const [hoveredFeature, setHoveredFeature] = useState<{
    id: string;
    location: string;
    provider: string;
    x: number;
    y: number;
  } | null>(null);

  const [toggles, setToggles] = useState({
  realTime: true,
  historical: true,
  regions: false
});

const handleToggleChange = (key: string, value: boolean) => {
  setToggles((prev) => ({ ...prev, [key]: value }));

  if (mapRef.current) {
    mapRef.current.setLayoutProperty(
      key === "historical" ? "latency-lines-layer" : "some-layer",
      "visibility",
      value ? "visible" : "none"
    );
  }
};

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [0, 20],
      zoom: 1.5,
      projection: "globe",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
    });

    mapRef.current = map;

    map.on("load", () => {
      const pointGeoJson = buildGeoJsonPoints();
      const lineGeoJson = buildGeoJsonLines();

      map.addSource("datacenters", { type: "geojson", data: pointGeoJson });
      map.addSource("latency-lines", {
        type: "geojson",
        data: lineGeoJson,
        lineMetrics: true,
      });

      setupLayers(map);
      setupInteractions(
        map,
        setSelectedFeature,
        selectedFeatureRef,
        setSelectedConnection,
        
      );
    });
    map.setBearing(30);
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );
    const updateLatencyData = () => {
      const updatedLines = buildGeoJsonLines();
      const source = mapRef.current?.getSource("latency-lines") as mapboxgl.GeoJSONSource;
      if (source) source.setData(updatedLines);
    };

    const intervalId = setInterval(updateLatencyData, 7000);

    map.on("mousemove", "datacenter-layer", (e) => {
      const feature = e.features?.[0];
      if (!feature?.properties) return;

      const { id, location, provider } = feature.properties;
      setHoveredFeature({
        id,
        location,
        provider,
        x: e.originalEvent.pageX,
        y: e.originalEvent.pageY,
      });
    });

    map.on("mouseleave", "datacenter-layer", () => {
      setHoveredFeature(null);
    });

    return () => {
      clearInterval(intervalId);
      map.remove();
    };
  }, []);

  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />

<MapControlPanel 
  onFilterChange={(filters: any) => {
  }}
  toggles={toggles}
  onToggleChange={handleToggleChange}
  selectedConnection={selectedConnection}
    onDataCenterSelect={({ longitude, latitude }) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 6.0,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }}
/>
      <div className="">

<MapStatsPanel map={mapRef.current} />
      </div>
<div className="">

      <MapOverlay selectedFeature={selectedFeature} />
</div>
      {hoveredFeature && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-md pointer-events-none"
          style={{
            top: hoveredFeature.y + 10,
            left: hoveredFeature.x + 10,
          }}
        >
          <div className="flex items-center gap-2 font-semibold">
  <span
    className="w-2.5 h-2.5 rounded-full inline-block"
    style={{ backgroundColor: getProviderColor(hoveredFeature.provider) }}
  />
  {hoveredFeature.id}
</div>

          <div>{hoveredFeature.location}</div>
          <div className="text-gray-300 text-xs">{hoveredFeature.provider}</div>
        </div>
      )}
    </div>
  );
};

export default MapBoxExample;
