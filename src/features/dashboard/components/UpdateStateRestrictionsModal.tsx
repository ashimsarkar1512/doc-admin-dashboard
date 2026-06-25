import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStateCoverageById,
  updateStateRestrictions,
  getAllCategories,
} from '@/api/endpoints/stateCoverage.api';
import Dialog from '@/components/shared/Dialog';
import { Loader2, ChevronDown, Check } from 'lucide-react';
import Swal from 'sweetalert2';

interface UpdateStateRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateCoverageId: string | null;
}

// Helper to format category names like "weight-loss" to "Weight Loss"
const formatCategoryName = (name: string) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function UpdateStateRestrictionsModal({
  isOpen,
  onClose,
  stateCoverageId,
}: UpdateStateRestrictionsModalProps) {
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isComingSoon, setIsComingSoon] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Fetch Categories
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories-names'],
    queryFn: getAllCategories,
  });

  // Fetch State Coverage Details
  const { data: stateCoverage, isLoading: isLoadingState, isError } = useQuery({
    queryKey: ['state-coverage', stateCoverageId],
    queryFn: () => getStateCoverageById(stateCoverageId as string),
    enabled: !!stateCoverageId && isOpen,
  });

  // Populate local state when data loads
  useEffect(() => {
    if (stateCoverage) {
      setSelectedCategoryIds(stateCoverage.allowedCategories.map((c) => c.id));
      setIsComingSoon(stateCoverage.isComingSoon);
    }
  }, [stateCoverage]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateStateRestrictions(stateCoverageId as string, {
        allowedCategoryIds: selectedCategoryIds,
        isComingSoon,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['state-coverages'] });
      queryClient.invalidateQueries({ queryKey: ['state-coverage', stateCoverageId] });
      onClose();
      Swal.fire({
        title: 'Updated!',
        text: 'State restrictions updated successfully.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: { container: '!z-[99999]' },
      });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to update state restrictions.';
      Swal.fire({
        title: 'Error!',
        text: msg,
        icon: 'error',
        customClass: { container: '!z-[99999]' },
      });
    },
  });

  const handleSave = () => {
    if (!stateCoverageId) return;
    updateMutation.mutate();
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  const isLoading = isLoadingCategories || isLoadingState;

  // Selected categories mapping for display badges
  const selectedCategoriesData = categories.filter((c) =>
    selectedCategoryIds.includes(c.id)
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Update State Restrictions" maxWidthClass="max-w-md">
      {isLoading ? (
        <div className="flex justify-center items-center py-14">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      ) : isError ? (
        <div className="py-12 text-center text-red-500 text-sm">
          Failed to load data. Please try again.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Custom Multi-select Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800">Allowed Services:</label>
            <div className="relative" ref={dropdownRef}>
              <div
                className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors text-sm text-slate-700"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>Select Services</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className="w-full mt-2 bg-slate-50/50 border border-slate-200 rounded-lg shadow-sm max-h-60 overflow-y-auto">
                  {categories.map((category) => {
                    const isSelected = selectedCategoryIds.includes(category.id);
                    return (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none transition-colors"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-700 select-none">
                          {formatCategoryName(category.name)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Badges */}
            {selectedCategoriesData.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedCategoriesData.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full"
                  >
                    {formatCategoryName(cat.name)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Coming Soon Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isComingSoon ? 'bg-slate-800 border-slate-800' : 'border-slate-300 group-hover:border-slate-400'}`}>
              {isComingSoon && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={isComingSoon}
              onChange={(e) => setIsComingSoon(e.target.checked)}
            />
            <span className="text-sm font-medium text-slate-700 select-none">
              Not yet, Coming Soon
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex-1 py-2.5 bg-[#1447E6] text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
