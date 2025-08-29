/**
 * Design constants for unified pact display
 * Ensures consistent sizing, colors, and animations across all pact states
 */

export const PACT_DISPLAY_CONSTANTS = {
  // Layout dimensions
  CONTAINER_HEIGHT: 500,
  CONTAINER_MAX_WIDTH: 400,
  ENERGY_CIRCLE_SIZE: 'lg' as const,
  NAVIGATION_HEIGHT: 80,
  
  // Spacing
  SPACING: {
    SECTION: 24,
    ELEMENT: 16,
    COMPACT: 8,
  },
  
  // Animation durations (ms)
  ANIMATIONS: {
    BUTTON_HOVER: 200,
    PACT_TRANSITION: 300,
    PROGRESS_FILL: 500,
    TIMER_UPDATE: 100,
  },
  
  // Typography
  TYPOGRAPHY: {
    TITLE_SIZE: 'text-xl',
    PROGRESS_SIZE: 'text-4xl',
    COUNTER_SIZE: 'text-lg',
    DESCRIPTION_SIZE: 'text-sm',
  },
  
  // Status colors (using semantic tokens)
  STATUS_COLORS: {
    active: {
      primary: 'text-foreground',
      accent: 'text-cosmic-accent',
      background: 'bg-cosmic-primary/20',
      border: 'border-cosmic-accent/30',
    },
    completed: {
      primary: 'text-green-300',
      accent: 'text-green-400',
      background: 'bg-green-500/20',
      border: 'border-green-400/30',
    },
    failed: {
      primary: 'text-red-300',
      accent: 'text-red-400',
      background: 'bg-red-500/20',
      border: 'border-red-400/30',
    },
    planned: {
      primary: 'text-cosmic-secondary',
      accent: 'text-cosmic-secondary/70',
      background: 'bg-cosmic-secondary/10',
      border: 'border-cosmic-secondary/20',
    },
  },
  
  // Navigation
  NAVIGATION: {
    BUTTON_SIZE: 48,
    DOT_SIZE: 12,
    DOT_SPACING: 8,
  },
  
  // Timer update frequencies
  TIMER_FREQUENCIES: {
    SECONDS: 1000,      // Update every second when showing seconds
    MINUTES: 60000,     // Update every minute when > 1 hour left
    HOURS: 3600000,     // Update every hour when > 1 day left
  },
  
  // Break ascesis
  BREAK_ASCESIS: {
    UNDO_TIMEOUT: 10000, // 10 seconds to undo
    QUICK_REASONS: [
      'emergency',
      'health',
      'force_majeure',
      'personal',
    ],
  },
  
  // Performance
  PERFORMANCE: {
    DEBOUNCE_MS: 50,
    VIRTUALIZATION_THRESHOLD: 10,
    PRELOAD_ADJACENT: 2,
  },
} as const;

export type PactStatus = keyof typeof PACT_DISPLAY_CONSTANTS.STATUS_COLORS;
export type TimerFrequency = keyof typeof PACT_DISPLAY_CONSTANTS.TIMER_FREQUENCIES;