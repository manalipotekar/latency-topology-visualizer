'use client';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { generateLatencyHistory } from '../utils/latencySimulator';

type Props = {
  sourceId: string;
  targetId: string;
};

const LatencyChartPanel: React.FC<Props> = ({ sourceId, targetId }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('1h');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const history = generateLatencyHistory(sourceId, targetId, timeRange);
    setData(history);
  }, [sourceId, targetId, timeRange]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return timeRange === '1h'
      ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
      : `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      right: 10,
      width: 380,
      background: '#fff',
      borderRadius: 6,
      padding: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      fontFamily: 'sans-serif',
    }}>
      <h4 style={{ marginBottom: 8 }}>
        Latency: <code>{sourceId}</code> → <code>{targetId}</code>
      </h4>

      <select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value as any)}
        style={{ marginBottom: 12 }}
      >
        <option value="1h">Last 1 Hour</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
      </select>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            domain={['auto', 'auto']}
            type="number"
          />
          <YAxis unit="ms" />
          <Tooltip
            labelFormatter={(ts: any) => formatTime(ts)}
            formatter={(value: any) => [`${value} ms`, 'Latency']}
          />
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LatencyChartPanel;
