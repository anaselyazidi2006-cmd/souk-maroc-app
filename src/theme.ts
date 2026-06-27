export const COLORS = {
  // Brand
  primary:   '#E8572A',   // warm orange-red (Moroccan terracotta)
  primary100:'#FFF1EC',
  primary200:'#FFD6C8',
  primary300:'#FFB49A',
  primary700:'#C43E18',

  // Semantic
  success:   '#22C55E',
  warning:   '#F59E0B',
  error:     '#EF4444',
  info:      '#3B82F6',

  // Backgrounds
  background:    '#F6F6F9',
  card:          '#FFFFFF',
  cardAlt:       '#F1F1F5',
  surface:       '#FAFAFA',

  // Text
  textPrimary:   '#111318',
  textSecondary: '#6B6F80',
  textTertiary:  '#9FA3B4',
  textInverse:   '#FFFFFF',

  // Borders
  border:        '#E8E9EE',
  borderLight:   '#F0F1F5',

  // Overlays
  overlay:       'rgba(0,0,0,0.45)',
  overlayLight:  'rgba(0,0,0,0.18)',

  // Star rating
  star:          '#F59E0B',
  starEmpty:     '#DDE0EA',

  // Tab bar
  tabActive:     '#E8572A',
  tabInactive:   '#B0B3C5',

  // Badge
  badge:         '#E8572A',
} as const;

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl:32,
} as const;

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 28,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   16,
  lg:   18,
  xl:   22,
  xxl:  26,
  xxxl: 32,
} as const;

export const SHADOW = {
  sm:  '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
  md:  '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)',
  lg:  '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
  primary: '0 8px 24px rgba(232,87,42,0.28)',
} as const;
