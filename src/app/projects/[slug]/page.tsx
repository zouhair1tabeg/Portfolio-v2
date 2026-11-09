import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDY_PROJECTS } from "@/data/projects";
import CaseStudy from "@/components/projects/CaseStudy";
import {
    OG_IMAGE_ALT,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_WIDTH,
} from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
    return CASE_STUDY_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = CASE_STUDY_PROJECTS.find((item) => item.slug === slug);

    if (!project) return {};

    const title = `${project.title} — Case Study | Tabeg Zouhair`;

    return {
        title,
        description: project.summary,
        alternates: {
            canonical: `/projects/${project.slug}`,
        },
        openGraph: {
            title,
            description: project.summary,
            type: "article",
            locale: "en_US",
            images: [
                {
                    url: "/og-image.png",
                    width: OG_IMAGE_WIDTH,
                    height: OG_IMAGE_HEIGHT,
                    alt: OG_IMAGE_ALT,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: project.summary,
            images: [
                {
                    url: "/og-image.png",
                    alt: OG_IMAGE_ALT,
                },
            ],
        },
    };
}

export default async function ProjectCaseStudyPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const index = CASE_STUDY_PROJECTS.findIndex((project) => project.slug === slug);

    if (index === -1) notFound();

    return (
        <CaseStudy
            project={CASE_STUDY_PROJECTS[index]}
            previous={CASE_STUDY_PROJECTS[index - 1] ?? null}
            next={CASE_STUDY_PROJECTS[index + 1] ?? null}
        />
    );
}
