export function formatMessageTime(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffMs = startOfToday.getTime() - startOfDate.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return timeStr;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}
