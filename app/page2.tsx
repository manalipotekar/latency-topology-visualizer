"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

// 🌍 Earth with texture
function Earth() {
  const [earthTexture] = useTexture(["/8k_earth_daymap.jpg"]); // Put your HD earth texture here

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

// 📍 Utility to convert lat/lon to x,y,z
function latLonToVec3(lat: number, lon: number, radius = 1.01) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// 📌 Marker Component
function Marker({ lat, lon }: { lat: number; lon: number }) {
  const position = latLonToVec3(lat, lon);
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.01, 16, 16]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// 🚀 Main GlobeCanvas
export default function Page() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <Earth />
          <Stars />
          {/* Add more markers as needed */}
          <Marker lat={51.5074} lon={-0.1278} /> {/* London */}
          <Marker lat={1.3521} lon={103.8198} /> {/* Singapore */}
          <Marker lat={37.7749} lon={-122.4194} /> {/* San Francisco */}
        </Suspense>
        <OrbitControls   enableZoom={true}
          autoRotate
  autoRotateSpeed={0.5}
          enableRotate={true}
          enablePan={true}
          zoomSpeed={0.6}
          rotateSpeed={0.4}
          panSpeed={0.5}/>
      </Canvas>
    </div>
  );
}
