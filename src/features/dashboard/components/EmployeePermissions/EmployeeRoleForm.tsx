import React, { useState, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import type { Employee, Permission, Role } from './types';

interface EmployeeRoleFormProps {
  mode: 'create' | 'edit' | 'view';
  employee?: Employee;
  permissions: Permission[];
  roles: Role[];
  onCancel: () => void;
  onSave: (payload: any) => void;
}

export const EmployeeRoleForm: React.FC<EmployeeRoleFormProps> = ({ mode, employee, permissions, roles, onCancel, onSave }) => {
  const isReadOnly = mode === 'view';
  
  // Default role is the employee's first role, or the first available role if creating
  const defaultRoleId = employee?.userRoles[0]?.roleId || (roles.length > 0 ? roles[0].id : '');
  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);
  
  // Local state to track which permissions are currently active
  const [activePermissionIds, setActivePermissionIds] = useState<Set<string>>(new Set());

  // Form states
  const [name, setName] = useState(employee?.name || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [hasInitializedEdit, setHasInitializedEdit] = useState(false);

  // Update active permissions whenever the selected role changes
  useEffect(() => {
    if (selectedRoleId && roles) {
      const isOriginalRole = employee?.userRoles[0]?.roleId === selectedRoleId;
      
      if ((mode === 'edit' || mode === 'view') && employee && isOriginalRole) {
        if (!hasInitializedEdit) {
          // If they have explicit custom userPermissions, use them!
          if (employee.userPermissions && employee.userPermissions.length > 0) {
            const pIds = new Set(employee.userPermissions.map((up: any) => up.permissionId));
            setActivePermissionIds(pIds);
          } else {
            // Fallback to role permissions if no custom ones
            const role = roles.find(r => r.id === selectedRoleId);
            if (role) {
              const pIds = new Set(role.permissions.map((rp: any) => rp.permissionId));
              setActivePermissionIds(pIds);
            }
          }
          setHasInitializedEdit(true);
        }
      } else {
        // When changing dropdown to a new role, or in create mode
        // Only run this if we are not looking at the original role (otherwise we'd overwrite the custom edits)
        const role = roles.find(r => r.id === selectedRoleId);
        if (role) {
          const pIds = new Set(role.permissions.map((rp: any) => rp.permissionId));
          setActivePermissionIds(pIds);
        } else {
          setActivePermissionIds(new Set());
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId, roles, employee, mode]);

  // Set initial selected role when employee/roles load
  useEffect(() => {
    setSelectedRoleId(employee?.userRoles[0]?.roleId || (roles.length > 0 ? roles[0].id : ''));
    setName(employee?.name || '');
    setEmail(employee?.email || '');
  }, [employee, roles]);

  const togglePermission = (permId: string) => {
    if (isReadOnly) return;
    setActivePermissionIds(prev => {
      const next = new Set(prev);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return next;
    });
  };

  const groupPermissionsForTable = (flatPermissions: Permission[]) => {
    const rows: Record<string, any> = {};

    flatPermissions.forEach((perm) => {
      // Extract the module name (e.g., "doctor_management" from "view:doctor_management")
      const parts = perm.key.split(":");
      if (parts.length < 2) return;
      const moduleName = parts[1]; 
      const isView = parts[0] === 'view';

      const formatDisplayName = (n: string) => n.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      if (!rows[moduleName]) {
        rows[moduleName] = {
          moduleName,
          displayName: formatDisplayName(moduleName),
          description: perm.description.replace("Access to view ", "").replace("Add, edit, or delete ", ""),
          viewPermissionId: null,
          managePermissionId: null,
        };
      }

      if (isView) {
        rows[moduleName].viewPermissionId = perm.id;
        // In case view description is better/more generic
        if (rows[moduleName].description.startsWith('Manage')) {
           rows[moduleName].description = perm.description.replace("Access to view ", "").replace("Add, edit, or delete ", "");
        }
      } else {
        rows[moduleName].managePermissionId = perm.id;
        if (!rows[moduleName].description) {
           rows[moduleName].description = perm.description.replace("Access to view ", "").replace("Add, edit, or delete ", "");
        }
      }
    });

    return Object.values(rows);
  };

  const groupedPermissions = groupPermissionsForTable(permissions);

  const handleSave = () => {
    onSave({
      name,
      email,
      roleId: selectedRoleId,
      permissionIds: Array.from(activePermissionIds),
      ...(mode === 'create' && password ? { password } : {})
    });
  };

  return (
    <div className="max-w-9xl mx-auto">
      <h2 className="text-[20px] font-semibold text-slate-800 mb-6">
        {mode === 'create' ? 'Create New Employee' : mode === 'edit' ? 'Edit Employee Role' : 'View Employee Role'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isReadOnly}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-2">Assign Role</label>
          <div className="relative">
            <select 
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              disabled={isReadOnly}
              className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <option value="" disabled>Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.displayName || role.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-2">Email:</label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isReadOnly}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>
        {mode === 'create' && (
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="***************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isReadOnly}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-[14px] font-medium text-slate-800 mb-3">
          Role Permissions <span className="text-slate-500 font-normal text-xs ml-2">(Customize specific permissions)</span>
        </h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F1F5F9] text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-[250px]">Permission</th>
                  <th className="px-6 py-4 w-[120px]">View Access</th>
                  <th className="px-6 py-4 w-[120px]">Manage Access</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedPermissions.map((row) => {
                  const isViewActive = row.viewPermissionId && activePermissionIds.has(row.viewPermissionId);
                  const isManageActive = row.managePermissionId && activePermissionIds.has(row.managePermissionId);
                  
                  return (
                    <tr key={row.moduleName} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700">{row.displayName}</td>
                      <td className="px-6 py-4">
                        {row.viewPermissionId && (
                          <button
                            type="button"
                            onClick={() => togglePermission(row.viewPermissionId)}
                            disabled={isReadOnly}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              isViewActive ? 'bg-[#1447E6]' : 'bg-slate-200'
                            } ${isReadOnly ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isViewActive ? 'translate-x-4' : 'translate-x-1'
                              } shadow-sm`}
                            />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {row.managePermissionId && (
                          <button
                            type="button"
                            onClick={() => togglePermission(row.managePermissionId)}
                            disabled={isReadOnly}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              isManageActive ? 'bg-[#1447E6]' : 'bg-slate-200'
                            } ${isReadOnly ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isManageActive ? 'translate-x-4' : 'translate-x-1'
                              } shadow-sm`}
                            />
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{row.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center gap-4 mt-8 pb-8">
        <button 
          onClick={onCancel}
          className="px-8 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-[13px] font-medium hover:bg-slate-50 transition-colors w-[140px]"
        >
          {isReadOnly ? 'Back' : 'Cancel'}
        </button>
        {!isReadOnly && (
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-[#1447E6] text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Role & Permission
          </button>
        )}
      </div>
    </div>
  );
};

