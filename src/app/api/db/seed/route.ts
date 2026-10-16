import { NextResponse } from 'next/server';
import { syncAllSeedDataToSupabase } from '@/lib/erpPersistence';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Supabase credentials are not configured in environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY first.',
        },
        { status: 400 }
      );
    }

    const result = await syncAllSeedDataToSupabase();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to sync seed data to Supabase.',
          counts: result.counts,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ArielMC ERP master seed data successfully synced to Supabase PostgreSQL.',
      counts: result.counts,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error while seeding database.',
      },
      { status: 500 }
    );
  }
}
