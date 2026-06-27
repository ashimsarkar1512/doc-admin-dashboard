import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EmployeeList } from './components/EmployeePermissions/EmployeeList';
import { EmployeeRoleForm } from './components/EmployeePermissions/EmployeeRoleForm';
import { getEmployees, getPermissions, getRoles } from '@/api/endpoints/employeePermissions.api';
import type { Employee } from './components/EmployeePermissions/types';

export default function EmployeePermissionsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });

  const handleCreate = () => {
    setSelectedEmployee(undefined);
    setView('create');
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setView('edit');
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setView('view');
  };

  const handleCancel = () => {
    setView('list');
    setSelectedEmployee(undefined);
  };

  const handleSave = () => {
    // In a real app, you would save the data to a backend here.
    setView('list');
    setSelectedEmployee(undefined);
  };

  const isLoading = isLoadingEmployees || isLoadingRoles || isLoadingPermissions;

  return (
    <div className="w-full p-6 md:p-8 min-h-screen bg-[#FAFAFB]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      
        {view !== 'list' && view !== 'view' && (
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#1447E6] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Role & Permission
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 text-slate-500">Loading permissions data...</div>
      ) : view === 'list' ? (
        <EmployeeList 
          employees={employees} 
          onCreate={handleCreate} 
          onEdit={handleEdit} 
          onView={handleView} 
        />
      ) : (
        <EmployeeRoleForm 
          mode={view}
          employee={selectedEmployee}
          permissions={permissions}
          roles={roles}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
