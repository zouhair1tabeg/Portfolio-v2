import type { Metadata } from "next";
import { Inter, Montserrat, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollSpy from "@/components/utils/ScrollSpy";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const SITE_TITLE = "Tabeg Zouhair | Web & Mobile Developer";
const SITE_DESCRIPTION =
    "Portfolio of Tabeg Zouhair, a web and mobile developer crafting fast, polished digital experiences.";

export const metadata: Metadata = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        locale: "en_US",
        type: "website",
        siteName: "Tabeg Zouhair",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
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
                className={`${inter.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${playfair.variable} bg-black text-white antialiased font-sans cursor-none`}
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
