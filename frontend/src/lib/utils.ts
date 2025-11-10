/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Extract preview from markdown content
 */
export function extractPreview(markdown: string, maxLength: number = 150): string {
  // Remove markdown syntax
  const plainText = markdown
    .replace(/#{1,6}\s/g, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\n/g, ' ') // Replace newlines with space
    .trim();

  return truncateText(plainText, maxLength);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, length: number = 200): string {
  const strippedContent = content.replace(/<[^>]+>/g, '');
  return strippedContent.length > length
    ? strippedContent.substring(0, length) + '...'
    : strippedContent;
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagString: string): string[] {
  return tagString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
}

/**
 * Format tags to comma-separated string
 */
export function formatTags(tags: string[]): string {
  return tags.join(', ');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
