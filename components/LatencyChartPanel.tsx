"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  downsampleData,
  generateLatencyData,
  LatencyDataPoint,
  TimeRange,
} from "@/utils/latencySimulator";
import { dataCenters } from "@/data/exchange_servers";

interface Props {
  sourceId?: string;
  targetId?: string;
}

const timeRanges: TimeRange[] = ["1h", "24h", "7d", "30d"];

const LatencyChartPanel: React.FC<Props> = ({ sourceId, targetId }) => {
  const availableNodes = useMemo(() => dataCenters.map((dc) => dc.id), []);

  const [selectedSource, setSelectedSource] = useState(sourceId || availableNodes[0]);
  const [selectedTarget, setSelectedTarget] = useState(
    targetId || availableNodes[1] || availableNodes[0]
  );
  const [timeRange, setTimeRange] = useState<TimeRange>("1h");
  const [latencyData, setLatencyData] = useState<LatencyDataPoint[]>([]);

  const generateAndSetLatencyData = useCallback(() => {
    if (selectedSource && selectedTarget) {
      const raw = generateLatencyData(selectedSource, selectedTarget, timeRange);
      const downsampled = downsampleData(raw);
      setLatencyData(downsampled);
    }
  }, [selectedSource, selectedTarget, timeRange]);

  useEffect(() => {
    generateAndSetLatencyData();
  }, [generateAndSetLatencyData]);

  // Auto Refresh Every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      generateAndSetLatencyData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [generateAndSetLatencyData]);

  const stats = useMemo(() => {
    const latencies = latencyData.map((d) => d.latency);
    if (latencies.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    return {
      min: Math.min(...latencies),
      max: Math.max(...latencies),
      avg: +(
        latencies.reduce((acc, val) => acc + val, 0) / latencies.length
      ).toFixed(2),
    };
  }, [latencyData]);

  return (
    <div className="w-full max-w-[300px] rounded-xl shadow-md text-sm text-white space-y-3">
      <h4 className="font-semibold text-base">Latency Trends</h4>
      <div className="flex gap-2 text-xs ">
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="flex-1 w-full px-2 py-1 thin-scrollbar rounded-[8px] bg-[#404040] text-white"
        >
          {availableNodes.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          className="flex-1 w-full px-2 py-1 thin-scrollbar rounded-[8px] bg-[#404040] text-white"
        >
          {availableNodes.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-[8px] transition ${
              timeRange === range
                ? "bg-pink-500 text-white"
                : "bg-[#404040] text-gray-300 hover:bg-pink-600 hover:text-white"
            }`}
          >
            {range}
          </button>
        ))}
      </div>
      <ResponsiveContainer className="-ml-5" width="100%" height={200}>
        <LineChart data={latencyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
            tick={{ fill: "#ccc", fontSize: 11 }}
          />
          <YAxis
            unit="ms"
            tick={{ fill: "#ccc", fontSize: 11 }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            labelFormatter={(ts) => new Date(ts).toLocaleString()}
            formatter={(value: number) => [`${value.toFixed(2)} ms`, "Latency"]}
            contentStyle={{
              backgroundColor: "#222",
              border: "none",
              borderRadius: 8,
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#ee15a6ff"
            strokeWidth={2}
            dot={{ r: 2, strokeWidth: 0.5 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-xs font-bold text-gray-300 -mt-4">
        <p>
          Min: <span style={{ color: "#09cc13ff" }}>{stats.min.toFixed(2)} ms</span>
        </p>
        <p>
          Max: <span style={{ color: "#f97316" }}>{stats.max.toFixed(2)} ms</span>
        </p>
        <p>
          Avg: <span style={{ color: "#e2f916ff" }}>{stats.avg} ms</span>
        </p>
      </div>
    </div>
  );
};

export default LatencyChartPanel;
