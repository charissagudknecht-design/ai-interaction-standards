/**
 * Glow AI Prompt Box — Design Tokens
 *
 * All colors are defined as swappable tokens so the Ruby Berry saturation
 * can be refined without touching component logic.
 */

export const glow = {
  // ── Brand Colors ──────────────────────────────────────────────────────
  rubyBerry: '#C0429F',
  champagne: '#FBECD6',
  neutralGray: '#9E9E9E',
  textPrimary: '#0A0A0A',
  textGhost: '#9E9E9E',

  // ── Gradient (warm spectrum for "Glow" rainbow border) ───────────────
  gradient: ['#E082C0', '#C0429F', '#FF7584', '#FFB98C'] as const,

  // ── Glow / Shadow ─────────────────────────────────────────────────────
  glow: {
    large: '0 0 15px rgba(192, 66, 159, 0.25)',
    small: 'none',
  },

  // ── Structural ────────────────────────────────────────────────────────
  radius: '12px',
  borderWidth: '2px',
  minHeight: { large: '92px', small: '74px' },
  maxHeight: '320px',
  iconSize: { large: 24, small: 20 },
  padding: {
    large: { input: '16px 16px 0 16px', toolbar: '8px 16px 12px 16px' },
    small: { input: '12px 12px 0 12px', toolbar: '6px 12px 10px 12px' },
  },

  // ── Timing ────────────────────────────────────────────────────────────
  rainbowDuration: '2s',
  buffer: 150, // ms
  transitionDuration: 200, // ms
  pulseDuration: '3s',
  waveformDuration: 0.6, // seconds per cycle
} as const;

/** CSS custom properties version — paste into :root or a wrapper div. */
export const cssVariables = `
  --glow-accent: ${glow.rubyBerry};
  --glow-accent-rgb: 192, 66, 159;
  --glow-accent-light: ${glow.champagne};
  --glow-gradient-1: ${glow.gradient[0]};
  --glow-gradient-2: ${glow.gradient[1]};
  --glow-gradient-3: ${glow.gradient[2]};
  --glow-gradient-4: ${glow.gradient[3]};
  --glow-text: ${glow.textPrimary};
  --glow-ghost: ${glow.textGhost};
`;
