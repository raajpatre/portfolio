"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Fade-in on pathname change.
 *
 * Avoid AnimatePresence + mode="wait" here — with the App Router the URL
 * updates synchronously but the new server-component children stream in
 * a moment later, so the exit animation can "swallow" the incoming page
 * and leave it stuck at opacity 0 until a refresh.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
