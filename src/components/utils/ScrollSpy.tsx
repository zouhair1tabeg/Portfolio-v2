"use client";

import { useEffect } from "react";

const SECTIONS = ["hero", "about", "skills", "projects", "experience", "contact"];

export default function ScrollSpy() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        if (id) {
                            // Update URL without adding to history stack
                            window.history.replaceState(null, "", `#${id}`);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: "-50% 0px -50% 0px", // Trigger when section is in the middle of viewport
                threshold: 0
            }
        );

        SECTIONS.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return null;
}
