
import mapboxgl from 'mapbox-gl';

export function setupInteractions(
  map: mapboxgl.Map,
  setSelectedFeature: (f: any) => void,
  selectedFeatureRef: React.MutableRefObject<any>,
  setSelectedConnection: (pair: { sourceId: string; targetId: string } | null) => void,
  setHoveredFeature: (f: { id: string; location: string; provider: string; x: number; y: number } | null) => void
) {
  map.on('click', 'datacenter-layer', (e) => {
    const feature = e.features?.[0];
    if (!feature || feature.properties?.id == null) return;
    if (feature) {
      setSelectedFeature(feature);
      setSelectedConnection(null);
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


}
