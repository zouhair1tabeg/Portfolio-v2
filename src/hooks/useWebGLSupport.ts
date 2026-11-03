"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

/**
 * Creates a throwaway context once, so we never mount R3F on a device or a
 * browser that cannot provide WebGL (headless, old GPU blocklists, …).
 */
function detectWebGL(): boolean {
    if (cached !== null) return cached;

    try {
        const canvas = document.createElement("canvas");
        const gl =
            canvas.getContext("webgl2") ??
            canvas.getContext("webgl");

        cached = gl !== null;
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
        cached = false;
    }

    return cached;
}

const subscribe = () => () => undefined;
const getServerSnapshot = () => false;

/** `enabled` avoids paying for detection on devices that will never use it. */
export function useWebGLSupport(enabled = true): boolean {
    return useSyncExternalStore(
        subscribe,
        () => (enabled ? detectWebGL() : false),
        getServerSnapshot,
    );
}
