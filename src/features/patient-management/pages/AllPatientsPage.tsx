import { useState, useMemo } from 'react';
import { Search, ChevronDown, Eye, Ban, Trash2, ArrowRightToLine } from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'All Patient', value: 'All Patient' },
  { label: 'Active', value: 'Active' },
  { label: 'Banned', value: 'Banned' },
  { label: 'Inactive', value: 'Inactive' },
];

const ALL_PATIENTS: Array<{ id: number; name: string; initials: string; email: string; contact: string; activeConsultation: number; payment: string; status: PatientStatus; joiningDate: string }> = [
  { id: 1, name: 'Jessica Martinez', initials: 'SJ', email: 'webdragon@msn.com', contact: '(307) 555-0133', activeConsultation: 2, payment: '$99', status: 'Active', joiningDate: '4/4/18' },
  { id: 2, name: 'Emily Chen', initials: 'SJ', email: 'wkrebs@verizon.net', contact: '(319) 555-0115', activeConsultation: 6, payment: '$99', status: 'Active', joiningDate: '5/19/12' },
  { id: 3, name: 'Jessica Martinez', initials: 'SJ', email: 'dgatwood@msn.com', contact: '(406) 555-0120', activeConsultation: 1, payment: '$99', status: 'Active', joiningDate: '4/4/18' },
  { id: 4, name: 'Michael Roberts', initials: 'SJ', email: 'sabren@comcast.net', contact: '(704) 555-0127', activeConsultation: 5, payment: '$99', status: 'Banned', joiningDate: '5/19/12' },
  { id: 5, name: 'David Wilson', initials: 'SJ', email: 'sumdumass@gmail.com', contact: '(603) 555-0123', activeConsultation: 8, payment: '$99', status: 'Active', joiningDate: '2/11/12' },
];

type PatientStatus = 'Active' | 'Banned' | 'Inactive';

function StatusBadge({ status }: { status: PatientStatus }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-xs font-medium text-blue-600">
        Active
      </span>
    );
  }
  if (status === 'Banned') {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 px-4 py-1 text-xs font-medium text-rose-500">
        Banned
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-xs font-medium text-slate-500">
      Inactive
    </span>
  );
}

export default function AllPatientsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Patient');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    return ALL_PATIENTS.filter((p) => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.contact.includes(search);
      const matchesStatus = statusFilter === 'All Patient' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  function handleExport() {
    const headers = ['Patient', 'Email', 'Contact', 'Active Consultation', 'Payment', 'Status', 'Joining Date'];
    const rows = filtered.map((p) => [p.name, p.email, p.contact, String(p.activeConsultation), p.payment, p.status, p.joiningDate]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patients.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-slate-800">All Patients</h1>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-48"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-6 px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 w-36 justify-between"
            >
              <span>{statusFilter}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute z-20 top-full mt-1.5 left-0 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-36">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors ${
                      statusFilter === opt.value ? 'text-blue-700 font-medium bg-blue-50' : 'text-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
        >
          <ArrowRightToLine size={15} />
          Export Data
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600">Patient</th>
                <th className="px-6 py-3.5 text-left font-semibold text-slate-600">Email</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600">Contact</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600">Active Consultation</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600">Payment</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600">Joining Date</th>
                <th className="px-6 py-3.5 text-center font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-slate-400 text-sm">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-blue-700">{row.initials}</span>
                        </div>
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">{row.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">{row.email}</td>

                    {/* Contact */}
                    <td className="px-6 py-4 text-sm text-slate-500 text-center whitespace-nowrap">{row.contact}</td>

                    {/* Active Consultation */}
                    <td className="px-6 py-4 text-sm text-slate-600 text-center">{String(row.activeConsultation).padStart(2, '0')}</td>

                    {/* Payment */}
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 text-center">{row.payment}</td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={row.status} />
                    </td>

                    {/* Joining Date */}
                    <td className="px-6 py-4 text-sm text-slate-500 text-center whitespace-nowrap">{row.joiningDate}</td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" className="text-slate-500 hover:text-slate-700 transition-colors" aria-label={`View ${row.name}`} title="View">
                          <Eye size={16} />
                        </button>
                        <button type="button" className="text-slate-500 hover:text-slate-700 transition-colors" aria-label={`Ban ${row.name}`} title="Ban">
                          <Ban size={16} />
                        </button>
                        <button type="button" className="text-red-500 hover:text-red-600 transition-colors" aria-label={`Delete ${row.name}`} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}