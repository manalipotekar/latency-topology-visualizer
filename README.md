# Latency Topology Visualizer

An interactive visualization tool to display real-time and historical **latency connections between exchange servers and cloud provider regions (AWS, GCP, Azure)** on a **3D Mapbox Globe**, built with **Next.js, Mapbox GL, React, and Recharts**.

---

## Features

*  **3D Globe Visualization** using MapboxGL.
*  **Interactive Data Center Nodes** (click, hover to view details).
*  **Latency Lines between exchange servers and cloud regions**.
*  **Auto-refresh real-time latency updates**.
*  **Control Panel** to filter real-time/historical data.
*  **Latency Trend Charts** for selected nodes.
* Responsive UI with **Geist fonts** and custom styling.

---

##  Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/latency-visualizer.git
cd latency-visualizer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Mapbox Token

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see it in action.

---

## Project Structure

```
/app
  /components
    /Map
      MapCanvas.tsx
      MapLayers.ts
      MapInteractions.ts
      MapControlPanel.tsx
      MapStatsPanel.tsx
      MapNodeDetailsPanel.tsx
    LatencyChartPanel.tsx
  /utils
    geojsonBuilders.ts
    latencySimulator.ts
    utils.ts
  /public
    favicon.ico
    ...
/.env.local
/README.md
/next.config.js
/package.json
```

---


## Tech Stack

* **Next.js 14+ (App Directory)**
* **Mapbox GL JS**
* **React & TypeScript**
* **Recharts** (Latency Trends Chart)
* **Zustand** (State Management)
* **Tailwind CSS**
* **Geist Sans & Geist Mono Fonts**

---

## Acknowledgements

* [Mapbox GL JS](https://www.mapbox.com/)
* [Recharts](https://recharts.org/)
* [React Icons](https://react-icons.github.io/react-icons/)
* [Geist Fonts by Vercel](https://vercel.com/fonts)
