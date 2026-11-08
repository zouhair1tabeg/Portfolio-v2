export type Certification = {
    id: string;
    title: string;
    issuer: string;
    awardedOn: string; // ISO "YYYY-MM-DD"
    expiresOn?: string; // ISO, optional
    credentialId?: string;
    verifyUrl?: string; // verification link (optional)
    image?: string; // certificate preview, /images/certifications/...
};

export const CERTIFICATIONS: readonly Certification[] = [
    {
        id: "it-specialist-java",
        title: "IT Specialist — Java",
        issuer: "Certiport, a Pearson VUE business",
        awardedOn: "2026-07-05",
        expiresOn: "2031-07-05",
        credentialId: "wBTvF-2FdY",
        verifyUrl: "https://verify.certiport.com",
        image: "/images/certifications/it-specialist-java.webp",
    },
] as const;
