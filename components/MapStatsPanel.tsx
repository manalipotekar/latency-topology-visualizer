"use client";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

type MapStatsPanelProps = {
  map: mapboxgl.Map | null;
};

const MapStatsPanel: React.FC<MapStatsPanelProps> = ({ map }) => {
  const [nodeCount, setNodeCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    if (!map) return;

    const updateStats = () => {
      const datacenterSource = map.getSource("datacenters") as mapboxgl.GeoJSONSource | undefined;
      const linesSource = map.getSource("latency-lines") as mapboxgl.GeoJSONSource | undefined;

      if (datacenterSource && linesSource) {
        // Ensure sources have data (loaded)
        const datacenterData = (datacenterSource as any)._data as GeoJSON.FeatureCollection;
        const linesData = (linesSource as any)._data as GeoJSON.FeatureCollection;

        setNodeCount(datacenterData?.features.length || 0);
        setConnectionCount(linesData?.features.length || 0);
      }
    };

    const onSourceData = (e: mapboxgl.MapSourceDataEvent) => {
      if (
        e.sourceId === "datacenters" &&
        map.isSourceLoaded("datacenters")
      ) {
        updateStats();
      }
      if (
        e.sourceId === "latency-lines" &&
        map.isSourceLoaded("latency-lines")
      ) {
        updateStats();
      }
    };

    map.on("sourcedata", onSourceData);

    return () => {
      map.off("sourcedata", onSourceData);
    };
  }, [map]);

  return (
    <div className="absolute top-2 right-12 border border-gray-700 z-50 bg-gray-900 bg-opacity-90 text-white text-sm rounded-lg shadow-md p-3">
      <h4 className="font-bold text-pink-400 mb-2">Map Stats</h4>
      <div>
        <span className="font-semibold">Nodes:</span> {nodeCount}
      </div>
      <div>
        <span className="font-semibold">Connections:</span> {connectionCount}
      </div>
    </div>
  );
};

export default MapStatsPanel;
