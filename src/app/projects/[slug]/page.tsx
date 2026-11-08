import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDY_PROJECTS } from "@/data/projects";
import CaseStudy from "@/components/projects/CaseStudy";

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
        openGraph: {
            title,
            description: project.summary,
            type: "article",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: project.summary,
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
