import React from 'react';
import { Eye, Mail, Trash2 } from 'lucide-react';
import type { ContactLead } from '@/api/endpoints/contact-leads.api';

interface ContactLeadsTableProps {
  leads: ContactLead[];
  onView: (lead: ContactLead) => void;
  onRespond: (lead: ContactLead) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function ContactLeadsTable({
  leads,
  onView,
  onRespond,
  onDelete,
  isLoading,
}: ContactLeadsTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-slate-500">Loading leads...</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p className="text-slate-500">No contact leads found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
          <tr>
            <th className="px-6 py-4 whitespace-nowrap">Full Name</th>
            <th className="px-6 py-4 whitespace-nowrap">Email</th>
            <th className="px-6 py-4 whitespace-nowrap">Phone Number</th>
            <th className="px-6 py-4 whitespace-nowrap">Service</th>
            <th className="px-6 py-4 whitespace-nowrap">Comments</th>
            <th className="px-6 py-4 whitespace-nowrap">Date</th>
            <th className="px-6 py-4 whitespace-nowrap text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium whitespace-nowrap">{item.fullName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.service}</td>
              <td className="px-6 py-4 max-w-xs truncate" title={item.message}>
                {item.message}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onView(item)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Message"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRespond(item)}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    title="Send Response"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
