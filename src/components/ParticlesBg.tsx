'use client'
import Particles from "react-tsparticles";

export default function ParticlesBg() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        particles: {
          number: { value: 60 },
          color: { value: "#fff" },
          shape: { type: "circle" },
          opacity: { value: 0.5 },
          size: { value: 3 },
          move: { enable: true, speed: 1, direction: "none", outModes: "out" },
        },
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
} 