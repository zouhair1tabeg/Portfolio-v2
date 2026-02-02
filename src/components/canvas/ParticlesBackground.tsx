"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

const ParticleField = () => {
    const count = 2000;
    const mesh = useRef<THREE.Points>(null!);

    // Store original positions for reset
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spread particles in a tunnel shape naturally
            positions[i * 3] = (Math.random() - 0.5) * 50;     // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z (depth)

            speeds[i] = 0.1 + Math.random() * 0.5;
        }

        return { positions, speeds };
    }, []);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#0066FF") }
    }), []);

    useFrame((state) => {
        if (!mesh.current) return;

        const { clock } = state;
        uniforms.uTime.value = clock.getElapsedTime();

        // Warp Speed Logic: Move particles towards camera (+Z)
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            // Update Z
            positions[i * 3 + 2] += particles.speeds[i] * 2; // Speed multiplier

            // Reset if passed camera (Camera at Z=10)
            if (positions[i * 3 + 2] > 20) {
                positions[i * 3 + 2] = -80; // Send back to deep background
                // Randomize X/Y slightly on reset for variation
                positions[i * 3] = (Math.random() - 0.5) * 50;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            }
        }

        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#0066FF"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    );
};

export default function ParticlesBackground() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: false }}>
                <ParticleField />

                <EffectComposer disableNormalPass>
                    {/* Glow for that Sci-Fi feel */}
                    <Bloom luminanceThreshold={0} mipmapBlur intensity={0.5} radius={0.8} />
                    {/* Cinematic Vignette */}
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
