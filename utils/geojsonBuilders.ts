import { dataCenters } from '../data/exchange_servers';
type CloudProvider = 'aws' | 'gcp' | 'azure';

export const buildGeoJsonPoints = (): GeoJSON.FeatureCollection => ({
  type: 'FeatureCollection',
  features: dataCenters.map(dc => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: dc.coordinates,
    },
    properties: {
      id: dc.id,
      provider: dc.provider,
      location: dc.location,
      latency: dc.latency,
      radius: dc.radius,
    },
  })),
});

export const buildGeoJsonLines = (): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = [];

  for (let i = 0; i < dataCenters.length; i++) {
    const source = dataCenters[i];

    for (let j = 0; j < dataCenters.length; j++) {
      const target = dataCenters[j];
      if (source.id === target.id) continue;

      const toProvider = target.provider.toLowerCase() as CloudProvider;
      const fromProvider = source.provider.toLowerCase() as CloudProvider;

      const latencyA = source.latency?.[toProvider];
      const latencyB = target.latency?.[fromProvider];

      const latency =
        latencyA !== undefined && latencyB !== undefined
          ? Math.round((latencyA + latencyB) / 2)
          : latencyA ?? latencyB ?? null;

      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [source.coordinates, target.coordinates],
        },
        properties: {
          sourceId: source.id,
          targetId: target.id,
          latency: latency,
        },
      });
    }
  }

  return {
    type: 'FeatureCollection',
    features,
  };
};
