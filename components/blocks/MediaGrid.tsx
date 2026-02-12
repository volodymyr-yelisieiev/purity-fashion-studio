"use client";

import React from "react";
import Image from "next/image";
import { cn, getMediaUrl } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "../animations/Reveal";

interface MediaGridProps {
  title?: string;
  columns?: "2" | "3" | "4" | "masonry";
  items: Array<{
    media: any;
    caption?: string;
    aspectRatio?: "portrait" | "square" | "landscape";
  }>;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  title,
  columns = "3",
  items,
}) => {
  const gridCols = {
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    masonry: "columns-1 md:columns-2 lg:columns-3 gap-8",
  };

  const isMasonry = columns === "masonry";

  return (
    <section className="section-lg bg-background">
      <div className="container-xl">
        {title && (
          <h2 className="heading-2 mb-12 text-center md:text-left">{title}</h2>
        )}

        {isMasonry ? (
          <div className={cn(gridCols.masonry)}>
            {items.map((item, index) => (
              <StaggerContainer key={index} delay={index * 0.05}>
                <StaggerItem>
                  <div className="mb-8 break-inside-avoid group">
                    <div className="relative overflow-hidden bg-muted">
                      {item.media?.url && (
                        <Image
                          src={getMediaUrl(item.media.url)}
                          alt={item.caption || "Gallery image"}
                          width={800}
                          height={1200}
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>
                    {item.caption && (
                      <p className="body-small mt-4 italic opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              </StaggerContainer>
            ))}
          </div>
        ) : (
          <StaggerContainer>
            <div className={cn("grid gap-8 md:gap-12", gridCols[columns])}>
              {items.map((item, index) => (
                <StaggerItem key={index}>
                  <div className="group">
                    <div
                      className={cn(
                        "relative overflow-hidden bg-muted",
                        item.aspectRatio === "portrait" && "aspect-3/4",
                        item.aspectRatio === "square" && "aspect-square",
                        item.aspectRatio === "landscape" && "aspect-video",
                      )}
                    >
                      {item.media?.url && (
                        <Image
                          src={getMediaUrl(item.media.url)}
                          alt={item.caption || "Gallery image"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>
                    {item.caption && (
                      <p className="body-small mt-4 italic">{item.caption}</p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>
    </section>
  );
};
