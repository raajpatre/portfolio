"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogueBox } from "./DialogueBox";
import { PixelButton } from "./PixelButton";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("rp-welcomed");
    if (!hasVisited) {
      setIsVisible(true);
      // We block scrolling while welcome screen is up
      document.body.style.overflow = 'hidden';
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleEnter = () => {
    localStorage.setItem("rp-welcomed", "1");
    setIsVisible(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      onComplete();
    }, 800); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
      <motion.div
        key="welcome"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-base p-4"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center max-w-lg w-full space-y-8">
          {/* Character Sprite Placeholder */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-32 h-32 sm:w-48 sm:h-48"
          >
            {/* The actual image should go in public/character/idle.png */}
            <div className="absolute inset-0 border-2 border-dashed border-border-pixel flex items-center justify-center text-border-pixel font-mono text-xs text-center p-2 rounded-sm">
              [Sprite Placeholder]
              <br />
              /public/character/idle.png
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full"
          >
            <DialogueBox
              text="Hey. I'm Raaj. Builder. Breaker. Repeat."
              speed={40}
              onComplete={() => setIsTypingDone(true)}
            />
          </motion.div>

          <AnimatePresence>
            {isTypingDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PixelButton onClick={handleEnter} variant="primary">
                  ▶ Enter Portfolio
                </PixelButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
