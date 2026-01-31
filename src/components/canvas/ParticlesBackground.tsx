"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ParticleField = () => {
    const count = 4000; // Number of particles
    const mesh = useRef<THREE.Points>(null!);

    // Mouse position reference
    const mouse = useRef(new THREE.Vector2(0, 0));

    // Update mouse position on move
    const onMouseMove = (event: MouseEvent) => {
        // Normalize mouse coordinates to -1 to 1
        mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Add event listener
    useMemo(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", onMouseMove);
        }
    }, []);

    // Generate random positions
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const distance = 40; // Spread of particles

        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            positions[i * 3] = (Math.random() - 0.5) * distance;
            positions[i * 3 + 1] = (Math.random() - 0.5) * distance;
            positions[i * 3 + 2] = (Math.random() - 0.5) * distance;
        }

        return positions;
    }, [count]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color("#0066FF") }
    }), []);

    useFrame((state) => {
        const { clock } = state;

        // Smooth mouse movement for shader
        uniforms.uMouse.value.lerp(mouse.current, 0.1);
        uniforms.uTime.value = clock.getElapsedTime();

        if (mesh.current) {
            // Subtle constant rotation
            mesh.current.rotation.y = clock.getElapsedTime() * 0.05;
            mesh.current.rotation.x = clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particlesPosition, 3]}
                />
            </bufferGeometry>
            <shaderMaterial
                depthWrite={false}
                fragmentShader={`
          uniform vec3 uColor;
          
          void main() {
            // Circular particle
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.1;
            
            gl_FragColor = vec4(uColor, strength);
          }
        `}
                vertexShader={`
          uniform float uTime;
          uniform vec2 uMouse;
          
          void main() {
            vec3 pos = position;
            
            // Simple interaction: push away based on mouse proximity projected to world space
            // This is a simplified interaction logic for the shader
            // For true 3D mouse interaction we'd need raycasting, but for a background effect, screen space approximation is often enough
            
            vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            gl_PointSize = 4.0; 
            
            // Size attenuation
            gl_PointSize *= (10.0 / -viewPosition.z);
          }
        `}
                uniforms={uniforms}
                transparent
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default function ParticlesBackground() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ParticleField />
            </Canvas>
        </div>
    );
}
