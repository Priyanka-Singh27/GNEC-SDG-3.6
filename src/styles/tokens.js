// src/styles/tokens.js
export const colors = {
  // Brand
  blue:        '#1A56A0',
  blueLight:   '#E6F1FB',
  blueDark:    '#0C447C',

  // Vision module (teal)
  teal:        '#1D9E75',
  tealLight:   '#E1F5EE',
  tealDark:    '#085041',

  // Hearing module (coral/red)
  red:         '#E24B4A',
  redLight:    '#FCEBEB',
  redDark:     '#791F1F',

  // Priority levels
  amber:       '#BA7517',
  amberLight:  '#FAEEDA',
  amberDark:   '#633806',

  // Neutral
  gray50:      '#F4F4F2',
  gray200:     '#D3D1C7',
  gray400:     '#888780',
  gray600:     '#5F5E5A',
  gray900:     '#1A1A1A',

  // Semantic
  white:       '#FFFFFF',
  black:       '#1A1A1A',
  textPrimary: '#1A1A1A',
  textSecondary: '#5F5E5A',
  textTertiary:  '#888780',
  border:      'rgba(0,0,0,0.12)',
  borderLight: 'rgba(0,0,0,0.07)',
  surface:     '#F4F4F2',
};

export const font = {
  sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  mono: "'Courier New', monospace",
};

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  pill: '999px',
};

export const transition = {
  fast:   'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow:   'all 0.4s ease',
};

// Alert priority → colour mapping
export const priorityColors = {
  3: { bg: colors.red,      text: colors.white,    light: colors.redLight,   dark: colors.redDark },
  2: { bg: colors.amber,    text: colors.white,    light: colors.amberLight, dark: colors.amberDark },
  1: { bg: colors.teal,     text: colors.white,    light: colors.tealLight,  dark: colors.tealDark },
};
