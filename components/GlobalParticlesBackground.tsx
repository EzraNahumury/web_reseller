"use client";

import Particles from "@/components/Particles";

export default function GlobalParticlesBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Particles
        particleColors={["#ffffff", "#ef4444", "#b91c1c"]}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
      <div className="absolute inset-0 bg-zinc-950/55" />
    </div>
  );
}


