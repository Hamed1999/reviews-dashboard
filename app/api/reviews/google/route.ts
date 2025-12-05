import { NextResponse } from 'next/server';

export async function GET() {  
  const mockGoogleReviews = {
    status: 'success',
    result: [
      {
        id: 'google_1',
        source: 'google',
        author: 'John D.',
        rating: 4.5,
        text: 'Great location and clean apartment. Would stay again!',
        time: '2024-01-15T10:30:00Z',
        relative_time: '2 months ago',
        language: 'en',
      },
      {
        id: 'google_2',
        source: 'google',
        author: 'Sarah M.',
        rating: 5.0,
        text: 'Excellent communication from the host. Very responsive.',
        time: '2024-01-10T14:20:00Z',
        relative_time: '2 months ago',
        language: 'en',
      },
    ],
    documentation: {
      integration_notes: [
        'Google Places API requires authentication with API key',
        'Each property needs a Google Place ID',
        'API has usage limits and costs after free tier',
        'Reviews are read-only via the API',
        'Need to handle rate limiting (60 requests per minute)',
      ],
      required_steps: [
        'Enable Google Places API in Google Cloud Console',
        'Create API key with Places API restriction',
        'Find Place ID for each property using Places API',
        'Implement proper error handling for API limits',
        'Cache responses to reduce API calls',
      ],
      limitations: [
        'Cannot post or reply to reviews via API',
        'Some reviews may be filtered by Google',
        'Limited historical data available',
        'Requires property to have a Google Business Profile',
      ],
      alternatives: [
        'Use third-party aggregation services (Birdeye, Podium)',
        'Embed Google reviews widget (simpler but less control)',
        'Manual import of Google reviews',
      ],
    },
  };

  return NextResponse.json(mockGoogleReviews);
}