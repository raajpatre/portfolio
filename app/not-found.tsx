"use client";

import Link from "next/link";
import { PixelButton } from "@/components/ui/PixelButton";
import { useEffect } from "react";

export default function NotFound() {
  // Ensure we don't trap scrolling if coming from a broken link on WelcomeScreen
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-8 p-8 border-2 border-border-pixel relative overflow-hidden bg-bg-base">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-accent-gold/20" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-gold/20" />
        
        <h1 className="font-pixel text-4xl sm:text-5xl text-accent-gold">404</h1>
        
        <div className="space-y-4">
          <h2 className="font-pixel text-xl sm:text-2xl text-text-primary uppercase tracking-wider">
            Quest Not Found
          </h2>
          <p className="font-mono text-sm text-text-primary/70 leading-relaxed">
            The path you are looking for has been destroyed by a stray fireball. The requested URL was not found on this server.
          </p>
        </div>
        
        <div className="pt-4 flex justify-center">
          <Link href="/">
            <PixelButton variant="primary">
              Return to Town
            </PixelButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
