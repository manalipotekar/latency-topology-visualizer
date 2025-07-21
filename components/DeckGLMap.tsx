"use client";
import {Map, Popup, useControl} from 'react-map-gl/mapbox';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {DeckProps} from '@deck.gl/core';
import {ScatterplotLayer} from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import {dummyLocations} from "../data/exchange_servers"
import { useState } from 'react';
import ServerPopup from './ServerPopup';

const INITIAL_VIEW_STATE = {
  longitude: 10,
  latitude: 40,
  zoom: 2,
  pitch: 0,
  bearing: 0,
};
type Latency = {
  aws: number;
  gcp: number;
  azure: number;
};

type ServerLocation = {
  id: string;
  provider: "AWS" | "GCP" | "Azure";
  location: string;
  coordinates: [number, number];
  latency: Latency;
  radius: number;
};

type ExtendedDeckProps = DeckProps & { interleaved?: boolean };

function DeckGLOverlay(props: ExtendedDeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({ interleaved: true, ...props }));
  overlay.setProps(props);
  return null;
}

export default function DeckGLMap() {
      const [hoverInfo, setHoverInfo] = useState<{
    object: ServerLocation;
    x: number;
    y: number;
  } | null>(null);

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
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Map
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        projection="globe"
        initialViewState={INITIAL_VIEW_STATE}
      >
        <DeckGLOverlay layers={layers} interleaved />

      {hoverInfo && <ServerPopup server={hoverInfo.object} x={hoverInfo.x} y={hoverInfo.y} />}
      </Map>
    </div>
  );
}