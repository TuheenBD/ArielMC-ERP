import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export interface SendEmailRequest {
  provider: 'HOSTINGER' | 'GMAIL';
  fromAccount?: string;
  to: string;
  subject: string;
  body: string;
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
    const payload: SendEmailRequest = await req.json();
    const { provider, fromAccount, to, subject, body, smtpConfig } = payload;

    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid recipient email address is required.' },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email subject line is required.' },
        { status: 400 }
      );
    }

    if (!body || !body.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email body text is required.' },
        { status: 400 }
      );
    }

    // Determine Host / Port / User / Pass
    let host: string;
    let port: number;
    let secure: boolean;
    let user: string;
    let pass: string | undefined;

    if (provider === 'HOSTINGER') {
      host = smtpConfig?.host || process.env.HOSTINGER_SMTP_HOST || 'smtp.hostinger.com';
      port = smtpConfig?.port || Number(process.env.HOSTINGER_SMTP_PORT || 465);
      secure = smtpConfig?.secure !== undefined ? smtpConfig.secure : true;
      user = smtpConfig?.user || process.env.HOSTINGER_SMTP_USER || fromAccount || 'info@arielmc.com';
      pass = smtpConfig?.pass || process.env.HOSTINGER_SMTP_PASS;
    } else {
      // GMAIL
      host = smtpConfig?.host || process.env.GMAIL_SMTP_HOST || 'smtp.gmail.com';
      port = smtpConfig?.port || Number(process.env.GMAIL_SMTP_PORT || 465);
      secure = smtpConfig?.secure !== undefined ? smtpConfig.secure : true;
      user = smtpConfig?.user || process.env.GMAIL_SMTP_USER || fromAccount || 'TuheenBD@gmail.com';
      pass = smtpConfig?.pass || process.env.GMAIL_SMTP_PASS;
    }

    // If password is not configured yet, provide seamless simulated mode with instructions
    if (!pass) {
      const simulatedId = `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return NextResponse.json({
        success: true,
        mode: 'SIMULATED',
        provider,
        from: user,
        to,
        subject,
        messageId: simulatedId,
        timestamp: new Date().toISOString(),
        note: `Email simulated successfully. To dispatch to real external inboxes, configure your ${
          provider === 'HOSTINGER' ? 'Hostinger mailbox password' : 'Google App Password'
        } in ERP Settings or .env.local.`,
      });
    }

    // Initialize real SMTP transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Prevents self-signed / local proxy cert drop
      },
    });

    // Format plain text into clean HTML email with corporate ArielMC footer
    const htmlContent = `
      <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #1a1a1a; max-width: 650px; margin: 0 auto; border: 1px solid #dde3dd; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #1F3A2E; padding: 20px 24px; border-bottom: 3px solid #C8A96A; color: #ffffff;">
          <h2 style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">Ariel Marketing & Communications Limited</h2>
          <p style="margin: 4px 0 0; font-size: 11px; color: #C8A96A; font-family: monospace;">Global Merchandising & Sourcing Desk</p>
        </div>
        <div style="padding: 24px; background-color: #ffffff; white-space: pre-wrap; font-size: 13px;">${body}</div>
        <div style="background-color: #f8f6f2; padding: 16px 24px; border-top: 1px solid #dde3dd; font-size: 11px; color: #6b7269;">
          <p style="margin: 0 0 4px; font-weight: bold; color: #1F3A2E;">Ariel Marketing & Communications Limited</p>
          <p style="margin: 0;">Dhaka HQ: House - 30 (1st Floor), Road - 07, Block - C, Niketon, Gulshan, Dhaka-1212, Bangladesh</p>
          <p style="margin: 2px 0 0;">Tel: +880 2410 811 91 | WhatsApp / Hotline: +8801819273458 | info@arielmc.com | tuheen@arielmc.com</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"${provider === 'HOSTINGER' ? 'ArielMC Trade Desk' : 'Syed Akramul Hassan'}" <${user}>`,
      to,
      subject,
      text: body,
      html: htmlContent,
      replyTo: user,
    });

    return NextResponse.json({
      success: true,
      mode: 'LIVE_SMTP',
      provider,
      from: user,
      to,
      subject,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
      note: `Email successfully delivered to ${to} via ${provider} SMTP.`,
    });
  } catch (error: any) {
    console.error('SMTP Dispatch Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to dispatch email via SMTP server.',
      },
      { status: 500 }
    );
  }
}
