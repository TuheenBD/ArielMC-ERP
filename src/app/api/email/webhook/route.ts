import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

/**
 * GET /api/email/webhook
 * Health check & developer schema documentation for email provider webhooks (Resend, Postmark, SES)
 */
export async function GET() {
  return NextResponse.json({
    status: 'ONLINE',
    service: 'ArielMC Enterprise ERP Real-Time Email Feedback Webhook Collector',
    version: '2026.1.0',
    supportedProviders: ['Resend (email.delivered, email.bounced)', 'Postmark (Delivery, Bounce, Open)', 'Amazon SES'],
    tables: ['email_queue', 'email_audit_ledger'],
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/email/webhook
 * Real-Time Webhook Callback Handler
 * Accepts delivery, bounce, open, and spam tracking events and synchronizes ERP outbox status
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // 1. Resolve Provider-Agnostic Event Fields
    let externalMessageId: string | null = null;
    let eventType: string = 'unknown';
    let recipient: string = '';
    let internalQueueId: string | null = null;

    if (payload.type && payload.type.startsWith('email.')) {
      // Resend Webhook Format
      eventType = payload.type.replace('email.', '').toLowerCase(); // delivered, bounced, opened, clicked
      externalMessageId = payload.data?.id || null;
      recipient = Array.isArray(payload.data?.to) ? payload.data.to[0] : payload.data?.to || '';
      internalQueueId = payload.data?.headers?.['X-ArielMC-Queue-ID'] || null;
    } else if (payload.RecordType) {
      // Postmark Webhook Format
      eventType = payload.RecordType.toLowerCase(); // delivery, bounce, open, click
      externalMessageId = payload.MessageID || null;
      recipient = payload.Recipient || payload.Email || '';
      internalQueueId = payload.Metadata?.internal_queue_id || null;
    } else {
      // Generic / Standard Payload
      eventType = (payload.event || payload.eventType || 'generic').toLowerCase();
      externalMessageId = payload.messageId || payload.id || null;
      recipient = payload.recipient || payload.to || '';
      internalQueueId = payload.queueId || null;
    }

    if (!externalMessageId && !eventType) {
      return NextResponse.json({ error: 'Invalid webhook event payload' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // 2. Persist to email_audit_ledger
    if (supabase) {
      try {
        await supabase.from('email_audit_ledger').insert([
          {
            queue_id: internalQueueId || null,
            external_message_id: externalMessageId,
            event_type: eventType,
            recipient: recipient || 'unknown@domain.com',
            raw_payload: payload,
          },
        ]);

        // 3. Update matching status in email_queue
        let mappedStatus: 'delivered' | 'bounced' | 'failed' | 'sent' | null = null;
        if (eventType === 'delivery' || eventType === 'delivered') mappedStatus = 'delivered';
        if (eventType === 'bounce' || eventType === 'bounced') mappedStatus = 'bounced';
        if (eventType === 'complaint' || eventType === 'failed') mappedStatus = 'failed';

        if (mappedStatus) {
          if (internalQueueId) {
            await supabase
              .from('email_queue')
              .update({
                status: mappedStatus,
                external_message_id: externalMessageId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', internalQueueId);
          } else if (externalMessageId) {
            await supabase
              .from('email_queue')
              .update({
                status: mappedStatus,
                updated_at: new Date().toISOString(),
              })
              .eq('external_message_id', externalMessageId);
          }
        }
      } catch (dbErr) {
        console.warn('Notice: Webhook Supabase sync bypassed:', dbErr);
      }
    }

    return NextResponse.json({ 
      received: true, 
      eventType, 
      externalMessageId,
      timestamp: new Date().toISOString() 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Email Webhook Processing Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
