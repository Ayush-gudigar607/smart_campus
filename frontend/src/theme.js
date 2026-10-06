/**
 * CampusConnect Design Tokens
 * Extracted directly from the Stitch MCP "Smart Campus Mobility" Design System
 */

export const colors = {
  // Brand Accents
  primary: '#4F46E5', // Indigo - core interactive triggers, active tab items
  primaryLight: '#EEF2FF', // Indigo 50
  primaryContainer: '#DAD7FF',
  primaryDark: '#3730A3',

  secondary: '#14B8A6', // Teal - confirmations, environmental metrics
  secondaryLight: '#CCFBF1',
  secondaryContainer: '#6DF5E1',

  tertiary: '#3B82F6', // Blue

  // Canvas & Surfaces
  canvas: '#FAF8FF',
  background: '#F8FAFC', // Slate 50 anti-glare mobile backdrop
  surface: '#FFFFFF', // Pure white card & actionable containers
  surfaceMuted: '#F1F5F9', // Slate 100 for search bars, tab tracks
  border: '#E2E8F0', // Slate 200 hairline border
  borderFocus: '#4F46E5',

  // Typography & Content
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#334155', // Slate 700
  textMuted: '#64748B', // Slate 500
  textInverse: '#FFFFFF',

  // Status Tones (Surface / Foreground pairs)
  status: {
    pending: {
      fg: '#D97706',
      bg: '#FEF3C7',
      border: '#FDE68A',
      label: 'Pending',
    },
    assigned: {
      fg: '#2563EB',
      bg: '#DBEAFE',
      border: '#BFDBFE',
      label: 'Assigned',
    },
    in_progress: {
      fg: '#7C3AED',
      bg: '#EDE9FE',
      border: '#DDD6FE',
      label: 'In Progress',
    },
    completed: {
      fg: '#059669',
      bg: '#D1FAE5',
      border: '#A7F3D0',
      label: 'Completed',
    },
    cancelled: {
      fg: '#DC2626',
      bg: '#FEE2E2',
      border: '#FECACA',
      label: 'Cancelled',
    },
    rejected: {
      fg: '#DC2626',
      bg: '#FEE2E2',
      border: '#FECACA',
      label: 'Rejected',
    },
    critical: {
      fg: '#EA580C',
      bg: '#FFEDD5',
      border: '#FED7AA',
      label: 'Escalated',
    },
  },

  // Priority Indicators
  priority: {
    low: {
      color: '#64748B',
      label: 'Low',
    },
    medium: {
      color: '#3B82F6',
      label: 'Medium',
    },
    high: {
      color: '#F97316',
      label: 'High',
    },
    urgent: {
      color: '#EF4444',
      label: 'Urgent',
    },
  },
};

export const typography = {
  displayLg: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headlineLg: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headlineMd: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  bodyMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  labelLg: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelSm: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: colors.textMuted,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 16,
  margin: 16,
};

export const radii = {
  sm: 6,
  md: 8,
  lg: 12, // Interactive controls, primary buttons, input fields
  xl: 16, // Cards, modal dialogs, bottom sheets
  pill: 9999, // Status & priority chips
};

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  modal: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

export default {
  colors,
  typography,
  spacing,
  radii,
  shadows,
};
