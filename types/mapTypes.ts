// types/mapTypes.ts

export type Latency = {
  aws: number;
  gcp: number;
  azure: number;
};

export type ServerLocation = {
  id: string;
  provider: 'AWS' | 'GCP' | 'Azure';
  location: string;
  coordinates: [number, number];
  latency: Latency;
  radius: number;
};

export type ArcConnection = {
  source: ServerLocation;
  target: ServerLocation;
  latency: number;
};

import { DeckProps } from '@deck.gl/core';

export type ExtendedDeckProps = DeckProps & { interleaved?: boolean };
