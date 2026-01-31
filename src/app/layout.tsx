import type { Metadata } from "next";
import { Inter, Montserrat, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Tabeg Zouhair | Web & Mobile Developer",
  description: "Portfolio of Tabeg Zouhair, a web and mobile developer creating modern digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} ${spaceGrotesk.variable} ${playfair.variable} bg-black text-white antialiased font-sans cursor-none`}>
        <SmoothScroll>
          <CustomCursor />
          <GrainOverlay />
          <Navigation />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
