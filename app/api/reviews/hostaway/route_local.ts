import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

type ReviewCategory = { category: string; rating: number };

type RawReview = {
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
};

type HostawayFile = {
  status?: string;
  result?: RawReview[];
};

type NormalizedReview = {
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
};

function toISO(dateLike?: string): string {
  if (!dateLike) return new Date().toISOString();
  try {
    return new Date(dateLike.replace(' ', 'T') + 'Z').toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function normalizeReview(r: RawReview): NormalizedReview {
  const categories: Record<string, number> = {};
  (r.reviewCategory ?? []).forEach((c) => {
    if (typeof c?.category === 'string' && typeof c?.rating === 'number') {
      categories[c.category] = c.rating;
    }
  });

  let rating: number | null = typeof r.rating === 'number' ? r.rating : null;
  if (rating === null && Object.keys(categories).length > 0) {
    const vals = Object.values(categories);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    rating = Math.round(avg * 10) / 10; 
  }

  return {
    id: r.id,
    listing: r.listingName ?? 'Unknown listing',
    type: r.type ?? 'unknown',
    channel: r.channel ?? 'hostaway',
    status: r.status ?? 'unknown',
    rating,
    categories,
    publicReview: r.publicReview,
    submittedAt: toISO(r.submittedAt),
    guestName: r.guestName,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listing = searchParams.get('listing');
    
    const filePath = path.join(process.cwd(), 'data', 'hostaway.json');
    const rawText = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(rawText) as HostawayFile;

    const normalized: NormalizedReview[] = (parsed.result ?? []).map(normalizeReview);

    // Filter by listing if provided
    let filtered = normalized;
    if (listing) {
      filtered = normalized.filter(review => 
        review.listing.toLowerCase().includes(listing.toLowerCase()) ||
        listing.toLowerCase().includes(review.listing.toLowerCase())
      );
    }

    return NextResponse.json({ 
      status: 'success', 
      result: filtered,
      count: filtered.length 
    });
  } catch (err) {
    console.error('hostaway API error', err);
    return NextResponse.json(
      { status: 'error', message: (err as Error)?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}