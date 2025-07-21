import React from 'react';

const MapOverlay = ({ selectedFeature }: { selectedFeature: any }) => {
  if (!selectedFeature) return null;

  return (
    <div
      className="map-overlay"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: '230px',
        padding: '10px',
        color: '#1a2224',
        fontSize: '12px',
        lineHeight: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        className="map-overlay-inner"
        style={{
          background: '#fff',
          padding: '10px',
          borderRadius: '3px',
        }}
      >
        <code>{selectedFeature.properties?.location}</code>
        <hr />
        <ul>
          {Object.entries(selectedFeature.properties || {}).map(([key, value]) => (
            <li key={key}>
              <b>{key}</b>: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapOverlay;
