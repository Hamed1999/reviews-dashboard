export type ReviewCategory = { category: string; rating: number };

export type RawReview = {
  id: number;
  type?: string;
  status?: string;
  rating?: number | null;
  publicReview?: string;
  reviewCategory?: ReviewCategory[];
  submittedAt?: string;
  guestName?: string;
  listingName?: string;
  channel?: string;
  listingId?: number;
  reservationId?: number;
  guestId?: number;
};

export type NormalizedReview = {
  id: number;
  listing: string;
  type: string;
  channel: string;
  status: string;
  rating: number | null;
  categories: Record<string, number>;
  publicReview?: string;
  submittedAt: string;
  guestName?: string;
  listingId?: number;
  reservationId?: number;
  guestId?: number;
};

export type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  totalListings: number;
  categoryAverages: Record<string, number>;
  recentReviews: NormalizedReview[];
  topListings: Array<{ listing: string; averageRating: number; reviewCount: number }>;
};

export type HostawayApiResponse = {
  status: string;
  result?: RawReview[];
  count?: number;
  limit?: number;
  offset?: number;
  message?: string;
};