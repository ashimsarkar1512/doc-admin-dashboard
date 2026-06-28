import { axiosInstance } from "../axiosInstance";


export interface Permission {
  id: string;
  key: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: Permission;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  permissions: RolePermission[];
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  assignedBy: string | null;
  assignedAt: string;
  expiresAt: string | null;
  role: Role;
}

export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  mfaEnabled: boolean;
  lastLoginAt: string;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userRoles: UserRole[];
  userPermissions?: {
    id: string;
    permissionId: string;
    permission?: Permission;
  }[];
}

export const getPermissions = async (): Promise<Permission[]> => {
  const { data } = await axiosInstance.get('/admin/employee-permissions/permissions');
  return data.data || data;
};

export const getRoles = async (): Promise<Role[]> => {
  const { data } = await axiosInstance.get('/admin/employee-permissions/roles');
  return data.data || data;
};

export const getEmployees = async (): Promise<EmployeeData[]> => {
  const { data } = await axiosInstance.get('/admin/employee-permissions/employees');
  return data.data || data;
};

export const createEmployee = async (payload: any): Promise<EmployeeData> => {
  const { data } = await axiosInstance.post('/admin/employee-permissions/employees', payload);
  return data.data || data;
};

export const updateEmployee = async ({ id, payload }: { id: string; payload: any }): Promise<EmployeeData> => {
  const { data } = await axiosInstance.patch(`/admin/employee-permissions/employees/${id}`, payload);
  return data.data || data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/employee-permissions/employees/${id}`);
};

export const toggleEmployeeStatus = async ({ id, status }: { id: string; status: 'ACTIVE' | 'SUSPENDED' }): Promise<void> => {
  await axiosInstance.patch(`/admin/employee-permissions/employees/${id}/status`, { status });
};

export const createRole = async (payload: any): Promise<Role> => {
  const { data } = await axiosInstance.post('/admin/employee-permissions/roles', payload);
  return data.data || data;
};

export const updateRole = async ({ id, payload }: { id: string; payload: any }): Promise<Role> => {
  const { data } = await axiosInstance.patch(`/admin/employee-permissions/roles/${id}`, payload);
  return data.data || data;
};
