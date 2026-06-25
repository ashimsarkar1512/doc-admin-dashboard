export interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  password?: string;
  permissions: string[];
  extraPermissions: string;
  lastLogin: string;
  avatar: string;
}

export interface PermissionItem {
  name: string;
  description: string;
  active: boolean;
}
