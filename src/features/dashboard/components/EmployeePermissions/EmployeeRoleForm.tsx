import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Employee, PermissionItem } from './types';

interface EmployeeRoleFormProps {
  mode: 'create' | 'edit' | 'view';
  employee?: Employee;
  permissions: PermissionItem[];
  onCancel: () => void;
  onSave: () => void;
}

export const EmployeeRoleForm: React.FC<EmployeeRoleFormProps> = ({ mode, employee, permissions: initialPermissions, onCancel, onSave }) => {
  const [permissions, setPermissions] = useState(initialPermissions);
  const isReadOnly = mode === 'view';

  useEffect(() => {
    // Reset permissions if needed on mount or when mode/employee changes
    setPermissions(initialPermissions);
  }, [initialPermissions, employee]);

  const togglePermission = (index: number) => {
    if (isReadOnly) return;
    const newPerms = [...permissions];
    newPerms[index] = { ...newPerms[index], active: !newPerms[index].active };
    setPermissions(newPerms);
  };

  return (
    <div className="max-w-9xl mx-auto">
      <h2 className="text-[20px] font-semibold text-slate-800 mb-6">
        {mode === 'create' ? 'Create New Role' : mode === 'edit' ? 'Edit Role' : 'View Role'}
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
              defaultValue={employee?.role || 'General Manger'}
              disabled={isReadOnly}
              className="w-full appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-[13px] text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
              <option value="General Manger">General Manger</option>
              <option value="Admin">Admin</option>
              <option value="Reviewer">Reviewer</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-2">Username:</label>
          <input
            type="text"
            placeholder="johndoe@gmail.com"
            defaultValue={employee?.email || ''}
            disabled={isReadOnly}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium text-slate-700 mb-2">password:</label>
          <input
            type="password"
            placeholder="***************"
            defaultValue={employee ? '********' : ''}
            disabled={isReadOnly}
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-[14px] font-medium text-slate-800 mb-3">Permissions</h3>
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
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{perm.name}</td>
                    <td className="px-6 py-4">
                      <button 
                        type="button"
                        onClick={() => togglePermission(idx)}
                        disabled={isReadOnly}
                        className={`w-11 h-[22px] rounded-full flex items-center transition-colors px-0.5 ${
                          perm.active ? 'bg-[#1447E6]' : 'bg-slate-200'
                        } ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <div className={`w-[18px] h-[18px] rounded-full bg-white transition-transform ${
                          perm.active ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{perm.description}</td>
                  </tr>
                ))}
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
