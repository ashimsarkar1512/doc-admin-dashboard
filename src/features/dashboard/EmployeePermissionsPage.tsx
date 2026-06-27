import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EmployeeList } from './components/EmployeePermissions/EmployeeList';
import { EmployeeRoleForm } from './components/EmployeePermissions/EmployeeRoleForm';
import { getEmployees, getPermissions, getRoles, createEmployee, updateEmployee } from '@/api/endpoints/employeePermissions.api';
import type { Employee } from './components/EmployeePermissions/types';

export default function EmployeePermissionsPage() {
  const queryClient = useQueryClient();
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

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setView('list');
      setSelectedEmployee(undefined);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setView('list');
      setSelectedEmployee(undefined);
    },
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

  const handleSave = (payload: any) => {
    if (view === 'create') {
      createMutation.mutate(payload);
    } else if (view === 'edit' && selectedEmployee) {
      updateMutation.mutate({ id: selectedEmployee.id, payload });
    }
  };

  const isLoading = isLoadingEmployees || isLoadingRoles || isLoadingPermissions;

  return (
    <div className="w-full p-6 md:p-8 min-h-screen bg-[#FAFAFB]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          {view === 'create' ? 'Create Employee Role' : view === 'edit' ? 'Edit Employee Role' : view === 'view' ? 'Employee Role Details' : 'Employee Roles & Permissions'}
        </h1>
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
