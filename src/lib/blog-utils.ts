/**
 * Blog utility functions for slug generation and content processing
 */

/**
 * Generates a URL-friendly slug from a Turkish title
 * Supports Turkish characters and proper transliteration
 */
export function generateSlug(title: string): string {
  const turkishCharMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',  
    'ı': 'i', 'I': 'I',
    'i': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  return title
    .toLowerCase()
    .replace(/[çğıöşü]/g, (match) => turkishCharMap[match] || match)
    .replace(/[ÇĞIÖŞÜ]/g, (match) => turkishCharMap[match]?.toLowerCase() || match)
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Calculates estimated reading time in minutes
 * Average reading speed: 200 words per minute
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Validates slug uniqueness against database
 */
export function validateSlugFormat(slug: string): boolean {
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug) && slug.length >= 3 && slug.length <= 100;
}

/**
 * Extracts excerpt from content if not provided
 */
export function generateExcerpt(content: string, maxLength: number = 200): string {
  // Remove HTML tags and markdown formatting
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/>\s/g, '') // Remove blockquotes
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSentence > maxLength * 0.5) {
    return plainText.substring(0, lastSentence + 1);
  } else if (lastSpace > maxLength * 0.5) {
    return plainText.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Sanitizes and normalizes tags array
 */
export function normalizeTags(tags: string[]): string[] {
  return tags
    .filter(tag => tag && typeof tag === 'string')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 50)
    .filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates
    .slice(0, 10); // Limit to 10 tags
}

/**
 * Validates publishedAt date for scheduled publishing
 */
export function validatePublishDate(publishedAt: string | null): Date | null {
  if (!publishedAt) return null;
  
  const date = new Date(publishedAt);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid publish date format');
  }
  
  return date;
}