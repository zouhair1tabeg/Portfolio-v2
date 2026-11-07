"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { REVEAL_CONFIG } from "@/components/hero/reveal-config";
import { HERO_PORTRAIT } from "@/components/hero/hero-portrait-assets";
import type { HeroNameTextures } from "@/components/hero/useHeroNameTextures";
import { revealFragmentShader } from "@/components/hero/shaders/reveal.frag";
import { revealVertexShader } from "@/components/hero/shaders/reveal.vert";

export type RevealInput = {
    /** Cursor position inside the hero, 0 – 1 (origin bottom-left). */
    x: number;
    y: number;
    inside: boolean;
};

type RevealPlaneProps = {
    input: React.RefObject<RevealInput>;
    name: HeroNameTextures | null;
    portraitRect: THREE.Vector4 | null;
    /** Enables the canvas name once the DOM name can be swapped out. */
    nameVisible: boolean;
    onReady?: () => void;
};

const TRAIL_LENGTH = 5;
const NAME_FADE_SPEED = 9;

// Placeholder for the name sampler until the DOM measurement is available.
const EMPTY_TEXTURE = new THREE.DataTexture(
    new Uint8Array([0, 0, 0, 0]),
    1,
    1,
    THREE.RGBAFormat,
);
EMPTY_TEXTURE.needsUpdate = true;

function preparePortraitTexture(texture: THREE.Texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;
}

export default function RevealPlane({
    input,
    name,
    portraitRect,
    nameVisible,
    onReady,
}: RevealPlaneProps) {
    const textureB = useTexture(HERO_PORTRAIT.reveal);

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
    const nameVisibleRef = useRef(nameVisible);
    const onReadyRef = useRef(onReady);
    const notified = useRef(false);

    const uniforms = useMemo(
        () => ({
            uTexB: { value: textureB },
            uNameFill: { value: EMPTY_TEXTURE as THREE.Texture },
            uNameOutline: { value: EMPTY_TEXTURE as THREE.Texture },
            uNameRect: { value: new THREE.Vector4(0, 0, 0.0001, 0.0001) },
            uPortraitRect: { value: new THREE.Vector4(0, 0, 0.0001, 0.0001) },
            uNameOpacity: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uVelocity: { value: new THREE.Vector2() },
            uTrail: {
                value: Array.from(
                    { length: TRAIL_LENGTH },
                    () => new THREE.Vector2(0.5, 0.5),
                ),
            },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uRadius: { value: REVEAL_CONFIG.radius },
            uTime: { value: 0 },
            uReveal: { value: 0 },
            uStretch: { value: REVEAL_CONFIG.stretch },
            uNoiseAmount: { value: REVEAL_CONFIG.noiseAmount },
            uNoiseScale: { value: REVEAL_CONFIG.noiseScale },
            uEdgeSoftness: { value: REVEAL_CONFIG.edgeSoftness },
        }),
        [textureB],
    );

    // `useFrame` mutates uniforms every frame; going through a ref keeps the
    // React Compiler lint rule happy (uniform objects are mutable by design).
    const uniformsRef = useRef(uniforms);

    useEffect(() => {
        preparePortraitTexture(textureB);
    }, [textureB]);

    useLayoutEffect(() => {
        nameVisibleRef.current = nameVisible;
    }, [nameVisible]);

    useLayoutEffect(() => {
        onReadyRef.current = onReady;
    }, [onReady]);

    useLayoutEffect(() => {
        if (!name) return;

        const u = uniformsRef.current;
        u.uNameFill.value = name.fill;
        u.uNameOutline.value = name.outline;
        u.uNameRect.value.copy(name.rect);
    }, [name]);

    useLayoutEffect(() => {
        if (!portraitRect) return;
        uniformsRef.current.uPortraitRect.value.copy(portraitRect);
    }, [portraitRect]);

    useEffect(() => {
        if (!name || notified.current) return;
        notified.current = true;
        onReadyRef.current?.();
    }, [name]);

    useFrame((state, delta) => {
        // Clamp long frames (tab switch) so the easing never jumps.
        const dt = Math.min(delta, 0.05);
        const target = input.current;
        const u = uniformsRef.current;

        u.uResolution.value.set(
            state.size.width * state.viewport.dpr,
            state.size.height * state.viewport.dpr,
        );

        const targetOpacity = nameVisibleRef.current ? 1 : 0;
        u.uNameOpacity.value +=
            (targetOpacity - u.uNameOpacity.value) *
            (1 - Math.exp(-dt * NAME_FADE_SPEED));

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

        // Velocity is expressed in height units, exactly like the distance
        // field, so the stretch feels the same whatever the hero aspect is.
        const aspect =
            state.size.height > 0 ? state.size.width / state.size.height : 1;
        instantVelocity.current.set(
            ((mouse.current.x - previousX) * aspect) / Math.max(dt, 0.001),
            (mouse.current.y - previousY) / Math.max(dt, 0.001),
        );
        velocity.current.lerp(
            instantVelocity.current,
            1 - Math.pow(0.72, dt * 60),
        );

        const speed = velocity.current.length();
        const portraitHeight = Math.max(u.uPortraitRect.value.w, 0.08);
        u.uRadius.value =
            REVEAL_CONFIG.radius *
            portraitHeight *
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

        // Fade out when the pointer stops or leaves the hero.
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
                transparent
                toneMapped={false}
            />
        </mesh>
    );
}
