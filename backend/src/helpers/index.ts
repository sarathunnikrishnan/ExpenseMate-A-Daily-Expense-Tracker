/**
 * @file index.ts
 * @description Barrel export for helper utilities.
 */

export const formatDateHelper = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
