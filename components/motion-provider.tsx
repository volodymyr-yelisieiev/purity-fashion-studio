"use client"

import { MotionConfig } from "motion/react"
import type * as React from "react"

function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export { MotionProvider }
