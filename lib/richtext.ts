/**
 * Utilities for working with Payload CMS Lexical RichText content
 */

// Type for Lexical rich text node structure
interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
}

interface LexicalRoot {
  root: {
    type: string;
    children: LexicalNode[];
    [key: string]: unknown;
  };
}

type RichTextContent = LexicalRoot | string | null | undefined;

/**
 * Extract plain text from Lexical rich text content
 * Useful for displaying excerpts, meta descriptions, and previews
 */
export function extractTextFromRichText(content: RichTextContent): string {
  if (!content) return "";

  // If it's already a string, return it
  if (typeof content === "string") return content;

  // If it doesn't have the expected structure, return empty
  if (!content.root?.children) return "";

  const extractText = (nodes: LexicalNode[]): string => {
    return nodes
      .map((node) => {
        // Direct text node
        if (node.text) return node.text;

        // Node with children
        if (node.children && Array.isArray(node.children)) {
          return extractText(node.children);
        }

        return "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  };

  return extractText(content.root.children);
}

/**
 * Check if rich text content has any actual content
 */
export function hasRichTextContent(content: RichTextContent): boolean {
  return extractTextFromRichText(content).length > 0;
}

/**
 * Truncate rich text to a specific character length
 */
export function truncateRichText(
  content: RichTextContent,
  maxLength: number = 150
): string {
  const text = extractTextFromRichText(content);
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + "...";
}
