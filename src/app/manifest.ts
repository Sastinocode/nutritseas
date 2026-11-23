import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NutriTSEAS – Nutrición Deportiva",
    short_name: "NutriTSEAS",
    description: "Aprende nutrición deportiva para el ciclo TSEAS",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8FC",
    theme_color: "#5B2C6F",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
