import { NormalizedReview } from '../../types/review';

const HOSTAWAY_API_URL = process.env.HOSTAWAY_API_URL || 'https://api.hostaway.com';
const HOSTAWAY_ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID;
const HOSTAWAY_API_KEY = process.env.HOSTAWAY_API_KEY;

export class HostawayService {
  private cache: Map<string, { data: NormalizedReview[]; timestamp: number }> = new Map();
  private cacheDuration = parseInt(process.env.HOSTAWAY_CACHE_DURATION || '3600') * 1000;

  /**
   * Fetch reviews from Hostaway API
   */
  async fetchReviews(listingFilter?: string): Promise<NormalizedReview[]> {
    // Check cache first
    const cacheKey = listingFilter || 'all';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('Returning cached reviews');
      return cached.data;
    }

    if (!HOSTAWAY_ACCOUNT_ID || !HOSTAWAY_API_KEY) {
      console.warn('Hostaway API credentials not configured, using mock data');
      return this.getMockReviews(listingFilter);
    }

    try {
      const url = new URL(`${HOSTAWAY_API_URL}/v1/reviews`);
      url.searchParams.append('accountId', HOSTAWAY_ACCOUNT_ID);
      url.searchParams.append('status', 'published');
      url.searchParams.append('limit', '100');
      
      if (listingFilter) {
        url.searchParams.append('listingName', listingFilter);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${HOSTAWAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Revalidate every hour (Next.js caching)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(`API returned error status: ${data.status}`);
      }

      const normalizedReviews = (data.result || []).map(this.normalizeReview.bind(this));
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: normalizedReviews,
        timestamp: Date.now(),
      });

      return normalizedReviews;

    } catch (error) {
      console.error('Hostaway API fetch failed:', error);
      // Fallback to mock data
      return this.getMockReviews(listingFilter);
    }
  }

  /**
   * Fetch reviews for a specific listing
   */
  async fetchReviewsByListing(listingName: string): Promise<NormalizedReview[]> {
    return this.fetchReviews(listingName);
  }

  /**
   * Fetch review by ID
   */
  async fetchReviewById(id: number): Promise<NormalizedReview | null> {
    const allReviews = await this.fetchReviews();
    return allReviews.find(review => review.id === id) || null;
  }

  /**
   * Get review statistics
   */
  async getReviewStats() {
    const reviews = await this.fetchReviews();
    
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
      : 0;
    
    const listings = [...new Set(reviews.map(r => r.listing))];
    const totalListings = listings.length;

    // Calculate category averages
    const categoryAverages: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    reviews.forEach(review => {
      Object.entries(review.categories || {}).forEach(([category, rating]) => {
        categoryAverages[category] = (categoryAverages[category] || 0) + rating;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });

    Object.keys(categoryAverages).forEach(category => {
      categoryAverages[category] = categoryAverages[category] / categoryCounts[category];
    });

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalListings,
      categoryAverages,
    };
  }

  /**
   * Normalize a raw Hostaway review
   */
  private normalizeReview(rawReview: any): NormalizedReview {
    const categories: Record<string, number> = {};
    
    (rawReview.reviewCategory || []).forEach((c: any) => {
      if (c?.category && typeof c.rating === 'number') {
        const normalizedCategory = c.category.toLowerCase().replace(/\s+/g, '_');
        categories[normalizedCategory] = c.rating;
      }
    });

    let rating: number | null = typeof rawReview.rating === 'number' ? rawReview.rating : null;
    
    if (rating === null && Object.keys(categories).length > 0) {
      const values = Object.values(categories);
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      rating = Math.round(average * 10) / 10;
    }

    return {
      id: rawReview.id,
      listing: rawReview.listingName || `Property ${rawReview.listingId}` || 'Unknown',
      type: rawReview.type || 'unknown',
      channel: rawReview.channel || 'hostaway',
      status: rawReview.status || 'unknown',
      rating,
      categories,
      publicReview: rawReview.publicReview,
      submittedAt: this.normalizeDate(rawReview.submittedAt),
      guestName: rawReview.guestName,
      listingId: rawReview.listingId,
      reservationId: rawReview.reservationId,
      guestId: rawReview.guestId,
    };
  }

  /**
   * Normalize date string to ISO format
   */
  private normalizeDate(dateString?: string): string {
    if (!dateString) return new Date().toISOString();
    
    try {
      // Try parsing as ISO
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
      
      // Try parsing common formats
      const formats = [
        'YYYY-MM-DD HH:mm:ss',
        'YYYY/MM/DD HH:mm:ss',
        'DD-MM-YYYY HH:mm:ss',
        'DD/MM/YYYY HH:mm:ss',
      ];
      
      for (const format of formats) {
        const normalized = dateString.replace(/[\/\s:-]/g, '-');
        const parts = normalized.split('-');
        
        if (parts.length >= 3) {
          // Try to create a date from parts
          const year = parts[0].length === 4 ? parts[0] : parts[2];
          const month = parts[1];
          const day = parts[0].length === 4 ? parts[2] : parts[0];
          const time = parts[3] || '00:00:00';
          
          const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}Z`;
          const date = new Date(isoString);
          
          if (!isNaN(date.getTime())) {
            return date.toISOString();
          }
        }
      }
      
      return new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  /**
   * Fallback mock data
   */
  private async getMockReviews(listingFilter?: string): Promise<NormalizedReview[]> {
    try {
      // Try to read from local file
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'data', 'hostaway.json');
      const rawText = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(rawText);
      
      const normalized = (data.result || []).map(this.normalizeReview.bind(this));
      
      if (listingFilter) {
        return normalized.filter(review =>
          review.listing.toLowerCase().includes(listingFilter.toLowerCase())
        );
      }
      
      return normalized;
    } catch (error) {
      console.error('Mock data load failed:', error);
      return [];
    }
  }
}

// Export singleton instance
export const hostawayService = new HostawayService();