# PURITY Image Generation Pipeline

This utility generates reviewable editorial assets for the public site. It does not expose `OPENAI_API_KEY` to browser code.

## Configuration

Jobs live in `config/image-prompts.json`. Each job contains:

- `id`
- `owner`
- `outputPath`
- `model`
- `size`
- `quality`
- `output_format`
- `background`
- `prompt`

`OPENAI_IMAGE_MODEL` defaults to `gpt-image-2`; override it per environment only when intentionally testing another image model.

Validation runs before any OpenAI request:

- `size` may be `auto` or `WIDTHxHEIGHT`.
- Explicit dimensions must have both edges as multiples of 16.
- Neither edge may exceed 3840px.
- The long edge / short edge ratio may not exceed 3:1.
- Total pixels must be between 655,360 and 8,294,400.
- `background: "transparent"` is rejected when the resolved model is `gpt-image-2`.

Use WebP for generated site assets unless PNG is required for a specific integration. Because `gpt-image-2` does not support transparent backgrounds, isolated cutout-style assets should be generated on a pure white studio background with prompt language that keeps edges clean and easy to mask in CSS.

## Commands

Run generation without overwriting existing files:

```bash
npm run images:generate
```

Overwrite existing generated files:

```bash
npm run images:generate:force
```

The script writes images under `public/images/generated` and updates `public/images/generated/manifest.json`.

Existing output files are not overwritten unless `--force` is passed.

Manifest entries for generated or skipped jobs include review workflow fields:

- `reviewed: false`
- `notes: ""`
- `final: false`

If an existing manifest entry already has those fields, the script preserves their values when refreshing the generated metadata.

## Review Rules

Before committing generated images, inspect every file for fake text, logos, distorted hands, uncanny faces, third-party marks, and collection imagery that implies real garment proof. Generated assets are acceptable as editorial atmosphere or layout material only after review.
