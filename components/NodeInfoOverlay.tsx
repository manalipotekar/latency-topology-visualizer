import React from 'react';

interface NodeInfoOverlayProps {
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


const NodeInfoOverlay: React.FC<NodeInfoOverlayProps> = ({ selectedFeature }) => {
  if (!selectedFeature) return null;

  const properties = selectedFeature.properties || {};
  const { id, provider, location, type, region, latency } = properties;
    const exchangeName =
    type === 'exchange'
      ? id
      : `${provider} - ${location}`;

const latencyNode: React.ReactNode = (() => {
  try {
    const parsed = JSON.parse(latency || '{}');
    const getColorClass = (key: string): string => {
      switch (key.toLowerCase()) {
        case 'aws':
          return 'bg-yellow-400';
        case 'gcp':
        case 'google':
          return 'bg-green-400';
        case 'azure':
          return 'bg-blue-400';
        default:
          return 'bg-gray-400';
      }
    };

    return (
      <ul className="pl-2 space-y-1">
        {Object.entries(parsed).map(([key, val]) => (
          <li key={key} className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${getColorClass(key)}`}></span>
            <span className="text-white">{key.toUpperCase()}: {String(val)}ms</span>
          </li>
        ))}
      </ul>
    );
  } catch {
    return 'N/A';
  }
})();


  const displayFields: { label: string; value: React.ReactNode }[] = [
    { label: 'Exchange Name', value: exchangeName },
    { label: 'Cloud Provider', value: provider },
    ...(type === 'cloud'
      ? [{ label: 'Region', value: region }]
      : []),
    ...(type === 'exchange'
      ? [{ label: 'Latency (ms)', value: latencyNode }]
      : []),
  ];

  return (
    <div className="hidden md:block absolute bottom-10 right-4 z-50 font-sans text-sm ">
      <div className="bg-gray-900 border border-gray-700 text-white backdrop-blur-md rounded-xl shadow-xl p-4 opacity-90">
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

export default NodeInfoOverlay;
