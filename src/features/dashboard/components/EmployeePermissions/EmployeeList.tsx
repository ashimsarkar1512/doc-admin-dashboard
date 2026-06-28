import { usePermissions } from "@/hooks/usePermissions";
import {
  Ban,
  CheckCircle,
  ChevronDown,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { Employee, Permission, Role } from "./types";

interface EmployeeListProps {
  employees: Employee[];
  permissions: Permission[];
  roles: Role[];
  onCreate: () => void;
  onEdit: (employee: Employee) => void;
  onView: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
  onCreateRole: (payload: {
    name: string;
    displayName: string;
    description: string;
    permissionIds?: string[];
  }) => void;
  onUpdateRole: (payload: {
    id: string;
    displayName: string;
    description: string;
    permissionIds?: string[];
    isActive: boolean;
  }) => void;
  isCreatingRole?: boolean;
  isUpdatingRole?: boolean;
}

// ─── Action Dropdown ────────────────────────────────────────────────────────

const ActionDropdown: React.FC<{
  employee: Employee;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  canManage: boolean;
}> = ({ employee, onView, onEdit, onToggleStatus, onDelete, canManage }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = employee.status === "ACTIVE";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
        title="More actions"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
          <button
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye size={14} className="text-slate-400" /> View Details
          </button>
          {canManage && (
            <>
              <button
                onClick={() => {
                  onEdit();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Edit size={14} className="text-slate-400" /> Edit Permissions
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  onToggleStatus();
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors ${isActive ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`}
              >
                {isActive ? (
                  <>
                    <Ban size={14} /> Suspend Employee
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} /> Activate Employee
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Delete Employee
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Role Modal (shared for Create & Edit) ───────────────────────────────────

const RoleModal: React.FC<{
  mode: "create" | "edit";
  role?: Role;
  permissions: Permission[];
  onClose: () => void;
  onSubmit: (payload: any) => void;
  isLoading?: boolean;
}> = ({ mode, role, permissions, onClose, onSubmit, isLoading }) => {
  const [displayName, setDisplayName] = useState(role?.displayName || "");
  const [name, setName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [isActive, setIsActive] = useState(role?.isActive ?? true);
  const [selectedPermIds, setSelectedPermIds] = useState<Set<string>>(
    new Set(role?.permissions?.map((rp) => rp.permissionId) || []),
  );

  const togglePerm = (id: string) => {
    setSelectedPermIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    if (mode === "create") {
      onSubmit({
        name: name.toUpperCase().replace(/\s+/g, "_"),
        displayName: displayName.trim(),
        description: description.trim(),
        ...(selectedPermIds.size > 0
          ? { permissionIds: Array.from(selectedPermIds) }
          : {}),
      });
    } else {
      onSubmit({
        id: role!.id,
        displayName: displayName.trim(),
        description: description.trim(),
        isActive,
        ...(selectedPermIds.size > 0
          ? { permissionIds: Array.from(selectedPermIds) }
          : { permissionIds: [] }),
      });
    }
  };

  // Group permissions by module
  const grouped: Record<
    string,
    { viewId?: string; manageId?: string; label: string }
  > = {};
  permissions.forEach((p) => {
    const [action, module] = p.key.split(":");
    if (!module) return;
    if (!grouped[module]) {
      grouped[module] = {
        label: module
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
      };
    }
    if (action === "view") grouped[module].viewId = p.id;
    else grouped[module].manageId = p.id;
  });

  const isSystemRole = role?.isSystem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-[#1447E6]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800">
                {mode === "create"
                  ? "Create New Role"
                  : `Edit Role — ${role?.displayName}`}
              </h2>
              <p className="text-[12px] text-slate-500 mt-0.5">
                {mode === "create"
                  ? "Define a role with optional permissions"
                  : "Update role details and permissions"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Fields */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100">
            {mode === "create" && (
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                  Role Key <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BILLING_MANAGER"
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Will be saved as uppercase with underscores
                </p>
              </div>
            )}
            <div>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Billing Manager"
                required
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            <div className={mode === "create" ? "sm:col-span-2" : ""}>
              <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe what this role can do..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>
            {mode === "edit" && (
              <div className="flex items-center gap-3">
                <label className="block text-[12px] font-medium text-slate-700">
                  Active Status
                </label>
                <button
                  type="button"
                  onClick={() => !isSystemRole && setIsActive((v) => !v)}
                  disabled={isSystemRole}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isActive ? "bg-[#1447E6]" : "bg-slate-200"} ${isSystemRole ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-4" : "translate-x-1"}`}
                  />
                </button>
                {isSystemRole && (
                  <span className="text-[11px] text-slate-400">
                    System roles cannot be deactivated
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Permissions Table */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] font-medium text-slate-700">
                Permissions{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </p>
              <span className="text-[12px] text-slate-400">
                {selectedPermIds.size} selected
              </span>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600 text-[12px]">
                      Module
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 text-[12px]">
                      View
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600 text-[12px]">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(grouped).map(
                    ([module, { viewId, manageId, label }]) => (
                      <tr key={module} className="hover:bg-slate-50/60">
                        <td className="px-4 py-3 font-medium text-slate-700">
                          {label}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {viewId ? (
                            <button
                              type="button"
                              onClick={() => togglePerm(viewId)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${selectedPermIds.has(viewId) ? "bg-[#1447E6]" : "bg-slate-200"}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${selectedPermIds.has(viewId) ? "translate-x-4" : "translate-x-1"}`}
                              />
                            </button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {manageId ? (
                            <button
                              type="button"
                              onClick={() => togglePerm(manageId)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${selectedPermIds.has(manageId) ? "bg-[#1447E6]" : "bg-slate-200"}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${selectedPermIds.has(manageId) ? "translate-x-4" : "translate-x-1"}`}
                              />
                            </button>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-[13px] font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg text-[13px] font-medium text-white bg-[#1447E6] hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading
                ? mode === "create"
                  ? "Creating…"
                  : "Saving…"
                : mode === "create"
                  ? "Create Role"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main EmployeeList ───────────────────────────────────────────────────────

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  permissions,
  roles,
  onCreate,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  onCreateRole,
  onUpdateRole,
  isCreatingRole,
  isUpdatingRole,
}) => {
  const [activeTab, setActiveTab] = useState<"employees" | "roles">(
    "employees",
  );
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { canManage } = usePermissions();
  const canManageEmployees = canManage("employee_permissions");

  const handleCreateRole = (payload: any) => {
    onCreateRole(payload);
    setShowCreateRoleModal(false);
  };

  const handleUpdateRole = (payload: any) => {
    onUpdateRole(payload);
    setEditingRole(null);
  };

  return (
    <>
      {/* Tab Bar + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActiveTab("employees")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-medium transition-all ${activeTab === "employees" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Users size={15} /> Employees
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === "employees" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
            >
              {employees.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-[13px] font-medium transition-all ${activeTab === "roles" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <ShieldCheck size={15} /> Roles
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === "roles" ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}
            >
              {roles.length}
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {activeTab === "employees" && (
            <>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={15}
                />
                <input
                  type="text"
                  placeholder="Search user"
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] w-[220px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 bg-white"
                />
              </div>
              <div className="relative">
                <select className="appearance-none pl-4 pr-9 py-2 border border-slate-200 rounded-lg text-[13px] text-slate-600 focus:outline-none focus:border-blue-500 bg-white cursor-pointer">
                  <option>All Roles</option>
                  {roles.map((r) => (
                    <option key={r.id}>{r.displayName}</option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                  size={14}
                />
              </div>
              {canManageEmployees && (
                <button
                  onClick={onCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus size={15} /> Add Employee
                </button>
              )}
            </>
          )}
          {activeTab === "roles" && canManageEmployees && (
            <button
              onClick={() => setShowCreateRoleModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1447E6] text-white rounded-lg text-[13px] font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={15} /> Create Role
            </button>
          )}
        </div>
      </div>

      {/* ── Employees Tab ── */}
      {activeTab === "employees" && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F1F5F9] text-slate-700 font-semibold text-[12px] border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 uppercase font-bold tracking-wider">
                    USER
                  </th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Permissions</th>
                  <th className="px-6 py-4 font-semibold">Last Login</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {employees.map((emp) => {
                  const roleName =
                    emp.userRoles[0]?.role?.displayName || "No Role";
                  let allPermissions: string[] = [];
                  if (emp.userPermissions && emp.userPermissions.length > 0) {
                    allPermissions = emp.userPermissions
                      .map((up) => up.permission?.name)
                      .filter(Boolean) as string[];
                  } else {
                    allPermissions = Array.from(
                      new Set(
                        emp.userRoles.flatMap(
                          (ur) =>
                            ur.role?.permissions?.map(
                              (p) => p.permission?.name,
                            ) || [],
                        ),
                      ),
                    );
                  }
                  allPermissions = Array.from(new Set(allPermissions));
                  const visiblePermissions = allPermissions.slice(0, 2);
                  const extraCount =
                    allPermissions.length > 2 ? allPermissions.length - 2 : 0;
                  const isActive = emp.status === "ACTIVE";
                  const isSuspended = emp.status === "SUSPENDED";

                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {(emp.name || emp.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {emp.name || "Unknown User"}
                            </div>
                            <div className="text-[12px] text-slate-500 mt-0.5">
                              {roleName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px]">{emp.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${isActive ? "bg-green-50 text-green-700" : isSuspended ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : isSuspended ? "bg-amber-500" : "bg-slate-400"}`}
                          />
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {visiblePermissions.length > 0 ? (
                            visiblePermissions.map((p, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 bg-[#EFF3FF] text-[#1447E6] rounded text-[12px] font-medium max-w-[150px] truncate"
                                title={p}
                              >
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[12px] font-medium">
                              None
                            </span>
                          )}
                          {extraCount > 0 && (
                            <span className="text-slate-400 text-[12px] ml-1 font-medium">
                              +{extraCount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-slate-500">
                        {emp.lastLoginAt
                          ? new Date(emp.lastLoginAt).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <ActionDropdown
                            employee={emp}
                            onView={() => onView(emp)}
                            onEdit={() => onEdit(emp)}
                            onToggleStatus={() => onToggleStatus(emp)}
                            onDelete={() => onDelete(emp)}
                            canManage={canManageEmployees}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Roles Tab ── */}
      {activeTab === "roles" && (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F1F5F9] text-slate-700 font-semibold text-[12px] border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 uppercase font-bold tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 font-semibold">Key</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Permissions</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {role.displayName}
                      </div>
                      {role.description && (
                        <div className="text-[12px] text-slate-500 mt-0.5 max-w-[200px] truncate">
                          {role.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <code className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[12px] font-mono">
                        {role.name}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${role.isSystem ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {role.isSystem ? "System" : "Custom"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${role.isActive ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${role.isActive ? "bg-green-500" : "bg-slate-400"}`}
                        />
                        {role.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-slate-600">
                        {role.permissions.length} permissions
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {canManageEmployees ? (
                        <button
                          onClick={() => setEditingRole(role)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                          <Settings size={13} /> Edit
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateRoleModal && (
        <RoleModal
          mode="create"
          permissions={permissions}
          onClose={() => setShowCreateRoleModal(false)}
          onSubmit={handleCreateRole}
          isLoading={isCreatingRole}
        />
      )}
      {editingRole && (
        <RoleModal
          mode="edit"
          role={editingRole}
          permissions={permissions}
          onClose={() => setEditingRole(null)}
          onSubmit={handleUpdateRole}
          isLoading={isUpdatingRole}
        />
      )}
    </>
  );
};
