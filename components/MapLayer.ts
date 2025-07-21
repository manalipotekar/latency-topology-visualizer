import mapboxgl from 'mapbox-gl';

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
      ['<=', ['get', 'latency'], 100], '#00ff00',
      ['<=', ['get', 'latency'], 200], '#ffff00',
      '#ff0000'
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
  }


  });

  map.addLayer({
    id: 'datacenter-layer',
    type: 'circle',
    source: 'datacenters',
    paint: {
      'circle-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        '#f00',
        '#4264fb',
      ],
      'circle-radius': [
        'case',
        ['boolean', ['feature-state', 'selected'], false],
        10,
        ['boolean', ['feature-state', 'highlight'], false],
        8,
        6,
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });
}
