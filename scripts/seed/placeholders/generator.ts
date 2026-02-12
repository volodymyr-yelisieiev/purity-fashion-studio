/**
 * Branded SVG placeholder generator.
 *
 * Produces beautiful abstract-gradient SVGs with subtle geometry,
 * converted to JPEG via sharp for Payload upload.
 */
import sharp from "sharp";

interface PlaceholderPalette {
  /** Primary gradient start color */
  from: string;
  /** Primary gradient end color */
  to: string;
  /** Optional accent color for geometric elements */
  accent?: string;
  /** Label text color */
  fg: string;
}

interface GeneratePlaceholderOpts {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Brand-themed color palette */
  palette: PlaceholderPalette;
  /** Label rendered at low opacity */
  label: string;
}

/**
 * Generate a branded placeholder JPEG from an SVG template.
 *
 * Uses abstract diagonal gradients with subtle geometric accents
 * (circles, diagonal lines) for a premium, Dieter Rams–inspired feel.
 */
export async function generatePlaceholder(
  opts: GeneratePlaceholderOpts,
): Promise<Buffer> {
  const { width, height, palette, label } = opts;
  const accent = palette.accent ?? palette.to;

  // Subtle geometric accent elements
  const cx1 = Math.round(width * 0.75);
  const cy1 = Math.round(height * 0.25);
  const r1 = Math.round(Math.min(width, height) * 0.18);

  const cx2 = Math.round(width * 0.2);
  const cy2 = Math.round(height * 0.8);
  const r2 = Math.round(Math.min(width, height) * 0.12);

  const cx3 = Math.round(width * 0.5);
  const cy3 = Math.round(height * 0.55);
  const r3 = Math.round(Math.min(width, height) * 0.08);

  const cx4 = Math.round(width * 0.85);
  const cy4 = Math.round(height * 0.65);
  const r4 = Math.round(Math.min(width, height) * 0.06);

  const fontSize = Math.max(14, Math.floor(width / 30));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.from}" />
      <stop offset="100%" stop-color="${palette.to}" />
    </linearGradient>
    <linearGradient id="acc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.08" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.02" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.06" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background gradient -->
  <rect width="100%" height="100%" fill="url(#bg)" />

  <!-- Soft radial glow -->
  <ellipse cx="${Math.round(width * 0.4)}" cy="${Math.round(height * 0.4)}" rx="${Math.round(width * 0.5)}" ry="${Math.round(height * 0.5)}" fill="url(#glow)" />

  <!-- Geometric accents -->
  <circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="url(#acc)" />
  <circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="${accent}" opacity="0.05" />
  <circle cx="${cx3}" cy="${cy3}" r="${r3}" fill="${accent}" opacity="0.03" />
  <circle cx="${cx4}" cy="${cy4}" r="${r4}" fill="url(#acc)" opacity="0.07" />
  <line x1="0" y1="${Math.round(height * 0.6)}" x2="${width}" y2="${Math.round(height * 0.35)}" stroke="${accent}" stroke-width="1" opacity="0.06" />
  <line x1="0" y1="${Math.round(height * 0.8)}" x2="${width}" y2="${Math.round(height * 0.55)}" stroke="${accent}" stroke-width="0.5" opacity="0.04" />
  <line x1="${Math.round(width * 0.3)}" y1="0" x2="${Math.round(width * 0.7)}" y2="${height}" stroke="${accent}" stroke-width="0.5" opacity="0.03" />

  <!-- Label -->
  <text
    x="50%" y="50%"
    font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
    font-size="${fontSize}"
    font-weight="300"
    letter-spacing="0.2em"
    fill="${palette.fg}"
    text-anchor="middle"
    dominant-baseline="middle"
    opacity="0.18"
  >${label}</text>
</svg>`;

  return sharp(Buffer.from(svg))
    .resize(width, height)
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer();
}

export type { PlaceholderPalette, GeneratePlaceholderOpts };
