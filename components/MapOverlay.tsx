import React from 'react';

const MapOverlay = ({ selectedFeature }: { selectedFeature: any }) => {
  if (!selectedFeature) return null;

  const { location, ...restProps } = selectedFeature.properties || {};

  return (
    <div className="absolute top-4 right-4 z-50 w-[250px] font-sans text-sm">
      <div className="bg-[#303030ff] text-white backdrop-blur-md rounded-xl shadow-xl p-4 opacity-90">
        <h3 className="text-base font-semibold border-b border-white/20 pb-1 mb-3">
          📍 {location}
        </h3>
        <ul className="space-y-2">
          {Object.entries(restProps).map(([key, value]) => (
            <li key={key}>
              <span className="text-gray-300 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>{' '}
              <span className="text-white break-words">
                {typeof value === 'object'
                  ? JSON.stringify(value, null, 1)
                  : String(value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapOverlay;
