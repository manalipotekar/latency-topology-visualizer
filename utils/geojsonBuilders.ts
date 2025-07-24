import { dataCenters } from '../data/exchange_servers'; // Assuming data is imported from the right path
import { FeatureCollection, Feature, LineString } from 'geojson';
import * as turf from '@turf/turf';
type CloudProvider = 'aws' | 'gcp' | 'azure';

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

// export const buildGeoJsonLines = (): GeoJSON.FeatureCollection => {
//   const features: GeoJSON.Feature[] = [];
  
//   // Fetch latency data or use mock for now
//   const fetchData = async () => {
//     try {
//       const response = await fetch(`https://api.perfops.net/analytics/cloud/provider`);
//       const data = await response.json();
//       console.log("Fetched latency data:", data);
//       return data;
//     } catch (error) {
//       console.error('Error fetching latency data:', error);
//       return null;
//     }
//   };

//   const res = fetchData();  // Using async function

//   // Iterate through each combination of source and target data centers
//   for (let i = 0; i < dataCenters.length; i++) {
//     const source = dataCenters[i];

//     for (let j = 0; j < dataCenters.length; j++) {
//       const target = dataCenters[j];

//       // Skip if the source and target are the same
//       if (source.id === target.id) continue;

//       const toProvider = target.provider.toLowerCase() as CloudProvider;
//       const fromProvider = source.provider.toLowerCase() as CloudProvider;

//       // Get the latency data for the connection
//       const latencyA = source.latency?.[toProvider]; // Latency for target provider
//       const latencyB = target.latency?.[fromProvider]; // Latency for source provider

//       // Calculate average latency or null if not available
//       const latency =
//         latencyA !== undefined && latencyB !== undefined
//           ? Math.round((latencyA + latencyB) / 2) // Average latency
//           : latencyA ?? latencyB ?? null;

//       // Create the line feature for the connection between source and target
//       features.push({
//         type: 'Feature',
//         geometry: {
//           type: 'LineString',
//           coordinates: [source.coordinates, target.coordinates], // Connecting the source and target coordinates
//         },
//         properties: {
//           sourceId: source.id,
//           targetId: target.id,
//           latency: latency, // Store the calculated latency in the feature
//         },
//       });
//     }
//   }

//   return {
//     type: 'FeatureCollection',
//     features,
//   };
// };


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