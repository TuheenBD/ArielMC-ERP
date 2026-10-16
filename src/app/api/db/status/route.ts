import { NextResponse } from 'next/server';
import { testSupabaseHealth } from '@/lib/erpPersistence';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const configured = isSupabaseConfigured();
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const maskedUrl = rawUrl ? rawUrl.replace(/(https?:\/\/)(.{4})(.*)(\.supabase\.co)/, '$1$2****$4') : 'Not Configured';

    if (!configured) {
      return NextResponse.json({
        configured: false,
        connected: false,
        mode: 'LOCAL_HYBRID_FALLBACK',
        url: maskedUrl,
        latencyMs: 0,
        message: 'Supabase PostgreSQL is not configured. ArielMC ERP is currently operating safely in Local Hybrid Fallback mode using memory and browser cache.',
        help: 'To connect persistent storage, configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
      });
    }

    const health = await testSupabaseHealth();

    return NextResponse.json({
      configured: true,
      connected: health.connected,
      mode: health.connected ? 'SUPABASE_POSTGRES' : 'LOCAL_HYBRID_FALLBACK',
      url: maskedUrl,
      latencyMs: health.latencyMs,
      tableCounts: health.tableCounts,
      error: health.error,
      message: health.connected
        ? `Supabase PostgreSQL is connected and active (${health.latencyMs}ms latency).`
        : `Supabase credentials detected, but database connection could not be established: ${health.error || 'Unknown error'}. Local cache is active.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        configured: false,
        connected: false,
        mode: 'LOCAL_HYBRID_FALLBACK',
        error: error.message || 'Health check error',
      },
      { status: 500 }
    );
  }
}
