import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Space_Grotesk,
} from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteBackground } from "@/components/ui/site-background";
import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { createThemeVariablesCss } from "@/lib/theme";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SciLoop",
  description:
    "A premium science visualization MVP where discoveries change interactive worlds instead of living as static articles.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
        <style>{createThemeVariablesCss()}</style>
        <div className="relative min-h-screen">
          <SiteBackground />
          <SiteHeader />
          <main className="relative z-10 pt-10">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
