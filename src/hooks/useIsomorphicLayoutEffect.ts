import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` warns during SSR, so fall back to `useEffect` on the server.
 */
export const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;
