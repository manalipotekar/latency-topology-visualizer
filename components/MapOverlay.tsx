import React from 'react';

interface MapOverlayProps {
  selectedFeature?: {
    properties?: {
      id?: string;
      provider?: string;
      location?: string;
      type?: string;
      region?: string;
      latency?: string;
    };
  } | null;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ selectedFeature }) => {
  if (!selectedFeature) return null;

  const properties = selectedFeature.properties || {};
  const { id, provider, location, type, region, latency } = properties;

  const latencyNode: React.ReactNode = (() => {
    try {
      const parsed = JSON.parse(latency || '{}');
      return (
        <ul className="pl-4 list-disc list-inside">
          {Object.entries(parsed).map(([key, val]) => (
            <li key={key}>
              {key.toUpperCase()}: {String(val)}ms
            </li>
          ))}
        </ul>
      );
    } catch {
      return 'N/A';
    }
  })();

  const displayFields: { label: string; value: React.ReactNode }[] = [
    {
      label: 'Exchange Name',
      value: `${provider} - ${location} (${id})`,
    },
    {
      label: 'Cloud Provider',
      value: provider,
    },
    ...(type === 'cloud'
      ? [{ label: 'Region', value: region }]
      : []),
    ...(type === 'exchange'
      ? [{ label: 'Latency (ms)', value: latencyNode }]
      : []),
  ];

  return (
    <div className="absolute top-4 right-4 z-50 w-[250px] font-sans text-sm">
      <div className="bg-[#303030ff] text-white backdrop-blur-md rounded-xl shadow-xl p-4 opacity-90">
        <h3 className="text-base font-semibold border-b border-white/20 pb-1 mb-3">
          📍 {location}
        </h3>
        <ul className="space-y-2">
          {displayFields.map(({ label, value }) => (
            <li key={label}>
              <span className="text-gray-300 font-semibold">{label}:</span>{' '}
              <span className="text-white break-words">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapOverlay;
