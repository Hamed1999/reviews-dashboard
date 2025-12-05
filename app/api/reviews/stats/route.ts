import { NextResponse } from 'next/server';
import { hostawayService } from '@/lib/services/hostawayService';

export async function GET() {
  try {
    const stats = await hostawayService.getReviewStats();
    
    return NextResponse.json({
      status: 'success',
      ...stats,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch review statistics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}