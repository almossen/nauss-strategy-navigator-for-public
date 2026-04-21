export const DISTRIBUTION_DATA: Record<string, number[]> = {
  'التعليم': [0.10875, 0.27038, 0.21138, 0.24088, 0.16863],
  'البحث والابتكار': [0.15830, 0.21950, 0.20680, 0.19930, 0.21630],
  'التدريب': [0.13200, 0.28800, 0.34040, 0.12880, 0.11080],
  'العلاقات الخارجية': [0.10250, 0.31000, 0.20880, 0.18380, 0.19500],
};

// Recomputed average across all 4 pillars
export const OVERALL_DISTRIBUTION = [0.12539, 0.27197, 0.24185, 0.18820, 0.17268];

export const ALL_YEARS = [2025, 2026, 2027, 2028, 2029] as const;
