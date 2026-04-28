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

`OPENAI_IMAGE_MODEL` defaults to `gpt-image-1.5`; override it per environment if another image model is available.

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

## Review Rules

Before committing generated images, inspect every file for fake text, logos, distorted hands, uncanny faces, third-party marks, and collection imagery that implies real garment proof. Generated assets are acceptable as editorial atmosphere or layout material only after review.
