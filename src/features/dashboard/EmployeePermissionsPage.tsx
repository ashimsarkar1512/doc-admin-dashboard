import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { EmployeeList } from './components/EmployeePermissions/EmployeeList';
import { EmployeeRoleForm } from './components/EmployeePermissions/EmployeeRoleForm';
import { getEmployees, getPermissions, getRoles, createEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus, createRole, updateRole } from '@/api/endpoints/employeePermissions.api';
import type { Employee } from './components/EmployeePermissions/types';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

export default function EmployeePermissionsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const routerState = useRouterState();
  
  const pathParts = routerState.location.pathname.split('/').filter(Boolean);
  let view: 'list' | 'create' | 'edit' | 'view' = 'list';
  let employeeId: string | undefined = undefined;

  const { canManage } = usePermissions();
  const canManageEmployees = canManage('employee_permissions');

  if (pathParts[2] === 'create') {
    view = canManageEmployees ? 'create' : 'list';
  } else if (pathParts[2] === 'edit') {
    view = canManageEmployees ? 'edit' : 'view';
    employeeId = pathParts[3];
  } else if (pathParts[2] === 'view') {
    view = 'view';
    employeeId = pathParts[3];
  }

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const selectedEmployee = employeeId ? employees.find(e => e.id === employeeId) : undefined;

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
      toast.success('Employee created successfully.');
      navigate({ to: '/dashboard/employee-permissions' });
    },
    onError: () => {
      toast.error('Failed to create employee.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully.');
      navigate({ to: '/dashboard/employee-permissions' });
    },
    onError: () => {
      toast.error('Failed to update employee.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully.');
    },
    onError: () => {
      toast.error('Failed to delete employee.');
    },
  });

  const statusMutation = useMutation({
    mutationFn: toggleEmployeeStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(variables.status === 'ACTIVE' ? 'Employee activated successfully.' : 'Employee suspended successfully.');
    },
    onError: () => {
      toast.error('Failed to update employee status.');
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully.');
    },
    onError: () => {
      toast.error('Failed to create role.');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role updated successfully.');
    },
    onError: () => {
      toast.error('Failed to update role.');
    },
  });

  const handleCreate = () => {
    navigate({
      to: '/dashboard/employee-permissions/$action',
      params: { action: 'create' },
    });
  };

  const handleEdit = (employee: Employee) => {
    navigate({
      to: '/dashboard/employee-permissions/$action/$id',
      params: { action: 'edit', id: String(employee.id) },
    });
  };

  const handleView = (employee: Employee) => {
    navigate({
      to: '/dashboard/employee-permissions/$action/$id',
      params: { action: 'view', id: String(employee.id) },
    });
  };

  const handleCancel = () => {
    navigate({ to: '/dashboard/employee-permissions' });
  };

  const handleSave = (payload: any) => {
    if (view === 'create') {
      createMutation.mutate(payload);
    } else if (view === 'edit' && selectedEmployee) {
      updateMutation.mutate({ id: selectedEmployee.id, payload });
    }
  };

  const handleDelete = (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete "${employee.email}"? This action cannot be undone.`)) {
      deleteMutation.mutate(employee.id);
    }
  };

  const handleToggleStatus = (employee: Employee) => {
    const newStatus = employee.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    statusMutation.mutate({ id: employee.id, status: newStatus });
  };

  const isLoading = isLoadingEmployees || isLoadingRoles || isLoadingPermissions;

  return (
    <div className="w-full p-6 md:p-8 min-h-screen bg-[#FAFAFB]">
     

      {isLoading ? (
        <div className="flex justify-center py-12 text-slate-500">Loading permissions data...</div>
      ) : view === 'list' ? (
        <EmployeeList 
          employees={employees}
          permissions={permissions}
          roles={roles}
          onCreate={handleCreate} 
          onEdit={handleEdit} 
          onView={handleView}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onCreateRole={(payload) => createRoleMutation.mutate(payload)}
          onUpdateRole={({ id, ...payload }) => updateRoleMutation.mutate({ id, payload })}
          isCreatingRole={createRoleMutation.isPending}
          isUpdatingRole={updateRoleMutation.isPending}
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
