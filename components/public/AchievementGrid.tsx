"use client";

import { motion } from "framer-motion";
import { AchievementCard, CertificateData } from "./AchievementCard";

interface AchievementGridProps {
  certificates: CertificateData[];
}

export function AchievementGrid({ certificates }: AchievementGridProps) {
  if (!certificates || certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border-pixel">
        <p className="font-pixel text-sm text-text-primary/50">No achievements unlocked yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {certificates.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <AchievementCard cert={cert} />
        </motion.div>
      ))}
    </div>
  );
}
