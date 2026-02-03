// Must match backend migration: jobs.category CHECK (category IN (...))
export const JOB_CATEGORIES = [
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "masonry",
  "cleaning",
  "general handyman",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export function categoryLabel(cat: string): string {
  return cat.replace(/\b\w/g, (c) => c.toUpperCase());
}
