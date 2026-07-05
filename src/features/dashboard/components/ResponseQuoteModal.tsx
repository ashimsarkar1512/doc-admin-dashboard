import React, { useState, useEffect } from 'react';
import Dialog from '@/components/shared/Dialog';
import { Upload } from 'lucide-react';
import type { ContactLead } from '@/api/endpoints/contact-leads.api';

interface ResponseQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ContactLead | null;
  onSend: (id: string, formData: FormData) => void;
  isSending?: boolean;
}

export default function ResponseQuoteModal({
  isOpen,
  onClose,
  lead,
  onSend,
  isSending,
}: ResponseQuoteModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('Welcome to WLMD');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (lead && isOpen) {
      setEmail(lead.email);
      setFullName(lead.fullName);
      setMessage('');
      setFile(null);
    }
  }, [lead, isOpen]);

  if (!lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('subject', subject);
    formData.append('message', message);
    if (file) {
      formData.append('attachments', file);
    }

    onSend(lead.id, formData);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Response Quote" maxWidthClass="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-900 block mb-1">To:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed text-sm"
            required
            disabled
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-900 block mb-1">Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed text-sm"
            required
            disabled
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-900 block mb-1">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed text-sm"
            required
            disabled
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-900 block mb-1">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-900 block mb-1">Attachments:</label>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <label className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm shrink-0">
              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Choose a File
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>
            {file && <span className="text-xs sm:text-sm text-slate-600 truncate max-w-[160px] sm:max-w-xs">{file.name}</span>}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-4 pt-3 sm:pt-4 mt-1 sm:mt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSending}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
