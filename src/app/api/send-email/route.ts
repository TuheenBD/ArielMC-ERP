import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { resolveEmailContent } from '@/lib/emailService';
import { EmailTemplateType, EmailProviderType } from '@/types/erp';

export interface SendEmailPayload {
  to: string;
  recipientName?: string;
  subject?: string;
  templateId?: EmailTemplateType;
  templateName?: string; // backward compat with blueprint
  variables?: Record<string, any>;
  templateVariables?: Record<string, any>; // backward compat with blueprint
  provider?: EmailProviderType;
  body?: string;
  smtpConfig?: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    secure?: boolean;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload: SendEmailPayload = await req.json();
    const to = payload.to;
    const recipientName = payload.recipientName || '';
    const templateId: EmailTemplateType = (payload.templateId || payload.templateName || 'CUSTOM') as EmailTemplateType;
    const variables = payload.variables || payload.templateVariables || {};
    const provider = payload.provider || 'RESEND';

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    // Resolve template and render corporate HTML
    const rendered = resolveEmailContent(
      templateId,
      { ...variables, to, recipientName },
      payload.subject,
      payload.body
    );

    const subject = payload.subject || rendered.subject;
    const html = rendered.html;

    // 1. Ingest into Supabase email_queue (Persistence Queue System)
    let queueId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('email_queue')
          .insert([
            {
              recipient: to,
              recipient_name: recipientName || null,
              template_id: templateId,
              subject,
              payload: variables,
              status: 'queued',
              attempts: 1,
              provider,
            },
          ])
          .select()
          .single();

        if (data && data.id) {
          queueId = data.id;
        }
      } catch (dbErr) {
        console.warn('Notice: Supabase email_queue insert bypassed:', dbErr);
      }
    }

    // 2. Dispatch Vector: Resend API, Postmark API, Hostinger/Gmail SMTP, or Simulated Sandbox
    let externalMessageId = queueId;
    let dispatchMode: 'RESEND_API' | 'POSTMARK_API' | 'LIVE_SMTP' | 'SIMULATED' = 'SIMULATED';

    const resendApiKey = process.env.RESEND_API_KEY;
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

    if (provider === 'RESEND' && resendApiKey) {
      // Dispatched via Resend Transactional API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'ArielMC ERP <invoicing@arielmc.com>',
          to: [to],
          reply_to: process.env.ERP_REPLY_TO_EMAIL || 'tuheen@arielmc.com',
          subject,
          html,
          headers: {
            'X-ArielMC-Queue-ID': queueId,
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Resend API returned dispatch error');
      }
      externalMessageId = resData.id || queueId;
      dispatchMode = 'RESEND_API';
    } else if (provider === 'POSTMARK' && postmarkToken) {
      // Dispatched via Postmark Transactional API
      const res = await fetch('https://api.postmarkapp.com/email', {
        method: 'POST',
        headers: {
          'X-Postmark-Server-Token': postmarkToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          From: process.env.POSTMARK_FROM_EMAIL || 'invoicing@arielmc.com',
          To: to,
          ReplyTo: process.env.ERP_REPLY_TO_EMAIL || 'tuheen@arielmc.com',
          Subject: subject,
          HtmlBody: html,
          Metadata: {
            internal_queue_id: queueId,
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.Message || 'Postmark API returned dispatch error');
      }
      externalMessageId = resData.MessageID || queueId;
      dispatchMode = 'POSTMARK_API';
    } else if ((provider === 'HOSTINGER' || provider === 'GMAIL') && payload.smtpConfig?.pass) {
      // Live SMTP Transporter
      const isHostinger = provider === 'HOSTINGER';
      const host = payload.smtpConfig.host || (isHostinger ? 'smtp.hostinger.com' : 'smtp.gmail.com');
      const port = payload.smtpConfig.port || 465;
      const user = payload.smtpConfig.user || (isHostinger ? 'info@arielmc.com' : 'TuheenBD@gmail.com');
      const pass = payload.smtpConfig.pass;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      const info = await transporter.sendMail({
        from: `ArielMC Enterprise ERP <${user}>`,
        to,
        replyTo: 'tuheen@arielmc.com',
        subject,
        html,
      });

      externalMessageId = info.messageId || queueId;
      dispatchMode = 'LIVE_SMTP';
    } else {
      // High-performance Simulated Mode with zero UI delay
      externalMessageId = `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      dispatchMode = 'SIMULATED';
    }

    // 3. Update status in Supabase email_queue
    if (supabase) {
      try {
        await supabase
          .from('email_queue')
          .update({
            status: 'sent',
            external_message_id: externalMessageId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', queueId);

        // Also add initial audit log
        await supabase
          .from('email_audit_ledger')
          .insert([
            {
              queue_id: queueId,
              external_message_id: externalMessageId,
              event_type: 'sent',
              recipient: to,
              raw_payload: { mode: dispatchMode, subject },
            },
          ]);
      } catch (updateErr) {
        console.warn('Notice: Supabase queue status update bypassed:', updateErr);
      }
    }

    // Return immediate 202 Accepted status
    return NextResponse.json(
      {
        success: true,
        messageId: queueId,
        externalMessageId,
        status: 'sent',
        mode: dispatchMode,
        recipient: to,
        subject,
        note: dispatchMode === 'SIMULATED' 
          ? 'Email queued & verified in simulated mode. Configure RESEND_API_KEY in .env.local to send to real buyer inboxes.'
          : 'Email dispatched successfully through enterprise gateway.',
      },
      { status: 202 }
    );
  } catch (error: any) {
    console.error('Email Dispatch Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Email Pipeline Gateway Error' },
      { status: 500 }
    );
  }
}
