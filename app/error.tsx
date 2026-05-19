"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PixelButton } from "@/components/public/PixelButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Hit!", error);
    document.body.style.overflow = "auto";
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md w-full space-y-8 p-8 border-2 border-accent-red relative overflow-hidden bg-bg-base">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-accent-red/20" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-accent-red/20" />
        
        <h1 className="font-pixel text-4xl sm:text-5xl text-accent-red">500</h1>
        
        <div className="space-y-4">
          <h2 className="font-pixel text-xl sm:text-2xl text-text-primary uppercase tracking-wider">
            Critical Hit!
          </h2>
          <p className="font-mono text-sm text-text-primary/70 leading-relaxed">
            The server took massive damage and crashed. Our mages are working on a healing spell.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <PixelButton variant="primary" onClick={() => reset()}>
            Try Healing Spell
          </PixelButton>
          
          <Link href="/">
            <PixelButton variant="secondary">
              Return to Town
            </PixelButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
