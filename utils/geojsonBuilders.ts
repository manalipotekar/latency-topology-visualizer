import { dataCenters } from '../data/exchange_servers'; // Assuming data is imported from the right path
import { FeatureCollection, Feature, LineString, Point } from 'geojson';
import * as turf from '@turf/turf';
type CloudProvider = 'aws' | 'gcp' | 'azure';

// Define the DataCenter type
type DataCenter = {
  id: string;
  provider: string;
  type: string;
  location: string;
  region: string;
  coordinates?: [number, number];
  latitude?: number;
  longitude?: number;
  latency?: { [key in CloudProvider]?: number };
};

export const buildGeoJsonPoints = (): GeoJSON.FeatureCollection => ({
  type: 'FeatureCollection',
  features: dataCenters.map(dc => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: dc.coordinates, // Coordinates will now be used directly
    },
    properties: {
      id: dc.id,
      provider: dc.provider,
      location: dc.location,
      latency: dc.latency, // Contains latency for aws, gcp, azure
      region: dc.region, // Region for the data center
      type: dc.type, // Type of the data center (e.g., cloud, exchange)
    },
  })),
});

export function buildGeoJsonLines(): FeatureCollection<LineString> {
  const exchanges = dataCenters.filter(dc => dc.type === 'exchange');
  const cloudRegions = dataCenters.filter(dc => dc.type === 'cloud');

  const features: Feature<LineString>[] = [];

  exchanges.forEach(exchange => {
    cloudRegions.forEach(cloud => {
      const latency = Math.floor(Math.random() * 300); // Simulated latency
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [exchange.coordinates, cloud.coordinates]
        },
        properties: {
          latency,
          sourceId: exchange.id,
          targetId: cloud.id,
          sourceProvider: exchange.provider,
          targetProvider: cloud.provider
        }
      });
    });
  });

  return {
    type: 'FeatureCollection',
    features
  };
}

export function buildGeoJsonFrom(data: DataCenter[]): FeatureCollection {
  const features: Feature<Point>[] = data
    .filter(dc => typeof dc.longitude === 'number' && typeof dc.latitude === 'number')
    .map((dc) => ({
      type: "Feature",
      properties: {
        id: dc.id,
        provider: dc.provider,
        type: dc.type,
        location: dc.location,
        region: dc.region,
      },
      geometry: {
        type: "Point",
        coordinates: [dc.longitude as number, dc.latitude as number],
      },
    }));

  return {
    type: "FeatureCollection",
    features,
  };
}