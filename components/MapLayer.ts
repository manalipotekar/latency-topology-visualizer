import mapboxgl from 'mapbox-gl';

function animatePulse(map: mapboxgl.Map) {
  let phase = 0;

  function frame() {
    phase = (phase + 0.01) % 1;

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

    requestAnimationFrame(frame);
  }

  frame();
}



export function setupLayers(map: mapboxgl.Map) {
  map.addLayer({
    id: 'latency-lines-layer',
    type: 'line',
    source: 'latency-lines',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-width': 4,
      'line-opacity': 1,
      // base color per latency (fallback if gradient not supported)
      'line-color': [
        'case',
        ['==', ['get', 'latency'], null], '#888',
        ['<=', ['get', 'latency'], 100], '#00ff00',  // Green
        ['<=', ['get', 'latency'], 200], '#ffff00',  // Yellow
        '#ff0000'  // Red
      ],
      // this will be overwritten by animation
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0, 'rgba(255,255,255,0)',
        0.5, 'rgba(255,255,255,1)',
        1, 'rgba(255,255,255,0)'
      ],
    },
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
    id: 'latency-lines',
    type: 'line',
    source: 'latency-lines',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#ff8800', // Base color for lines
      'line-width': 2,
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
