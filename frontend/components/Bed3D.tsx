"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

interface Bed3DProps {
  totalBeds: number;
  allocatedBeds: number;
}

function BedBox({
  allocated,
  position,
}: {
  allocated: boolean;
  position: [number, number, number];
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.3, 1.2]} />
      <meshStandardMaterial color={allocated ? "#2563eb" : "#e5e7eb"} />
      {allocated && (
        <Html position={[0, 0.25, 0]} center>
          <span style={{ color: "#2563eb", fontWeight: 700, fontSize: 12 }}>
            🛏️
          </span>
        </Html>
      )}
    </mesh>
  );
}

export default function Bed3D({ totalBeds, allocatedBeds }: Bed3DProps) {
  // Arrange beds in a grid
  const cols = Math.ceil(Math.sqrt(totalBeds));
  const rows = Math.ceil(totalBeds / cols);
  return (
    <div
      style={{
        width: "100%",
        height: 260,
        background: "#f1f5f9",
        borderRadius: 16,
        boxShadow: "0 2px 8px #0001",
        margin: "16px 0",
      }}
    >
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }} shadows>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={0.7} castShadow />
        {Array.from({ length: totalBeds }).map((_, i) => {
          const x = (i % cols) - cols / 2 + 0.5;
          const z = Math.floor(i / cols) - rows / 2 + 0.5;
          return (
            <BedBox
              key={i}
              allocated={i < allocatedBeds}
              position={[x * 1.2, 0, z * 1.5]}
            />
          );
        })}
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}
