"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps extends ImageProps {
  timeoutMs?: number;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  timeoutMs = 5000,
  fallbackSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setIsTimedOut(true);
      }
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [isLoaded, timeoutMs]);

  const handleLoad = (e: any) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e: any) => {
    setHasError(true);
    if (onError) onError(e);
  };

  const displaySrc = hasError || isTimedOut ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={displaySrc}
      alt={alt}
      className={cn(
        "transition-opacity duration-500",
        isLoaded ? "opacity-100" : "opacity-0",
        className,
      )}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};
