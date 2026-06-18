import {
  changePassword,
  getSessions,
  getUserPreferences,
  getUserProfile,
  toggleMfa,
  updateUserPreferences,
  updateUserProfile,
  uploadAvatar
} from '@/api/endpoints/auth.api';
import type {
  ChangePasswordPayload,
  DeviceSession,
  UpdateUserPreferencesPayload,
  UpdateUserProfilePayload,
  UserPreferences,
  UserProfile
} from '@/types/auth.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserProfile = () => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await getUserProfile();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface UpdateProfileContext {
  previousProfile?: UserProfile;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, unknown, UpdateUserProfilePayload, UpdateProfileContext>({
    mutationFn: async (payload) => {
      const res = await updateUserProfile(payload);
      return res.data;
    },
    onMutate: async (newProfileData) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile']);

      if (previousProfile) {
        // Optimistically update
        queryClient.setQueryData<UserProfile>(['userProfile'], (old) => ({
          ...old!,
          profile: {
            ...old?.profile,
            ...newProfileData,
          },
        }));
      }

      return { previousProfile };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData<UserProfile>(['userProfile'], context.previousProfile);
      }
      toast.error('Failed to update profile');
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation<{ avatarId: string }, unknown, File>({
    mutationFn: async (file) => {
      const res = await uploadAvatar(file);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Avatar uploaded successfully');
      const currentProfile = queryClient.getQueryData<UserProfile>(['userProfile']);
      if (currentProfile) {
        queryClient.setQueryData<UserProfile>(['userProfile'], (old) => ({
          ...old!,
          profile: {
            ...old?.profile,
            avatarId: data.avatarId,
          },
        }));
      }
    },
    onError: () => {
      toast.error('Failed to upload avatar');
    },
  });
};

interface ToggleMfaContext {
  previousProfile?: UserProfile;
}

export const useToggleMfa = () => {
  const queryClient = useQueryClient();
  return useMutation<{ mfaEnabled: boolean }, unknown, void, ToggleMfaContext>({
    mutationFn: async () => {
      const res = await toggleMfa();
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousProfile = queryClient.getQueryData<UserProfile>(['userProfile']);

      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(['userProfile'], (old) => ({
          ...old!,
          mfaEnabled: !old?.mfaEnabled,
        }));
      }

      return { previousProfile };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile);
      }
      toast.error('Failed to toggle 2FA');
    },
    onSuccess: () => {
      toast.success('2FA status updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useUserPreferences = () => {
  return useQuery<UserPreferences>({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const res = await getUserPreferences();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

interface UpdatePreferencesContext {
  previousPrefs?: UserPreferences;
}

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation<UserPreferences, unknown, UpdateUserPreferencesPayload, UpdatePreferencesContext>({
    mutationFn: async (payload) => {
      const res = await updateUserPreferences(payload);
      return res.data;
    },
    onMutate: async (newPrefs) => {
      await queryClient.cancelQueries({ queryKey: ['userPreferences'] });
      const previousPrefs = queryClient.getQueryData<UserPreferences>(['userPreferences']);

      if (previousPrefs) {
        queryClient.setQueryData<UserPreferences>(['userPreferences'], (old) => ({
          ...old!,
          ...newPrefs,
        }));
      }

      return { previousPrefs };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousPrefs) {
        queryClient.setQueryData<UserPreferences>(['userPreferences'], context.previousPrefs);
      }
      toast.error('Failed to update preferences');
    },
    onSuccess: () => {
      toast.success('Preferences updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });
};

export const useSessions = () => {
  return useQuery<DeviceSession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      const res = await getSessions();
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useChangePassword = () => {
  return useMutation<{ success: boolean; statusCode: number; message: string }, unknown, ChangePasswordPayload>({
    mutationFn: async (payload) => {
      const res = await changePassword(payload);
      return res;
    },
    onError: () => {
      toast.error('Failed to change password');
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  });
};
