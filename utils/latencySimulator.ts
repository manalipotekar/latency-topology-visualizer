export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface LatencyDataPoint {
  timestamp: number;
  latency: number;
}
export const downsampleData = (data: LatencyDataPoint[], maxPoints = 10) => {

  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
};


export function generateLatencyData(
  sourceId: string,
  targetId: string,
  range: TimeRange
): LatencyDataPoint[] {
  const now = Date.now();
  const intervals: Record<TimeRange, number> = {
    '1h': 60,
    '24h': 60 * 24,
    '7d': 60 * 24 * 7,
    '30d': 60 * 24 * 30,
  };

  const count = intervals[range];
  const data: LatencyDataPoint[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * 60 * 1000;
    const latency = 20 + Math.random() * 80;
    data.push({ timestamp, latency });
  }

  return data;
}
