# Agent conventions

These rules apply to every automated contributor.

## Before changing code

- Read this file and `CONTRIBUTING.md` completely.
- Read the relevant guide in `node_modules/next/dist/docs/` before changing
  Next.js code.
- Inspect the current worktree and preserve unrelated user changes.
- Reuse existing patterns and dependencies before creating anything new.

## Implementation

- Keep changes small, local, typed and accessible.
- Preserve localization, responsive behavior, content contracts and business
  logic unless the task explicitly changes them.
- Treat shadcn preset `b59jufTOPg` as the only UI-system source. Use semantic
  tokens and canonical `components/ui/*` APIs; never fork primitives for a page.
- Do not introduce `purity-*` colors, direct UI colors, Lucide, custom primitive
  variants, speculative abstractions, dependencies or configuration.
- Links navigate; buttons perform actions. Preserve keyboard behavior, focus
  rings, contrast, reduced motion and accessible names.
- Never weaken, skip or rewrite a check to hide a product defect.

## Verification and delivery

- Run the narrowest relevant check and report the exact command and result.
- Treat warnings, type errors, lint findings, test failures and build failures
  as blocking.
- Visual baseline updates require explicit manual approval.
- Follow Conventional Commits and the branch/PR workflow in `CONTRIBUTING.md`.
- Never push directly to protected `main`, force-push shared history, merge with
  pending or failing checks, expose secrets, or deploy without authorization.
- Any rule exception must be explicit, one-time and granted by the repository
  owner; do not infer or reuse approval.
