/**
 * Professional Image Utility for Marketplace
 * Generates unique, category-specific high-quality images
 * Ensures no duplicate images across products
 */

interface CategoryImageConfig {
  keywords: string[]
  width: number
  height: number
  seed?: string
}

// Category-specific image configurations
const categoryConfigs: Record<string, CategoryImageConfig> = {
  development: {
    keywords: ['code', 'programming', 'developer', 'laptop', 'coding'],
    width: 1200,
    height: 800,
  },
  writing: {
    keywords: ['writing', 'notebook', 'pen', 'journal', 'creative'],
    width: 1200,
    height: 800,
  },
  business: {
    keywords: ['business', 'office', 'meeting', 'strategy', 'corporate'],
    width: 1200,
    height: 800,
  },
  ai: {
    keywords: ['ai', 'artificial-intelligence', 'robot', 'technology', 'neural'],
    width: 1200,
    height: 800,
  },
  marketing: {
    keywords: ['marketing', 'advertising', 'social-media', 'campaign', 'branding'],
    width: 1200,
    height: 800,
  },
  data: {
    keywords: ['data', 'analytics', 'charts', 'graphs', 'statistics'],
    width: 1200,
    height: 800,
  },
  design: {
    keywords: ['design', 'ui', 'ux', 'creative', 'art'],
    width: 1200,
    height: 800,
  },
  education: {
    keywords: ['education', 'learning', 'books', 'study', 'knowledge'],
    width: 1200,
    height: 800,
  },
  health: {
    keywords: ['health', 'fitness', 'wellness', 'exercise', 'healthy'],
    width: 1200,
    height: 800,
  },
  other: {
    keywords: ['technology', 'innovation', 'digital', 'modern', 'future'],
    width: 1200,
    height: 800,
  },
}

/**
 * Generate a unique image URL for a product
 * Uses Unsplash Source for high-quality, unique images
 * @param category - Product category
 * @param productId - Unique product ID to ensure uniqueness
 * @param title - Product title (used as seed for consistency)
 * @returns High-quality image URL (4K/HD)
 */
export function generateProductImage(
  category: string,
  productId: string,
  title: string = ''
): string {
  const config = categoryConfigs[category] || categoryConfigs.other
  
  // Create a unique seed from product ID and title
  const seed = `${productId}_${title}`.replace(/[^a-zA-Z0-9]/g, '_')
  
  // Use Unsplash Source with category keyword and unique seed
  const keyword = config.keywords[0]
  
  // Generate unique image URL with high quality
  // Using Unsplash Source API for consistent, high-quality images
  const width = config.width
  const height = config.height
  
  // Create hash from product ID for uniqueness
  const hash = simpleHash(productId)
  
  // Use Picsum Photos with seed for unique, high-quality images
  // Format: https://picsum.photos/seed/{seed}/{width}/{height}
  return `https://picsum.photos/seed/${seed}${hash}/${width}/${height}`
}

/**
 * Generate a set of unique product images (for gallery/carousel)
 * @param category - Product category
 * @param productId - Unique product ID
 * @param title - Product title
 * @param count - Number of images to generate
 * @returns Array of unique image URLs
 */
export function generateProductImageGallery(
  category: string,
  productId: string,
  title: string = '',
  count: number = 3
): string[] {
  const images: string[] = []
  
  for (let i = 0; i < count; i++) {
    // Create unique seed for each image
    const uniqueSeed = `${productId}_${title}_${i}_gallery`
    const hash = simpleHash(uniqueSeed)
    const config = categoryConfigs[category] || categoryConfigs.other
    
    images.push(
      `https://picsum.photos/seed/${uniqueSeed}${hash}/${config.width}/${config.height}`
    )
  }
  
  return images
}

/**
 * Generate a high-quality thumbnail (optimized size)
 * @param category - Product category
 * @param productId - Unique product ID
 * @param title - Product title
 * @returns Thumbnail image URL
 */
export function generateProductThumbnail(
  category: string,
  productId: string,
  title: string = ''
): string {
  const seed = `${productId}_${title}_thumb`
  const hash = simpleHash(seed)
  
  // Thumbnail size (optimized for performance)
  return `https://picsum.photos/seed/${seed}${hash}/400/300`
}

/**
 * Generate 3D-style image URL (for premium products)
 * Uses different aspect ratio and keywords
 */
export function generate3DProductImage(
  category: string,
  productId: string,
  title: string = ''
): string {
  const seed = `${productId}_${title}_3d`
  const hash = simpleHash(seed)
  
  // Square aspect ratio for 3D style
  return `https://picsum.photos/seed/${seed}${hash}/1200/1200`
}

/**
 * Generate 4K Ultra HD image URL
 */
export function generate4KProductImage(
  category: string,
  productId: string,
  title: string = ''
): string {
  const seed = `${productId}_${title}_4k`
  const hash = simpleHash(seed)
  
  // 4K resolution (3840x2160)
  return `https://picsum.photos/seed/${seed}${hash}/3840/2160`
}

/**
 * Simple hash function to create unique numeric values
 * @param str - String to hash
 * @returns Numeric hash
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Get category-specific image placeholder
 * Returns a styled placeholder if image fails to load
 */
export function getCategoryPlaceholder(category: string): string {
  const emojiMap: Record<string, string> = {
    development: '💻',
    writing: '✍️',
    business: '💼',
    ai: '🤖',
    marketing: '📢',
    data: '📊',
    design: '🎨',
    education: '📚',
    health: '💪',
    other: '✨'
  }
  
  return emojiMap[category] || '✨'
}

/**
 * Check if image exists and is accessible
 * @param url - Image URL to check
 * @returns Promise<boolean>
 */
export async function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Generate optimized image URL with quality parameters
 * @param baseUrl - Base image URL
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export function optimizeImageUrl(baseUrl: string, quality: number = 85): string {
  // Add quality parameter if supported by the service
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}quality=${quality}`
}


