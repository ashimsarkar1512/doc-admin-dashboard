import React from 'react';
import { Search, ChevronDown, Plus, Eye, Edit } from 'lucide-react';
import type { Employee } from './types';

interface EmployeeListProps {
  employees: Employee[];
  onCreate: () => void;
  onEdit: (employee: Employee) => void;
  onView: (employee: Employee) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onCreate, onEdit, onView }) => {
  return (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search user"
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] w-[260px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 bg-white"
            />
          </div>
          <div className="relative">
            <select className="appearance-none pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-[13px] w-[120px] text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer">
              <option>All</option>
              <option>Admin</option>
              <option>General Manger</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
        </div>
        <button 
          onClick={onCreate}
          className="flex items-center gap-2 px-5 py-2 bg-[#1447E6] text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New Role
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F1F5F9] text-slate-700 font-semibold text-[12px] border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 uppercase font-bold tracking-wider">USER</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Password</th>
                <th className="px-6 py-4 font-semibold">Permissions</th>
                <th className="px-6 py-4 font-semibold">last login</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover bg-slate-200 border border-slate-100" />
                      <div>
                        <div className="font-medium text-slate-800">{emp.name}</div>
                        <div className="text-[12px] text-slate-500 mt-0.5">{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px]">{emp.email}</td>
                  <td className="px-6 py-4 text-[13px] text-slate-500">{emp.password}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {emp.permissions.map((p, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#EFF3FF] text-[#1447E6] rounded text-[12px] font-medium">
                          {p}
                        </span>
                      ))}
                      <span className="text-slate-400 text-[12px] ml-1 font-medium">{emp.extraPermissions}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px]">{emp.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => onView(emp)} className="text-[#1447E6] hover:bg-blue-50 p-1.5 rounded transition-colors" title="View">
                        <Eye size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => onEdit(emp)} className="text-slate-500 hover:bg-slate-100 p-1.5 rounded transition-colors" title="Edit">
                        <Edit size={16} strokeWidth={2.5} />
                      </button>
                      <button className="px-4 py-1.5 bg-[#FFF1F1] text-[#F34D4D] rounded text-[13px] font-medium hover:bg-red-100 transition-colors ml-2">
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
