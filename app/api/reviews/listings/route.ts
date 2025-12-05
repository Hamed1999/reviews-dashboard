import { NextResponse } from 'next/server';
import { hostawayService } from '@/lib/services/hostawayService';

export async function GET() {
  try {
    const reviews = await hostawayService.fetchReviews();
    
    const listingsMap = new Map<string, { reviewCount: number; totalRating: number }>();
    
    reviews.forEach(review => {
      const listing = review.listing;
      const current = listingsMap.get(listing) || { reviewCount: 0, totalRating: 0 };
      
      current.reviewCount++;
      current.totalRating += review.rating || 0;
      listingsMap.set(listing, current);
    });
    
    const listings = Array.from(listingsMap.entries()).map(([listing, data]) => ({
      name: listing,
      reviewCount: data.reviewCount,
      averageRating: data.reviewCount > 0 ? data.totalRating / data.reviewCount : 0,
    }));
    
    return NextResponse.json({
      status: 'success',
      result: listings,
      count: listings.length,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch listings',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}