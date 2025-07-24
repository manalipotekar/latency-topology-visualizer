import { ArcLayer } from '@deck.gl/layers';
import { MapboxLayer } from "@deck.gl/mapbox";



// Example data
const arcs = [
  {
    sourcePosition: [139.6917, 35.6895],  // Tokyo
    targetPosition: [103.8198, 1.3521],   // Singapore
    color: [0, 255, 0],  // Green
    width: 2
  },
  // Add more arcs here
];

// Create ArcLayer
export const arcLayer1 = new MapboxLayer({
  id: 'arc-layer',
  type: ArcLayer,
  data: arcs,
  getSourcePosition: d => d.sourcePosition,
  getTargetPosition: d => d.targetPosition,
  getSourceColor: d => d.color,
  getTargetColor: d => d.color,
  getWidth: d => d.width,
  getHeight: 1000000,  // Elevation in meters (adjust as needed)
  greatCircle: true,
  pickable: true,
});
