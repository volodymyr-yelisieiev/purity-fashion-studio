/**
 * EmptyState Component
 *
 * Display when a collection has no items to show.
 * Provides a clear message and optional call-to-action.
 *
 * @example
 * <EmptyState
 *   title="No services yet"
 *   description="Check back soon for our styling services."
 *   action={{ label: "Go Home", href: "/" }}
 * />
 */

import { Button } from "./Button";
import { H3, Body } from "./Typography";
import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  /** Main message title */
  title: string;
  /** Descriptive message */
  description: string;
  /** Optional icon to display above title */
  icon?: ReactNode;
  /** Optional call-to-action button */
  action?: {
    label: string;
    href: string;
  };
}

/**
 * EmptyState - Displays when a collection or list is empty
 * Used for graceful handling of no-content scenarios
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-100 items-center justify-center px-4">
      <div className="max-w-md text-center">
        {icon && (
          <div className="mb-6 flex justify-center text-muted-foreground">
            {icon}
          </div>
        )}
        <H3 className="mb-4">{title}</H3>
        <Body className="mb-8">{description}</Body>
        {action && (
          <Button asChild variant="outline">
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
