"use client";

import dynamic from "next/dynamic";

// Import the Canvas component with SSR disabled
const GlobeCanvas = dynamic(() => import("../components/GlobeComponent"), {
  ssr: false,
});

export default function ClientGlobe() {
  return <GlobeCanvas />;
}
