import { ReactNode } from "react";
import "../globals.css";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";

export const metadata = {
  title: "Raaj Patre | Portfolio",
  description: "Builder. Breaker. Repeat.",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bg-base text-text-primary font-mono antialiased overflow-x-hidden">
        <Nav />
        <main className="flex-1 flex flex-col w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
