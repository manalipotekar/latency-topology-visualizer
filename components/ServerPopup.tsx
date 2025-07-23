"use client";

import { Popup } from "react-map-gl/mapbox";

type Latency = {
  aws: number;
  gcp: number;
  azure: number;
};

type ServerLocation = {
  id: string;
  provider: "AWS" | "GCP" | "Azure";
  location: string;
  coordinates: [number, number];
  latency: Latency;
  radius: number;
};

type ServerPopupProps = {
  server: ServerLocation;
  x: number;
  y: number;
};

export default function ServerPopup({ server }: ServerPopupProps) {
  return (
    <Popup
      longitude={server.coordinates[0]}
      latitude={server.coordinates[1]}
      closeButton={false}
      closeOnClick={false}
      anchor="top"
    >
      <div className="text-sm bg-black text-white p-2 rounded shadow-lg">
        <strong className="text-white">{server.location}</strong>
        <br />
        Provider: {server.provider}
        <br />
        Latency (ms):
        <ul className="">
          <li>AWS: {server.latency.aws}</li>
          <li>GCP: {server.latency.gcp}</li>
          <li>Azure: {server.latency.azure}</li>
        </ul>
      </div>
    </Popup>
  );
}
