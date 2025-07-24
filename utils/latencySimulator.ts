export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface LatencyDataPoint {
  timestamp: number; // Unix timestamp (ms)
  latency: number;   // Latency in ms
}

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
    const timestamp = now - i * 60 * 1000; // every minute
    const latency = 20 + Math.random() * 80; // random latency between 20ms and 100ms
    data.push({ timestamp, latency });
  }
  console.log(`Generated ${count} data points for ${sourceId} ➝ ${targetId} (${range})`);
  console.log("Latency data:", data);

  return data;
}
