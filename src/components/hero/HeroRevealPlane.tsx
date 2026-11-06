"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { REVEAL_CONFIG } from "@/components/hero/reveal-config";
import { revealFragmentShader } from "@/components/hero/shaders/reveal.frag";
import { revealVertexShader } from "@/components/hero/shaders/reveal.vert";

export type RevealInput = {
    /** Cursor position inside the portrait, 0 – 1 (origin bottom-left). */
    x: number;
    y: number;
    inside: boolean;
};

type RevealPlaneProps = {
    input: React.RefObject<RevealInput>;
};

const BASE_TEXTURE = "/images/hero/portrait-base.png";
const REVEAL_TEXTURE = "/images/hero/portrait-reveal.png";
const TRAIL_LENGTH = 5;

// Both textures must share the same dimensions and framing. To swap in the
// real pair, replace the two PNGs only — see public/images/hero/README.md.

export default function RevealPlane({ input }: RevealPlaneProps) {
    const [textureA, textureB] = useTexture([BASE_TEXTURE, REVEAL_TEXTURE]);

    const mouse = useRef(new THREE.Vector2(0.5, 0.5));
    const velocity = useRef(new THREE.Vector2());
    const instantVelocity = useRef(new THREE.Vector2());
    const lastTarget = useRef({ x: 0.5, y: 0.5 });
    const trail = useRef(
        Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(0.5, 0.5)),
    );
    const idle = useRef(0);
    const reveal = useRef(0);
    const initialised = useRef(false);

    const uniforms = useMemo(
        () => ({
            uTexA: { value: textureA },
            uTexB: { value: textureB },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uVelocity: { value: new THREE.Vector2() },
            uTrail: {
                value: Array.from(
                    { length: TRAIL_LENGTH },
                    () => new THREE.Vector2(0.5, 0.5),
                ),
            },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uTexResolution: { value: new THREE.Vector2(1, 1) },
            uRadius: { value: REVEAL_CONFIG.radius },
            uTime: { value: 0 },
            uReveal: { value: 0 },
            uStretch: { value: REVEAL_CONFIG.stretch },
            uNoiseAmount: { value: REVEAL_CONFIG.noiseAmount },
            uNoiseScale: { value: REVEAL_CONFIG.noiseScale },
            uEdgeSoftness: { value: REVEAL_CONFIG.edgeSoftness },
        }),
        [textureA, textureB],
    );

    // `useFrame` mutates uniforms every frame; going through a ref keeps the
    // React Compiler lint rule happy (uniform objects are mutable by design).
    const uniformsRef = useRef(uniforms);

    useEffect(() => {
        for (const texture of [textureA, textureB]) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 4;
            texture.needsUpdate = true;
        }

        const image = textureA.image as HTMLImageElement;
        uniformsRef.current.uTexResolution.value.set(
            image.naturalWidth || image.width,
            image.naturalHeight || image.height,
        );
    }, [textureA, textureB]);

    useFrame((state, delta) => {
        // Clamp long frames (tab switch) so the easing never jumps.
        const dt = Math.min(delta, 0.05);
        const target = input.current;
        const u = uniformsRef.current;

        u.uResolution.value.set(
            state.size.width * state.viewport.dpr,
            state.size.height * state.viewport.dpr,
        );

        if (!target) return;

        if (!initialised.current) {
            if (!target.inside) return;
            mouse.current.set(target.x, target.y);
            lastTarget.current = { x: target.x, y: target.y };
            for (const point of trail.current) point.copy(mouse.current);
            initialised.current = true;
        }

        const follow = 1 - Math.pow(1 - REVEAL_CONFIG.damping, dt * 60);
        const previousX = mouse.current.x;
        const previousY = mouse.current.y;

        mouse.current.x += (target.x - mouse.current.x) * follow;
        mouse.current.y += (target.y - mouse.current.y) * follow;

        instantVelocity.current.set(
            (mouse.current.x - previousX) / Math.max(dt, 0.001),
            (mouse.current.y - previousY) / Math.max(dt, 0.001),
        );
        velocity.current.lerp(
            instantVelocity.current,
            1 - Math.pow(0.72, dt * 60),
        );

        const speed = velocity.current.length();
        u.uRadius.value =
            REVEAL_CONFIG.radius *
            (1 + Math.min(speed * 0.25, 1) * REVEAL_CONFIG.radiusBoost);

        // Trail: each point chases the previous one, giving a liquid wake.
        let lead = mouse.current;
        for (let index = 0; index < trail.current.length; index += 1) {
            const point = trail.current[index];
            const damping = REVEAL_CONFIG.trailDamping[index];
            point.lerp(lead, 1 - Math.pow(1 - damping, dt * 60));
            lead = point;
            u.uTrail.value[index].copy(point);
        }

        // Fade out when the pointer stops or leaves the portrait.
        const targetMoved = Math.hypot(
            target.x - lastTarget.current.x,
            target.y - lastTarget.current.y,
        );
        lastTarget.current = { x: target.x, y: target.y };

        if (target.inside && targetMoved > 0.0003) idle.current = 0;
        else idle.current += dt;

        const visible = target.inside && idle.current < REVEAL_CONFIG.idleDelay;
        reveal.current +=
            ((visible ? 1 : 0) - reveal.current) *
            (1 - Math.exp(-dt * REVEAL_CONFIG.revealSpeed));

        u.uMouse.value.copy(mouse.current);
        u.uVelocity.value.copy(velocity.current);
        u.uReveal.value = reveal.current;
        u.uTime.value = state.clock.elapsedTime;
    });

    return (
        <mesh frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={revealVertexShader}
                fragmentShader={revealFragmentShader}
                uniforms={uniforms}
                depthTest={false}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
}
