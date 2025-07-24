"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { buildGeoJsonPoints, buildGeoJsonLines } from "@/utils/geojsonBuilders";
import { setupLayers } from "./MapLayer";
import { setupInteractions } from "./MapInteractions";
import MapOverlay from "./MapOverlay";
import LatencyChartPanel from "./LatencyChartPanel";
import { arcLayer1 } from "./GlobeComponent";
// import { generateLatencyData, TimeRange } from '@/data/latencySimulator';

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
      // map.addSource('latency-lines', { type: 'geojson', data: lineGeoJson, lineMetrics: true });

      map.addSource("latency-lines", {
        type: "geojson",
        data: buildGeoJsonLines(),
        lineMetrics: true,
      });
      //  map.addLayer(arcLayer1);

      setupLayers(map);
      setupInteractions(
        map,
        setSelectedFeature,
        selectedFeatureRef,
        setSelectedConnection
      );
    });

    map.setBearing(30); // Rotate the globe

    map.addControl(new mapboxgl.NavigationControl(), "top-left");

    map.addControl(new mapboxgl.FullscreenControl(), "top-left");

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-left"
    );

    const updateLatencyData = () => {
      const updatedLines = buildGeoJsonLines(); // This should return new latency values
      const source = mapRef.current?.getSource(
        "latency-lines"
      ) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData(updatedLines);
      }
    };

    // Update every 7 seconds
    const intervalId = setInterval(updateLatencyData, 7000);

    // Cleanup interval when component unmounts
    return () => {
      clearInterval(intervalId);
      map.remove();
    };
  }, []);

  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      {selectedConnection && (
        <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 5 }}>
          <LatencyChartPanel
            sourceId={selectedConnection.sourceId}
            targetId={selectedConnection.targetId}
          />
        </div>
      )}
      <MapOverlay selectedFeature={selectedFeature} />
    </div>
  );
};

export default MapBoxExample;
