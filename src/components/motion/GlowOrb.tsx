"use client";

import { motion } from "framer-motion";

interface GlowOrbProps {
  className?: string;
  delay?: number;
  duration?: number;
  size?: string;
}

export function GlowOrb({
  className = "",
  delay = 0,
  duration = 6,
  size = "400px",
}: GlowOrbProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full bg-accent/[0.06] blur-[100px] ${className}`}
      style={{ width: size, height: size }}
      animate={{
        opacity: [0.4, 1, 0.4],
        scale: [0.9, 1.15, 0.9],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
