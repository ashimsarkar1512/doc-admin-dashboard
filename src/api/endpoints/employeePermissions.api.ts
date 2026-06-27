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
}

export const getPermissions = async (): Promise<Permission[]> => {
  const { data } = await axiosInstance.get('/admin/employee-permissions/permissions');
  return data;
};

export const getRoles = async (): Promise<Role[]> => {
  const { data } = await axiosInstance.get('/admin/employee-permissions/roles');
  return data;
};

export const getEmployees = async (): Promise<EmployeeData[]> => {
  const { data } = await axiosInstance.get('/admin/employee-permissions/employees');
  return data;
};
