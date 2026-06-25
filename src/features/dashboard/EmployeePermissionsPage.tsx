import  { useState } from 'react';
import { EmployeeList } from './components/EmployeePermissions/EmployeeList';
import { EmployeeRoleForm } from './components/EmployeePermissions/EmployeeRoleForm';
import type { Employee, PermissionItem } from './components/EmployeePermissions/types';

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: 'Michael Chen',
    role: 'Admin',
    email: 'micheal.chen@gmail.com',
    password: 'Hff6*****ghghfgh',
    permissions: ['View PHI', 'Edit PHI'],
    extraPermissions: '+2',
    lastLogin: '2026-06-01 09:02',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'General Manger',
    email: 'sarah12@gmail.com',
    password: 'C@*****ereret',
    permissions: ['View PHI', 'Edit PHI'],
    extraPermissions: '+2',
    lastLogin: '2026-06-01 09:02',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Reviewer',
    email: 'emma.davis@gmail.com',
    password: 'a#2*****rsertgser',
    permissions: ['View PHI', 'Edit PHI'],
    extraPermissions: '+2',
    lastLogin: '2026-06-01 09:02',
    avatar: 'https://i.pravatar.cc/150?u=3'
  },
];

const ALL_PERMISSIONS: PermissionItem[] = [
  { name: 'View PHI', description: 'Access to view patient health information', active: true },
  { name: 'Edit PHI', description: 'Modify patient health records and medical data', active: true },
  { name: 'View Billing', description: 'Access billing records and financial data', active: false },
  { name: 'Approve Prescriptions', description: 'Authorize and approve prescription orders', active: true },
  { name: 'Export Data', description: 'Export patient or system data to CSV/PDF', active: false },
  { name: 'Manage Providers', description: 'Add, edit, or deactivate provider accounts', active: false },
  { name: 'Manage Users', description: 'Create, modify, and delete user accounts', active: false },
  { name: 'View Audit Logs', description: 'Access compliance and activity audit logs', active: false },
];

export default function EmployeePermissionsPage() {
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);

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

      {view === 'list' ? (
        <EmployeeList 
          employees={INITIAL_EMPLOYEES} 
          onCreate={handleCreate} 
          onEdit={handleEdit} 
          onView={handleView} 
        />
      ) : (
        <EmployeeRoleForm 
          mode={view}
          employee={selectedEmployee}
          permissions={ALL_PERMISSIONS}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
