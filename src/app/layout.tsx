import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/nav/Sidebar";
import { BottomNav } from "@/components/nav/BottomNav";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="h-full"
        style={{ background: "var(--nt-bg)", color: "var(--nt-ink)" }}
      >
        {/* Layout: sidebar en escritorio, bottom nav en móvil */}
        <div className="flex h-full">
          {/* Sidebar sólo en lg+ */}
          <Sidebar />

          {/* Área de contenido principal */}
          <main
            className="flex-1 overflow-y-auto"
            style={{
              /* En móvil: deja espacio para el bottom nav (60px) */
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }}
          >
            <div className="pb-[60px] lg:pb-0">
              {children}
            </div>
          </main>
        </div>

        {/* Bottom nav sólo en móvil/tablet (<lg) */}
        <BottomNav />
      </body>
    </html>
  );
}
