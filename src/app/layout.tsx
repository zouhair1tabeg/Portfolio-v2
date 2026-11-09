import type { Metadata } from "next";
import {
    Inter,
    Montserrat,
    Noto_Sans_Arabic,
    Space_Grotesk,
    Playfair_Display,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollSpy from "@/components/utils/ScrollSpy";
import {
    OG_IMAGE_ALT,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_WIDTH,
    SITE_DESCRIPTION,
    SITE_TITLE,
    SITE_URL,
} from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const notoSansArabic = Noto_Sans_Arabic({
    subsets: ["arabic"],
    variable: "--font-noto-arabic",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: "/",
        locale: "en_US",
        type: "website",
        siteName: "Tabeg Zouhair",
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
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [
            {
                url: "/og-image.png",
                alt: OG_IMAGE_ALT,
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${playfair.variable} ${notoSansArabic.variable} bg-black text-white antialiased font-sans cursor-none`}
            >
                {/* Hides the intro for returning visitors before the first paint. */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{if(sessionStorage.getItem("zt:intro:v1")==="1"){document.documentElement.dataset.intro="seen"}}catch(e){}`,
                    }}
                />

                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-ink"
                >
                    Skip to content
                </a>

                <SmoothScroll>
                    <CustomCursor />
                    <GrainOverlay />
                    <ScrollSpy />
                    <Navigation />
                    {children}
                    <Footer />
                </SmoothScroll>
            </body>
        </html>
    );
}
