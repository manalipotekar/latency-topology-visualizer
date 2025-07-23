
"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { buildGeoJsonPoints, buildGeoJsonLines } from '@/utils/geojsonBuilders';
import { setupLayers } from './MapLayer';
import { setupInteractions } from './MapInteractions';
import MapOverlay from './MapOverlay';
import LatencyChartPanel from './LatencyChartPanel';
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
      projection: 'globe',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
    });

    mapRef.current = map;

    map.on('load', () => {
      const pointGeoJson = buildGeoJsonPoints();
      const lineGeoJson = buildGeoJsonLines();

      map.addSource('datacenters', { type: 'geojson', data: pointGeoJson });
      map.addSource('latency-lines', { type: 'geojson', data: lineGeoJson, lineMetrics: true });

      setupLayers(map);
      setupInteractions(map, setSelectedFeature, selectedFeatureRef,setSelectedConnection);
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }), 'top-left');

    return () => map.remove();
  }, []);

  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);


return (
  <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

    {selectedConnection && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 5 }}>
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

