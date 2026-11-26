import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutriTSEAS – Nutrición Deportiva",
  description: "Aprende nutrición deportiva y suplementación para el ciclo TSEAS",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NutriTSEAS",
  },
};

export const viewport: Viewport = {
  themeColor: "#5B2C6F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="h-full"
        style={{ background: "var(--nt-bg)", color: "var(--nt-ink)" }}
      >
        {children}
      </body>
    </html>
  );
}
