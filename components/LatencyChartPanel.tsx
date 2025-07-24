"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  generateLatencyData,
  LatencyDataPoint,
  TimeRange,
} from "@/utils/latencySimulator";
interface Props {
  sourceId: string;
  targetId: string;
}

const timeRanges: TimeRange[] = ["1h", "24h", "7d", "30d"];

const LatencyChartPanel: React.FC<Props> = ({ sourceId, targetId }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1h");
  const [latencyData, setLatencyData] = useState<LatencyDataPoint[]>([]);

  useEffect(() => {
    const data = generateLatencyData(sourceId, targetId, timeRange);
    console.log("Generated latency data:", data);
    setLatencyData(data);
  }, [sourceId, targetId, timeRange]);

  const stats = {
    min: Math.min(...latencyData.map((d) => d.latency)),
    max: Math.max(...latencyData.map((d) => d.latency)),
    avg: +(
      latencyData.reduce((acc, d) => acc + d.latency, 0) / latencyData.length
    ).toFixed(2),
  };

  return (
    <div
      style={{
        background: "#303030ff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        width: 400,
        opacity: 0.8,
      }}
    >
      <h4 className="pb-1">
        Latency Trends: {sourceId} ➝ {targetId}
      </h4>

      {/* Time Range Selector */}
      <div className="mb-2  flex flex-wrap gap-2">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded cursor-pointer transition-opacity duration-200
        ${
          timeRange === range
            ? "bg-blue-600 text-white opacity-100"
            : "bg-gray-50 text-black opacity-70 hover:opacity-100"
        }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={latencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
          />
          <YAxis unit="ms" />
          <Tooltip
            labelFormatter={(ts) => new Date(ts).toLocaleString()}
            formatter={(value: number) => [`${value.toFixed(2)} ms`, "Latency"]}
            contentStyle={{
              backgroundColor: "#2f2f2f", // dark gray
              color: "#ffffff",
              borderRadius: "8px",
              border: "none",
            }}
            itemStyle={{
              color: "#ffffff",
            }}
          />

          <Line
            type="monotone"
            dataKey="latency"
            stroke="#0070f3"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div style={{ marginTop: 1, color: "#e7e7e7ff" }}>
        <p>
          <strong>Min:</strong> {stats.min.toFixed(2)} ms
        </p>
        <p>
          <strong>Max:</strong> {stats.max.toFixed(2)} ms
        </p>
        <p>
          <strong>Avg:</strong> {stats.avg} ms
        </p>
      </div>
    </div>
  );
};

export default LatencyChartPanel;
