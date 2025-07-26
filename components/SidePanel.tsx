"use client";
import React, { useState, useMemo } from "react";
import { dataCenters } from "@/data/exchange_servers"; // Adjust path
import LatencyChartPanel from "./LatencyChartPanel";
import { getProviderColor } from "@/utils/utils"; // Adjust path if needed

type MapControlPanelProps = {
  onFilterChange?: (filters: {
    type: string;
    provider: string;
    search: string;
    filtered: typeof dataCenters;
  }) => void;
  onDataCenterSelect?: (coords: { longitude: number; latitude: number }) => void;

  toggles?: Record<string, boolean>;
  onToggleChange: (layer: string, checked: boolean) => void;
  selectedConnection: {
    sourceId: string;
    targetId: string;
  } | null;
};

const TABS = ["Legend", "Filters", "Performance"];

const MapControlPanel: React.FC<MapControlPanelProps> = ({
  onFilterChange,
  toggles,
  onToggleChange,
  selectedConnection,
  onDataCenterSelect,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [latencyRange, setLatencyRange] = useState([0, 100]);
  const [activeTab, setActiveTab] = useState("Legend");
  const [collapsed, setCollapsed] = useState(false);


  const uniqueProviders = useMemo(() => {
    const providers = new Set(dataCenters.map((d) => d.provider));
    return Array.from(providers);
  }, []);

  const filteredData = useMemo(() => {
    return dataCenters.filter((dc) => {
      const matchesSearch =
        dc.location.toLowerCase().includes(search.toLowerCase()) ||
        dc.region?.toLowerCase().includes(search.toLowerCase()) ||
        dc.id?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "all" || dc.type.toLowerCase() === typeFilter;

      const matchesProvider =
        providerFilter === "all" || dc.provider === providerFilter;

      const withinLatencyRange = Object.values(dc.latency).some(
        (val) => val >= latencyRange[0] && val <= latencyRange[1]
      );

      return (
        matchesSearch && matchesType && matchesProvider && withinLatencyRange
      );
    });
  }, [search, typeFilter, providerFilter, latencyRange]);

  const handleFilterChange = () => {
    onFilterChange?.({
      type: typeFilter,
      provider: providerFilter,
      search,
      filtered: filteredData,
    });
  };

  return (
    <>
    <div
  onClick={() => setCollapsed(!collapsed)}
  className={`absolute z-10 left-1/2 transform -translate-x-1/2  cursor-pointer bg-gray-600 rounded-full w-12 h-1.5
  ${collapsed ? "mb-2" : "mb-2"}
  `}
></div>

<div
  className={`
    absolute z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm border border-gray-700
    text-white rounded-xl shadow-lg font-sans text-sm overflow-y-auto thin-scrollbar
    transition-all duration-300 ease-in-out
    
    w-full ${collapsed ? "h-14" : "h-1/2"} bottom-0 left-0
    lg:w-[310px] lg:h-auto lg:top-2 lg:left-2
    `}
>
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
 className={`flex-1 px-3 py-2 text-sm font-medium transition-all ${
  activeTab === tab
    ? "bg-gray-700 text-gray-100 border-b-1 border-pink-500"
    : "bg-gray-900 text-gray-50 hover:bg-gray-800"
}`}

            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-y-auto space-y-2 thin-scrollbar">
          {activeTab === "Legend" && (
            <>
              <h4 className="font-semibold text-base text-white-200">
                Cloud Providers
              </h4>
              <ul className="space-y-1">
                {["AWS", "GCP", "Azure"].map((provider) => (
                  <li key={provider} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getProviderColor(provider) }}
                    ></span>
                    {provider}
                  </li>
                ))}
              </ul>
              <hr className="border-gray-700" />

              <h4 className="font-semibold text-base mt-4 text-white-400">
                Latency Line Colors
              </h4>
              <ul className="space-y-1">
                <li>
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2" />{" "}
                  Low (&lt; 30ms)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2" />{" "}
                  Medium (30–60ms)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2" />{" "}
                  High (&gt; 60ms)
                </li>
              </ul>
              {/* Uncomment and style if needed */}
              <hr className="border-gray-700" />

              
                <LatencyChartPanel
                  sourceId={selectedConnection?.sourceId}
                  targetId={selectedConnection?.targetId}
                />
            
            </>
          )}

          {activeTab === "Filters" && (
            <>
              <input
                type="text"
                placeholder="Search by name/region"
                className="w-full px-2 py-1  rounded bg-gray-800  text-white-400 placeholder-gray-400"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange();
                }}
              />

              <div className="flex gap-2">
                <div>
                  <label className="block mb-1 px-1 font-semibold text-white-400">
                    Type
                  </label>
                  <select
                    className="w-full px-2 py-1 rounded bg-gray-800 text-gray-100"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      handleFilterChange();
                    }}
                  >
                    <option value="all">All</option>
                    <option value="cloud">Cloud</option>
                    <option value="exchange">Exchange</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 px-1 font-semibold text-white-400">
                    Provider
                  </label>
                  <select
                    className="w-full px-2 py-1 rounded bg-gray-800 text-gray-100 "
                    value={providerFilter}
                    onChange={(e) => {
                      setProviderFilter(e.target.value);
                      handleFilterChange();
                    }}
                  >
                    <option value="all">All</option>
                    {uniqueProviders.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-white-400">
                  Latency (ms)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={latencyRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLatencyRange([0, val]);
                    handleFilterChange();
                  }}
                  className="w-full hover:cursor-pointer range-slider"
                />
                <div className="text-xs text-pink-400 ">
                  Max: {latencyRange[1]} ms
                </div>
              </div>

              <hr className="border-gray-700" />

              {filteredData.length > 0 ? (
                <div className="h-[61%] overflow-y-auto rounded border border-gray-700 mt-2 thin-scrollbar">
                  {filteredData.map((dc) => (
                    <div
                      key={dc.id}
                      onClick={() => {
                        console.log("Selected node:", dc);
                            onDataCenterSelect?.({
      longitude: dc.coordinates[0],
      latitude: dc.coordinates[1],
    });
                        //handle logic to move to and focus on server if clicked
                      }}
                      className="px-2 py-1 hover:bg-gray-700 cursor-pointer text-xs"
                    >
                      <div className="font-semibold">{dc.id}</div>
                      <div className="text-pink-300">
                        {dc.provider} • {dc.region || dc.location}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-pink-500 mt-2">
                  No matches found.
                </div>
              )}
            </>
          )}

          {activeTab === "Performance" && (
            <>
              <h4 className="font-semibold text-base text-pink-200">
                System Stats
              </h4>
              <p>
                Datacenters:{" "}
                {dataCenters.filter((dc) => dc.type === "cloud").length}
              </p>
              <p>
                Exchanges:{" "}
                {dataCenters.filter((dc) => dc.type === "exchange").length}
              </p>
              <p>
                Avg AWS Latency:{" "}
                {(
                  dataCenters.reduce(
                    (acc, dc) => acc + (dc.latency.aws ?? 0),
                    0
                  ) / dataCenters.length
                ).toFixed(2)}{" "}
                ms
              </p>
              <p>
                Avg All Latency:{" "}
                {(
                  dataCenters.reduce((acc, dc) => {
                    const sum = Object.values(dc.latency).reduce(
                      (a, b) => a + b,
                      0
                    );
                    return acc + sum / Object.keys(dc.latency).length;
                  }, 0) / dataCenters.length
                ).toFixed(2)}{" "}
                ms
              </p>
            </>
          )}

          <hr className="border-gray-700" />
          <div className="text-xs text-gray-400">
            Showing: {filteredData.length} / {dataCenters.length} nodes
          </div>
        </div>
      </div>
    </>
  );
};

export default MapControlPanel;
