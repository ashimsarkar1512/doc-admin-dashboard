import { useAppSelector } from '@/store/hooks';
import { useUserProfile } from '@/features/account-settings/hooks/useAccountSettings';

export const usePermissions = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: profile } = useUserProfile();

  const currentUser = user || profile;
  const permissions: string[] = (currentUser as any)?.permissions ?? [];
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.role === 'ADMIN';

  const canManage = (featureKey: string) => isAdmin || permissions.includes(`manage:${featureKey}`);
  const canView = (featureKey: string) => isAdmin || permissions.includes(`view:${featureKey}`);

  return { canManage, canView, isAdmin, permissions };
};
