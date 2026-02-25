export function slugifyCategory(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}
