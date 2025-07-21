// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// import { buildGeoJsonPoints, buildGeoJsonLines } from '../utils/geojsonBuilders';

// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

// type FeatureWithProps = {
//   id: string | number;
//   source: string;
//   properties: Record<string, any>;
// };

// const MapboxExample: React.FC = () => {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const [selectedFeature, setSelectedFeature] = useState<FeatureWithProps | null>(null);
//   const selectedFeatureRef = useRef<FeatureWithProps | null>(null);

//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current as HTMLElement,
//       center: [0, 20],
//       zoom: 1.5,
//       projection: 'globe',
//       style: 'mapbox://styles/mapbox/satellite-streets-v12',
//     });

//     mapRef.current = map;

//     const pointGeoJson = buildGeoJsonPoints();
//     const lineGeoJson = buildGeoJsonLines();

//     map.on('load', () => {
//       map.addSource('datacenters', {
//         type: 'geojson',
//         data: pointGeoJson,
//       });

//       map.addSource('latency-lines', {
//         type: 'geojson',
//         data: lineGeoJson,
//       });

//       map.addLayer({
//         id: 'latency-lines-layer',
//         type: 'line',
//         source: 'latency-lines',
//         layout: {
//           'line-cap': 'round',
//           'line-join': 'round',
//         },
//         paint: {
//           'line-color': '#00ffff',
//           'line-width': 2,
//           'line-dasharray': [2, 4],
//           'line-opacity': 0.5,
//         },
//       });

//       map.addLayer({
//         id: 'datacenter-layer',
//         type: 'circle',
//         source: 'datacenters',
//         paint: {
//           'circle-color': [
//             'case',
//             ['boolean', ['feature-state', 'selected'], false],
//             '#f00',
//             '#4264fb',
//           ],
//           'circle-radius': [
//             'case',
//             ['boolean', ['feature-state', 'selected'], false],
//             10,
//             ['boolean', ['feature-state', 'highlight'], false],
//             8,
//             6,
//           ],
//           'circle-stroke-width': 2,
//           'circle-stroke-color': '#ffffff',
//         },
//       });

//       // Click on feature
//       map.on('click', 'datacenter-layer', (e) => {
//         const feature = e.features?.[0];
//         if (!feature || feature.properties?.id == null) return;

//         if (selectedFeatureRef.current) {
//           map.setFeatureState(
//             {
//               source: 'datacenters',
//               id: selectedFeatureRef.current.id,
//             },
//             { selected: false }
//           );
//         }

//         map.setFeatureState(
//           {
//             source: 'datacenters',
//             id: feature.properties.id,
//           },
//           { selected: true }
//         );

//         setSelectedFeature({
//           id: feature.properties.id,
//           source: 'datacenters',
//           properties: feature.properties,
//         });
//       });

//       // Deselect on background click
//       map.on('click', (e) => {
//         const features = map.queryRenderedFeatures(e.point, {
//           layers: ['datacenter-layer'],
//         });
//         if (features.length === 0 && selectedFeatureRef.current) {
//           map.setFeatureState(
//             {
//               source: 'datacenters',
//               id: selectedFeatureRef.current.id,
//             },
//             { selected: false }
//           );
//           setSelectedFeature(null);
//         }
//       });

//       // Hover state
//       map.on('mouseenter', 'datacenter-layer', (e) => {
//         map.getCanvas().style.cursor = 'pointer';
//         const feature = e.features?.[0];
//         if (feature?.properties?.id != null) {
//           map.setFeatureState(
//             {
//               source: 'datacenters',
//               id: feature.properties.id,
//             },
//             { highlight: true }
//           );
//         }
//       });

//       map.on('mouseleave', 'datacenter-layer', (e) => {
//         map.getCanvas().style.cursor = '';
//         const feature = e.features?.[0];
//         if (feature?.properties?.id != null) {
//           map.setFeatureState(
//             {
//               source: 'datacenters',
//               id: feature.properties.id,
//             },
//             { highlight: false }
//           );
//         }
//       });

//       // Line animation
//       let dashOffset = 0;
//       function animateLines() {
//         dashOffset -= 0.5;
//         // map.setPaintProperty('latency-lines-layer', 'line-dashar', dashedOffset);
//         requestAnimationFrame(animateLines);
//       }
//       animateLines();
//     });

//     return () => map.remove();
//   }, []);

//   useEffect(() => {
//     selectedFeatureRef.current = selectedFeature;
//   }, [selectedFeature]);

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
//       <div
//         className="map-overlay"
//         style={{
//           position: 'absolute',
//           right: 0,
//           top: 0,
//           width: '230px',
//           padding: '10px',
//           color: '#1a2224',
//           fontSize: '12px',
//           lineHeight: '20px',
//           fontFamily: 'sans-serif',
//         }}
//       >
//         {selectedFeature && (
//           <div
//             className="map-overlay-inner"
//             style={{
//               background: '#fff',
//               padding: '10px',
//               borderRadius: '3px',
//             }}
//           >
//             <code>{selectedFeature.properties?.location}</code>
//             <hr />
//             <ul>
//               {Object.entries(selectedFeature.properties || {}).map(([key, value]) => (
//                 <li key={key}>
//                   <b>{key}</b>: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MapboxExample;

// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// import { buildGeoJsonPoints, buildGeoJsonLines } from '@/utils/geojsonBuilders';
// import { setupLayers } from './MapLayer';
// import { setupInteractions } from './MapInteractions';
// import MapOverlay from './MapOverlay';
// import { generateLatencyData, TimeRange } from '@/data/latencySimulator';
// import { LatencyChart } from '@/components/LatencyChart';


// mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

// const MapboxExample: React.FC = () => {
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<mapboxgl.Map | null>(null);
//   const [selectedFeature, setSelectedFeature] = useState(null);
//   const selectedFeatureRef = useRef(null);


//   useEffect(() => {
//     const map = new mapboxgl.Map({
//       container: mapContainerRef.current as HTMLElement,
//       center: [0, 20],
//       zoom: 1.5,
//       projection: 'globe',
//       style: 'mapbox://styles/mapbox/satellite-streets-v12',
//     });

//     mapRef.current = map;

//     map.on('load', () => {
//       const pointGeoJson = buildGeoJsonPoints();
//       const lineGeoJson = buildGeoJsonLines();

//       map.addSource('datacenters', { type: 'geojson', data: pointGeoJson });
//       map.addSource('latency-lines', { type: 'geojson', data: lineGeoJson, lineMetrics: true });

//       setupLayers(map);
//       setupInteractions(map, setSelectedFeature, selectedFeatureRef);
//     });

//     return () => map.remove();
//   }, []);

//   useEffect(() => {
//     selectedFeatureRef.current = selectedFeature;
//   }, [selectedFeature]);

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
//       <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
//       <MapOverlay selectedFeature={selectedFeature} />
//     </div>
//   );
// };

// export default MapboxExample;


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

const MapboxExample: React.FC = () => {
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

    return () => map.remove();
  }, []);

  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);


return (
  <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

    {selectedConnection && (
        <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 5 }}>
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

export default MapboxExample;
