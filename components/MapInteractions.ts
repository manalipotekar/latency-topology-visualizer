
import mapboxgl from 'mapbox-gl';

export function setupInteractions(
  map: mapboxgl.Map,
  setSelectedFeature: (f: any) => void,
  selectedFeatureRef: React.MutableRefObject<any>,
  setSelectedConnection: (pair: { sourceId: string; targetId: string } | null) => void
) {
    let lastClickedId: string | null = null;

  map.on('click', 'datacenter-layer', (e) => {
    const feature = e.features?.[0];
    if (!feature || feature.properties?.id == null) return;
      // 👉 Handle connection logic
    if (feature) {
      setSelectedFeature(feature);
      setSelectedConnection(null); // clear any line selection
    }

    if (selectedFeatureRef.current) {
      map.setFeatureState(
        { source: 'datacenters', id: selectedFeatureRef.current.id },
        { selected: false }
      );
    }

    map.setFeatureState(
      { source: 'datacenters', id: feature.properties.id },
      { selected: true }
    );

    setSelectedFeature({
      id: feature.properties.id,
      source: 'datacenters',
      properties: feature.properties,
    });
  });

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['datacenter-layer'],
    });

    if (features.length === 0 && selectedFeatureRef.current) {
      map.setFeatureState(
        { source: 'datacenters', id: selectedFeatureRef.current.id },
        { selected: false }
      );
      setSelectedFeature(null);
    }
  });

  map.on('mouseenter', 'datacenter-layer', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const feature = e.features?.[0];
    if (feature?.properties?.id != null) {
      map.setFeatureState(
        { source: 'datacenters', id: feature.properties.id },
        { highlight: true }
      );
    }
  });

  map.on('mouseleave', 'datacenter-layer', (e) => {
    map.getCanvas().style.cursor = '';
    const feature = e.features?.[0];
    if (feature?.properties?.id != null) {
      map.setFeatureState(
        { source: 'datacenters', id: feature.properties.id },
        { highlight: false }
      );
    }
  });
  map.on('mouseenter', 'latency-lines-layer', () => {
  map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'latency-lines-layer', () => {
  map.getCanvas().style.cursor = '';
});
    map.on('click', 'latency-lines-layer', (e) => {
    const feature = e.features?.[0];
    if (feature?.properties?.sourceId && feature?.properties?.targetId) {
      console.log('Line clicked:', feature.properties);
      setSelectedConnection({
        sourceId: feature.properties.sourceId,
        targetId: feature.properties.targetId
      });
      setSelectedFeature(null); // clear any point selection
    }
  });

//   animatePulseLines();

function animatePulseLines() {
  let phase = 0;
  function frame() {
    phase = (phase + 0.015) % 1;

    map.setPaintProperty('latency-lines-layer', 'line-gradient', [
      'interpolate',
      ['linear'],
      ['line-progress'],
      0, 'rgba(207, 0, 0, 0)',
      phase, 'rgba(33, 29, 29, 1)',
      Math.min(phase + 0.1, 1), 'rgba(255,255,255,0)'
    ]);

    requestAnimationFrame(frame);
  }

  frame();
}


}
