import mapboxgl from 'mapbox-gl';

import { lineString } from '@turf/helpers';
import { greatCircle } from '@turf/turf';

const from = [139.6917, 35.6895]; // Tokyo
const to = [103.8198, 1.3521];   // Singapore

const arcLine = greatCircle(from, to, {
  properties: { color: '#00ff00' },
  npoints: 100, // more = smoother
});


function animatePulse(map: mapboxgl.Map) {
  let phase = 0;

  function frame() {
    phase = (phase + 0.015) % 1;

    const pulseExpression = [
      'interpolate',
      ['linear'],
      ['sin', ['*', phase, Math.PI * 2]],
      -1, 6,  // Minimum
      1, 12   // Maximum
    ];

    const opacityExpression = [
      'interpolate',
      ['linear'],
      ['sin', ['*', phase, Math.PI * 2]],
      -1, 0.6,
      1, 1
    ];

    // Animate only features where type === 'exchange'
    map.setPaintProperty('datacenter-layer', 'circle-radius', [
      'case',
      ['==', ['get', 'type'], 'exchange'], pulseExpression,
      6 // default
    ]);

    map.setPaintProperty('datacenter-layer', 'circle-opacity', [
      'case',
      ['==', ['get', 'type'], 'exchange'], opacityExpression,
      1 // default
    ]);
      phase = (phase + 0.005) % 1;  // Adjust speed here

  map.setPaintProperty('latency-lines-glow', 'line-gradient', [
    'interpolate',
    ['linear'],
    ['line-progress'],
    0, 'rgba(255,255,255,0)',
    phase, 'rgba(255,255,255,0.7)', // Main glow color
    Math.min(phase + 0.1, 1), 'rgba(255,255,255,0)'
  ]);

    requestAnimationFrame(frame);
  }

  frame();
}



export function setupLayers(map: mapboxgl.Map) {
  map.addSource('arc-line', {
        type: 'geojson',
        data: arcLine,
      });

  map.addLayer({
  id: 'arc-layer',
  type: 'line',
  source: 'arc-line',
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 2,
  },
});
  map.addLayer({
    id: 'latency-lines-layer',
    type: 'line',
    source: 'latency-lines',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-width': 2,
      'line-opacity': 0.7,
      // base color per latency (fallback if gradient not supported)
      'line-color': [
        'case',
        ['==', ['get', 'latency'], null], '#888',
        ['<=', ['get', 'latency'], 100], '#00ff00',  // Green
        ['<=', ['get', 'latency'], 200], '#ffff00',  // Yellow
        '#ff0000'  // Red
      ],
    },
  });
  map.addLayer({
  id: 'latency-lines-glow',
  type: 'line',
  source: 'latency-lines',
  layout: {
    'line-cap': 'round',
    'line-join': 'round',
  },
  paint: {
    'line-width': 3,  // Slightly wider than base
    'line-opacity': 0.7,
    'line-gradient': [
      'interpolate',
      ['linear'],
      ['line-progress'],
      0, 'rgba(255,255,255,0)',
      0.1, 'rgba(255,255,255,0.5)',
      0.5, 'rgba(255,255,255,1)',
      0.9, 'rgba(255,255,255,0.5)',
      1, 'rgba(255,255,255,0)'
    ]
  }
});


  map.addLayer({
    id: 'datacenter-layer',
    type: 'circle',
    source: 'datacenters',
    paint: {
      'circle-color': [
        'case',
        // If selected, color it red
        ['boolean', ['feature-state', 'selected'], false], '#f00',

        // Exchange server (highlight red if type === 'exchange')
        ['==', ['get', 'type'], 'exchange'], '#F44336',

        // AWS (yellow)
        ['==', ['get', 'provider'], 'AWS'], '#FFEB3B',
        // GCP (green)
        ['==', ['get', 'provider'], 'GCP'], '#4CAF50',
        // Azure (blue)
        ['==', ['get', 'provider'], 'Azure'], '#2196F3',

        // Default fallback color
        '#4264fb'
      ],

      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'selected'], false], 10,  // Larger for selected
        ['boolean', ['feature-state', 'highlight'], false], 8,  // Highlighted size
        6,  // Default size
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });

  
  map.addLayer({
  id: 'exchange-layer',
  type: 'circle',
  source: 'datacenters',
  filter: ['==', ['get', 'provider'], 'Exchange'],  // Filter to only exchange servers
  paint: {
    'circle-color': '#F44336', // Exchange color
    'circle-radius': 12,
    'circle-stroke-width': 3,
    'circle-stroke-color': '#FF5722',  // Glowing color for exchange
    'circle-opacity': 0.8,
  }
  
});
animatePulse(map);
}
