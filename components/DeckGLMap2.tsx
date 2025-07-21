"use client";
import {Map, Popup, useControl} from 'react-map-gl/mapbox';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {DeckProps} from '@deck.gl/core';
import {ArcLayer, GeoJsonLayer, ScatterplotLayer} from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import {dummyLocations} from "../data/exchange_servers"
import { useState } from 'react';
import ServerPopup from './ServerPopup';
import {
  Latency,
  ServerLocation,
  ArcConnection,
  ExtendedDeckProps
} from '../types/mapTypes';


const INITIAL_VIEW_STATE = {
  longitude: 10,
  latitude: 40,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};
const AIR_PORTS ='https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';

function DeckGLOverlay(props: ExtendedDeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({ interleaved: true, ...props }));
  overlay.setProps(props);
  return null;
}
// function DeckGLOverlay(props: ExtendedDeckProps) {
//   const overlay = useControl(() => new MapboxOverlay(props));
//   overlay.setProps(props);
//   return null;
// }

export default function DeckGLMap2() {
      const [hoverInfo, setHoverInfo] = useState<{
    object: ServerLocation;
    x: number;
    y: number;
  } | null>(null);
  const [selected, setSelected] = useState(null);


const arcLayer = new ArcLayer<ArcConnection>({
  id: 'latency-lines',
  data: dummyLocations.flatMap(source => {
    return dummyLocations
      .filter(dest => dest.id !== source.id)
      .map(dest => ({
        source,
        target: dest,
        latency: source.latency[dest.provider.toLowerCase() as keyof Latency]  ?? 100
      }));
  }),
  getSourcePosition: d => d.source.coordinates,
  getTargetPosition: d => d.target.coordinates,
  getSourceColor: d => {
    const latency = d.latency;
    if (latency < 30) return [0, 255, 0]; // Green
    if (latency < 70) return [255, 165, 0]; // Orange
    return [255, 0, 0]; // Red
  },
  getTargetColor: d => [0, 0, 255, 255],
  getWidth: 2.5,
  widthMinPixels: 2,
widthMaxPixels: 6,
getHeight: () => 300000, // 300km above surface

  greatCircle: true,
  pickable: false,
});

  const layers = [
    new ScatterplotLayer({
      id: 'marker-layer',
      data: dummyLocations,
      getPosition: d => d.coordinates,
      getRadius: 50000, // 100km radius
      getFillColor: d => {
        switch (d.provider) {
          case 'AWS':
            return [255, 0, 0, 200];
          case 'GCP':
            return [0, 255, 0, 200];
          case 'Azure':
            return [0, 0, 255, 200];
          default:
            return [255, 255, 255, 200];
        }
      },
      pickable: true,
      radiusMinPixels: 5,
      radiusMaxPixels: 30,
      beforeId: 'waterway-label',
      onHover: (info) => {
        if (info.object) {
          setHoverInfo({
            object: info.object,
            x: info.x ?? 0,
            y: info.y ?? 0,
          });
        } else {
          setHoverInfo(null);
        }
      },
    }),
    arcLayer, // Add the arc layer for latency lines
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        projection="globe"
        initialViewState={INITIAL_VIEW_STATE}
      >
      {hoverInfo && <ServerPopup server={hoverInfo.object} x={hoverInfo.x} y={hoverInfo.y} />}
      </Map>
    </div>
  );
}