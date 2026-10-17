'use client';

import React from 'react';
import { OfficialDocument } from '@/types/documentPortal';
import { AlertTriangle, Trash2, X, ShieldAlert, Building2 } from 'lucide-react';

interface DeleteDocumentConfirmModalProps {
  document?: OfficialDocument | null;
  documents?: OfficialDocument[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete?: (docId: string) => void;
  onConfirmBulkDelete?: (docIds: string[]) => void;
}

export const DeleteDocumentConfirmModal: React.FC<DeleteDocumentConfirmModalProps> = ({
  document,
  documents,
  isOpen,
  onClose,
  onConfirmDelete,
  onConfirmBulkDelete,
}) => {
  const targetDocs: OfficialDocument[] = documents && documents.length > 0 
    ? documents 
    : (document ? [document] : []);

  if (!isOpen || targetDocs.length === 0) return null;

  const isBulk = targetDocs.length > 1;

  const handleExecuteDelete = () => {
    if (isBulk && onConfirmBulkDelete) {
      onConfirmBulkDelete(targetDocs.map((d) => d.id));
    } else if (onConfirmDelete) {
      targetDocs.forEach((d) => onConfirmDelete(d.id));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-[#12231B] border-2 border-rose-600/70 text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-rose-950/60 border-b border-rose-600/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-heading text-rose-100">
                {isBulk ? `Confirm Bulk Deletion (${targetDocs.length} Documents)` : 'Confirm Document Deletion'}
              </h3>
              <p className="text-[10px] text-rose-300/80 font-mono">
                IRREVERSIBLE STATUTORY ACTION
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-300/70 hover:text-white hover:bg-rose-900/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs max-h-[65vh] overflow-y-auto">
          <p className="text-gray-300 leading-relaxed">
            {isBulk ? (
              <>
                Are you sure you want to permanently delete these <span className="font-bold text-rose-400">{targetDocs.length} official documents</span> from the archive?
              </>
            ) : (
              'Are you sure you want to permanently delete this official document from the archive?'
            )}
          </p>

          {isBulk ? (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                <span>Selected Documents to Delete:</span>
                <span className="font-mono text-rose-400 font-bold">{targetDocs.length} Records</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-xl bg-black/40 border border-white/10 divide-y divide-white/5">
                {targetDocs.map((doc) => (
                  <div key={doc.id} className="pt-2 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[9px] font-bold">
                          {doc.docCode}
                        </span>
                        <span className="font-bold text-white text-xs truncate max-w-[240px]">
                          {doc.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {doc.station.replace('ARIEL_', '')}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{doc.issuingAuthority}</span>
                      <span className="font-mono">{doc.documentNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] font-mono text-[9px] font-bold">
                  {targetDocs[0].docCode}
                </span>
                <span className="text-[10px] text-gray-400">
                  Station: {targetDocs[0].station.replace('ARIEL_', '')}
                </span>
              </div>
              <div className="font-bold text-white text-sm">
                {targetDocs[0].title}
              </div>
              <div className="text-[11px] text-gray-300">
                Issuing Authority: <span className="text-[#C8A96A] font-medium">{targetDocs[0].issuingAuthority}</span>
              </div>
              <div className="text-[11px] font-mono text-gray-400">
                Registration No: <span className="text-white">{targetDocs[0].documentNumber}</span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-600/30 text-[11px] text-rose-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Consequences of Deletion:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-rose-200/80 pl-1">
              <li>Removes the certificate{isBulk ? 's' : ''} from all multi-entity station dossiers</li>
              <li>De-links from the 34-Point Bangladesh Legal Compliance Matrix</li>
              <li>Cancels active 7-day expiration alarms and assigned renewal tasks</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#162B22] border-t border-[#2C5240] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel, Keep {isBulk ? 'Documents' : 'Document'}
          </button>
          <button
            type="button"
            onClick={handleExecuteDelete}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete {isBulk ? `(${targetDocs.length} Documents)` : ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
