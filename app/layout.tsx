import { ReactNode } from "react";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://raaj.me"),
  title: "Raaj Patre — Builder. Breaker. Repeat.",
  description: "A passionate full-stack developer who thrives at the intersection of design and engineering. Crafting pixel-perfect web experiences with a focus on performance, aesthetics, and scalable architecture.",
  openGraph: {
    title: "Raaj Patre — Builder. Breaker. Repeat.",
    description: "Crafting pixel-perfect web experiences.",
    url: "https://raaj.me",
    siteName: "Raaj Patre Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Raaj Patre Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raaj Patre — Builder. Breaker. Repeat.",
    description: "Crafting pixel-perfect web experiences.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* We apply a base style here so that error pages get the right background. 
          Specific layout wrappers will add additional flex/min-h constraints. */}
      <body className="bg-bg-base text-text-primary font-mono antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
