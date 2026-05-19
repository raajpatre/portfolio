import { ReactNode } from "react";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { PageTransition } from "@/components/public/PageTransition";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col w-full">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
