import type { User } from "@/types/auth.types";

/**
 * Check if a user has the ADMIN role
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return (user.roles && user.roles.includes("ADMIN")) || user.role === "ADMIN";
};

/**
 * Check if a user has all the required permissions
 * @param user User object
 * @param requiredPermissions Array of permissions required
 * @param requireAll If true, all permissions are required (AND), if false any permission is enough (OR)
 */
export const hasPermissions = (
  user: User | null,
  requiredPermissions: string[],
  requireAll: boolean = true
): boolean => {
  // Admin always has access
  if (isAdmin(user)) return true;

  if (!user || !user.permissions || user.permissions.length === 0) {
    return false;
  }

  if (requireAll) {
    return requiredPermissions.every((permission) =>
      user.permissions!.includes(permission)
    );
  } else {
    return requiredPermissions.some((permission) =>
      user.permissions!.includes(permission)
    );
  }
};

/**
 * Check if a user has any of the required roles
 */
export const hasRoles = (
  user: User | null,
  requiredRoles: string[]
): boolean => {
  if (isAdmin(user)) return true;

  if (!user) return false;

  const userRoles = user.roles || [];
  if (user.role) {
    userRoles.push(user.role);
  }

  return requiredRoles.some((role) => userRoles.includes(role));
};

/**
 * Check if a user has access to a route/menu item (can check roles or permissions)
 */
export const hasAccess = (
  user: User | null,
  options: {
    permissions?: string[];
    requireAllPermissions?: boolean;
    roles?: string[];
  }
): boolean => {
  // If no permissions or roles are specified, assume everyone has access (or admin only)
  if (!options.permissions && !options.roles) {
    return true;
  }

  // Check roles first if provided
  if (options.roles && options.roles.length > 0) {
    if (hasRoles(user, options.roles)) return true;
  }

  // Check permissions if provided
  if (options.permissions && options.permissions.length > 0) {
    return hasPermissions(user, options.permissions, options.requireAllPermissions);
  }

  return false;
};
