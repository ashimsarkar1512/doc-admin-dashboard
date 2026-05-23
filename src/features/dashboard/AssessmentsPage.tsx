import { useState, useMemo } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Assessment } from '@/types';
import { CATEGORY_OPTIONS, INITIAL_ASSESSMENTS } from '@/data/assessments';
import MetricCard from '@/components/shared/cards/MetricCard';
import AssessmentCard from '@/components/shared/cards/AssessmentCard';
import AssessmentFormDialog from './components/AssessmentFormDialog';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);

  const stats = useMemo(() => {
    const totalTaken = assessments.reduce((acc, curr) => acc + curr.totalAssessments, 0) * 10;
    const approved = Math.round(totalTaken * 0.76);
    return {
      active: assessments.filter((a) => a.status === 'Active').length.toString().padStart(2, '0'),
      taken: totalTaken.toLocaleString(),
      approved: approved.toLocaleString(),
      declined: (totalTaken - approved).toLocaleString(),
    };
  }, [assessments]);

  const filteredAssessments = useMemo(
    () => assessments.filter((a) => selectedCategory === 'All' || a.category === selectedCategory),
    [assessments, selectedCategory]
  );

  const handleOpenCreate = () => { setEditingAssessment(null); setIsModalOpen(true); };
  const handleOpenEdit = (a: Assessment) => { setEditingAssessment(a); setIsModalOpen(true); };
  const handleDelete = (id: number) => { setAssessments((prev) => prev.filter((a) => a.id !== id)); toast.success('Assessment deleted.'); };

  const handleSave = (data: Omit<Assessment, 'id' | 'publishedDate' | 'totalAssessments'> & { id?: number }) => {
    if (data.id) {
      setAssessments((prev) => prev.map((a) => (a.id === data.id ? { ...a, ...data } : a)));
      toast.success('Assessment updated successfully.');
    } else {
      const newItem: Assessment = { ...data, id: Date.now(), publishedDate: new Date().toLocaleDateString('en-US'), totalAssessments: 0 };
      setAssessments((prev) => [newItem, ...prev]);
      toast.success('Assessment created successfully.');
    }
  };

  return (
    <div className="p-6 md:p-10 w-full space-y-10 font-sans">

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Assessments', value: stats.active },
          { label: 'Assessment Taken', value: stats.taken },
          { label: 'Approved (By Doctor)', value: stats.approved },
          { label: 'Declined Assessment', value: stats.declined },
        ].map((m, i) => <MetricCard key={i} label={m.label} value={m.value} />)}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
        {['All', ...CATEGORY_OPTIONS].map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-sm font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Recent Assessment Activity</h2>
          <p className="text-xs md:text-sm text-gray-400 font-light">Manage assessment forms, status, and view doctor metrics.</p>
        </div>
        <button onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-600/10 cursor-pointer self-start sm:self-auto">
          <Plus className="h-4 w-4" /><span>Create Assessment</span>
        </button>
      </div>

      {/* Cards Grid */}
      {filteredAssessments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAssessments.map((a) => (
            <AssessmentCard key={a.id} assessment={a} onEdit={handleOpenEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-150 text-center p-6 space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-base">No assessments found</h3>
            <p className="text-gray-400 text-sm max-w-sm">No assessments match "{selectedCategory}".</p>
          </div>
          <button onClick={() => setSelectedCategory('All')} className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline underline-offset-4">Clear filters</button>
        </div>
      )}

      {/* Assessment Form Dialog */}
      <AssessmentFormDialog
        key={editingAssessment?.id ?? 'create'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingAssessment={editingAssessment}
        onSave={handleSave}
      />
    </div>
  );
}
