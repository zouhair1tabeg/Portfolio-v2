"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useLenis } from "@studio-freight/react-lenis";
import {
    ArrowUpRight,
    BadgeCheck,
    Check,
    Copy,
    Maximize2,
    X,
} from "lucide-react";
import type { Certification } from "@/data/certifications";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
});

/** ISO "YYYY-MM-DD" -> "Jul 2026", parsed as UTC so SSR and client agree. */
function formatMonthYear(iso: string): string {
    const [year, month, day] = iso.split("-").map(Number);
    return DATE_FORMATTER.format(new Date(Date.UTC(year, month - 1, day)));
}

/** Clipboard fallback for browsers without the async API (or insecure origins). */
function copyWithTextarea(text: string): boolean {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}

export default function CertificationCard({
    certification,
}: {
    certification: Certification;
}) {
    const { title, issuer, awardedOn, expiresOn, credentialId, verifyUrl, image } =
        certification;

    const titleId = useId();
    const viewerTitleId = useId();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [imageFailed, setImageFailed] = useState(false);
    const [copied, setCopied] = useState(false);
    const lenis = useLenis();
    const lenisRef = useRef(lenis);

    useEffect(() => {
        lenisRef.current = lenis;
    }, [lenis]);

    // Never leave Lenis locked if the card unmounts with the viewer open.
    useEffect(() => {
        return () => lenisRef.current?.start();
    }, []);

    useEffect(() => {
        if (!copied) return;
        const timeout = window.setTimeout(() => setCopied(false), 2000);
        return () => window.clearTimeout(timeout);
    }, [copied]);

    const openViewer = () => {
        lenisRef.current?.stop();
        dialogRef.current?.showModal();
    };

    const closeViewer = () => {
        dialogRef.current?.close();
    };

    const handleViewerClose = () => {
        lenisRef.current?.start();
        triggerRef.current?.focus();
    };

    const handleCopy = async () => {
        if (!credentialId) return;

        let success = false;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(credentialId);
                success = true;
            }
        } catch {
            success = false;
        }

        if (!success) success = copyWithTextarea(credentialId);
        if (success) setCopied(true);
    };

    return (
        <>
            <article
                aria-labelledby={titleId}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-soft/90 transition-colors duration-500 hover:border-accent/40"
            >
                {image && !imageFailed ? (
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={openViewer}
                        aria-haspopup="dialog"
                        aria-label={`View ${title} certificate`}
                        className="relative block aspect-[16/10] w-full overflow-hidden border-b border-white/10 text-left"
                    >
                        <Image
                            src={image}
                            alt={`${title} certificate preview`}
                            fill
                            sizes="(max-width: 767px) 100vw, 50vw"
                            onError={() => setImageFailed(true)}
                            className="object-cover object-top opacity-80 transition-[scale,opacity] duration-700 group-hover:scale-[1.03] group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />

                        <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-ink-soft via-ink-soft/20 to-transparent"
                        />

                        <span className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
                            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md transition-colors duration-300 group-hover:border-accent/50 group-hover:text-accent">
                                <Maximize2 aria-hidden="true" size={13} />
                                View certificate
                            </span>
                        </span>
                    </button>
                ) : null}

                <div className="flex flex-1 flex-col p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                            <BadgeCheck aria-hidden="true" size={20} />
                        </span>
                        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                            Certificate
                        </span>
                    </div>

                    <h4
                        id={titleId}
                        className="mt-4 font-hero text-xl font-bold tracking-tight text-white md:text-2xl"
                    >
                        {title}
                    </h4>
                    <p className="mt-1 text-sm leading-snug text-white/60">{issuer}</p>

                    <dl className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                                Awarded
                            </dt>
                            <dd className="font-mono text-white/80">
                                {formatMonthYear(awardedOn)}
                            </dd>
                        </div>

                        {expiresOn ? (
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    Validity
                                </dt>
                                <dd className="font-mono text-white/80">
                                    Valid until {formatMonthYear(expiresOn)}
                                </dd>
                            </div>
                        ) : null}

                        {credentialId ? (
                            <div className="space-y-2">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                                    Credential ID
                                </dt>
                                <dd className="flex flex-wrap items-center justify-between gap-2">
                                    <code className="min-w-0 break-all font-mono text-white/80">
                                        {credentialId}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/70 transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                                    >
                                        {copied ? (
                                            <Check
                                                aria-hidden="true"
                                                size={13}
                                                className="text-accent"
                                            />
                                        ) : (
                                            <Copy aria-hidden="true" size={13} />
                                        )}
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                    <span aria-live="polite" className="sr-only">
                                        {copied ? "Credential ID copied to clipboard" : ""}
                                    </span>
                                </dd>
                            </div>
                        ) : null}
                    </dl>

                    {verifyUrl ? (
                        <div className="mt-auto pt-5">
                            <a
                                href={verifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Verify ${title} certificate on ${issuer}`}
                                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                            >
                                Verify
                                <ArrowUpRight aria-hidden="true" size={14} />
                            </a>
                        </div>
                    ) : null}
                </div>
            </article>

            {image && !imageFailed ? (
                <dialog
                    ref={dialogRef}
                    aria-labelledby={viewerTitleId}
                    onClose={handleViewerClose}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) closeViewer();
                    }}
                    className="m-auto max-h-[calc(100dvh-2rem)] w-[min(1100px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/15 bg-ink-soft p-0 text-white backdrop:bg-black/80 backdrop:backdrop-blur-sm"
                >
                    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-ink-soft/95 px-5 py-4 backdrop-blur">
                        <div className="min-w-0">
                            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">
                                Certificate
                            </p>
                            <h4
                                id={viewerTitleId}
                                className="truncate font-display text-sm font-semibold text-white"
                            >
                                {title}
                            </h4>
                        </div>

                        <button
                            type="button"
                            onClick={closeViewer}
                            aria-label="Close certificate preview"
                            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                        >
                            <X aria-hidden="true" size={18} />
                        </button>
                    </div>

                    <div className="relative h-[min(72vh,42rem)] w-full bg-black/40">
                        <Image
                            src={image}
                            alt={`${title} certificate, issued by ${issuer}`}
                            fill
                            sizes="(max-width: 1100px) 100vw, 1100px"
                            className="object-contain p-2 md:p-4"
                        />
                    </div>

                    <p className="border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                        Issued {formatMonthYear(awardedOn)}
                        {expiresOn
                            ? ` · Valid until ${formatMonthYear(expiresOn)}`
                            : ""}
                    </p>
                </dialog>
            ) : null}
        </>
    );
}
