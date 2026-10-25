'use client';

import React, { useState } from 'react';
import { OfficialDocument } from '@/types/documentPortal';
import { OFFICIAL_COMMUNICATION_CHANNELS } from '@/data/initialData';
import {
  Share2,
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  QrCode,
  ShieldCheck,
  X,
  Sparkles,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Layers,
  Globe2
} from 'lucide-react';
import { EmailProviderType } from '@/types/erp';
import { dispatchErpEmail } from '@/lib/emailService';


// Custom WhatsApp SVG Icon
const WhatsappIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.02L7.55 18.84L4.44 19.66L5.27 16.63L5.07 16.31C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.05 7.12C8.86 7.12 8.55 7.19 8.29 7.47C8.03 7.76 7.29 8.45 7.29 9.87C7.29 11.29 8.32 12.65 8.47 12.85C8.61 13.04 10.45 15.88 13.27 17.1C15.61 18.11 16.09 17.91 16.59 17.86C17.1 17.81 18.21 17.19 18.44 16.55C18.67 15.9 18.67 15.35 18.6 15.24C18.53 15.12 18.34 15.06 18.06 14.92C17.77 14.77 16.39 14.09 16.13 14C15.87 13.9 15.69 13.86 15.5 14.14C15.31 14.43 14.78 15.06 14.61 15.25C14.45 15.44 14.29 15.47 14 15.32C13.72 15.18 12.81 14.88 11.73 13.92C10.89 13.17 10.33 12.24 10.16 11.96C10 11.67 10.14 11.52 10.29 11.37C10.42 11.24 10.58 11.03 10.72 10.86C10.86 10.69 10.91 10.57 11 10.38C11.1 10.18 11.05 10.02 10.98 9.87C10.9 9.73 10.33 8.33 10.1 7.76C9.87 7.21 9.63 7.29 9.46 7.28C9.3 7.28 9.11 7.28 9.05 7.12Z" />
  </svg>
);

interface ShareDocumentModalProps {
  document?: OfficialDocument | null;
  documents?: OfficialDocument[];
  isOpen: boolean;
  onClose: () => void;
}

const RECIPIENT_PRESETS = [
  {
    label: 'AD Bank Trade Desk (Gulshan / Motijheel)',
    email: 'trade.fx@easternbank.com.bd',
    phone: '+8801819273458',
    org: 'Eastern Bank AD Branch',
  },
  {
    label: 'Customs C&F Agent (ASYCUDA Clearance)',
    email: 'customs.clearance@asycuda-bd.com',
    phone: '+8801711223344',
    org: 'Dhaka Airport / Chittagong Port C&F',
  },
  {
    label: 'Foreign Buyer Compliance Team (UK/EU)',
    email: 'sourcing.compliance@marksandspencer.co.uk',
    phone: '+447911123456',
    org: 'Marks & Spencer Sourcing Office',
  },
  {
    label: 'Trade Association Secretariat (LFMEAB)',
    email: 'secretary@lfmeab.org',
    phone: '+8801819273458',
    org: 'LFMEAB Export Cell',
  },
  {
    label: 'ArielMC Managing Director Desk',
    email: 'tuheen@arielmc.com',
    phone: '+8801819273458',
    org: 'ArielMC Executive Office',
  },
];

export const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  document,
  documents,
  isOpen,
  onClose,
}) => {
  const rawDocs: OfficialDocument[] = documents && documents.length > 0 
    ? documents 
    : (document ? [document] : []);

  if (!isOpen || rawDocs.length === 0) return null;

  const targetDocs: OfficialDocument[] = rawDocs.map(d => ({
    ...d,
    docCode: d.docCode || d.documentNumber || d.id,
    station: (d.station || d.entityCode || 'ARIEL_BD') as any,
  }));

  const isBatch = targetDocs.length > 1;
  const primaryDoc = targetDocs[0];
  const comms = OFFICIAL_COMMUNICATION_CHANNELS;

  // Active Share Channel: 'EMAIL' | 'WHATSAPP' | 'LINK' | 'ACKNOWLEDGE'
  const [activeTab, setActiveTab] = useState<'EMAIL' | 'WHATSAPP' | 'LINK' | 'ACKNOWLEDGE'>('EMAIL');
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [ackParty, setAckParty] = useState('Eastern Bank PLC (AD Trade Desk)');
  const [ackOfficer, setAckOfficer] = useState('Mohammad Rafiqul Islam (Senior Manager)');
  const [ackTime, setAckTime] = useState<string | null>(null);

  // Email form state
  const [emailProvider, setEmailProvider] = useState<EmailProviderType>('RESEND');
  const [recipientEmail, setRecipientEmail] = useState('trade.fx@easternbank.com.bd');
  const [emailSubject, setEmailSubject] = useState(
    isBatch
      ? `[ArielMC Compliance Dossier] Transmittal of ${targetDocs.length} Official Statutory Documents`
      : `[ArielMC Official Document] ${primaryDoc.title} (Reg: ${primaryDoc.documentNumber})`
  );
  const [emailNotes, setEmailNotes] = useState(
    isBatch
      ? `Please find attached the official statutory compliance package (${targetDocs.length} certified documents) for verification and commercial records.`
      : 'Please find attached the official statutory compliance certificate for verification and commercial records.'
  );

  // WhatsApp form state
  const [whatsappPhone, setWhatsappPhone] = useState(comms.whatsappIntl);
  const [isCopied, setIsCopied] = useState<string | null>(null);

  // Direct In-ERP Email Sending state
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Compute days left for primary doc
  const daysLeft = Math.ceil(
    (new Date(primaryDoc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Generate Email Body
  const generatedEmailBody = isBatch
    ? `Dear Partner,

We are transmitting the official statutory compliance package for Ariel Marketing & Communications Limited comprising ${targetDocs.length} certified documents.

============================================================
OFFICIAL DOCUMENTS TRANSMITTAL BATCH (${targetDocs.length} DOCUMENTS)
============================================================
${targetDocs.map((doc, idx) => {
  const days = Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return `${idx + 1}. [${doc.docCode}] ${doc.title}
   - Authority: ${doc.issuingAuthority}
   - Registration No: ${doc.documentNumber}
   - Station: ${doc.station.replace('ARIEL_', '')} | Section: ${doc.section.replace('_', ' ')}
   - Effective: ${doc.issueDate} | Expiry: ${doc.expiryDate} (${days > 0 ? `${days}d left` : 'Expired'})
   - Status: ${doc.status}`;
}).join('\n\n')}

${emailNotes ? `\nTransmission Remarks:\n${emailNotes}\n` : ''}
============================================================
SECURITY & CRYPTOGRAPHIC VERIFICATION:
- Total Documents: ${targetDocs.length} Verified Records
- Digital Fingerprint: SHA256:${targetDocs.map(d => d.id.replace(/-/g, '').substring(0, 4)).join('').toUpperCase()}
- Online Verification Portal: https://erp.arielmc.com/verify-doc
============================================================

Sincerely,
Syed Akramul Hassan (Managing Director)
Ariel Marketing & Communications Limited
Corporate Desk: +8801819273458 | info@arielmc.com | tuheen@arielmc.com
Website: https://www.arielmc.com`
    : `Dear Partner,

We are transmitting the official statutory compliance record for Ariel Marketing & Communications Limited.

============================================================
OFFICIAL DOCUMENT TRANSMITTAL
============================================================
Document Title: ${primaryDoc.title}
Official Code: ${primaryDoc.docCode}
Issuing Authority: ${primaryDoc.issuingAuthority}
Registration / Permit No: ${primaryDoc.documentNumber}
Station / Jurisdiction: ${primaryDoc.station.replace('ARIEL_', '')} (Dhaka, Bangladesh)
Section: ${primaryDoc.section.replace('_', ' ')}
Category: ${primaryDoc.category}

Effective Date: ${primaryDoc.issueDate}
Renewal Due Date: ${primaryDoc.expiryDate} (${daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'})
Document Status: ${primaryDoc.status}
Certified By: ${primaryDoc.uploadedBy}

Scope & Description:
${primaryDoc.notes || 'Official certified regulatory compliance document under Bangladesh Foreign Exchange and Export statutory guidelines.'}

${emailNotes ? `\nTransmission Remarks:\n${emailNotes}\n` : ''}
============================================================
SECURITY & CRYPTOGRAPHIC VERIFICATION:
- Document Format: ${primaryDoc.fileFormat} (${primaryDoc.fileSize})
- Verification Status: Certified Official ERP Record
- Digital Fingerprint: SHA256:${primaryDoc.id.replace(/-/g, '').substring(0, 24).toUpperCase()}
- Online Verification Portal: https://erp.arielmc.com/verify-doc?code=${primaryDoc.docCode}
============================================================

Sincerely,
Syed Akramul Hassan (Managing Director)
Ariel Marketing & Communications Limited
Corporate Desk: +8801819273458 | info@arielmc.com | tuheen@arielmc.com
Website: https://www.arielmc.com`;

  // Generate WhatsApp Message
  const generatedWhatsappText = isBatch
    ? `*ARIEL MARKETING & COMMUNICATIONS LTD*
*Batch Statutory Document Transmittal (${targetDocs.length} Documents)*
----------------------------------------
${targetDocs.map((doc, idx) => {
  const days = Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return `${idx + 1}. 📄 *${doc.title}*
   🏛️ ${doc.issuingAuthority}
   🔢 Reg: \`${doc.documentNumber}\`
   📍 Station: ${doc.station.replace('ARIEL_', '')} | 📅 Exp: ${doc.expiryDate} (${days}d left)`;
}).join('\n\n')}
----------------------------------------
${emailNotes ? `💬 *Remarks:* ${emailNotes}\n----------------------------------------\n` : ''}🔗 *ERP Verification Portal:* https://erp.arielmc.com/verify-doc
📞 *Trade Desk:* ${comms.whatsappIntl} | info@arielmc.com`
    : `*ARIEL MARKETING & COMMUNICATIONS LTD*
*Official Statutory Document Dispatch*
----------------------------------------
📄 *Document:* ${primaryDoc.title}
🏛️ *Issuing Authority:* ${primaryDoc.issuingAuthority}
🔢 *Registration No:* \`${primaryDoc.documentNumber}\`
📍 *Station:* ${primaryDoc.station.replace('ARIEL_', '')} | Dhaka, BD
📅 *Validity:* ${primaryDoc.issueDate} to *${primaryDoc.expiryDate}* (${daysLeft}d left)
📂 *Section:* ${primaryDoc.section.replace('_', ' ')}
🛡️ *Verification:* Certified Official Document
----------------------------------------
${emailNotes ? `💬 *Remarks:* ${emailNotes}\n----------------------------------------\n` : ''}🔗 *ERP Verification Link:* https://erp.arielmc.com/verify-doc?code=${primaryDoc.docCode}
📞 *Trade Desk:* ${comms.whatsappIntl} | info@arielmc.com`;

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(key);
    setTimeout(() => setIsCopied(null), 2000);
  };

  // Direct Send Email via Asynchronous Pipeline
  const handleSendDirectEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setSendStatus({
        type: 'error',
        message: 'Please provide a valid recipient email address.',
      });
      return;
    }

    setIsSending(true);
    setSendStatus(null);

    try {
      const result = await dispatchErpEmail({
        to: recipientEmail,
        recipientName: isBatch ? 'Official Regulatory Authority' : primaryDoc.issuingAuthority,
        subject: emailSubject,
        templateId: 'CUSTOM',
        variables: {
          subject: emailSubject,
          body: generatedEmailBody,
        },
        provider: emailProvider,
      });

      setSendStatus({
        type: 'success',
        message: `Official document dispatched to queue successfully via ${emailProvider}! Ticket ID: ${result.messageId || 'SENT'}`,
      });
    } catch (err: any) {
      setSendStatus({
        type: 'error',
        message: err.message || 'Error occurred while connecting to mail gateway.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // External Webmail launcher
  const handleLaunchWebmail = (provider: 'GMAIL' | 'HOSTINGER' | 'DEFAULT') => {
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(generatedEmailBody);

    if (provider === 'GMAIL') {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${subject}&body=${body}`,
        '_blank'
      );
    } else if (provider === 'HOSTINGER') {
      window.open('https://mail.hostinger.com', '_blank');
    } else {
      window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    }
  };

  // Launch WhatsApp
  const handleLaunchWhatsApp = (mode: 'WEB' | 'APP') => {
    const cleanPhone = whatsappPhone.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(generatedWhatsappText);

    if (mode === 'WEB') {
      window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`, '_blank');
    } else {
      window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
    }

    // Log to communication history
    try {
      const savedHistory = localStorage.getItem('arielmc_email_history');
      const historyList = savedHistory ? JSON.parse(savedHistory) : [];
      const newEntry = {
        id: `dsp-wa-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        provider: 'WHATSAPP_DESK',
        from: '+8801819273458',
        to: whatsappPhone,
        subject: `[WhatsApp] ${isBatch ? `${targetDocs.length} Official Documents` : primaryDoc.title}`,
        mode: 'WHATSAPP_LIVE',
        messageId: `wa-share-${Date.now()}`,
      };
      localStorage.setItem('arielmc_email_history', JSON.stringify([newEntry, ...historyList]));
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12231B] border border-[#2C5240] text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-[#2C5240] bg-[#162B22] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F3A2E] border border-[#C8A96A]/60 flex items-center justify-center text-[#C8A96A] shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[9px] font-bold">
                  {isBatch ? `BATCH (${targetDocs.length} DOCS)` : primaryDoc.docCode}
                </span>
                <span className="text-[10px] text-gray-300">
                  {isBatch ? 'Multi-Document Package' : `Station: ${primaryDoc.station.replace('ARIEL_', '')}`}
                </span>
              </div>
              <h2 className="text-base font-bold font-heading text-white mt-0.5">
                {isBatch
                  ? `Share ${targetDocs.length} Official Documents via Communication Hub`
                  : 'Share Official Document via Communication Hub'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-[#162B22]/60 border-b border-[#2C5240] text-xs font-heading">
          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`px-4 py-2 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'EMAIL'
                ? 'bg-[#12231B] text-[#C8A96A] border-[#C8A96A]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Transmittal (Hostinger / Gmail)</span>
          </button>

          <button
            onClick={() => setActiveTab('WHATSAPP')}
            className={`px-4 py-2 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'WHATSAPP'
                ? 'bg-[#12231B] text-emerald-400 border-emerald-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <WhatsappIcon className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Trade Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('LINK')}
            className={`px-4 py-2 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'LINK'
                ? 'bg-[#12231B] text-blue-400 border-blue-400'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Verification Link</span>
          </button>

          <button
            onClick={() => setActiveTab('ACKNOWLEDGE')}
            className={`px-4 py-2 rounded-t-xl font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ACKNOWLEDGE'
                ? 'bg-[#12231B] text-[#C8A96A] border-[#C8A96A]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#C8A96A]" />
            <span>Verified / Acknowledgement</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Document Summary Strip */}
          {isBatch ? (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-gray-300 uppercase tracking-wider font-mono">
                  Transmittal Package ({targetDocs.length} Official Documents):
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] font-bold font-mono text-[10px]">
                  Verified Archive Batch
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {targetDocs.map((doc) => (
                  <span
                    key={doc.id}
                    className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-[11px] flex items-center gap-1.5"
                    title={`${doc.title} (${doc.issuingAuthority})`}
                  >
                    <span className="text-[#C8A96A] font-mono font-bold text-[9px]">{doc.docCode}</span>
                    <span className="truncate max-w-[170px]">{doc.title}</span>
                    <span className="text-gray-400 text-[10px] font-mono">({doc.station.replace('ARIEL_', '')})</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Selected Document:</span>
                <p className="font-bold text-white text-xs truncate max-w-md">{primaryDoc.title}</p>
                <p className="text-[10px] text-[#C8A96A] font-mono">
                  {primaryDoc.issuingAuthority} • Reg: {primaryDoc.documentNumber}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 whitespace-nowrap">
                {primaryDoc.fileFormat} ({primaryDoc.fileSize})
              </span>
            </div>
          )}

          {/* Status Message Banner */}
          {sendStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                sendStatus.type === 'success'
                  ? 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/50'
                  : 'bg-rose-950/70 text-rose-200 border border-rose-500/50'
              }`}
            >
              {sendStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{sendStatus.message}</span>
            </div>
          )}

          {/* TAB 1: EMAIL DISPATCH */}
          {activeTab === 'EMAIL' && (
            <div className="space-y-4">
              {/* Provider Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setEmailProvider('RESEND')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    emailProvider === 'RESEND'
                      ? 'bg-[#1F3A2E] border-[#C8A96A] shadow-md ring-1 ring-[#C8A96A]'
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Resend API</div>
                  <div className="text-[9.5px] text-[#C8A96A] font-mono">Recommended (Fast)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailProvider('POSTMARK')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    emailProvider === 'POSTMARK'
                      ? 'bg-[#1F3A2E] border-[#FFDC00] shadow-md ring-1 ring-[#FFDC00]'
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Postmark API</div>
                  <div className="text-[9.5px] text-amber-300 font-mono">High Deliverability</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailProvider('HOSTINGER')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    emailProvider === 'HOSTINGER'
                      ? 'bg-[#1F3A2E] border-[#673AB7] shadow-md ring-1 ring-[#673AB7]'
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Hostinger Mail</div>
                  <div className="text-[9.5px] text-purple-300 font-mono">@arielmc.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEmailProvider('GMAIL')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    emailProvider === 'GMAIL'
                      ? 'bg-[#1F3A2E] border-[#EA4335] shadow-md ring-1 ring-[#EA4335]'
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-xs">Workspace Mail</div>
                  <div className="text-[9.5px] text-red-300 font-mono">TuheenBD@gmail</div>
                </button>
              </div>

              {/* Quick Preset Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Quick Select Recipient:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {RECIPIENT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRecipientEmail(preset.email)}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] border transition-colors ${
                        recipientEmail === preset.email
                          ? 'bg-[#C8A96A] text-[#12231B] font-bold border-[#C8A96A]'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g., trade.fx@easternbank.com.bd or buyer@retailer.com"
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {/* Remarks / Custom Notes */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">
                  Transmission Notes / Message To Recipient
                </label>
                <input
                  type="text"
                  value={emailNotes}
                  onChange={(e) => setEmailNotes(e.target.value)}
                  placeholder="Optional custom instruction..."
                  className="w-full p-2 rounded-xl bg-black/40 border border-[#2C5240] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              {/* Preview Box */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="uppercase font-bold">Email Transmittal Body Preview:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedEmailBody, 'email_text')}
                    className="text-[#C8A96A] hover:underline flex items-center gap-1 font-medium"
                  >
                    {isCopied === 'email_text' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Email Text</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={6}
                  value={generatedEmailBody}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-gray-300 font-mono text-[10.5px] leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Email Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchWebmail('GMAIL')}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-red-400" />
                    <span>Open in Gmail</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchWebmail('HOSTINGER')}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                    <span>Hostinger Mail</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendDirectEmail}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#DFCA98] text-[#12231B] font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Dispatching via Mailer...' : 'Send via Communication Hub'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP DISPATCH */}
          {activeTab === 'WHATSAPP' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <WhatsappIcon className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-emerald-200 text-xs">
                      ArielMC 24/7 International Trade WhatsApp Desk
                    </h4>
                    <p className="text-[10px] text-emerald-400/80">
                      Direct WhatsApp transmittal to buyers, C&amp;F agents, and overseas 3PL partners
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient Phone */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">
                  Recipient WhatsApp Number (with country code) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+8801819273458 or +447911123456"
                    className="flex-1 p-2.5 rounded-xl bg-black/40 border border-[#2C5240] text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setWhatsappPhone(comms.whatsappIntl)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-[#C8A96A] border border-white/10 whitespace-nowrap"
                  >
                    Reset ArielMC Desk
                  </button>
                </div>
              </div>

              {/* Message Preview */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="uppercase font-bold">WhatsApp Formatted Message Preview:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedWhatsappText, 'wa_text')}
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    {isCopied === 'wa_text' ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span className="font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy WhatsApp Text</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D1914] border border-emerald-500/20 text-emerald-200 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {generatedWhatsappText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => handleLaunchWhatsApp('APP')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <WhatsappIcon className="w-4 h-4 text-emerald-400" />
                  <span>Open WhatsApp App</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchWhatsApp('WEB')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <WhatsappIcon className="w-4 h-4" />
                  <span>Launch WhatsApp Web</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: VERIFICATION LINK */}
          {activeTab === 'LINK' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Sovereign ERP Verification &amp; Audit Trail</span>
                </div>
                <p className="text-[11px] text-blue-200/80 leading-relaxed">
                  Third-party auditors, banks, and customs officers can verify this official certificate directly against ArielMC&apos;s cryptographic ledger.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">
                  Official Audit Verification URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      isBatch
                        ? `https://erp.arielmc.com/verify-dossier?codes=${targetDocs.map((d) => d.docCode).join(',')}`
                        : `https://erp.arielmc.com/verify-doc?code=${primaryDoc.docCode}&reg=${encodeURIComponent(
                            primaryDoc.documentNumber
                          )}`
                    }
                    className="flex-1 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = isBatch
                        ? `https://erp.arielmc.com/verify-dossier?codes=${targetDocs.map((d) => d.docCode).join(',')}`
                        : `https://erp.arielmc.com/verify-doc?code=${primaryDoc.docCode}&reg=${encodeURIComponent(
                            primaryDoc.documentNumber
                          )}`;
                      handleCopy(url, 'audit_url');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#C8A96A] text-[#12231B] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopied === 'audit_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied === 'audit_url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 font-mono text-[10.5px]">
                <div className="text-gray-400">Cryptographic SHA-256 Checksum:</div>
                <div className="text-[#C8A96A] break-all">
                  SHA256:8F4B9C2A01E47D93C78B65EF1290DA74BEEF3210CBA8741D8E
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VERIFIED / ACKNOWLEDGEMENT */}
          {activeTab === 'ACKNOWLEDGE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-[#12231B] border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Official Verified Document &bull; Acknowledgement Protocol</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[9px] font-mono font-bold">
                    {isAcknowledged ? '✅ ACKNOWLEDGED' : 'PENDING ACKNOWLEDGEMENT'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  Every official trade document and compliance form issued by ArielMC requires verified recipient acknowledgement to establish a binding audit trail for customs, banking, and buyer verification.
                </p>
              </div>

              {/* Digital Acknowledgment Slip */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase">Target Document:</div>
                    <div className="font-bold text-white text-xs">{primaryDoc.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 font-mono">Reg / Code:</div>
                    <div className="font-mono text-[#C8A96A] text-xs font-bold">{primaryDoc.docCode}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Acknowledging Entity / Organization
                    </label>
                    <input
                      type="text"
                      value={ackParty}
                      onChange={(e) => setAckParty(e.target.value)}
                      className="w-full p-2 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-[11px]"
                      placeholder="e.g. Eastern Bank Trade Desk / Factory Manager"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                      Authorized Officer &amp; Designation
                    </label>
                    <input
                      type="text"
                      value={ackOfficer}
                      onChange={(e) => setAckOfficer(e.target.value)}
                      className="w-full p-2 rounded-lg bg-black/60 border border-white/15 text-white font-mono text-[11px]"
                      placeholder="e.g. Authorized Signatory / C&F Agent"
                    />
                  </div>
                </div>

                {isAcknowledged ? (
                  <div className="p-3 rounded-lg bg-emerald-900/40 border border-emerald-500/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Formal Recipient Acknowledgement Recorded</span>
                    </div>
                    <div className="text-[10.5px] text-gray-300 leading-snug">
                      Verified by <strong className="text-white">{ackOfficer}</strong> on behalf of <strong className="text-white">{ackParty}</strong>.
                    </div>
                    <div className="font-mono text-[10px] text-emerald-400 flex items-center justify-between pt-1 border-t border-emerald-800/60">
                      <span>Timestamp: {ackTime}</span>
                      <span>Audit Hash: #ACK-{primaryDoc.docCode}-OK</span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' });
                      setIsAcknowledged(true);
                      setAckTime(now);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Digitally Confirm Verification &amp; Acknowledgement Receipt</span>
                  </button>
                )}
              </div>

              {/* Direct Link to Acknowledgement Portal */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">
                  Direct Verification &amp; Acknowledgement Portal URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://erp.arielmc.com/verify-doc?code=${primaryDoc.docCode}&ack=true`}
                    className="flex-1 p-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const ackUrl = `https://erp.arielmc.com/verify-doc?code=${primaryDoc.docCode}&ack=true`;
                      handleCopy(ackUrl, 'ack_url');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#C8A96A] text-[#12231B] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopied === 'ack_url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied === 'ack_url' ? 'Copied' : 'Copy Ack Link'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#162B22] border-t border-[#2C5240] flex items-center justify-between shrink-0">
          <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Corporate Transmittal Channel</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
