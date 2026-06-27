import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Employee, Permission, Role } from './types';

interface EmployeeRoleFormProps {
  mode: 'create' | 'edit' | 'view';
  employee?: Employee;
  permissions: Permission[];
  roles: Role[];
  onCancel: () => void;
  onSave: () => void;
}

export const EmployeeRoleForm: React.FC<EmployeeRoleFormProps> = ({ mode, employee, permissions, roles, onCancel, onSave }) => {
  const isReadOnly = mode === 'view';
  
  // Default role is the employee's first role, or the first available role if creating
  const defaultRoleId = employee?.userRoles[0]?.roleId || (roles.length > 0 ? roles[0].id : '');
  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId);
  
  // Local state to track which permissions are currently active
  const [activePermissionIds, setActivePermissionIds] = useState<Set<string>>(new Set());

  // Update active permissions whenever the selected role changes
  useEffect(() => {
    const role = roles.find(r => r.id === selectedRoleId);
    if (role) {
      setActivePermissionIds(new Set(role.permissions.map(rp => rp.permissionId)));
    } else {
      setActivePermissionIds(new Set());
    }
  }, [selectedRoleId, roles]);

  // Set initial selected role when employee/roles load
  useEffect(() => {
    setSelectedRoleId(employee?.userRoles[0]?.roleId || (roles.length > 0 ? roles[0].id : ''));
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
            defaultValue={employee?.name || ''}
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
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.displayName}</option>
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
            defaultValue={employee?.email || ''}
            disabled={isReadOnly}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>
        {mode === 'create' && (
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-2">Password:</label>
            <input
              type="password"
              placeholder="***************"
              disabled={isReadOnly}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
            />
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
                  <th className="px-6 py-4 w-[120px]">Access</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map((perm) => {
                  const isActive = activePermissionIds.has(perm.id);
                  return (
                    <tr key={perm.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700">{perm.name}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => togglePermission(perm.id)}
                          disabled={isReadOnly}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isActive ? 'bg-[#1447E6]' : 'bg-slate-200'
                          } ${isReadOnly ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isActive ? 'translate-x-4' : 'translate-x-1'
                            } shadow-sm`}
                          />
                        </button>
                        </td>
                      <td className="px-6 py-4 text-slate-500">{perm.description}</td>
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
            onClick={onSave}
            className="px-8 py-2.5 bg-[#1447E6] text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save Role & Permission
          </button>
        )}
      </div>
    </div>
  );
};
