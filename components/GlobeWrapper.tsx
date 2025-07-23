"use client";

import dynamic from "next/dynamic";

const DynamicGlobe = dynamic(() => import("./GlobeComponent"), { ssr: false });

export default function GlobeWrapper() {
  return <DynamicGlobe />;
}
