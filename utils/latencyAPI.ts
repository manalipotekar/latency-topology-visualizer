export async function fetchLatencyData() {
  // Simulate or fetch from Cloudflare Radar, etc.
  return [
    {
      source: "Binance",
      target: "Bybit",
      latency: Math.random() * 150,
    },
  ];
}
