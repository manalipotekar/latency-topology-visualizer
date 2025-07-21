type LatencyEntry = { timestamp: number; latency: number };

export function generateLatencyHistory(
  sourceId: string,
  targetId: string,
  timeRange: '1h' | '24h' | '7d' | '30d'
): LatencyEntry[] {
  const now = Date.now();
  let interval = 0;
  let points = 0;

  switch (timeRange) {
    case '1h':
      interval = 60 * 1000; // 1 min
      points = 60;
      break;
    case '24h':
      interval = 60 * 60 * 1000; // 1 hr
      points = 24;
      break;
    case '7d':
      interval = 6 * 60 * 60 * 1000; // 6 hr
      points = 28;
      break;
    case '30d':
      interval = 24 * 60 * 60 * 1000; // 1 day
      points = 30;
      break;
  }

  return Array.from({ length: points }).map((_, i) => ({
    timestamp: now - (points - i) * interval,
    latency: Math.floor(Math.random() * 50) + 10, // Random 10–60 ms
  }));
}
