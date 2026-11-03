"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { getAccent } from "@/lib/accent";

const PARTICLE_COUNT = 520;

/** Generated once at module scope: Math.random must not run during render. */
const PARTICLE_FIELD = (() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        speeds[i] = 0.06 + Math.random() * 0.22;
    }

    return { positions, speeds };
})();

function ParticleField({ color }: { color: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const pointsRef = useRef<THREE.Points>(null);
    const { positions, speeds } = PARTICLE_FIELD;

    useFrame((state, delta) => {
        const group = groupRef.current;
        const points = pointsRef.current;
        if (!group || !points) return;

        group.rotation.y += delta * 0.025;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, state.pointer.y * 0.12, 0.04);
        group.position.x = THREE.MathUtils.lerp(group.position.x, state.pointer.x * 0.4, 0.04);

        const attribute = points.geometry.attributes.position as THREE.BufferAttribute;
        const array = attribute.array as Float32Array;

        for (let i = 0; i < PARTICLE_COUNT; i += 1) {
            array[i * 3 + 1] += speeds[i] * delta;
            if (array[i * 3 + 1] > 4) {
                array[i * 3 + 1] = -4;
                array[i * 3] = (Math.random() - 0.5) * 14;
            }
        }

        attribute.needsUpdate = true;
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.017}
                    color={color}
                    transparent
                    opacity={0.5}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation
                />
            </points>
        </group>
    );
}

/**
 * Lightweight particle field. Only mounted by <Hero> on desktop with a fine
 * pointer and no reduced-motion preference.
 */
export default function HeroBackground3D() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(true);
    const accent = useMemo(() => getAccent(), []);

    useEffect(() => {
        const element = wrapperRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => setActive(entry.isIntersecting),
            { threshold: 0 },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} className="pointer-events-none absolute inset-0">
            <Canvas
                dpr={[1, 1.5]}
                frameloop={active ? "always" : "never"}
                camera={{ position: [0, 0, 7], fov: 55 }}
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
            >
                <ParticleField color={accent} />

                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.4}
                        intensity={0.16}
                        radius={0.5}
                        mipmapBlur
                    />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
