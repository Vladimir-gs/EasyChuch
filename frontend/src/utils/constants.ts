export const INCOME_CATEGORIES = ['TITHES', 'OFFERINGS', 'DONATIONS', 'EVENTS'] as const;
export const EXPENSE_CATEGORIES = ['UTILITIES', 'MAINTENANCE', 'SALARIES', 'EVENTS'] as const;
export const ROLES = ['ADMIN', 'TREASURER', 'MEMBER'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  TITHES: 'Tithes',
  OFFERINGS: 'Offerings',
  DONATIONS: 'Donations',
  EVENTS: 'Events',
  UTILITIES: 'Utilities',
  MAINTENANCE: 'Maintenance',
  SALARIES: 'Salaries',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  TREASURER: 'Treasurer',
  MEMBER: 'Member',
};
