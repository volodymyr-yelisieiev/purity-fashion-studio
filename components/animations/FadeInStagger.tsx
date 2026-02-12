"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { createContext, useContext, useRef } from "react";

const StaggerContext = createContext(false);

// Container variants - simple stagger logic
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

// Item variants - core animation properties
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Premium easing
    },
  },
};

interface FadeInStaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * FadeInStagger - Individual animated item
 * Triggers immediately if in viewport on load, or on scroll
 */
export function FadeInStagger({
  children,
  className,
  delay = 0,
}: FadeInStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInsideContainer = useContext(StaggerContext);

  // CRITICAL: useInView with margin for early trigger and amount: 0 for immediate detection
  const isInView = useInView(ref, {
    once: false,
    margin: "-80px 0px -10% 0px", // Trigger slightly before fully visible
    amount: 0, // Trigger as soon as 1 pixel is visible
  });

  // If inside a container, the container's animate prop will propagate to this child
  if (isInsideContainer) {
    return (
      <motion.div
        ref={ref}
        variants={itemVariants}
        className={className}
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </motion.div>
    );
  }

  // Standalone item uses its own isInView trigger
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={className}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInStaggerContainer - Wrapper for staggered group animations
 */
export function FadeInStaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Trigger container animation as soon as it enters viewport
  const isInView = useInView(ref, {
    once: false,
    margin: "-80px 0px -10% 0px",
    amount: 0,
  });

  return (
    <StaggerContext.Provider value={true}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className={className}
      >
        {children}
      </motion.div>
    </StaggerContext.Provider>
  );
}
