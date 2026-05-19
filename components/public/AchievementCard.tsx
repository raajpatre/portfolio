"use client";

import Image from "next/image";
import { ExternalLink, Award } from "lucide-react";

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  issued_date: string;
  credential_url: string | null;
  image_url: string | null;
}

export function AchievementCard({ cert }: { cert: CertificateData }) {
  const formattedDate = new Date(cert.issued_date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative w-full aspect-[4/3] perspective-1000">
      <div className="w-full h-full relative preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
        
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-bg-base border-2 border-border-pixel rounded-sm flex flex-col items-center justify-center p-4">
          {cert.image_url ? (
            <div className="relative w-full h-full p-2">
              <Image
                src={cert.image_url}
                alt={cert.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <Award className="w-16 h-16 text-border-pixel/50 mb-4" />
          )}
          <div className="absolute bottom-0 w-full bg-bg-base/90 backdrop-blur-md border-t-2 border-border-pixel p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
             <p className="font-pixel text-[10px] text-text-primary text-center truncate">{cert.title}</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-border-pixel border-2 border-accent-gold rounded-sm flex flex-col items-center justify-center p-6 text-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
          <Award className="w-8 h-8 text-accent-gold mb-4" />
          <h3 className="font-pixel text-xs text-text-primary mb-4 leading-relaxed">{cert.title}</h3>
          
          <div className="space-y-2 mb-6">
            <p className="font-mono text-xs text-text-primary/70 uppercase">
              <span className="text-accent-teal">Issuer:</span> {cert.issuer}
            </p>
            <p className="font-mono text-xs text-text-primary/70 uppercase">
              <span className="text-accent-violet">Date:</span> {formattedDate}
            </p>
          </div>

          {cert.credential_url && (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-bg-base bg-accent-gold px-4 py-2 hover:bg-accent-gold/80 transition-colors rounded-sm"
              onClick={(e) => e.stopPropagation()} // Prevent flip on click
            >
              Verify <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
