import { NextRequest, NextResponse } from 'next/server';
import { hostawayService } from '@/lib/services/hostawayService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listing = searchParams.get('listing');
    
    const reviews = listing
      ? await hostawayService.fetchReviewsByListing(listing)
      : await hostawayService.fetchReviews();
    
    // Get stats if no specific listing requested
    const stats = !listing ? await hostawayService.getReviewStats() : null;
    
    return NextResponse.json({
      status: 'success',
      result: reviews,
      count: reviews.length,
      stats,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: (error as Error)?.message || 'Failed to fetch reviews',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}