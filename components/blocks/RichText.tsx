import React from "react";
import { Reveal } from "../animations/Reveal";

interface RichTextBlockProps {
  content: any; // Lexical data
}

export const RichTextBlock: React.FC<RichTextBlockProps> = ({ content }) => {
  if (!content) return null;

  return (
    <section className="section-md bg-background">
      <div className="container-md">
        <Reveal direction="up">
          <div className="prose prose-lg dark:prose-invert max-w-none font-light leading-relaxed tracking-wide text-foreground/80">
            {/* 
              In a real scenario, we'd use a Payload Lexical renderer here. 
              For now, we'll assume the rendering is handled by a standard utility.
            */}
            {typeof content === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <p>Lexical rich text content would be rendered here.</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
